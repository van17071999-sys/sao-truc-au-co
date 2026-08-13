/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  CMS_ADMIN_PASSWORD?: string;
  CMS_SESSION_SECRET?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type CmsRow = {
  id: string;
  collection: string;
  title: string;
  slug: string;
  published_at: string;
  excerpt: string;
  image_url: string;
  tag: string;
  price: string;
  content: string;
  visible: number;
  sort_order: number;
  updated_at: string;
};

const CMS_COOKIE = "hongviet_cms_session";
const CMS_COLLECTIONS = new Set([
  "services", "classes", "products", "materials", "articles", "courses",
  "class-details", "product-groups", "product-items", "course-groups", "course-items",
  "studio-packages", "booking-packages", "recording-instruments", "flute-tabs", "free-guides",
  "settings", "page-classes", "page-products", "page-articles", "page-courses",
]);

const initialCmsEntries = [
  ["service-01", "services", "Lớp học các bộ môn", "classes", "Sáo trúc, Dizi, sáo nứa, sáo mèo, recorder và các bộ môn dân tộc.", "/carousel-saotruc.webp", "♫", "", "Xem lớp học", 1],
  ["service-02", "services", "Đăng ký lớp học", "contact", "Học tại trung tâm, gia sư tại nhà hoặc online 1 kèm 1 với lịch linh động.", "/carousel-recorder.webp", "⌂", "", "Đăng ký ngay", 2],
  ["service-03", "services", "Sáo & phụ kiện", "products", "Sáo trúc chuẩn âm, Dizi, sáo nứa, sáo mèo cùng phụ kiện được tuyển chọn.", "/carousel-dizi.webp", "◌", "", "Khám phá", 3],
  ["service-04", "services", "Khóa học quay sẵn", "courses", "Video bài giảng HD từ nhập môn đến nâng cao, học mọi lúc và xem lại trọn đời.", "/carousel-tieu.webp", "▶", "", "Xem khóa học", 4],
  ["service-05", "services", "Giáo trình & sheet", "materials", "Giáo trình kỹ thuật, sheet nhạc và bản chuyển soạn theo yêu cầu biểu diễn.", "/carousel-flute.webp", "▤", "Từ 50.000đ / sheet", "Xem tài liệu", 5],
  ["service-06", "services", "Thu âm & quay video", "studio", "Thu âm, mixing, quay hình và dựng video chỉn chu cho học viên, nghệ sĩ.", "/hero-flute.webp", "◉", "Từ 900.000đ", "Xem các gói", 6],
  ["service-07", "services", "Booking nghệ sĩ", "booking", "Độc tấu sáo, hòa tấu và ban nhạc dân tộc cho sự kiện, sân khấu, lễ hội.", "/carousel-saotruc.webp", "♬", "", "Xem gói booking", 7],
  ["service-08", "services", "Thu âm nhạc cụ thật", "instrument-recording", "Sáo, đàn tranh, đàn bầu, đàn nhị và nhiều nhạc cụ dân tộc khác.", "/carousel-dizi.webp", "≋", "Từ 500.000đ / track", "Xem dịch vụ thu", 8],
  ["article-01", "articles", "5 bước tạo tiếng sáo trong và ổn định", "5-buoc-tao-tieng-sao", "Từ tư thế, khẩu hình đến luồng hơi — nền tảng dành cho người mới bắt đầu.", "", "Kỹ thuật", "", "", 1],
  ["article-02", "articles", "Người mới nên bắt đầu với sáo tone nào?", "nguoi-moi-chon-sao-tone-nao", "So sánh sáo Đô C5, La A4 và Sol G4 để chọn cây sáo phù hợp với mục tiêu học.", "", "Chọn nhạc cụ", "", "", 2],
  ["article-03", "articles", "Cách luyện hơi dài mà không bị căng", "cach-luyen-hoi-dai", "Một lịch tập ngắn, an toàn và hiệu quả để cải thiện cột hơi mỗi ngày.", "", "Luyện tập", "", "", 3],
  ["settings-general", "settings", "HỒNG VIỆT", "general", "Sáo trúc & âm nhạc dân tộc", "/hero-flute.webp", "vanquach999x@gmail.com", "0374 261 368", "106/72 Hòa Bình, P. Tân Phú, TP.HCM", 1],
] as const;

const detailedCmsEntries = [
  // Chi tiết các bộ môn. Nội dung là danh sách kiến thức, mỗi dòng một ý.
  ["class-sao-truc", "class-details", "Sáo trúc Việt Nam", "sao-truc-viet-nam", "Nền tảng hơi, ngón và kỹ thuật biểu cảm đặc trưng.", "/carousel-saotruc.webp", "♫", "Người mới bắt đầu, người chơi tự học hoặc học viên muốn biểu diễn.", "Tư thế, khẩu hình và cột hơi\nNgón bấm, đánh lưỡi, rung hơi\nDân ca, nhạc trữ tình và nhạc trẻ", 1],
  ["class-dizi", "class-details", "Sáo Dizi", "sao-dizi", "Âm sắc sáng, vang với màng rung và phong cách cổ phong.", "/carousel-dizi.webp", "◉", "Người yêu nhạc Trung Hoa, nhạc phim và âm sắc Dizi.", "Dán và điều chỉnh màng rung\nHệ thống ngón và kỹ thuật hơi\nLuyến, láy và xử lý tác phẩm cổ phong", 2],
  ["class-recorder", "class-details", "Sáo Recorder", "sao-recorder", "Dễ tiếp cận, phù hợp trẻ em và giáo dục âm nhạc.", "/carousel-recorder.webp", "♩", "Trẻ em, người mới học và giáo viên âm nhạc phổ thông.", "Tư thế, hơi và ngón bấm chuẩn\nĐọc bản nhạc và giữ nhịp\nĐộc tấu, song tấu và hòa tấu", 3],
  ["class-xiao", "class-details", "Động tiêu & Xiao", "dong-tieu-xiao", "Âm thanh trầm ấm, sâu lắng và giàu chất thiền.", "/carousel-tieu.webp", "♬", "Người yêu âm nhạc nhẹ nhàng, cổ phong và thiền định.", "Tạo tiếng và kiểm soát âm trầm\nNgón bấm hai hệ nhạc cụ\nVuốt, rung và xử lý giai điệu chậm", 4],
  ["class-flute", "class-details", "Flute", "flute", "Kỹ thuật phương Tây bài bản, âm sắc trong trẻo linh hoạt.", "/carousel-flute.webp", "♪", "Người mới, học sinh nghệ thuật hoặc người muốn nâng cao kỹ thuật.", "Tư thế, khẩu hình và cao độ\nGam, etude và kỹ thuật lưỡi\nĐọc nhạc và xử lý tác phẩm", 5],
  ["class-hmong", "class-details", "Sáo H’Mông", "sao-hmong", "Khám phá âm hưởng Tây Bắc mộc mạc và da diết.", "/carousel-saotruc.webp", "❋", "Người yêu âm nhạc dân tộc và muốn khám phá nhạc cụ mới.", "Tạo tiếng và điều khiển lam đồng\nHệ thống ngón đặc trưng\nLàn điệu và phong cách Tây Bắc", 6],

  // Nhóm sản phẩm và sản phẩm con. Trường nhãn của sản phẩm con là slug nhóm cha.
  ["pg-sao-ngang", "product-groups", "Sáo ngang Việt Nam", "sao-ngang-viet-nam", "Nhạc cụ ngang truyền thống, âm sắc mộc mạc và phù hợp từ người mới đến người biểu diễn.", "/carousel-saotruc.webp", "", "", "", 1],
  ["pg-dizi", "product-groups", "Sáo Dizi Trung Quốc", "sao-dizi-trung-quoc", "Dòng sáo có màng rung đặc trưng, âm thanh sáng và giàu chất cổ phong.", "/carousel-dizi.webp", "", "", "", 2],
  ["pg-sao-meo", "product-groups", "Sáo mèo", "sao-meo", "Âm sắc da diết nhờ lam đồng, mang đậm màu sắc âm nhạc vùng cao.", "/carousel-saotruc.webp", "", "", "", 3],
  ["pg-tieu-xiao", "product-groups", "Tiêu & Xiao", "tieu-xiao", "Nhạc cụ thổi dọc với âm vực trầm, sâu, thích hợp nhạc thiền và cổ phong.", "/carousel-tieu.webp", "", "", "", 4],
  ["pg-recorder", "product-groups", "Recorder", "recorder", "Nhạc cụ dễ học, phù hợp trẻ em, giáo dục âm nhạc và hòa tấu.", "/carousel-recorder.webp", "", "", "", 5],
  ["pg-flute", "product-groups", "Flute", "flute", "Sáo ngang phương Tây với âm sắc trong trẻo, linh hoạt và âm vực rộng.", "/carousel-flute.webp", "", "", "", 6],
  ["pg-sao-doc", "product-groups", "Sáo dọc", "sao-doc", "Các dòng sáo thổi dọc gọn nhẹ, âm thanh gần gũi và dễ luyện tập.", "/carousel-tieu.webp", "", "", "", 7],
  ["pi-sao-nua", "product-items", "Sáo nứa", "sao-nua", "Chất âm ấm, nhẹ, dễ rung và giàu màu sắc dân gian.", "/carousel-saotruc.webp", "sao-ngang-viet-nam", "Liên hệ", "", 1],
  ["pi-sao-truc", "product-items", "Sáo trúc", "sao-truc", "Âm thanh sáng, vang, độ bền cao; có nhiều tone để lựa chọn.", "/carousel-saotruc.webp", "sao-ngang-viet-nam", "Liên hệ", "", 2],
  ["pi-sao-nua-bac", "product-items", "Sáo nứa Bắc", "sao-nua-bac", "Thành sáo mỏng, tiếng thanh và mềm, phù hợp dân ca miền Bắc.", "/carousel-saotruc.webp", "sao-ngang-viet-nam", "Liên hệ", "", 3],
  ["pi-dizi-truc", "product-items", "Dizi trúc", "dizi-truc", "Phiên bản truyền thống, âm sắc cân bằng và dễ sử dụng.", "/carousel-dizi.webp", "sao-dizi-trung-quoc", "Liên hệ", "", 1],
  ["pi-dizi-ngoc", "product-items", "Dizi ngọc", "dizi-ngoc", "Ngoại hình sang trọng, âm sắc riêng và thích hợp sưu tầm.", "/carousel-dizi.webp", "sao-dizi-trung-quoc", "Liên hệ", "", 2],
  ["pi-dizi-thuy-tinh", "product-items", "Dizi thủy tinh", "dizi-thuy-tinh", "Thiết kế trong suốt độc đáo, nổi bật khi biểu diễn.", "/carousel-dizi.webp", "sao-dizi-trung-quoc", "Liên hệ", "", 3],
  ["pi-meo-don", "product-items", "Sáo mèo đơn bằng gỗ", "sao-meo-don", "Thân gỗ chắc chắn, âm trầm ấm và dễ mang theo.", "/carousel-saotruc.webp", "sao-meo", "Liên hệ", "", 1],
  ["pi-meo-cap", "product-items", "Sáo mèo cặp bằng nứa", "sao-meo-cap", "Hai ống nứa hòa âm tạo chất tiếng dày và độc đáo.", "/carousel-saotruc.webp", "sao-meo", "Liên hệ", "", 2],
  ["pi-tieu", "product-items", "Tiêu trúc Việt 6 lỗ", "tieu-truc-viet", "Hệ ngón quen thuộc, tiếng trầm mộc mạc và dễ tiếp cận.", "/carousel-tieu.webp", "tieu-xiao", "Liên hệ", "", 1],
  ["pi-xiao", "product-items", "Xiao trúc Trung Quốc 8 lỗ", "xiao-truc", "Hệ 8 lỗ linh hoạt, âm sắc sâu và giàu biểu cảm.", "/carousel-tieu.webp", "tieu-xiao", "Liên hệ", "", 2],
  ["pi-recorder-nhua", "product-items", "Recorder nhựa", "recorder-nhua", "Bền, dễ vệ sinh và ổn định cao độ cho người mới học.", "/carousel-recorder.webp", "recorder", "Liên hệ", "", 1],
  ["pi-recorder-go", "product-items", "Recorder gỗ", "recorder-go", "Chất âm ấm, tự nhiên, phù hợp người chơi nâng cao.", "/carousel-recorder.webp", "recorder", "Liên hệ", "", 2],
  ["pi-flute-nhua", "product-items", "Flute nhựa", "flute-nhua", "Nhẹ, dễ bảo quản, phù hợp người mới.", "/carousel-flute.webp", "flute", "Liên hệ", "", 1],
  ["pi-flute-ma-bac", "product-items", "Flute mạ bạc", "flute-ma-bac", "Lựa chọn phổ biến cho học tập, âm thanh sáng.", "/carousel-flute.webp", "flute", "Liên hệ", "", 2],
  ["pi-flute-bac", "product-items", "Flute bạc", "flute-bac", "Âm sắc dày và giàu cộng hưởng, dành cho người chơi chuyên sâu.", "/carousel-flute.webp", "flute", "Liên hệ", "", 3],
  ["pi-sao-doc-nua", "product-items", "Sáo dọc nứa", "sao-doc-nua", "Chất tiếng mềm, mộc và mang nét dân gian tự nhiên.", "/carousel-tieu.webp", "sao-doc", "Liên hệ", "", 1],
  ["pi-sao-doc-truc", "product-items", "Sáo dọc trúc", "sao-doc-truc", "Thân chắc, tiếng sáng và độ bền tốt.", "/carousel-tieu.webp", "sao-doc", "Liên hệ", "", 2],

  // Nhóm khóa học và từng nội dung khóa học.
  ["cg-sao-truc", "course-groups", "Sáo trúc", "sao-truc", "Khóa học sáo trúc quay sẵn, học mọi lúc và xem lại trọn đời.", "/carousel-saotruc.webp", "", "", "", 1],
  ["cg-sao-meo", "course-groups", "Sáo mèo", "sao-meo", "Lộ trình sáo mèo từ cơ bản đến biểu diễn.", "/carousel-saotruc.webp", "", "", "", 2],
  ["cg-recorder", "course-groups", "Recorder", "recorder", "Khóa recorder theo cấp độ cho trẻ em và người mới.", "/carousel-recorder.webp", "", "", "", 3],
  ["cg-dizi", "course-groups", "Sáo Dizi", "sao-dizi", "Kỹ thuật Dizi, màng rung và tác phẩm Trung Hoa.", "/carousel-dizi.webp", "", "", "", 4],
  ["ci-dan-ca", "course-items", "Dân ca & nhạc cổ ba miền", "dan-ca-nhac-co", "Tác phẩm tiêu biểu ba miền; hướng dẫn luyến láy, hơi và phong cách.", "", "sao-truc", "399.000đ", "", 1],
  ["ci-dan-gian", "course-items", "Nhạc âm hưởng dân ca, dân gian", "nhac-dan-gian", "Xử lý các ca khúc mới mang màu sắc dân gian Việt Nam.", "", "sao-truc", "399.000đ", "", 2],
  ["ci-bolero", "course-items", "Nhạc trữ tình & Bolero", "nhac-tru-tinh-bolero", "Kỹ thuật rung hơi, nhả chữ và tạo câu nhạc mềm mại.", "", "sao-truc", "399.000đ", "", 3],
  ["ci-nhac-tre", "course-items", "Nhạc trẻ", "nhac-tre", "Chuyển soạn và trình diễn ca khúc hiện đại trên sáo trúc.", "", "sao-truc", "399.000đ", "", 4],
  ["ci-sao-meo", "course-items", "Sáo mèo từ cơ bản đến biểu diễn", "sao-meo-co-ban", "Làm chủ lam đồng, hệ ngón và phong cách âm nhạc vùng cao.", "", "sao-meo", "499.000đ", "", 1],
  ["ci-recorder-ngu-cung", "course-items", "Nhạc ngũ cung Việt Nam", "nhac-ngu-cung", "Giai điệu Việt Nam chuyển soạn phù hợp recorder.", "", "recorder", "299.000đ", "", 1],
  ["ci-recorder-steiner", "course-items", "Giáo trình Steiner", "giao-trinh-steiner", "Lộ trình cảm thụ, hơi, ngón và đọc nhạc theo cấp độ.", "", "recorder", "399.000đ", "", 2],
  ["ci-recorder-thieu-nhi", "course-items", "Nhạc thiếu nhi", "nhac-thieu-nhi", "Tuyển tập bài vui tươi, dễ học dành cho trẻ em.", "", "recorder", "299.000đ", "", 3],
  ["ci-dizi-co-ban", "course-items", "Dizi cơ bản & 15 nhạc phẩm Trung Quốc", "dizi-co-ban", "Từ dán màng rung, hệ ngón đến 15 tác phẩm kinh điển.", "", "sao-dizi", "599.000đ", "", 1],
  ["ci-dizi-hoa", "course-items", "Nhạc Hoa lời Việt", "nhac-hoa-loi-viet", "Ca khúc quen thuộc với hướng dẫn diễn cảm chi tiết.", "", "sao-dizi", "399.000đ", "", 2],

  // Các gói dịch vụ. Nội dung là quyền lợi, mỗi dòng một ý.
  ["studio-basic", "studio-packages", "Thu âm cơ bản", "thu-am-co-ban", "Một nhạc cụ · Một tác phẩm", "", "◉", "900.000đ", "Thu một nhạc cụ tại studio\nChỉnh sửa lỗi và lọc tạp âm\nMixing & mastering cơ bản\nBàn giao WAV và MP3\n01 lần chỉnh sửa", 1],
  ["studio-complete", "studio-packages", "Thu âm hoàn chỉnh", "thu-am-hoan-chinh", "Bản thu sẵn sàng phát hành", "", "♫", "1.500.000đ", "Tư vấn tone và cấu trúc bài\nThu nhiều lượt, chọn take tốt\nMixing & mastering hoàn chỉnh\nGhép beat hoặc piano có sẵn\nBàn giao WAV, MP3 và instrumental", 2],
  ["studio-video", "studio-packages", "Quay video biểu diễn", "quay-video-bieu-dien", "Hình ảnh chỉn chu, giàu cảm xúc", "", "▶", "1.800.000đ", "Quay Full HD với nhiều góc máy\nHỗ trợ bố cục và diễn xuất\nDựng video, chỉnh màu cơ bản\n01 bản ngang YouTube/Facebook\n01 lần chỉnh sửa", 3],
  ["studio-mv", "studio-packages", "MV trọn gói", "mv-tron-goi", "Thu âm · Quay hình · Hậu kỳ", "", "◆", "Liên hệ", "Lên ý tưởng và kịch bản hình ảnh\nThu âm, mixing & mastering\nQuay studio hoặc ngoại cảnh\nDựng MV, chỉnh màu, chèn tiêu đề\nCó thể thêm bản dọc TikTok/Reels", 4],
  ["studio-memory", "studio-packages", "Video kỷ niệm học viên", "video-ky-niem", "Lưu lại dấu mốc âm nhạc", "", "★", "1.200.000đ", "Tư vấn chọn bài phù hợp\nThu âm hoặc thu tiếng trực tiếp\nQuay video biểu diễn\nDựng clip hoàn chỉnh\nTặng ảnh bìa video", 5],
  ["booking-solo", "booking-packages", "Độc tấu nghệ sĩ", "doc-tau-nghe-si", "01 nghệ sĩ · 1–3 tiết mục", "", "♪", "Từ 2.000.000đ", "Sáo trúc, Dizi, tiêu, sáo mèo, recorder hoặc flute\nTư vấn tiết mục phù hợp không khí sự kiện\nTrang phục biểu diễn cơ bản", 1],
  ["booking-duet", "booking-packages", "Song tấu", "song-tau", "Sáo kết hợp piano, guitar hoặc đàn tranh", "", "♫", "Từ 4.000.000đ", "02 nghệ sĩ chuyên nghiệp\nPhối hợp tiết mục theo chủ đề\n1–3 tiết mục biểu diễn", 2],
  ["booking-ensemble", "booking-packages", "Nhóm hòa tấu", "nhom-hoa-tau", "Đội hình 3–5 nghệ sĩ", "", "♬", "Liên hệ", "Nhạc cụ dân tộc hoặc kết hợp hiện đại\nBiểu diễn đón khách, mở màn hoặc sân khấu\nTư vấn đội hình theo ngân sách", 3],
  ["booking-band", "booking-packages", "Ban nhạc dân tộc", "ban-nhac-dan-toc", "Đội hình từ 5 nghệ sĩ", "", "◆", "Liên hệ", "Chương trình nghệ thuật quy mô lớn\nDàn dựng theo kịch bản sự kiện\nCó thể kết hợp ca sĩ và múa", 4],
  ["booking-custom", "booking-packages", "Biểu diễn theo yêu cầu", "bieu-dien-theo-yeu-cau", "Dàn dựng riêng theo chủ đề", "", "★", "Liên hệ", "Chuyển soạn bài mới\nTrang phục và hình thức biểu diễn riêng\nPhù hợp quảng cáo, quay phim, lễ nghi", 5],
  ["record-sao-truc", "recording-instruments", "Sáo trúc Việt Nam", "sao-truc-viet-nam", "Mộc mạc, mềm mại, giàu chất dân gian", "", "♫", "500.000đ", "", 1],
  ["record-dizi", "recording-instruments", "Sáo Dizi", "sao-dizi", "Sáng, vang, phù hợp cổ phong và nhạc Hoa", "", "◉", "600.000đ", "", 2],
  ["record-xiao", "recording-instruments", "Tiêu & Xiao", "tieu-xiao", "Trầm ấm, sâu lắng, thích hợp nhạc thiền", "", "♬", "600.000đ", "", 3],
  ["record-flute", "recording-instruments", "Recorder & Flute", "recorder-flute", "Trong trẻo, linh hoạt cho nhạc phim và thiếu nhi", "", "♪", "500.000đ", "", 4],
  ["record-strings", "recording-instruments", "Đàn tranh, đàn bầu, đàn nhị", "dan-truyen-thong", "Âm sắc truyền thống cho bản phối hiện đại", "", "◇", "Liên hệ", "", 5],
  ["record-custom", "recording-instruments", "Nhạc cụ theo yêu cầu", "nhac-cu-theo-yeu-cau", "Nhạc cụ dây, gõ và hiệu ứng âm thanh riêng", "", "✦", "Liên hệ", "", 6],
] as const;

function normalizeCmsRow(row: CmsRow) {
  return {
    id: row.id,
    collection: row.collection,
    title: row.title,
    slug: row.slug,
    publishedAt: row.published_at,
    excerpt: row.excerpt,
    imageUrl: row.image_url,
    tag: row.tag,
    price: row.price,
    content: row.content,
    visible: Boolean(row.visible),
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
}

async function ensureCmsSchema(db: D1Database) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS cms_entries (
      id TEXT PRIMARY KEY,
      collection TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      published_at TEXT NOT NULL DEFAULT '',
      excerpt TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      tag TEXT NOT NULL DEFAULT '',
      price TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      visible INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS cms_collection_idx ON cms_entries(collection, visible, sort_order)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS cms_assets (
      id TEXT PRIMARY KEY,
      content_type TEXT NOT NULL,
      data BLOB NOT NULL,
      created_at TEXT NOT NULL
    )`),
  ]);

  const count = await db.prepare("SELECT COUNT(*) AS total FROM cms_entries").first<{ total: number }>();
  if (Number(count?.total ?? 0) > 0) return;
  const now = new Date().toISOString();
  const seedStatements = initialCmsEntries.map((item) => db.prepare(`INSERT OR IGNORE INTO cms_entries
    (id, collection, title, slug, published_at, excerpt, image_url, tag, price, content, visible, sort_order, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`)
    .bind(item[0], item[1], item[2], item[3], item[1] === "articles" ? "2026-08-08" : "", item[4], item[5], item[6], item[7], item[8], item[9], now));
  for (let offset = 0; offset < seedStatements.length; offset += 12) {
    await db.batch(seedStatements.slice(offset, offset + 12));
  }
}

function requestHasSameOrigin(request: Request, url: URL) {
  return request.headers.get("Origin") === url.origin;
}

function getCookie(request: Request, name: string) {
  const cookies = request.headers.get("Cookie") ?? "";
  return cookies.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) ?? "";
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

async function isCmsAuthenticated(request: Request, env: Env) {
  if (!env.CMS_SESSION_SECRET) return false;
  const [expires, signature] = getCookie(request, CMS_COOKIE).split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return constantTimeEqual(signature, await hmac(expires, env.CMS_SESSION_SECRET));
}

async function notifyCmsUpdate(env: Env, entry: { title: string; collection: string; slug: string }, isUpdate: boolean) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;
  const message = [
    "✅ QUẢN TRỊ WEBSITE ĐÃ CẬP NHẬT THÀNH CÔNG",
    "",
    `Thao tác: ${isUpdate ? "Chỉnh sửa nội dung" : "Tạo nội dung mới"}`,
    `Mục: ${entry.collection}`,
    `Tiêu đề: ${entry.title}`,
    `Slug: ${entry.slug}`,
    `Thời gian: ${new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "medium" }).format(new Date())}`,
  ].join("\n");
  try {
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: message, disable_web_page_preview: true }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function handleCms(request: Request, env: Env, url: URL): Promise<Response | null> {
  if (!url.pathname.startsWith("/api/cms/") && !url.pathname.startsWith("/media/")) return null;

  if (!env.DB) return Response.json({ error: "CMS database is unavailable" }, { status: 503 });

  if (url.pathname.startsWith("/media/")) {
    const id = decodeURIComponent(url.pathname.slice("/media/".length));
    if (!id || id.includes("..") || id.startsWith("/")) return new Response("Not found", { status: 404 });
    const asset = await env.DB.prepare("SELECT content_type, data FROM cms_assets WHERE id = ?").bind(id).first<{ content_type: string; data: ArrayBuffer }>();
    if (!asset) return new Response("Not found", { status: 404 });
    return new Response(asset.data, { headers: { "Content-Type": asset.content_type, "Cache-Control": "public, max-age=31536000, immutable" } });
  }

  if (url.pathname === "/api/cms/content" && request.method === "GET") {
    const result = await env.DB.prepare("SELECT * FROM cms_entries WHERE visible = 1 ORDER BY collection, sort_order, updated_at DESC").all<CmsRow>();
    return Response.json({ entries: (result.results ?? []).map(normalizeCmsRow) }, { headers: { "Cache-Control": "public, max-age=30" } });
  }

  if (url.pathname === "/api/cms/login") {
    if (request.method !== "POST" || !requestHasSameOrigin(request, url)) return Response.json({ error: "Invalid request" }, { status: 403 });
    if (!env.CMS_ADMIN_PASSWORD || !env.CMS_SESSION_SECRET) return Response.json({ error: "CMS login is not configured" }, { status: 503 });
    const body = await request.json().catch(() => ({})) as { password?: unknown };
    const supplied = String(body.password ?? "");
    const suppliedDigest = await hmac(supplied, env.CMS_SESSION_SECRET);
    const expectedDigest = await hmac(env.CMS_ADMIN_PASSWORD, env.CMS_SESSION_SECRET);
    if (!constantTimeEqual(suppliedDigest, expectedDigest)) return Response.json({ error: "Invalid credentials" }, { status: 401 });
    const expires = String(Date.now() + 12 * 60 * 60 * 1000);
    const signature = await hmac(expires, env.CMS_SESSION_SECRET);
    return Response.json({ ok: true }, { headers: { "Set-Cookie": `${CMS_COOKIE}=${expires}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200` } });
  }

  if (url.pathname === "/api/cms/logout") {
    return Response.json({ ok: true }, { headers: { "Set-Cookie": `${CMS_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` } });
  }

  if (!await isCmsAuthenticated(request, env)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (url.pathname === "/api/cms/admin" && request.method === "GET") {
    const result = await env.DB.prepare("SELECT * FROM cms_entries ORDER BY collection, sort_order, updated_at DESC").all<CmsRow>();
    return Response.json({ entries: (result.results ?? []).map(normalizeCmsRow) }, { headers: { "Cache-Control": "no-store" } });
  }

  if (!requestHasSameOrigin(request, url)) return Response.json({ error: "Invalid origin" }, { status: 403 });

  if (url.pathname === "/api/cms/seed-details" && request.method === "POST") {
    const parsedOffset = Number.parseInt(url.searchParams.get("offset") || "0", 10);
    const offset = Number.isFinite(parsedOffset)
      ? Math.max(0, Math.min(parsedOffset, detailedCmsEntries.length))
      : 0;
    const batch = detailedCmsEntries.slice(offset, offset + 12);
    const now = new Date().toISOString();
    for (const item of batch) {
      await env.DB.prepare(`INSERT OR IGNORE INTO cms_entries
        (id, collection, title, slug, published_at, excerpt, image_url, tag, price, content, visible, sort_order, updated_at)
        VALUES (?, ?, ?, ?, '', ?, ?, ?, ?, ?, 1, ?, ?)`)
        .bind(item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], now).run();
    }
    const nextOffset = offset + batch.length;
    return Response.json({
      ok: true,
      count: batch.length,
      nextOffset: nextOffset < detailedCmsEntries.length ? nextOffset : null,
      total: detailedCmsEntries.length,
    });
  }

  if (url.pathname === "/api/cms/admin" && request.method === "POST") {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const clean = (value: unknown, maximum: number) => String(value ?? "").trim().slice(0, maximum);
    const collection = clean(body.collection, 40);
    const title = clean(body.title, 180);
    const slug = clean(body.slug, 160).toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!CMS_COLLECTIONS.has(collection) || !title || !slug) return Response.json({ error: "Invalid content" }, { status: 400 });
    const existingId = clean(body.id, 80);
    const id = existingId || crypto.randomUUID();
    const now = new Date().toISOString();
    const entry = {
      id, collection, title, slug,
      publishedAt: clean(body.publishedAt, 20), excerpt: clean(body.excerpt, 800), imageUrl: clean(body.imageUrl, 500),
      tag: clean(body.tag, 100), price: clean(body.price, 100), content: clean(body.content, 30000),
      visible: body.visible !== false, sortOrder: Math.max(0, Math.min(9999, Number(body.sortOrder) || 0)), updatedAt: now,
    };
    await env.DB.prepare(`INSERT INTO cms_entries
      (id, collection, title, slug, published_at, excerpt, image_url, tag, price, content, visible, sort_order, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET collection=excluded.collection, title=excluded.title, slug=excluded.slug,
      published_at=excluded.published_at, excerpt=excluded.excerpt, image_url=excluded.image_url, tag=excluded.tag,
      price=excluded.price, content=excluded.content, visible=excluded.visible, sort_order=excluded.sort_order, updated_at=excluded.updated_at`)
      .bind(id, collection, title, slug, entry.publishedAt, entry.excerpt, entry.imageUrl, entry.tag, entry.price, entry.content, entry.visible ? 1 : 0, entry.sortOrder, now).run();
    const telegramNotified = await notifyCmsUpdate(env, entry, Boolean(existingId));
    return Response.json({ entry, telegramNotified });
  }

  if (url.pathname === "/api/cms/admin" && request.method === "DELETE") {
    const id = (url.searchParams.get("id") ?? "").slice(0, 80);
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
    await env.DB.prepare("DELETE FROM cms_entries WHERE id = ?").bind(id).run();
    return Response.json({ ok: true });
  }

  if (url.pathname === "/api/cms/upload" && request.method === "POST") {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size > 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      return Response.json({ error: "Invalid image" }, { status: 400 });
    }
    const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const key = `${crypto.randomUUID()}.${extension}`;
    await env.DB.prepare("INSERT INTO cms_assets (id, content_type, data, created_at) VALUES (?, ?, ?, ?)")
      .bind(key, file.type, await file.arrayBuffer(), new Date().toISOString()).run();
    return Response.json({ url: `/media/${encodeURIComponent(key)}` });
  }

  return Response.json({ error: "Not found" }, { status: 404 });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const cmsResponse = await handleCms(request, env, url);
    if (cmsResponse) return cmsResponse;

    if (url.pathname === "/api/payment-notification") {
      if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
      }

      const origin = request.headers.get("Origin");
      if (!origin || origin !== url.origin) {
        return Response.json({ error: "Invalid origin" }, { status: 403 });
      }

      if (!env?.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
        return Response.json({ error: "Telegram notification is not configured" }, { status: 503 });
      }

      let data: Record<string, unknown>;
      try {
        data = await request.json() as Record<string, unknown>;
      } catch {
        return Response.json({ error: "Invalid request" }, { status: 400 });
      }

      const clean = (value: unknown, maxLength = 180) => String(value ?? "").trim().slice(0, maxLength);
      const product = clean(data.product);
      const buyerPhone = clean(data.buyerPhone, 40);
      if (!product || !buyerPhone) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
      }

      const notification = [
        "🔔 KHÁCH HÀNG BÁO ĐÃ CHUYỂN KHOẢN",
        "",
        `Sản phẩm: ${product}`,
        `Số tiền: ${clean(data.amount, 40) || "Khách chưa nhập"}`,
        `Nội dung CK: ${clean(data.transferContent, 80) || "Khách chưa nhập"}`,
        `Họ tên: ${clean(data.buyerName, 80) || "Khách chưa nhập"}`,
        `SĐT / Zalo: ${buyerPhone}`,
        `Email: ${clean(data.buyerEmail, 120) || "Khách chưa nhập"}`,
        `Thời gian: ${new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "medium" }).format(new Date())}`,
        "",
        "Lưu ý: Đây là xác nhận do khách bấm trên website. Vui lòng kiểm tra giao dịch ngân hàng trước khi cấp sản phẩm.",
      ].join("\n");

      const telegramResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: notification,
          disable_web_page_preview: true,
        }),
      });

      if (!telegramResponse.ok) {
        console.error("Telegram payment notification failed", telegramResponse.status);
        return Response.json({ error: "Unable to send notification" }, { status: 502 });
      }

      return Response.json({ ok: true });
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
