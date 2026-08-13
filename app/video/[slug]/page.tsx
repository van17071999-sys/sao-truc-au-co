import { SalesDetail } from "../../cms-content-pages";
import { catalogMetadata } from "../../catalog-metadata";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return catalogMetadata(params, "Video hướng dẫn", "video"); }
export default function Page() { return <SalesDetail collection="single-videos" typeLabel="Video hướng dẫn từng bài" backHref="/#courses" backLabel="Video quay sẵn" />; }
