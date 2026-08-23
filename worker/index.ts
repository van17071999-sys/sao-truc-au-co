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

const CMS_COOKIE = "saotrucauco_cms_session";
const CMS_COLLECTIONS = new Set([
  "services", "classes", "products", "materials", "articles", "courses",
  "hero-slides", "class-details", "product-groups", "product-items", "course-groups", "course-items",
  "single-videos", "social-links", "studio-packages", "booking-packages", "recording-instruments", "flute-tabs", "free-guides",
  "settings", "page-contact", "page-classes", "page-products", "page-articles", "page-courses",
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
  ["page-contact", "page-contact", "Đăng ký lớp học & Tư vấn", "dang-ky-hoc", "Để lại thông tin, Sáo Trúc Âu Cơ sẽ liên hệ tư vấn lớp học, chọn sáo hoặc dịch vụ phù hợp.", "/hero-flute.webp", "BẮT ĐẦU HÀNH TRÌNH", "0374 261 368", "Để tiếng sáo cất lời.\n\nHọc tại trung tâm (TP.HCM), gia sư tại nhà hoặc online 1 kèm 1 linh động cho học viên ở xa và nước ngoài.\n\n106/72 Hòa Bình, P. Tân Phú, TP.HCM\n\nvanquach999x@gmail.com", 1],
  ["settings-general", "settings", "SÁO TRÚC ÂU CƠ", "general", "Sáo trúc & âm nhạc dân tộc", "/hero-flute.webp", "vanquach999x@gmail.com", "0374 261 368", "106/72 Hòa Bình, P. Tân Phú, TP.HCM", 1],
  ["settings-payment", "settings", "Thanh toán VietQR", "payment", "QUACH HA VAN", "/vietqr-payment.png", "STB · Sacombank", "030046023451", "Thông tin chuyển khoản dùng chung cho toàn bộ website.", 2],
  ["settings-tuition", "settings", "2.400.000đ – 3.200.000đ", "tuition", "4.800.000đ – 6.400.000đ", "", "Bảng mục học phí", "7.200.000đ", "giảm 10% – 15%, tặng MV Video thổi sáo khi hết khoá.", 3],
] as const;

const detailedCmsEntries = [
  // Cài đặt học phí và ưu đãi
  ["settings-tuition", "settings", "2.400.000đ – 3.200.000đ", "tuition", "4.800.000đ – 6.400.000đ", "", "Bảng mục học phí", "7.200.000đ", "giảm 10% – 15%, tặng MV Video thổi sáo khi hết khoá.", 3],

  // Thông tin tài khoản và QR dùng chung cho mọi bảng thanh toán trên website.
  ["settings-payment", "settings", "Thanh toán VietQR", "payment", "QUACH HA VAN", "/vietqr-payment.png", "STB · Sacombank", "030046023451", "Thông tin chuyển khoản dùng chung cho toàn bộ website.", 2],

  // Năm ảnh demo bộ môn ở đầu trang chủ.
  ["hero-slide-01", "hero-slides", "Sáo trúc Việt Nam", "sao-truc-viet-nam", "Từ hơi thở đầu tiên đến tiếng sáo giàu cảm xúc.", "/carousel-saotruc.webp", "BỘ MÔN TRUYỀN THỐNG", "Khám phá bộ môn", "/bo-mon/sao-truc-viet-nam", 1],
  ["hero-slide-02", "hero-slides", "Sáo Dizi", "sao-dizi", "Khám phá màng rung và kỹ thuật diễn tấu Trung Hoa.", "/carousel-dizi.webp", "ÂM SẮC CỔ PHONG", "Khám phá bộ môn", "/bo-mon/sao-dizi", 2],
  ["hero-slide-03", "hero-slides", "Sáo Recorder", "sao-recorder", "Khởi đầu dễ dàng, đọc nhạc bài bản và cùng nhau hòa tấu.", "/carousel-recorder.webp", "ÂM NHẠC CHO MỌI LỨA TUỔI", "Khám phá bộ môn", "/bo-mon/sao-recorder", 3],
  ["hero-slide-04", "hero-slides", "Động tiêu & Xiao", "dong-tieu-xiao", "Một khoảng lặng đẹp cho người yêu âm nhạc cổ phong.", "/carousel-tieu.webp", "TRẦM ẤM & SÂU LẮNG", "Khám phá bộ môn", "/bo-mon/dong-tieu-xiao", 4],
  ["hero-slide-05", "hero-slides", "Flute", "flute", "Âm sắc trong trẻo, linh hoạt cùng lộ trình cá nhân hóa.", "/carousel-flute.webp", "KỸ THUẬT PHƯƠNG TÂY", "Khám phá bộ môn", "/bo-mon/flute", 5],

  // Chi tiết các bộ môn. Toàn bộ nội dung trang /bo-mon/slug có thể chỉnh sửa trong CMS.
  ["class-sao-truc", "class-details", "Sáo trúc Việt Nam", "sao-truc-viet-nam", "Mang hơi thở dân tộc vào từng giai điệu.", "/carousel-saotruc.webp", "♫", "Người mới bắt đầu, người từng tự học nhưng chưa vững nền tảng, hoặc học viên muốn nâng cao khả năng biểu diễn.", "[TIÊU ĐỀ BÀI]\nMột lộ trình rõ ràng để chơi nhạc bằng chính cảm xúc của bạn.\n\n[GIỚI THIỆU]\nSáo trúc Việt Nam có âm sắc mộc mạc, gần gũi nhưng giàu khả năng biểu cảm. Tại trung tâm, học viên không chỉ học cách thổi đúng nốt mà còn được xây dựng cột hơi, tiếng sáo và tư duy xử lý tác phẩm một cách bài bản.\n\n[BẠN SẼ HỌC ĐƯỢC GÌ]\nTư thế cầm sáo, khẩu hình và điểm đặt môi\nKiểm soát cột hơi, cao độ và chất lượng âm thanh\nNgón bấm, đánh lưỡi, rung hơi, láy và vuốt\nĐọc nhạc, cảm âm và luyện tập cùng beat\nXử lý dân ca, nhạc trữ tình và ca khúc hiện đại\n\n[LỘ TRÌNH HỌC]\nGiai đoạn 1 · Làm quen & tạo tiếng\nGiai đoạn 2 · Nốt nhạc & nhịp điệu\nGiai đoạn 3 · Kỹ thuật biểu cảm\nGiai đoạn 4 · Hoàn thiện tác phẩm\n\n[TRÍCH DẪN]\nHọc đúng kỹ thuật để tự do thể hiện cảm xúc — đó là nền tảng của mỗi chương trình.\n\n[HÌNH THỨC HỌC]\nTrực tiếp tại trung tâm\nGia sư tại nhà\nOnline 1 kèm 1\n\n[THỜI GIAN]\nLinh động theo lịch học viên", 1],
  ["class-dizi", "class-details", "Sáo Dizi", "sao-dizi", "Âm sắc rực rỡ của những giai điệu cổ phong.", "/carousel-dizi.webp", "◉", "Người yêu âm nhạc Trung Hoa, nhạc phim cổ trang và muốn khám phá màu âm Dizi.", "[TIÊU ĐỀ BÀI]\nLàm chủ màng rung và kỹ thuật diễn tấu Trung Hoa.\n\n[GIỚI THIỆU]\nDizi tạo dấu ấn bằng màng rung đặc trưng và âm sắc sáng, vang. Khóa học kết hợp kỹ thuật nhạc cụ với cách xử lý tác phẩm Trung Hoa, giúp học viên tạo được màu âm rõ ràng và tự nhiên.\n\n[BẠN SẼ HỌC ĐƯỢC GÌ]\nCấu tạo Dizi và cách chọn tone phù hợp\nDán, căn chỉnh và bảo quản màng rung\nKhẩu hình, cột hơi và hệ thống ngón\nLuyến, láy, vuốt và kỹ thuật cổ phong\nThực hành nhạc phim và tác phẩm Trung Hoa\n\n[LỘ TRÌNH HỌC]\nGiai đoạn 1 · Làm chủ màng rung\nGiai đoạn 2 · Hơi & ngón Dizi\nGiai đoạn 3 · Kỹ thuật cổ phong\nGiai đoạn 4 · Hoàn thiện tác phẩm\n\n[TRÍCH DẪN]\nTiếng sáo Dizi bay bổng là sự hòa quyện giữa màng rung và hơi thở người nghệ sĩ.\n\n[HÌNH THỨC HỌC]\nTrực tiếp tại trung tâm\nGia sư tại nhà\nOnline 1 kèm 1\n\n[THỜI GIAN]\nLinh động theo lịch học viên", 2],
  ["class-recorder", "class-details", "Sáo Recorder", "sao-recorder", "Khởi đầu âm nhạc nhẹ nhàng và đúng phương pháp.", "/carousel-recorder.webp", "♩", "Trẻ em, người mới học, giáo viên phổ thông và giáo viên Steiner/Waldorf.", "[TIÊU ĐỀ BÀI]\nHọc nhạc cụ dễ tiếp cận, bài bản và giàu tính giáo dục.\n\n[GIỚI THIỆU]\nRecorder dễ tiếp cận nhưng cần nền tảng đúng để tiếng không chói và ngón bấm linh hoạt. Chương trình phù hợp cho trẻ em, người mới và giáo viên âm nhạc cần ứng dụng trong lớp học.\n\n[BẠN SẼ HỌC ĐƯỢC GÌ]\nTư thế, hơi thổi nhẹ và âm thanh tròn\nHệ thống ngón soprano/alto recorder\nĐọc nốt, tiết tấu và ký hiệu âm nhạc\nĐộc tấu, song tấu và hòa tấu\nPhương pháp luyện tập và ứng dụng giảng dạy\n\n[LỘ TRÌNH HỌC]\nGiai đoạn 1 · Nốt cơ bản\nGiai đoạn 2 · Đọc nhạc\nGiai đoạn 3 · Kỹ thuật & hòa tấu\nGiai đoạn 4 · Biểu diễn\n\n[TRÍCH DẪN]\nRecorder là cây cầu tuyệt vời để kết nối trẻ em và người mới đến với thế giới âm nhạc.\n\n[HÌNH THỨC HỌC]\nTrực tiếp tại trung tâm\nGia sư tại nhà\nOnline 1 kèm 1\n\n[THỜI GIAN]\nLinh động theo lịch học viên", 3],
  ["class-xiao", "class-details", "Động tiêu & Xiao", "dong-tieu-xiao", "Thanh âm trầm ấm cho những khoảng lặng sâu.", "/carousel-tieu.webp", "♬", "Người yêu âm nhạc sâu lắng, cổ phong, thiền định và màu âm trầm ấm.", "[TIÊU ĐỀ BÀI]\nKhoảng lặng bình yên cho người yêu âm nhạc cổ phong và thiền định.\n\n[GIỚI THIỆU]\nĐộng tiêu Việt Nam và Xiao Trung Quốc cùng sử dụng huyệt thổi dọc nhưng có hệ thống ngón và phong cách khác nhau. Học viên được hướng dẫn tạo tiếng trầm ổn định, kiểm soát hơi dài và biểu cảm tinh tế.\n\n[BẠN SẼ HỌC ĐƯỢC GÌ]\nTư thế, huyệt thổi và cách tạo tiếng\nCột hơi dài, âm trầm và chuyển quãng\nHệ thống ngón động tiêu và Xiao\nRung, vuốt và xử lý câu nhạc chậm\nThực hành nhạc thiền và tác phẩm cổ phong\n\n[LỘ TRÌNH HỌC]\nGiai đoạn 1 · Tạo tiếng trầm\nGiai đoạn 2 · Hệ thống ngón\nGiai đoạn 3 · Sắc thái\nGiai đoạn 4 · Tác phẩm\n\n[TRÍCH DẪN]\nTiếng tiêu trầm lắng giúp lòng người tĩnh lại sau những bộn bề cuộc sống.\n\n[HÌNH THỨC HỌC]\nTrực tiếp tại trung tâm\nGia sư tại nhà\nOnline 1 kèm 1\n\n[THỜI GIAN]\nLinh động theo lịch học viên", 4],
  ["class-flute", "class-details", "Flute", "flute", "Âm sắc trong trẻo cùng kỹ thuật phương Tây bài bản.", "/carousel-flute.webp", "♪", "Người mới, học sinh nghệ thuật hoặc người muốn nâng cao kỹ thuật.", "[TIÊU ĐỀ BÀI]\nKỹ thuật hiện đại, âm vực rộng và lộ trình cá nhân hóa.\n\n[GIỚI THIỆU]\nChương trình flute được cá nhân hóa từ nền tảng đến nâng cao. Người học phát triển tư thế đúng, khẩu hình linh hoạt, cao độ ổn định và khả năng đọc bản nhạc để tiến tới các tác phẩm hoàn chỉnh.\n\n[BẠN SẼ HỌC ĐƯỢC GÌ]\nLắp nhạc cụ, tư thế và khẩu hình\nÂm dài, cao độ và chuyển quãng\nGam, arpeggio, etude và kỹ thuật lưỡi\nĐọc bản nhạc và xây dựng nhịp\nPhong cách và xử lý tác phẩm\n\n[LỘ TRÌNH HỌC]\nGiai đoạn 1 · Âm thanh nền tảng\nGiai đoạn 2 · Gam & etude\nGiai đoạn 3 · Kỹ thuật\nGiai đoạn 4 · Repertoire\n\n[TRÍCH DẪN]\nFlute mang lại sự trong sáng, thanh thoát và khả năng biểu đạt không giới hạn.\n\n[HÌNH THỨC HỌC]\nTrực tiếp tại trung tâm\nGia sư tại nhà\nOnline 1 kèm 1\n\n[THỜI GIAN]\nLinh động theo lịch học viên", 5],
  ["class-hmong", "class-details", "Sáo H’Mông", "sao-hmong", "Khám phá âm hưởng Tây Bắc mộc mạc và da diết.", "/carousel-saotruc.webp", "❋", "Người yêu âm nhạc dân tộc, văn hóa Tây Bắc và muốn khám phá nhạc cụ mới.", "[TIÊU ĐỀ BÀI]\nÂm sắc lam đồng da diết và những làn điệu vùng cao.\n\n[GIỚI THIỆU]\nSáo H’Mông sử dụng lam đồng và có màu âm da diết rất riêng. Khóa học đưa người học từ nguyên lý phát âm đến hệ thống ngón và những làn điệu mang đậm bản sắc vùng cao.\n\n[BẠN SẼ HỌC ĐƯỢC GÌ]\nCấu tạo và nguyên lý lam đồng\nTạo tiếng, bẻ lam và kiểm soát hơi\nHệ thống ngón đặc trưng\nLuyến láy theo phong cách Tây Bắc\nThực hành làn điệu và tác phẩm\n\n[LỘ TRÌNH HỌC]\nGiai đoạn 1 · Làm quen lam\nGiai đoạn 2 · Hơi & ngón\nGiai đoạn 3 · Làn điệu\nGiai đoạn 4 · Biểu diễn\n\n[TRÍCH DẪN]\nÂm thanh sáo Mèo như tiếng gọi người yêu vang vọng giữa đại ngàn Tây Bắc.\n\n[HÌNH THỨC HỌC]\nTrực tiếp tại trung tâm\nGia sư tại nhà\nOnline 1 kèm 1\n\n[THỜI GIAN]\nLinh động theo lịch học viên", 6],

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

  // Video quay từng bài. Trường nhãn là slug nhóm nhạc cụ.
  ["video-beo-dat", "single-videos", "Bèo dạt mây trôi", "beo-dat-may-troi-sao-truc", "Video hướng dẫn từng câu, sheet nhạc, ngón bấm và kỹ thuật.", "/carousel-saotruc.webp", "sao-truc", "99.000đ", "Hướng dẫn chia câu và lấy hơi\nSheet nhạc và ngón bấm\nPhân tích kỹ thuật luyến láy\nVideo xem lại trọn đời", 1],
  ["video-ve-que", "single-videos", "Về quê", "ve-que-sao-truc", "Video hướng dẫn tác phẩm Về quê dành cho sáo trúc.", "/carousel-saotruc.webp", "sao-truc", "99.000đ", "Hướng dẫn từng câu\nSheet nhạc và ngón bấm\nKỹ thuật biểu cảm\nVideo xem lại trọn đời", 2],
  ["video-tinh-ca-tay-bac", "single-videos", "Tình ca Tây Bắc", "tinh-ca-tay-bac-sao-truc", "Hướng dẫn xử lý âm hưởng Tây Bắc trên sáo trúc.", "/carousel-saotruc.webp", "sao-truc", "99.000đ", "Hướng dẫn từng câu\nSheet nhạc\nLuyến láy phong cách Tây Bắc\nVideo xem lại trọn đời", 3],
  ["video-dai-ngu", "single-videos", "Đại Ngư", "dai-ngu-sao-dizi", "Hướng dẫn Dizi tác phẩm Đại Ngư với màng rung và luyến láy.", "/carousel-dizi.webp", "sao-dizi", "129.000đ", "Hướng dẫn từng câu\nSheet nhạc Dizi\nXử lý màng rung và luyến láy\nVideo xem lại trọn đời", 1],
  ["video-than-thoai", "single-videos", "Thần Thoại", "than-thoai-sao-dizi", "Hướng dẫn Dizi tác phẩm Thần Thoại.", "/carousel-dizi.webp", "sao-dizi", "129.000đ", "Hướng dẫn từng câu\nSheet nhạc Dizi\nKỹ thuật biểu cảm\nVideo xem lại trọn đời", 2],
  ["video-luong-son-ba", "single-videos", "Lương Sơn Bá – Chúc Anh Đài", "luong-son-ba-chuc-anh-dai-sao-dizi", "Hướng dẫn tác phẩm cổ điển cho sáo Dizi.", "/carousel-dizi.webp", "sao-dizi", "149.000đ", "Hướng dẫn từng câu\nSheet nhạc Dizi\nLuyến láy cổ phong\nVideo xem lại trọn đời", 3],
  ["video-inh-la-oi", "single-videos", "Inh lả ơi", "inh-la-oi-sao-meo", "Hướng dẫn bài Inh lả ơi dành cho sáo mèo.", "/carousel-saotruc.webp", "sao-meo", "99.000đ", "Hướng dẫn từng câu\nSheet nhạc\nKỹ thuật lam đồng\nVideo xem lại trọn đời", 1],
  ["video-xuan-ve-ban-mong", "single-videos", "Xuân về bản Mông", "xuan-ve-ban-mong-sao-meo", "Hướng dẫn phong cách vùng cao trên sáo mèo.", "/carousel-saotruc.webp", "sao-meo", "129.000đ", "Hướng dẫn từng câu\nSheet nhạc\nKỹ thuật phong cách vùng cao\nVideo xem lại trọn đời", 2],
  ["video-goi-em-ben-suoi", "single-videos", "Gọi em bên suối", "goi-em-ben-suoi-sao-meo", "Video hướng dẫn dành cho sáo mèo đơn và kép.", "/carousel-saotruc.webp", "sao-meo", "Liên hệ", "Hướng dẫn từng câu\nSheet nhạc\nNgón bấm và kỹ thuật\nVideo xem lại trọn đời", 3],
  ["video-vo-ky", "single-videos", "Vô Ky", "vo-ky-tieu-xiao", "Hướng dẫn tác phẩm Vô Ky cho tiêu và Xiao.", "/carousel-tieu.webp", "tieu-xiao", "129.000đ", "Hướng dẫn từng câu\nSheet nhạc\nKiểm soát hơi dài\nVideo xem lại trọn đời", 1],
  ["video-co-mong", "single-videos", "Cố Mộng", "co-mong-tieu-xiao", "Hướng dẫn tác phẩm cổ phong cho tiêu và Xiao.", "/carousel-tieu.webp", "tieu-xiao", "129.000đ", "Hướng dẫn từng câu\nSheet nhạc\nKỹ thuật cổ phong\nVideo xem lại trọn đời", 2],
  ["video-tinh-tam", "single-videos", "Tịnh tâm", "tinh-tam-tieu-xiao", "Hướng dẫn giai điệu thiền cho tiêu và Xiao.", "/carousel-tieu.webp", "tieu-xiao", "99.000đ", "Hướng dẫn từng câu\nSheet nhạc\nKỹ thuật hơi và sắc thái\nVideo xem lại trọn đời", 3],
  ["video-always-with-me", "single-videos", "Always With Me", "always-with-me-recorder", "Hướng dẫn tác phẩm nhạc phim cho Recorder.", "/carousel-recorder.webp", "recorder", "99.000đ", "Hướng dẫn từng câu\nSheet nhạc Recorder\nNgón bấm và nhịp\nVideo xem lại trọn đời", 1],
  ["video-ly-cay-xanh", "single-videos", "Lý cây xanh", "ly-cay-xanh-recorder", "Hướng dẫn dân ca Việt Nam cho Recorder.", "/carousel-recorder.webp", "recorder", "79.000đ", "Hướng dẫn từng câu\nSheet nhạc Recorder\nNhịp và ngón bấm\nVideo xem lại trọn đời", 2],
  ["video-con-chim-non", "single-videos", "Con chim non", "con-chim-non-recorder", "Video hướng dẫn Recorder dành cho người mới và trẻ em.", "/carousel-recorder.webp", "recorder", "79.000đ", "Hướng dẫn từng câu\nSheet nhạc Recorder\nBài tập ngón bấm\nVideo xem lại trọn đời", 3],
  ["video-the-swan", "single-videos", "The Swan", "the-swan-flute", "Hướng dẫn tác phẩm The Swan dành cho Flute.", "/carousel-flute.webp", "flute", "129.000đ", "Hướng dẫn từng câu\nSheet nhạc Flute\nKỹ thuật hơi và biểu cảm\nVideo xem lại trọn đời", 1],
  ["video-canon-in-d", "single-videos", "Canon in D", "canon-in-d-flute", "Hướng dẫn Canon in D theo cấp độ cho Flute.", "/carousel-flute.webp", "flute", "129.000đ", "Hướng dẫn từng câu\nSheet nhạc Flute\nNgón bấm và kỹ thuật\nVideo xem lại trọn đời", 2],
  ["video-a-thousand-years", "single-videos", "A Thousand Years", "a-thousand-years-flute", "Hướng dẫn Flute tác phẩm A Thousand Years.", "/carousel-flute.webp", "flute", "Liên hệ", "Hướng dẫn từng câu\nSheet nhạc Flute\nKỹ thuật biểu cảm\nVideo xem lại trọn đời", 3],

  // Giáo trình và sheet. Nhãn có dạng loai:slug-nhom.
  ["material-gt-st-tong-hop", "materials", "Giáo trình tổng hợp", "giao-trinh-tong-hop", "Lộ trình đầy đủ từ nhập môn đến xử lý tác phẩm.", "/carousel-saotruc.webp", "giao-trinh:sao-truc", "499.000đ", "Lộ trình học theo cấp độ\nBài tập hơi, ngón và kỹ thuật\nHướng dẫn xử lý tác phẩm\nTài liệu sử dụng lâu dài", 1],
  ["material-gt-st-co-ban", "materials", "Giáo trình cơ bản", "giao-trinh-co-ban", "Tư thế, khẩu hình, hơi, ngón và đọc nhạc nền tảng.", "/carousel-saotruc.webp", "giao-trinh:sao-truc", "249.000đ", "Nền tảng tư thế và khẩu hình\nBài tập cột hơi\nHệ thống ngón bấm\nĐọc nhạc cơ bản", 2],
  ["material-gt-st-nang-cao", "materials", "Giáo trình nâng cao", "giao-trinh-nang-cao", "Rung hơi, luyến láy, kỹ thuật nhanh và biểu cảm.", "/carousel-saotruc.webp", "giao-trinh:sao-truc", "399.000đ", "Kỹ thuật rung hơi\nLuyến láy và ngón nhanh\nPhát triển sắc thái\nBài tập nâng cao", 3],
  ["material-gt-st-etude", "materials", "Giáo trình gam & etude", "giao-trinh-gam-etude", "Hệ thống bài luyện gam, ngón và etude theo cấp độ.", "/carousel-saotruc.webp", "giao-trinh:sao-truc", "299.000đ", "Hệ thống gam\nBài luyện ngón\nEtude theo cấp độ\nLịch luyện tập gợi ý", 4],
  ["material-gt-st-dan-ca", "materials", "Giáo trình dân ca", "giao-trinh-dan-ca", "Dân ca ba miền cùng hướng dẫn xử lý phong cách.", "/carousel-saotruc.webp", "giao-trinh:sao-truc", "299.000đ", "Tác phẩm dân ca ba miền\nKỹ thuật luyến láy\nPhân tích phong cách\nGợi ý luyện tập", 5],
  ["material-gt-st-chu-de", "materials", "Ca khúc chuyển soạn theo chủ đề", "ca-khuc-chuyen-soan-theo-chu-de", "Tuyển tập tác phẩm theo chủ đề và mục tiêu biểu diễn.", "/carousel-saotruc.webp", "giao-trinh:sao-truc", "Liên hệ", "Tuyển tập theo chủ đề\nChuyển soạn theo nhạc cụ\nTư vấn theo mục tiêu biểu diễn", 6],
  ["material-gt-dizi-tong-hop", "materials", "Giáo trình tổng hợp", "giao-trinh-tong-hop-dizi", "Từ dán màng rung đến hoàn thiện tác phẩm Dizi.", "/carousel-dizi.webp", "giao-trinh:sao-dizi", "599.000đ", "Dán và căn chỉnh màng rung\nHơi và hệ thống ngón\nKỹ thuật Dizi\nHoàn thiện tác phẩm", 1],
  ["material-gt-dizi-co-ban", "materials", "Giáo trình cơ bản", "giao-trinh-co-ban-dizi", "Hơi, ngón, màng rung và kỹ thuật nền tảng.", "/carousel-dizi.webp", "giao-trinh:sao-dizi", "299.000đ", "Nền tảng hơi và ngón\nCách dùng màng rung\nBài tập cơ bản", 2],
  ["material-gt-dizi-nang-cao", "materials", "Giáo trình nâng cao", "giao-trinh-nang-cao-dizi", "Luyến, láy, rung và kỹ thuật biểu diễn cổ phong.", "/carousel-dizi.webp", "giao-trinh:sao-dizi", "449.000đ", "Luyến láy nâng cao\nKỹ thuật cổ phong\nXử lý tác phẩm", 3],
  ["material-gt-dizi-etude", "materials", "Giáo trình gam & etude", "giao-trinh-gam-etude-dizi", "Bài luyện gam và etude riêng cho hệ Dizi.", "/carousel-dizi.webp", "giao-trinh:sao-dizi", "299.000đ", "Hệ thống gam\nEtude Dizi\nLịch luyện tập", 4],
  ["material-gt-dizi-dan-ca", "materials", "Giáo trình dân ca", "giao-trinh-dan-ca-dizi", "Tác phẩm dân gian Trung Hoa tuyển chọn.", "/carousel-dizi.webp", "giao-trinh:sao-dizi", "349.000đ", "Tác phẩm tuyển chọn\nPhân tích phong cách\nKỹ thuật luyến láy", 5],
  ["material-gt-dizi-chu-de", "materials", "Ca khúc chuyển soạn theo chủ đề", "ca-khuc-chuyen-soan-theo-chu-de-dizi", "Nhạc Hoa, cổ phong và nhạc phim theo chủ đề.", "/carousel-dizi.webp", "giao-trinh:sao-dizi", "Liên hệ", "Chuyển soạn theo chủ đề\nNhạc Hoa và cổ phong\nTư vấn theo yêu cầu", 6],
  ["material-gt-rec-tong-hop", "materials", "Giáo trình tổng hợp", "giao-trinh-tong-hop-sao-recorder", "Chương trình Recorder toàn diện theo từng cấp độ.", "/carousel-recorder.webp", "giao-trinh:sao-recorder", "399.000đ", "Lộ trình theo cấp độ\nHơi, ngón và đọc nhạc\nTác phẩm thực hành", 1],
  ["material-gt-rec-co-ban", "materials", "Giáo trình cơ bản", "giao-trinh-co-ban-sao-recorder", "Hơi, ngón, nhịp và đọc bản nhạc cho người mới.", "/carousel-recorder.webp", "giao-trinh:sao-recorder", "199.000đ", "Tư thế và hơi\nHệ thống ngón\nNhịp và đọc nhạc", 2],
  ["material-gt-rec-nang-cao", "materials", "Giáo trình nâng cao", "giao-trinh-nang-cao-sao-recorder", "Kỹ thuật nâng cao, hòa tấu và xử lý tác phẩm.", "/carousel-recorder.webp", "giao-trinh:sao-recorder", "349.000đ", "Kỹ thuật nâng cao\nHòa tấu\nXử lý tác phẩm", 3],
  ["material-gt-rec-etude", "materials", "Giáo trình gam & etude", "giao-trinh-gam-etude-sao-recorder", "Gam, ngón chéo và etude phát triển kỹ thuật.", "/carousel-recorder.webp", "giao-trinh:sao-recorder", "249.000đ", "Hệ thống gam\nNgón chéo\nEtude phát triển kỹ thuật", 4],
  ["material-gt-rec-dan-ca", "materials", "Giáo trình dân ca", "giao-trinh-dan-ca-sao-recorder", "Dân ca Việt Nam chuyển soạn phù hợp Recorder.", "/carousel-recorder.webp", "giao-trinh:sao-recorder", "249.000đ", "Dân ca Việt Nam\nChuyển soạn cho Recorder\nGợi ý luyện tập", 5],
  ["material-gt-rec-chu-de", "materials", "Ca khúc chuyển soạn theo chủ đề", "ca-khuc-chuyen-soan-theo-chu-de-sao-recorder", "Thiếu nhi, nhạc phim và tác phẩm giáo dục.", "/carousel-recorder.webp", "giao-trinh:sao-recorder", "Liên hệ", "Tác phẩm thiếu nhi\nNhạc phim\nChuyển soạn theo yêu cầu", 6],
  ["material-sheet-st-tuyen-tap", "materials", "Tuyển tập sheet sáo trúc", "tuyen-tap-sheet-sao-truc", "Dân ca, trữ tình, nhạc trẻ và tác phẩm biểu diễn.", "/carousel-saotruc.webp", "sheet:sao-truc", "79.000đ", "Tuyển tập nhiều phong cách\nTrình bày rõ ràng\nPhù hợp luyện tập và biểu diễn", 1],
  ["material-sheet-st-ngon", "materials", "Sheet kèm ngón bấm", "sheet-kem-ngon-bam", "Bản nhạc trình bày rõ ràng, có ký hiệu ngón hỗ trợ.", "/carousel-saotruc.webp", "sheet:sao-truc", "99.000đ", "Sheet nhạc đầy đủ\nKý hiệu ngón bấm\nGợi ý hơi và kỹ thuật", 2],
  ["material-sheet-dizi-tuyen-tap", "materials", "Tuyển tập sheet Dizi", "tuyen-tap-sheet-dizi", "Nhạc Hoa, cổ phong và nhạc phim chuyển soạn cho Dizi.", "/carousel-dizi.webp", "sheet:sao-dizi", "99.000đ", "Nhạc Hoa và cổ phong\nChuyển soạn cho Dizi\nTrình bày rõ ràng", 1],
  ["material-sheet-dizi-ky-thuat", "materials", "Sheet kèm kỹ thuật", "sheet-kem-ky-thuat-dizi", "Đánh dấu hơi, luyến láy và vị trí xử lý màng rung.", "/carousel-dizi.webp", "sheet:sao-dizi", "129.000đ", "Đánh dấu hơi\nKý hiệu luyến láy\nHướng dẫn màng rung", 2],
  ["material-sheet-rec-tuyen-tap", "materials", "Tuyển tập sheet Recorder", "tuyen-tap-sheet-recorder", "Nhạc thiếu nhi, nhạc phim và ngũ cung Việt Nam.", "/carousel-recorder.webp", "sheet:sao-recorder", "69.000đ", "Nhạc thiếu nhi và nhạc phim\nNgũ cung Việt Nam\nPhân cấp độ", 1],
  ["material-sheet-rec-hoa-tau", "materials", "Sheet hòa tấu Recorder", "sheet-hoa-tau-recorder", "Bản song tấu và hòa tấu phân bè theo trình độ.", "/carousel-recorder.webp", "sheet:sao-recorder", "Liên hệ", "Bản song tấu và hòa tấu\nPhân bè rõ ràng\nĐiều chỉnh theo trình độ", 2],

  // Liên kết mạng xã hội trên trang chủ. Nội dung là URL đầy đủ.
  ["social-youtube", "social-links", "Kênh Sáo Trúc Âu Cơ", "youtube", "Kênh video của Sáo Trúc Âu Cơ", "", "▶", "YOUTUBE", "https://www.youtube.com/", 1],
  ["social-facebook", "social-links", "Sáo Trúc Âu Cơ", "facebook", "Trang Facebook của Sáo Trúc Âu Cơ", "", "f", "FACEBOOK", "https://www.facebook.com/", 2],
  ["social-tiktok", "social-links", "@saotruc.auco", "tiktok", "Kênh TikTok của Sáo Trúc Âu Cơ", "", "♪", "TIKTOK", "https://www.tiktok.com/", 3],
  ["social-instagram", "social-links", "@saotruc.auco", "instagram", "Trang Instagram của Sáo Trúc Âu Cơ", "", "◎", "INSTAGRAM", "https://www.instagram.com/", 4],

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

  // Cảm âm sáo trúc mẫu theo định dạng 2 dòng (dòng lời ở trên, dòng nốt ở dưới)
  ["tab-beo-dat", "flute-tabs", "Bèo dạt mây trôi", "beo-dat-may-troi", "Bèo dạt mây trôi – Dân ca quan họ Bắc Ninh", "", "Tone C5 · Nhịp 4/4 · Dễ", "", "Bèo dạt mây trôi chốn xa xôi\ndo2 re2 mi2 sol2 la2 sol2 mi2 re2 do2\n\nAnh ơi em vẫn đợi cánh bèo dạt trôi\nla sol do2 re2 mi2 sol2 re2 do2 la sol", 1],
  ["tab-chieu-que-huong", "flute-tabs", "Chiều trên quê hương", "chieu-tren-que-huong", "Chiều trên quê hương – Cảm âm dân gian", "", "Tone C5 · Nhịp 2/4 · Trung bình", "", "Chiều nghiêng theo gió bờ tre ru êm đềm\nsol la sol mi re mi sol\n\nDòng sông lấp lánh chở câu ca về làng\nmi sol la do2 si la sol mi re mi sol do", 2],
  ["tab-vung-cao", "flute-tabs", "Khúc sáo vùng cao", "khuc-sao-vung-cao", "Khúc sáo vùng cao – Bài luyện luyến láy", "", "Tone G4 · Nhịp 6/8 · Trung bình", "", "Mây bay qua núi bước chân vui trên đồi\nsol la si re2 si la sol la sol mi\n\nTiếng sáo ngân dài gọi mùa xuân về đây\nsi re2 mi2 re2 si la sol mi sol la sol", 3],
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
    db.prepare(`CREATE TABLE IF NOT EXISTS cms_deleted (
      id TEXT PRIMARY KEY,
      deleted_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TRIGGER IF NOT EXISTS cms_entries_delete_tombstone
      AFTER DELETE ON cms_entries
      BEGIN
        INSERT OR REPLACE INTO cms_deleted (id, deleted_at)
        VALUES (OLD.id, CURRENT_TIMESTAMP);
      END`),
  ]);

  const now = new Date().toISOString();
  const allSeedEntries = [...initialCmsEntries, ...detailedCmsEntries];
  const seedStatements = allSeedEntries.map((item) => db.prepare(`INSERT OR IGNORE INTO cms_entries
    (id, collection, title, slug, published_at, excerpt, image_url, tag, price, content, visible, sort_order, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`)
    .bind(item[0], item[1], item[2], item[3], item[1] === "articles" ? "2026-08-08" : "", item[4], item[5], item[6], item[7], item[8], item[9], now));
  for (let offset = 0; offset < seedStatements.length; offset += 12) {
    await db.batch(seedStatements.slice(offset, offset + 12));
  }
  await db.prepare("DELETE FROM cms_entries WHERE id IN (SELECT id FROM cms_deleted)").run();
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
  const sessionSecret = env.CMS_SESSION_SECRET || "saotrucauco-secret-key-2026";
  const [expires, signature] = getCookie(request, CMS_COOKIE).split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return constantTimeEqual(signature, await hmac(expires, sessionSecret));
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

  await ensureCmsSchema(env.DB);

  if (url.pathname.startsWith("/media/")) {
    const id = decodeURIComponent(url.pathname.slice("/media/".length));
    if (!id || id.includes("..") || id.startsWith("/")) return new Response("Not found", { status: 404 });
    const asset = await env.DB.prepare("SELECT content_type, data FROM cms_assets WHERE id = ?").bind(id).first<{ content_type: string; data: any }>();
    if (!asset || !asset.data) return new Response("Not found", { status: 404 });

    let bodyData: BodyInit;
    if (asset.data instanceof Uint8Array || asset.data instanceof ArrayBuffer) {
      bodyData = asset.data;
    } else if (Array.isArray(asset.data)) {
      bodyData = new Uint8Array(asset.data);
    } else if (typeof asset.data === "string") {
      try {
        const bin = atob(asset.data);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        bodyData = bytes;
      } catch {
        bodyData = new TextEncoder().encode(asset.data);
      }
    } else {
      bodyData = new Uint8Array(asset.data as any);
    }

    return new Response(bodyData, {
      headers: {
        "Content-Type": asset.content_type || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  if (url.pathname === "/api/cms/content" && request.method === "GET") {
    const result = await env.DB.prepare("SELECT * FROM cms_entries WHERE visible = 1 ORDER BY collection, sort_order, updated_at DESC").all<CmsRow>();
    return Response.json({ entries: (result.results ?? []).map(normalizeCmsRow) }, { headers: { "Cache-Control": "public, max-age=30" } });
  }

  if (url.pathname === "/api/cms/login") {
    if (request.method !== "POST" || !requestHasSameOrigin(request, url)) return Response.json({ error: "Invalid request" }, { status: 403 });
    const customPassRow = await env.DB.prepare("SELECT content FROM cms_entries WHERE collection = 'settings' AND slug = 'admin-password'").first<{ content: string }>().catch(() => null);
    const adminPassword = customPassRow?.content || env.CMS_ADMIN_PASSWORD || "854123";
    const sessionSecret = env.CMS_SESSION_SECRET || "saotrucauco-secret-key-2026";
    const body = await request.json().catch(() => ({})) as { password?: unknown };
    const supplied = String(body.password ?? "");
    const suppliedDigest = await hmac(supplied, sessionSecret);
    const expectedDigest = await hmac(adminPassword, sessionSecret);
    if (!constantTimeEqual(suppliedDigest, expectedDigest)) return Response.json({ error: "Invalid credentials" }, { status: 401 });
    const expires = String(Date.now() + 12 * 60 * 60 * 1000);
    const signature = await hmac(expires, sessionSecret);
    return Response.json({ ok: true }, { headers: { "Set-Cookie": `${CMS_COOKIE}=${expires}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200` } });
  }

  if (url.pathname === "/api/cms/logout") {
    return Response.json({ ok: true }, { headers: { "Set-Cookie": `${CMS_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` } });
  }

  if (!await isCmsAuthenticated(request, env)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (url.pathname === "/api/cms/change-password" && request.method === "POST") {
    const body = await request.json().catch(() => ({})) as { currentPassword?: string; newPassword?: string };
    const currentSupplied = String(body.currentPassword ?? "");
    const newPassword = String(body.newPassword ?? "").trim();
    if (!newPassword || newPassword.length < 4) {
      return Response.json({ error: "Mật khẩu mới phải có ít nhất 4 ký tự" }, { status: 400 });
    }
    const customPassRow = await env.DB.prepare("SELECT content FROM cms_entries WHERE collection = 'settings' AND slug = 'admin-password'").first<{ content: string }>().catch(() => null);
    const adminPassword = customPassRow?.content || env.CMS_ADMIN_PASSWORD || "854123";
    const sessionSecret = env.CMS_SESSION_SECRET || "saotrucauco-secret-key-2026";
    const suppliedDigest = await hmac(currentSupplied, sessionSecret);
    const expectedDigest = await hmac(adminPassword, sessionSecret);
    if (!constantTimeEqual(suppliedDigest, expectedDigest)) {
      return Response.json({ error: "Mật khẩu hiện tại không đúng" }, { status: 401 });
    }
    const now = new Date().toISOString();
    await env.DB.prepare(`INSERT INTO cms_entries
      (id, collection, title, slug, published_at, excerpt, image_url, tag, price, content, visible, sort_order, updated_at)
      VALUES ('settings-admin-password', 'settings', 'Mật khẩu Quản trị', 'admin-password', '', '', '', '', '', ?, 0, 999, ?)
      ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at`)
      .bind(newPassword, now).run();
    return Response.json({ ok: true, message: "Đổi mật khẩu quản trị thành công!" });
  }

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
    const deletedAt = new Date().toISOString();
    await env.DB.batch([
      env.DB.prepare("INSERT OR REPLACE INTO cms_deleted (id, deleted_at) VALUES (?, ?)").bind(id, deletedAt),
      env.DB.prepare("DELETE FROM cms_entries WHERE id = ?").bind(id),
    ]);
    return Response.json({ ok: true });
  }

  if (url.pathname === "/api/cms/upload" && request.method === "POST") {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size > 2 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      return Response.json({ error: "Invalid image" }, { status: 400 });
    }
    const extension = file.type === "image/jpeg" ? "jpg" : (file.type.split("/")[1] || "jpg");
    const key = `${crypto.randomUUID()}.${extension}`;
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    await env.DB.prepare("INSERT INTO cms_assets (id, content_type, data, created_at) VALUES (?, ?, ?, ?)")
      .bind(key, file.type || "image/jpeg", uint8, new Date().toISOString()).run();
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

    if (url.pathname === "/api/contact-request") {
      if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
      }
      if (!requestHasSameOrigin(request, url)) {
        return Response.json({ error: "Invalid origin" }, { status: 403 });
      }
      if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
        return Response.json({ error: "Telegram notification is not configured" }, { status: 503 });
      }

      const data = await request.json().catch(() => null) as Record<string, unknown> | null;
      if (!data) return Response.json({ error: "Invalid request" }, { status: 400 });
      const clean = (value: unknown, maximum: number) => String(value ?? "").trim().slice(0, maximum);
      const name = clean(data.name, 100);
      const phone = clean(data.phone, 40);
      const interest = clean(data.interest, 500);
      const message = clean(data.message, 1000);
      if (!name || !phone || !interest) return Response.json({ error: "Missing required fields" }, { status: 400 });

      const notification = [
        "📩 YÊU CẦU TƯ VẤN MỚI TỪ WEBSITE",
        "",
        `Họ tên: ${name}`,
        `SĐT / Zalo: ${phone}`,
        `Nhu cầu: ${interest}`,
        `Lời nhắn: ${message || "Khách không để lại lời nhắn"}`,
        `Thời gian: ${new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "medium" }).format(new Date())}`,
      ].join("\n");

      const telegramResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: notification, disable_web_page_preview: true }),
      });
      if (!telegramResponse.ok) {
        console.error("Telegram contact request failed", telegramResponse.status);
        return Response.json({ error: "Unable to send request" }, { status: 502 });
      }
      return Response.json({ ok: true });
    }

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
