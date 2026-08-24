import type { Metadata } from "next";
import { FluteDetail } from "../../cms-content-pages";

export const metadata: Metadata = {
  title: "Cảm âm sáo trúc",
};

export default function Page() {
  return <FluteDetail />;
}
