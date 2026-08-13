import type { Metadata } from "next";
import { FluteIndex } from "../cms-content-pages";

export const metadata: Metadata = { title: "Cảm âm sáo trúc", description: "Cảm âm sáo trúc theo từng bài, gồm lời và nốt nhạc để luyện tập." };

export default function Page() { return <FluteIndex />; }
