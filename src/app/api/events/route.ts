import { NextResponse } from 'next/server';
import { events } from '../mockData';

export async function GET() {
  return NextResponse.json({ events });
}