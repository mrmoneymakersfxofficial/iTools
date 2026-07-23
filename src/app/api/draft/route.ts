import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  const envSecret = process.env.SANITY_REVALIDATE_SECRET || "itools2024";

  if (secret !== envSecret) {
    return new Response("Invalid secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  // Redirect to the provided path or home so the VisualEditing component mounts
  const path = searchParams.get("path") || "/";
  redirect(path);
}

export async function POST(request: Request) {
  return new Response("Method not allowed", { status: 405 });
}