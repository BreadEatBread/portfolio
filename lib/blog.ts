import modbusPost, { meta as modbusMeta } from "@/content/blog/modbus-rtu-basics";
import type { ComponentType } from "react";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTimeMin: number;
  tags: string[];
};

type PostEntry = {
  meta: PostMeta;
  Component: ComponentType;
};

const posts: PostEntry[] = [
  { meta: modbusMeta, Component: modbusPost },
];

posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));

export function listPosts(): PostMeta[] {
  return posts.map((p) => p.meta);
}

export function getPost(slug: string): PostEntry | null {
  return posts.find((p) => p.meta.slug === slug) ?? null;
}

export function getPostSlugs(): string[] {
  return posts.map((p) => p.meta.slug);
}
