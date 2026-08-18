import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/sanityFetch";
import type { Metadata } from "next";

const pageQuery = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  content
}`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await params;
  const page = await sanityFetch({ query: pageQuery, params: { slug: p.slug } });
  
  if (!page) return {};
  
  return {
    title: page.title,
  };
}

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const page = await sanityFetch({ query: pageQuery, params: { slug: p.slug } });

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold font-impact tracking-wider text-itools-dark dark:text-white uppercase">
        {page.title}
      </h1>
      <div className="prose prose-blue max-w-none dark:prose-invert">
        <PortableText value={page.content} />
      </div>
    </div>
  );
}
