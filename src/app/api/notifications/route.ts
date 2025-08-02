import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message } = await request.json();
  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }
  console.log('--- MOCK EMAIL SENDER ---');
  console.log(`Sending email with message: "${message}"`);
  console.log('-------------------------');
  return NextResponse.json({ success: true, message: `Notification set and email sent.` });
}