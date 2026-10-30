import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NOTES } from "../../content";

export const dynamicParams = false;

export function generateStaticParams() {
  return NOTES.map((n) => ({ slug: n.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = NOTES.find((n) => n.id === slug);
  if (!note) return {};
  return { title: `${note.title} · Aaditya Desai`, description: note.hook };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = NOTES.find((n) => n.id === slug);
  if (!note) notFound();
  return (
    <main className="work">
      <h1>{note.title}</h1>
      <p>{note.hook}</p>
      <p>Project page: issue 06.</p>
      <a href={`/datasheet/#${note.id}`}>Datasheet entry</a>
    </main>
  );
}
