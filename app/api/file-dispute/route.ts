import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { against_user_id, issue } = body;

    // Validate input
    if (!against_user_id || !issue) {
      return NextResponse.json(
        { error: "Missing required fields: against_user_id and issue" },
        { status: 400 },
      );
    }

    // Check if user is trying to file a dispute against themselves
    if (against_user_id === user.id) {
      return NextResponse.json(
        { error: "You cannot file a dispute against yourself" },
        { status: 400 },
      );
    }

    // Verify the target user exists
    const { data: targetUser, error: userError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", against_user_id)
      .single();

    if (userError || !targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 },
      );
    }

    // Get the filer's name
    const { data: filerProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const filerName = filerProfile?.full_name || "A user";

    // Create the dispute
    const { data: dispute, error: disputeError } = await supabase
      .from("disputes")
      .insert([
        {
          filed_by: user.id,
          against_user_id,
          issue: issue.trim(),
          status: "raised",
        },
      ])
      .select()
      .single();

    if (disputeError) {
      console.error("Dispute creation error:", disputeError);
      return NextResponse.json(
        { error: "Failed to create dispute: " + disputeError.message },
        { status: 500 },
      );
    }

    // Send notification to the user the dispute is filed against
    const { error: notifError } = await supabase.from("notifications").insert([
      {
        user_id: against_user_id,
        message: `${filerName} has filed a dispute against you. Case ID: ${dispute.id.slice(0, 8)}`,
        is_read: false,
      },
    ]);

    if (notifError) {
      console.error("Notification creation error:", notifError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json(
      {
        success: true,
        dispute,
        message: "Dispute filed successfully and notification sent",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error filing dispute:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
