import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const secret = body._secret || request.headers.get("x-sanity-secret");

    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    revalidateTag("sanity");
    revalidateTag("product");
    
    if (body.slug?.current) {
      revalidatePath(`/producto/${body.slug.current}`);
    }
    revalidatePath("/");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}