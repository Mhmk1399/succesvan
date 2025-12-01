const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC95990d02ca4c2a567c37f844fa637e75';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'eb1033b57759d5480ed8f43ad4cf1294';
const fromNumber = process.env.TWILIO_PHONE_NUMBER || '+17087199369';
const isDev = process.env.NODE_ENV === 'development';

export async function sendSMS(to: string, message: string) {
  if (isDev) {
    console.log(`[DEV MODE] SMS to ${to}: ${message}`);
    return { sid: 'dev-mode', status: 'sent' };
  }
  
  const client = require('twilio')(accountSid, authToken);
  
  const msg = await client.messages.create({
    body: message,
    from: fromNumber,
    to: to
  });
  
  return msg;
}
