import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { to, message: messageBody } = body;

    const accountSid = 'AC95990d02ca4c2a567c37f844fa637e75';
    const authToken = 'eb1033b57759d5480ed8f43ad4cf1294';
    const client = require('twilio')(accountSid, authToken);

    const msg = await client.messages.create({
      body: messageBody || 'Ahoy 👋',
      from: '+17087199369',
      to: to || '+18777804236'
    });

    return NextResponse.json({ success: true, sid: msg.sid });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST method to send SMS' });
}
