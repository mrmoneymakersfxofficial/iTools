import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.json({ draft: true });
}

export async function POST(request: Request) {
  const body = await request.json();
  const secret = body?.secret;

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.json({ draft: true });
}