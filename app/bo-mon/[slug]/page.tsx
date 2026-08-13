import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const subjects = {
  "sao-truc-viet-nam": { icon: "♫", title: "Sáo trúc Việt Nam", lead: "Mang hơi thở dân tộc vào từng giai điệu.", intro: "Sáo trúc Việt Nam có âm sắc mộc mạc, gần gũi nhưng giàu khả năng biểu cảm. Tại Hồng Việt, học viên không chỉ học cách thổi đúng nốt mà còn được xây dựng cột hơi, tiếng sáo và tư duy xử lý tác phẩm một cách bài bản.", learn: ["Tư thế cầm sáo, khẩu hình và điểm đặt môi", "Kiểm soát cột hơi, cao độ và chất lượng âm thanh", "Ngón bấm, đánh lưỡi, rung hơi, láy và vuốt", "Đọc nhạc, cảm âm và luyện tập cùng beat", "Xử lý dân ca, nhạc trữ tình và ca khúc hiện đại"], path: ["Giai đoạn 1 · Làm quen & tạo tiếng", "Giai đoạn 2 · Nốt nhạc & nhịp điệu", "Giai đoạn 3 · Kỹ thuật biểu cảm", "Giai đoạn 4 · Hoàn thiện tác phẩm"], suitable: "Người mới bắt đầu, người từng tự học nhưng chưa vững nền tảng, hoặc học viên muốn nâng cao khả năng biểu diễn." },
  "sao-dizi": { icon: "◉", title: "Sáo Dizi", lead: "Âm sắc rực rỡ của những giai điệu cổ phong.", intro: "Dizi tạo dấu ấn bằng màng rung đặc trưng và âm sắc sáng, vang. Khóa học kết hợp kỹ thuật nhạc cụ với cách xử lý tác phẩm Trung Hoa, giúp học viên tạo được màu âm rõ ràng và tự nhiên.", learn: ["Cấu tạo Dizi và cách chọn tone phù hợp", "Dán, căn chỉnh và bảo quản màng rung", "Khẩu hình, cột hơi và hệ thống ngón", "Luyến, láy, vuốt và kỹ thuật cổ phong", "Thực hành nhạc phim và tác phẩm Trung Hoa"], path: ["Giai đoạn 1 · Làm chủ màng rung", "Giai đoạn 2 · Hơi & ngón Dizi", "Giai đoạn 3 · Kỹ thuật cổ phong", "Giai đoạn 4 · Hoàn thiện tác phẩm"], suitable: "Người yêu âm nhạc Trung Hoa, nhạc phim cổ trang và muốn khám phá màu âm Dizi." },
  "sao-recorder": { icon: "♩", title: "Sáo Recorder", lead: "Khởi đầu âm nhạc nhẹ nhàng và đúng phương pháp.", intro: "Recorder dễ tiếp cận nhưng cần nền tảng đúng để tiếng không chói và ngón bấm linh hoạt. Chương trình phù hợp cho trẻ em, người mới và giáo viên âm nhạc cần ứng dụng trong lớp học.", learn: ["Tư thế, hơi thổi nhẹ và âm thanh tròn", "Hệ thống ngón soprano/alto recorder", "Đọc nốt, tiết tấu và ký hiệu âm nhạc", "Độc tấu, song tấu và hòa tấu", "Phương pháp luyện tập và ứng dụng giảng dạy"], path: ["Giai đoạn 1 · Nốt cơ bản", "Giai đoạn 2 · Đọc nhạc", "Giai đoạn 3 · Kỹ thuật & hòa tấu", "Giai đoạn 4 · Biểu diễn"], suitable: "Trẻ em, người mới học, giáo viên phổ thông và giáo viên Steiner/Waldorf." },
  "dong-tieu-xiao": { icon: "♬", title: "Động tiêu & Xiao", lead: "Thanh âm trầm ấm cho những khoảng lặng sâu.", intro: "Động tiêu Việt Nam và Xiao Trung Quốc cùng sử dụng huyệt thổi dọc nhưng có hệ thống ngón và phong cách khác nhau. Học viên được hướng dẫn tạo tiếng trầm ổn định, kiểm soát hơi dài và biểu cảm tinh tế.", learn: ["Tư thế, huyệt thổi và cách tạo tiếng", "Cột hơi dài, âm trầm và chuyển quãng", "Hệ thống ngón động tiêu và Xiao", "Rung, vuốt và xử lý câu nhạc chậm", "Thực hành nhạc thiền và tác phẩm cổ phong"], path: ["Giai đoạn 1 · Tạo tiếng trầm", "Giai đoạn 2 · Hệ thống ngón", "Giai đoạn 3 · Sắc thái", "Giai đoạn 4 · Tác phẩm"], suitable: "Người yêu âm nhạc sâu lắng, cổ phong, thiền định và màu âm trầm ấm." },
  flute: { icon: "♪", title: "Flute", lead: "Âm sắc trong trẻo cùng kỹ thuật phương Tây bài bản.", intro: "Chương trình flute được cá nhân hóa từ nền tảng đến nâng cao. Người học phát triển tư thế đúng, khẩu hình linh hoạt, cao độ ổn định và khả năng đọc bản nhạc để tiến tới các tác phẩm hoàn chỉnh.", learn: ["Lắp nhạc cụ, tư thế và khẩu hình", "Âm dài, cao độ và chuyển quãng", "Gam, arpeggio, etude và kỹ thuật lưỡi", "Đọc bản nhạc và xây dựng nhịp", "Phong cách và xử lý tác phẩm"], path: ["Giai đoạn 1 · Âm thanh nền tảng", "Giai đoạn 2 · Gam & etude", "Giai đoạn 3 · Kỹ thuật", "Giai đoạn 4 · Repertoire"], suitable: "Người mới, học sinh nghệ thuật và người chơi muốn chỉnh sửa hoặc nâng cao kỹ thuật." },
  "sao-hmong": { icon: "❋", title: "Sáo H’Mông", lead: "Chạm vào âm hưởng mộc mạc của núi rừng Tây Bắc.", intro: "Sáo H’Mông sử dụng lam đồng và có màu âm da diết rất riêng. Khóa học đưa người học từ nguyên lý phát âm đến hệ thống ngón và những làn điệu mang đậm bản sắc vùng cao.", learn: ["Cấu tạo và nguyên lý lam đồng", "Tạo tiếng, bẻ lam và kiểm soát hơi", "Hệ thống ngón đặc trưng", "Luyến láy theo phong cách Tây Bắc", "Thực hành làn điệu và tác phẩm"], path: ["Giai đoạn 1 · Làm quen lam", "Giai đoạn 2 · Hơi & ngón", "Giai đoạn 3 · Làn điệu", "Giai đoạn 4 · Biểu diễn"], suitable: "Người yêu âm nhạc dân tộc, văn hóa Tây Bắc và muốn khám phá nhạc cụ mới." },
} as const;

type SubjectKey = keyof typeof subjects;

export function generateStaticParams() {
  return Object.keys(subjects).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const subject = subjects[slug as SubjectKey];
  if (!subject) return {};

  const path = `/bo-mon/${slug}`;
  const description = `${subject.lead} ${subject.intro}`;

  return {
    title: subject.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "vi_VN",
      siteName: "Hồng Việt Sáo Trúc",
      title: `${subject.title} | Hồng Việt Sáo Trúc`,
      description,
      url: path,
      images: [{ url: "/hero-flute.webp", width: 1536, height: 1024, alt: subject.title }],
    },
    twitter: { card: "summary_large_image", title: subject.title, description, images: ["/hero-flute.webp"] },
  };
}

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const subject = subjects[slug as SubjectKey];
  if (!subject) notFound();

  return <main className="subject-page">
    <header className="article-header"><Link className="brand" href="/"><span className="brand-mark">〽</span><span><b>HỒNG VIỆT</b><small>SÁO TRÚC & ÂM NHẠC DÂN TỘC</small></span></Link><nav><Link href="/">Trang chủ</Link><Link href="/#classes">Các bộ môn</Link><Link href="/#contact">Liên hệ</Link></nav></header>
    <section className="subject-hero"><div><p className="eyebrow">BÀI GIỚI THIỆU BỘ MÔN</p><span className="subject-symbol">{subject.icon}</span><h1>{subject.title}</h1><p>{subject.lead}</p><a className="button button-wine" href="#dang-ky">Đăng ký tư vấn →</a></div></section>
    <article className="subject-article">
      <div className="article-main"><p className="article-kicker">HIỂU VỀ BỘ MÔN</p><h2>Một lộ trình rõ ràng để chơi nhạc bằng chính cảm xúc của bạn.</h2><p className="article-lead">{subject.intro}</p><h3>Bạn sẽ học được gì?</h3><ul className="learn-list">{subject.learn.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul><h3>Lộ trình học</h3><div className="path-grid">{subject.path.map((item, i) => <div key={item}><b>0{i + 1}</b><span>{item}</span></div>)}</div><blockquote>“Học đúng kỹ thuật để tự do thể hiện cảm xúc — đó là nền tảng của mỗi chương trình tại Hồng Việt.”</blockquote></div>
      <aside><div><small>PHÙ HỢP VỚI</small><p>{subject.suitable}</p></div><div><small>HÌNH THỨC HỌC</small><ul><li>Trực tiếp tại trung tâm</li><li>Gia sư tại nhà</li><li>Online 1 kèm 1</li></ul></div><div><small>THỜI GIAN</small><p>Linh động theo lịch học viên</p></div></aside>
    </article>
    <section className="subject-register" id="dang-ky"><p className="eyebrow">BẮT ĐẦU HÀNH TRÌNH</p><h2>Đăng ký học {subject.title}</h2><p>Để lại thông tin tại form đăng ký của Hồng Việt. Bộ môn sẽ được chọn sẵn khi bạn quay về trang chính.</p><Link className="button button-wine" href={`/?subject=${encodeURIComponent(subject.title)}#contact`}>Đi đến form đăng ký →</Link></section>
    <footer><Link className="brand" href="/"><span className="brand-mark">〽</span><span><b>HỒNG VIỆT</b><small>SÁO TRÚC & ÂM NHẠC DÂN TỘC</small></span></Link><p>Đam mê làm nên giá trị · Chất lượng tạo nên uy tín</p><small>© 2026 Hồng Việt.</small></footer>
  </main>;
}
