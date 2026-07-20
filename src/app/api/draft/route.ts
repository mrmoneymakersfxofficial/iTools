import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("Draft mode enabled", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export async function POST(request: Request) {
  return new NextResponse("Draft mode enabled", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}