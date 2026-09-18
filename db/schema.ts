import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cmsEntries = sqliteTable("cms_entries", {
  id: text("id").primaryKey(),
  collection: text("collection").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  publishedAt: text("published_at").notNull().default(""),
  excerpt: text("excerpt").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  tag: text("tag").notNull().default(""),
  price: text("price").notNull().default(""),
  content: text("content").notNull().default(""),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

export const cmsAssets = sqliteTable("cms_assets", {
  id: text("id").primaryKey(),
  contentType: text("content_type").notNull(),
  data: blob("data", { mode: "buffer" }).notNull(),
  createdAt: text("created_at").notNull(),
});

export const analyticsEvents = sqliteTable("analytics_events", {
  id: text("id").primaryKey(),
  visitorId: text("visitor_id").notNull(),
  sessionId: text("session_id").notNull(),
  eventName: text("event_name").notNull(),
  path: text("path").notNull(),
  referrer: text("referrer").notNull().default(""),
  source: text("source").notNull().default(""),
  medium: text("medium").notNull().default(""),
  campaign: text("campaign").notNull().default(""),
  device: text("device").notNull().default("desktop"),
  browser: text("browser").notNull().default(""),
  createdAt: text("created_at").notNull(),
});
