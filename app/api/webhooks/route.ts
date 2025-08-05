// File: src/app/api/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Vercel automatically parses the incoming JSON request body
    const body = await request.json();

    // Log the entire body to the Vercel logs for debugging
    console.log("--- Mailgun Webhook Payload Received ---");
    console.log(JSON.stringify(body, null, 2));

    // You can also log specific fields
    const sender = body.sender;
    const subject = body.subject;
    console.log(`Received email from: ${sender} with subject: ${subject}`);

    // --- YOUR VERIFICATION LOGIC WILL GO HERE ---

    // Respond to Mailgun with a success message
    return NextResponse.json({ message: "Webhook received successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error processing webhook:", error);
    // If there's an error (e.g., the request body isn't valid JSON), send a bad request response
    return NextResponse.json({ message: "Error processing request" }, { status: 400 });
  }
}