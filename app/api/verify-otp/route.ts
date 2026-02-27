import bcrypt from "bcrypt";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { otp } = await req.json();

    if (!otp || typeof otp !== "string") {
      return Response.json(
        { success: false, message: "OTP is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get the most recent challenge for this user
    const { data, error } = await supabase
      .from("phone_otp_challenges")
      .select("id, code_hash, phone, expires_at, attempts")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return Response.json(
        { success: false, message: "No OTP found. Please request a new one." },
        { status: 400 }
      );
    }

    // Check max attempts (5)
    if (data.attempts >= 5) {
      await supabase
        .from("phone_otp_challenges")
        .delete()
        .eq("id", data.id);

      return Response.json(
        { success: false, message: "Too many attempts. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date(data.expires_at) < new Date()) {
      await supabase
        .from("phone_otp_challenges")
        .delete()
        .eq("id", data.id);

      return Response.json(
        { success: false, message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Increment attempts
    await supabase
      .from("phone_otp_challenges")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id);

    // Compare OTP against hash
    const isValid = await bcrypt.compare(otp, data.code_hash);

    if (!isValid) {
      return Response.json(
        { success: false, message: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    // OTP is valid — update the profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        phone: data.phone,
        phone_verified: true,
        phone_verified_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return Response.json(
        { success: false, message: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Clean up used challenge
    await supabase
      .from("phone_otp_challenges")
      .delete()
      .eq("user_id", user.id);

    return Response.json({
      success: true,
      message: "Phone number verified successfully!",
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}