// File: src/app/api/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * This API route is designed to handle webhooks from Mailgun.
 * Mailgun sends data in the 'multipart/form-data' format, not JSON.
 * Therefore, we can't use `request.json()`. Instead, we use `request.formData()`
 * to correctly parse the incoming data.
 */
export async function POST(request: NextRequest) {
  try {
    // Use request.formData() to parse the multipart/form-data payload
    const formData = await request.formData();

    // The data from Mailgun is now available in the formData object.
    // We can access each field using the .get() method.
    // The field names (e.g., 'sender', 'subject') are defined by Mailgun.
    const sender = formData.get('sender') as string | null;
    const subject = formData.get('subject') as string | null;
    const body = formData.get('body-plain') as string | null; // 'body-plain' is the text version

    // Log the parsed data to the Vercel console for debugging
    console.log("--- Mailgun Webhook Payload Received (Parsed as Form Data) ---");
    console.log(`From: ${sender}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log("----------------------------------------------------------");

    if (!sender || !subject || !body) {
      console.error("Webhook payload was missing required fields.");
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // --- YOUR VERIFICATION LOGIC WILL GO HERE ---
    // Now you can parse the 'body' string to find your sale reference,
    // query your database, and send the confirmation email.


    // Respond to Mailgun with a success message
    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error processing form data webhook:", error);
    // This will catch any errors during the formData parsing
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}
