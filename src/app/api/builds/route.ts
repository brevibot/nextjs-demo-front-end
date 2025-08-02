import { NextResponse } from 'next/server';
import { builds } from '../mockData';

export async function GET() {
  return NextResponse.json({ _embedded: { builds } });
}