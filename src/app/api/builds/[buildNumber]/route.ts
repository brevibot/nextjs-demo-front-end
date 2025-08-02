import { NextResponse } from 'next/server';
import { builds } from '../../mockData';

export async function GET(
  request: Request,
  { params }: { params: { buildNumber: string } }
) {
  const buildNumber = parseInt(params.buildNumber, 10);
  const build = builds.find(b => b.buildNumber === buildNumber);

  if (!build) {
    return NextResponse.json({ error: 'Build not found' }, { status: 404 });
  }

  build._links.changes = { href: `/api/builds/${buildNumber}/changes` };
  return NextResponse.json(build);
}