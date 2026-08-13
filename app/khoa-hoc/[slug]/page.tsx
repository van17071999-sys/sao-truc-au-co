import { SalesDetail } from "../../cms-content-pages";
import { catalogMetadata } from "../../catalog-metadata";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return catalogMetadata(params, "Khóa học", "khoa-hoc"); }
export default function Page() { return <SalesDetail collection="course-items" typeLabel="Khóa học quay sẵn" backHref="/#courses" backLabel="Khóa học" />; }
