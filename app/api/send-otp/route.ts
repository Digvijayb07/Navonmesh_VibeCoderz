import bcrypt from "bcrypt";
import twilio from "twilio";
import { createClient } from "@/utils/supabase/server";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Initialize Twilio client only if credentials are available
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || typeof phone !== "string") {
      return Response.json(
        { success: false, message: "Phone number is required" },
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

    const otp = generateOTP();
    const codeHash = await bcrypt.hash(otp, 10);
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Delete any existing challenges for this user
    await supabase
      .from("phone_otp_challenges")
      .delete()
      .eq("user_id", user.id);

    // Store the hashed OTP
    const { error: insertError } = await supabase
      .from("phone_otp_challenges")
      .insert({
        user_id: user.id,
        phone,
        code_hash: codeHash,
        expires_at: expires.toISOString(),
        attempts: 0,
      });

    if (insertError) {
      console.error("OTP insert error:", insertError);
      return Response.json(
        { success: false, message: `Failed to generate OTP: ${insertError.message}` },
        { status: 500 }
      );
    }

    // Send OTP via SMS if Twilio is configured
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `Your Krishi Exchange verification code is: ${otp}. It expires in 5 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        });

        return Response.json({
          success: true,
          message: "OTP sent to your phone via SMS",
        });
      } catch (smsError) {
        console.error("Twilio SMS error:", smsError);
        // Fall through to dev mode if SMS fails
        return Response.json({
          success: true,
          message: "SMS delivery failed. Showing OTP for testing.",
          otp_dev: otp,
        });
      }
    }

    // Dev/demo mode — no Twilio configured, return OTP in response
    return Response.json({
      success: true,
      message: "OTP generated (SMS not configured — showing for testing)",
      otp_dev: otp,
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}