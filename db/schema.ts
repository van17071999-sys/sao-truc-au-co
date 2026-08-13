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
