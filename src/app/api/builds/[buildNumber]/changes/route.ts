import { NextResponse } from 'next/server';

const mockChanges = [
  { hash: 'a1b2c3d', author: 'Jane Doe', message: 'feat: Add user authentication endpoint' },
  { hash: 'e4f5g6h', author: 'John Smith', message: 'fix: Correct calculation in payment module' },
  { hash: 'i7j8k9l', author: 'Jane Doe', message: 'refactor: Simplify database query logic' },
];

export async function GET() {
  return NextResponse.json({ changes: mockChanges });
}