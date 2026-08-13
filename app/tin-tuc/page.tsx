import type { Metadata } from "next";
import { NewsIndex } from "../cms-content-pages";

export const metadata: Metadata = { title: "Tin tức", description: "Tin tức, bài viết và chia sẻ kiến thức sáo trúc, nhạc cụ dân tộc." };

export default function Page() { return <NewsIndex />; }
