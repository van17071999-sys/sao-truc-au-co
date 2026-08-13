import type { Metadata } from "next";
import { NewsDetail } from "../../cms-content-pages";

export const metadata: Metadata = { title: "Bài viết" };

export default function Page() { return <NewsDetail />; }
