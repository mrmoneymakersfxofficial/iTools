import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  const validPassword = process.env.SANITY_STUDIO_PASSWORD;

  if (!validPassword) {
    return NextResponse.json({ error: "Studio password not configured" }, { status: 500 });
  }

  if (password !== validPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("SANITY_STUDIO_AUTH", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}