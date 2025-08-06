// File: src/app/api/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * This API route is designed to handle webhooks from various sources,
 * including Mailgun. It can intelligently parse 'application/json',
 * 'multipart/form-data', and 'text/plain' content types.
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let sender: string | null = null;
    let subject: string | null = null;
    let body: string | null = null;

    // Check the content type to decide how to parse the body
    if (contentType.includes('application/json')) {
      console.log("Parsing request as JSON...");
      const json = await request.json();
      sender = json.sender;
      subject = json.subject;
      // Handle both 'body' and 'body-plain' for flexibility
      body = json.body || json['body-plain'];
    } else if (contentType.includes('multipart/form-data')) {
      console.log("Parsing request as multipart/form-data...");
      const formData = await request.formData();
      sender = formData.get('sender') as string | null;
      subject = formData.get('subject') as string | null;
      body = formData.get('body-plain') as string | null;
    } else if (contentType.includes('text/plain')) {
      console.log("Parsing request as plain text...");
      body = await request.text();
      // For plain text, sender and subject aren't available in the same way.
      // We'll set default values to satisfy the logic.
      sender = "Unknown (Plain Text)";
      subject = "No Subject (Plain Text)";
    } else {
      // Handle unsupported content types
      console.error(`Unsupported Content-Type: ${contentType}`);
      return NextResponse.json({ message: `Unsupported Content-Type` }, { status: 415 });
    }

    // Log the parsed data to the Vercel console for debugging
    console.log("--- Webhook Payload Received ---");
    console.log(`From: ${sender}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log("--------------------------------");

    if (!sender || !subject || !body) {
      console.error("Webhook payload was missing required fields after parsing.");
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // --- YOUR VERIFICATION LOGIC WILL GO HERE ---
    // Now you can parse the 'body' string to find your sale reference,
    // query your database, and send the confirmation email.


    // Respond with a success message
    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error processing webhook:", error);
    // This will catch any errors during parsing
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}
