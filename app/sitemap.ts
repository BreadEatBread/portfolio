import type { MetadataRoute } from "next";

const SITE = "https://woong4252.vercel.app";

const routes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/projects/iot-dashboard", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/projects/enterprise-grid", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/projects/modbus-playground", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/projects/event-bus-refactor", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/projects/kukudocs-iframe", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/now", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${SITE}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
