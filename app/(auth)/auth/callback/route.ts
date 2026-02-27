import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error_description = searchParams.get("error_description");

  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error.message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }

    // ── Upsert profile for OAuth users (Google, etc.) ────────────────────────
    // Google provides: full_name, name, avatar_url, email in user_metadata
    const user = data.session?.user;
    if (user) {
      const meta = user.user_metadata ?? {};

      const full_name =
        meta.full_name ||
        meta.name ||
        [meta.first_name, meta.last_name].filter(Boolean).join(" ") ||
        user.email?.split("@")[0] ||
        null;

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id:        user.id,
            full_name,
            role:      "farmer", // default for new Google users; ignored on re-login
          },
          {
            onConflict:       "id",
            ignoreDuplicates: true, // ✅ won't overwrite existing profile on re-login
          }
        );

      if (profileError) {
        // Non-fatal — just log it
        console.error("Profile upsert error (OAuth):", profileError.message);
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  console.error("No authorization code received");
  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent(
      error_description || "No authorization code received"
    )}`
  );
}
