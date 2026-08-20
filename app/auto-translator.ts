// Smart bilingual dictionary and heuristic translation engine

export type Language = "vi" | "en";

// Pre-compiled direct phrase mappings for high quality rendering
const exactPhraseMap: Record<string, string> = {
  // Brand & Slogans
  "SÁO TRÚC ÂU CƠ": "AU CO BAMBOO FLUTE",
  "Sáo Trúc Âu Cơ": "Au Co Bamboo Flute",
  "SÁO TRÚC & ÂM NHẠC DÂN TỘC": "BAMBOO FLUTE & TRADITIONAL MUSIC",
  "Sáo trúc & Âm nhạc dân tộc": "Bamboo Flute & Traditional Music",
  "ÂM NHẠC DÂN TỘC & ĐÀO TẠO CHUYÊN NGHIỆP": "TRADITIONAL MUSIC & PROFESSIONAL TRAINING",
  "Âm nhạc dân tộc & Đào tạo chuyên nghiệp": "Traditional Music & Professional Training",
  "Hơi Thở Thành Âm": "Breath Into Sound",
  "Tâm Hồn Thành Nhạc": "Soul Into Melody",
  "Hơi thở thành âm · Tâm hồn thành nhạc": "Breath into sound · Soul into melody",
  "Đam mê làm nên giá trị · Chất lượng tạo nên uy tín": "Passion creates value · Quality builds trust",
  "TRUNG TÂM ĐÀO TẠO & SẢN XUẤT ÂM NHẠC SÁO TRÚC ÂU CƠ": "AU CO BAMBOO FLUTE ACADEMY & AUDIO PRODUCTION",
  "Âm nhạc dân tộc · Đào tạo chuyên sâu · Nhạc cụ chuẩn âm · Sản xuất âm thanh": "Traditional Music · In-Depth Training · Concert-Pitch Instruments · Audio Production",
  "© 2026 Sáo Trúc Âu Cơ. All rights reserved.": "© 2026 Au Co Bamboo Flute. All rights reserved.",
  "© 2026 Sáo Trúc Âu Cơ.": "© 2026 Au Co Bamboo Flute.",

  // Navigations & Search
  "Trang chủ": "Home",
  "Bài viết": "Articles",
  "Lớp học": "Classes",
  "Cảm âm": "Flute Tabs",
  "Liên hệ": "Contact",
  "Khóa học": "Courses",
  "Sáo & Phụ kiện": "Flutes & Accessories",
  "Dịch vụ": "Services",
  "Về chúng tôi": "About Us",
  "⌕ Tìm kiếm": "⌕ Search",
  "Tìm kiếm": "Search",
  "Tìm lớp học, khóa học, dịch vụ...": "Search classes, courses, services...",
  "Không tìm thấy nội dung phù hợp.": "No matching content found.",
  "✦ Đăng ký học": "✦ Enroll Now",
  "Hotline / Zalo": "Hotline / Zalo",
  "Mở menu": "Open menu",
  "Điều hướng chính": "Main navigation",

  // 8 Main Services (Cards on Homepage)
  "Lớp học các bộ môn": "Instrument Classes & Disciplines",
  "LỚP HỌC CÁC BỘ MÔN": "INSTRUMENT CLASSES & DISCIPLINES",
  "Sáo trúc, Dizi, sáo nứa, sáo mèo, recorder và các bộ môn dân tộc.": "Bamboo flute, Dizi, Cat flute (Bawu), Recorder, and traditional folk disciplines.",
  "Xem lớp học": "Explore Classes",
  "XEM LỚP HỌC": "EXPLORE CLASSES",

  "Đăng ký lớp học": "Class Enrollment & Contact",
  "ĐĂNG KÝ LỚP HỌC": "CLASS ENROLLMENT & CONTACT",
  "Học tại trung tâm, gia sư tại nhà hoặc online 1 kèm 1 với lịch linh động.": "Learn at academy, private in-home tutoring, or 1-on-1 online with flexible schedules.",
  "Đăng ký ngay": "Enroll Now",
  "ĐĂNG KÝ NGAY": "ENROLL NOW",

  "Sáo & phụ kiện": "Flutes & Accessories",
  "SÁO & PHỤ KIỆN": "FLUTES & ACCESSORIES",
  "Sáo & Phụ kiện tuyển chọn": "Handpicked Flutes & Accessories",
  "Sáo trúc chuẩn âm, Dizi, sáo nứa, sáo mèo cùng phụ kiện được tuyển chọn.": "Concert-pitch bamboo flutes, Dizi, Cat flutes, and curated musical accessories.",
  "Khám phá": "Explore",
  "KHÁM PHÁ": "EXPLORE",

  "Khóa học quay sẵn": "Video Courses & Masterclasses",
  "KHÓA HỌC QUAY SẴN": "VIDEO COURSES & MASTERCLASSES",
  "COURSE QUAY SẴN": "VIDEO MASTERCLASSES",
  "Video bài giảng HD từ nhập môn đến nâng cao, học mọi lúc và xem lại trọn đời.": "HD masterclass lessons from beginner to advanced; learn anytime with lifetime access.",
  "Xem khóa học": "View Courses",
  "XEM KHÓA HỌC": "VIEW COURSES",
  "Xem course": "View Courses",
  "XEM COURSE": "VIEW COURSES",

  "Giáo trình & sheet": "Curriculum & Sheet Music",
  "GIÁO TRÌNH & SHEET": "CURRICULUM & SHEET MUSIC",
  "CURRICULUM & SHEET": "CURRICULUM & SHEET MUSIC",
  "Giáo trình kỹ thuật, sheet nhạc và bản chuyển soạn theo yêu cầu biểu diễn.": "Technique method books, sheet music, and custom arrangements for live performance.",
  "Xem tài liệu": "View Materials",
  "XEM TÀI LIỆU": "VIEW MATERIALS",
  "Từ 50.000đ / sheet": "From 50,000 VND / sheet",
  "FROM 50,000 VND / SHEET": "FROM 50,000 VND / SHEET",

  "Thu âm & quay video": "Audio Recording & Music Videos",
  "THU ÂM & QUAY VIDEO": "AUDIO RECORDING & MUSIC VIDEOS",
  "AUDIO RECORDING & MUSIC VIDEOS": "AUDIO RECORDING & MUSIC VIDEOS",
  "Thu âm, mixing, quay hình và dựng video chỉn chu cho học viên, nghệ sĩ.": "Multi-track audio recording, mixing, filming, and video editing for students and artists.",
  "Xem các gói": "View Packages",
  "XEM CÁC GÓI": "VIEW PACKAGES",
  "Từ 900.000đ": "From 900,000 VND",
  "FROM 900,000 VND": "FROM 900,000 VND",

  "Booking nghệ sĩ": "Artist Performance Booking",
  "BOOKING NGHỆ SĨ": "ARTIST PERFORMANCE BOOKING",
  "Độc tấu sáo, hòa tấu và ban nhạc dân tộc cho sự kiện, sân khấu, lễ hội.": "Flute soloists, chamber ensembles, and traditional folk bands for events and festivals.",
  "Xem gói booking": "View Booking Options",
  "XEM GÓI BOOKING": "VIEW BOOKING OPTIONS",

  "Thu âm nhạc cụ thật": "Real Instrument Studio Recording",
  "THU ÂM NHẠC CỤ THẬT": "REAL INSTRUMENT STUDIO RECORDING",
  "REAL INSTRUMENT STUDIO RECORDING": "REAL INSTRUMENT STUDIO RECORDING",
  "Sáo, đàn tranh, đàn bầu, đàn nhị và nhiều nhạc cụ dân tộc khác.": "Flute, Zither (Dan Tranh), Monochord (Dan Bau), Erhu (Dan Nhi), and many traditional instruments.",
  "Xem dịch vụ thu": "View Recording Services",
  "XEM DỊCH VỤ THU": "VIEW RECORDING SERVICES",
  "Từ 500.000đ / track": "From 500,000 VND / track",
  "FROM 500,000 VND / TRACK": "FROM 500,000 VND / TRACK",

  // Homepage Section Headings
  "Khám phá các dịch vụ & sản phẩm": "EXPLORE SERVICES & PRODUCTS",
  "Mọi giải pháp âm nhạc từ học tập, biểu diễn đến sản xuất âm thanh chuyên nghiệp.": "Complete musical solutions from learning and performing to professional audio production.",
  "ĐANG XEM CHI TIẾT": "CURRENTLY VIEWING",
  "✕ Đóng phần này": "✕ Close Section",

  // Hero Slides
  "BỘ MÔN TRUYỀN THỐNG": "TRADITIONAL DISCIPLINE",
  "Từ hơi thở đầu tiên đến tiếng sáo giàu cảm xúc.": "From the very first breath to soul-stirring melodies.",
  "Khám phá bộ môn": "Explore Discipline",
  "ÂM SẮC CỔ PHONG": "ANCIENT & ORIENTAL TIMBRE",
  "Khám phá màng rung và kỹ thuật diễn tấu Trung Hoa.": "Discover buzzing membrane resonance and Chinese flute performance techniques.",
  "ÂM NHẠC CHO MỌI LỨA TUỔI": "MUSIC FOR ALL AGES",
  "Khởi đầu dễ dàng, đọc nhạc bài bản và cùng nhau hòa tấu.": "Effortless beginning, structured sight-reading, and joyful ensemble playing.",
  "TRẦM ẤM & SÂU LẮNG": "WARM & MEDITATIVE RESONANCE",
  "Một khoảng lặng đẹp cho người yêu âm nhạc cổ phong.": "A serene sanctuary for lovers of meditative and ancient melodies.",
  "KỸ THUẬT PHƯƠNG TÂY": "WESTERN TECHNIQUE",
  "Âm sắc trong trẻo, linh hoạt cùng lộ trình cá nhân hóa.": "Crystal-clear tone, virtuosic flexibility, and a personalized learning roadmap.",

  // Training Disciplines
  "CHƯƠNG TRÌNH ĐÀO TẠO": "TRAINING PROGRAMS",
  "CÁC BỘ MÔN GIẢNG DẠY": "TRAINING DISCIPLINES",
  "6 bộ môn nhạc cụ chính": "6 Primary Instrument Disciplines",
  "Từ nhạc cụ hơi Việt Nam đến các dòng sáo phương Đông và Tây phương, mỗi bộ môn đều có lộ trình từ cơ bản đến nâng cao.": "From Vietnamese wind instruments to Eastern and Western flutes, each discipline features a structured step-by-step roadmap.",
  "Sáo trúc Việt Nam": "Vietnamese Bamboo Flute",
  "Sáo Dizi": "Chinese Dizi Flute",
  "Sáo Recorder": "Recorder Flute",
  "Động tiêu & Xiao": "Dongxiao & Xiao Flute",
  "Động tiêu (Xiao)": "Dongxiao (Xiao Flute)",
  "Sáo Flute": "Western Concert Flute",
  "Flute": "Western Concert Flute",
  "Sáo Mèo / Sáo H'Mông": "Hmong Flute / Bawu",
  "Sáo mèo": "Hmong Flute / Bawu",
  "Sáo H’Mông": "Hmong Flute",
  "Sáo H'Mông": "Hmong Flute",
  "Xem chi tiết bộ môn": "View discipline details",
  "Xem bài viết": "Read article",
  "Xem bài viết chuyên sâu →": "Read in-depth article →",
  "Nhận tư vấn khóa học →": "Get course consultation →",
  "Xem lộ trình →": "View syllabus →",
  "Nội dung trọng tâm:": "Core syllabus:",
  "Phù hợp với:": "Suitable for:",
  "Thời lượng & hình thức:": "Format & Duration:",
  "Tư vấn lộ trình riêng": "Custom Syllabus Consultation",
  "Bạn chưa rõ nên bắt đầu từ nhạc cụ nào? Nhận tư vấn 1:1 hoàn toàn miễn phí.": "Not sure which instrument to start with? Get a free 1-on-1 consultation.",
  "Mỗi bộ môn có một màu sắc riêng. Khám phá nội dung học, đối tượng phù hợp và đăng ký tư vấn trực tiếp hoặc online 1 kèm 1.": "Each discipline holds a distinct musical character. Discover syllabus, prerequisites, and enroll in direct offline or 1-on-1 online classes.",
  "Xem bài giới thiệu đầy đủ →": "Read full discipline guide →",
  "Đăng ký bộ môn này": "Enroll in this course",
  "Thu gọn −": "Collapse −",
  "Xem nhanh +": "Quick view +",
  "NỘI DUNG HỌC": "SYLLABUS",
  "PHÙ HỢP VỚI": "SUITABLE FOR",
  "BỘ MÔN": "DISCIPLINE",
  "NHẠC CỤ": "INSTRUMENT",
  "KHÓA HỌC": "COURSE",
  "TÀI LIỆU": "DOCUMENT",
  "THÔNG TIN CHI TIẾT": "DETAILED INFORMATION",
  "THÔNG TIN CHI TIẾT & LỘ TRÌNH": "DETAILED SYLLABUS & INFORMATION",

  // Video and Courses
  "KHÓA HỌC & VIDEO HƯỚNG DẪN": "VIDEO COURSES & LESSONS",
  "Khóa học & video quay sẵn": "Video Courses & Masterclasses",
  "Học linh hoạt theo lộ trình.": "Learn flexibly at your own pace.",
  "HỌC MỌI LÚC · XEM LẠI TRỌN ĐỜI": "LEARN ANYTIME · LIFETIME ACCESS",
  "Chọn một lộ trình đầy đủ hoặc mua riêng từng video tác phẩm theo đúng nhạc cụ bạn đang chơi.": "Select structured roadmaps or individual song masterclasses tailored to your instrument.",
  "Các khóa học được xây dựng theo từng cấp độ, kết hợp kho video hướng dẫn chi tiết từng bài để bạn tự luyện tập hiệu quả.": "Courses designed by levels, combined with step-by-step video song tutorials for self-paced practice.",
  "I. Khóa học theo bộ môn": "I. Courses by Instrument",
  "II. Video từng bài lẻ": "II. Individual Song Videos",
  "II. Video quay từng bài": "II. Individual Song Videos",
  "CHƯƠNG TRÌNH QUAY SẴN": "PRE-RECORDED PROGRAM",
  "GIÁ KHÓA HỌC": "COURSE TUITION",
  "GIÁ VIDEO": "VIDEO PRICE",
  "GIÁ TÀI LIỆU": "MATERIAL PRICE",
  "GIÁ BÁN": "PRICE",
  "Mua ngay qua VietQR": "Buy via VietQR",
  "Nhận tư vấn →": "Get Consultation →",
  "Gửi yêu cầu tư vấn →": "Get Consultation →",
  "VIDEO CÁ NHÂN HÓA": "CUSTOM VIDEO LESSON",
  "Bài quay theo yêu cầu": "Custom Video on Demand",
  "Gửi tên bài, tone sáo và yêu cầu kỹ thuật. Sáo Trúc Âu Cơ sẽ quay video hướng dẫn riêng phù hợp với bạn.": "Send song title, flute key, and technique level. Au Co Bamboo Flute will record a tailored tutorial video for you.",
  "Gửi yêu cầu": "Send Request",
  "Thanh toán nhanh bằng VietQR": "Fast Checkout with VietQR",
  "Bấm “Mua khóa học” hoặc “Chọn video” để mở bảng thanh toán và chỉnh số tiền, nội dung chuyển khoản.": "Click 'Buy course' or 'Select video' to open instant QR payment modal.",
  "Tuyển tập video hướng dẫn": "Masterclass Video Tutorials",

  // Products
  "Sáo ngang Việt Nam": "Vietnamese Transverse Flutes",
  "Sáo Dizi Trung Quốc": "Chinese Dizi Flutes",
  "Tiêu & Xiao": "Dongxiao & Xiao Flutes",
  "Sáo dọc": "End-Blown Flutes",
  "Sáo nứa": "Neohouzeaua Bamboo Flute",
  "Sáo trúc": "Concert Bamboo Flute",
  "Sáo nứa Bắc": "Northern Bamboo Flute",
  "Dizi trúc": "Bamboo Dizi Flute",
  "Dizi ngọc": "Jade Dizi Flute",
  "Dizi thủy tinh": "Glass Dizi Flute",
  "Sáo mèo đơn bằng gỗ": "Wooden Single Bawu / Cat Flute",
  "Sáo mèo cặp bằng nứa": "Bamboo Double Bawu / Cat Flute",
  "Tiêu trúc Việt 6 lỗ": "Vietnamese 6-hole Bamboo Dongxiao",
  "Xiao trúc Trung Quốc 8 lỗ": "Chinese 8-hole Bamboo Xiao",
  "Recorder nhựa": "Resin / Plastic Recorder",
  "Recorder gỗ": "Wooden Concert Recorder",
  "Flute nhựa": "Polymer Student Flute",
  "Flute mạ bạc": "Silver-plated Concert Flute",
  "Flute bạc": "Solid Silver Concert Flute",
  "Sáo dọc nứa": "Bamboo End-blown Flute",
  "Sáo dọc trúc": "Traditional End-blown Flute",

  // Curriculum & Sheets
  "GIÁO TRÌNH & SHEET CHUYỂN SOẠN": "CURRICULUM & ARRANGED SHEETS",
  "Giáo trình & Sheet nhạc": "Curriculum & Sheet Music",
  "Tài liệu học tập\ntheo từng bộ môn.": "Learning Materials\nby Instrument.",
  "Chọn bộ môn để xem chi tiết. Mỗi tài liệu đều có giá phía trên nút mua VietQR; các mục ẩn giá sẽ hiển thị “Liên hệ”.": "Select a discipline for details. Pricing is displayed above each VietQR purchase button.",
  "I. Giáo trình": "I. Curriculums",
  "II. Sheet chuyển soạn": "II. Arranged Sheet Music",
  "BỘ MÔN GIÁO TRÌNH": "CURRICULUM DISCIPLINE",
  "BỘ MÔN SHEET": "SHEET MUSIC DISCIPLINE",
  "DỊCH VỤ CHUYỂN SOẠN RIÊNG": "CUSTOM ARRANGEMENT SERVICE",
  "Yêu cầu sheet theo bài": "Custom Sheet Arrangement",
  "Gửi tên bài, tone sáo và yêu cầu ký âm; Sáo Trúc Âu Cơ sẽ tư vấn giá và thời gian hoàn thiện qua Zalo.": "Send song title, key, and notation requirements; Au Co Bamboo Flute will advise pricing and timeline via Zalo.",
  "Liên hệ qua Zalo →": "Contact via Zalo →",
  "Giáo trình tổng hợp": "Comprehensive Master Curriculum",
  "Giáo trình cơ bản": "Foundation Level Curriculum",
  "Giáo trình nâng cao": "Advanced Technique Curriculum",
  "Giáo trình gam & etude": "Scales & Etudes Method Book",
  "Giáo trình dân ca": "Vietnamese Folk Song Collection",
  "Giáo trình tổng hợp Dizi": "Comprehensive Dizi Method Book",
  "Giáo trình cơ bản Dizi": "Dizi Foundation Method Book",
  "Giáo trình nâng cao Dizi": "Advanced Dizi Method Book",
  "Giáo trình gam & etude Dizi": "Dizi Scales & Etudes Method Book",
  "Giáo trình dân ca Dizi": "Chinese Folk & Classical Songbook",
  "Giáo trình tổng hợp Recorder": "Comprehensive Recorder Method Book",
  "Giáo trình cơ bản Recorder": "Recorder Foundation Method Book",
  "Giáo trình nâng cao Recorder": "Advanced Recorder Method Book",
  "Tuyển tập sheet sáo trúc": "Selected Bamboo Flute Sheet Music",
  "Sheet kèm ngón bấm": "Sheet Music with Fingering Charts",
  "Tuyển tập sheet Dizi": "Selected Dizi Sheet Music",
  "Sheet kèm kỹ thuật": "Sheet Music with Technique Annotations",
  "Tuyển tập sheet Recorder": "Selected Recorder Sheet Music",
  "Sheet hòa tấu Recorder": "Recorder Ensemble Score & Parts",

  // Studio & Recording
  "Thu âm & Quay Video Chuyên Nghiệp": "Professional Audio Recording & Video Production",
  "Biến phần trình diễn\nthành một sản phẩm đẹp.": "Transform your performance\ninto a polished masterpiece.",
  "Từ một bản thu mộc đến MV hoàn chỉnh, Sáo Trúc Âu Cơ đồng hành ở cả âm thanh, hình ảnh và cách thể hiện để giữ được màu sắc riêng của người biểu diễn.": "From raw acoustic tracks to full music videos, Au Co Bamboo Flute accompanies you through audio, visuals, and expression to preserve your unique identity.",
  "GIÁ THAM KHẢO": "STARTING PRICE",
  "Đặt cọc qua VietQR": "Deposit via VietQR",
  "Nhận báo giá qua Zalo": "Get Quote via Zalo",
  "QUY TRÌNH THỰC HIỆN": "WORKFLOW PROCESS",
  "Rõ ràng trong từng bước": "Clear step-by-step milestones",
  "THÔNG TIN CẦN GỬI": "INFORMATION REQUIRED",
  "Để nhận báo giá chính xác": "To receive an accurate quote",
  "SẢN PHẨM BÀN GIAO": "DELIVERABLES",
  "Đầy đủ để lưu giữ & chia sẻ": "Ready for archiving & releasing",
  "Lưu ý trước khi đặt lịch": "Booking notice",
  "Mỗi gói có phạm vi, số lần chỉnh sửa và thời gian bàn giao khác nhau. Lịch chỉ được giữ sau khi hai bên thống nhất nội dung và đặt cọc.": "Each package varies in scope, revision rounds, and turnaround. Schedules are confirmed upon agreement and deposit.",

  // Booking
  "Booking Nghệ Sĩ Biểu Diễn": "Artist Performance Booking",
  "Âm nhạc phù hợp\ncho từng khoảnh khắc.": "The right music\nfor every memorable moment.",
  "Độc tấu, song tấu, hòa tấu hoặc ban nhạc dân tộc được tư vấn theo quy mô, không gian và tinh thần riêng của mỗi sự kiện.": "Solo, duet, ensemble, or full traditional bands tailored to the scale, acoustic space, and ambiance of your event.",
  "Kiểm tra lịch & đặt cọc": "Check availability & deposit",
  "THÔNG TIN BOOKING": "BOOKING DETAILS",
  "Xem quy trình, yêu cầu và điều khoản": "View workflow, requirements & terms",
  "Ẩn quy trình và điều khoản": "Hide workflow and terms",
  "8 bước xác nhận lịch": "8 steps to schedule confirmation",
  "CHI PHÍ & ĐIỀU KHOẢN": "EXPENSES & TERMS",
  "Cần thống nhất trước": "To be agreed beforehand",
  "SẴN SÀNG CHO SỰ KIỆN CỦA BẠN?": "READY FOR YOUR EVENT?",
  "Gửi ngày, địa điểm và đội hình mong muốn để kiểm tra lịch.": "Send date, venue, and lineup preference to check availability.",

  // Real Instrument Remote Recording
  "Thu Âm Nhạc Cụ Thật Từ Xa": "Remote Real Instrument Recording",
  "Chất liệu âm thanh thật\ncho bản phối của bạn.": "Authentic acoustic textures\nfor your music production.",
  "Dành cho ca sĩ, nhạc sĩ, nhà sản xuất và người làm nội dung cần một track nhạc cụ giàu cảm xúc, đúng tone, BPM và sẵn sàng đưa vào dự án.": "For singers, songwriters, producers, and creators needing expressive instrument tracks with exact key, BPM, and project readiness.",
  "GIÁ TỪ": "PRICE FROM",
  "NHẠC CỤ NHẬN THU": "RECORDING INSTRUMENTS",
  "Đặt thu qua VietQR": "Book recording via VietQR",
  "Gửi yêu cầu riêng": "Send custom request",
  "KHÁCH HÀNG CẦN GỬI": "WHAT CLIENTS PROVIDE",
  "Beat, BPM, tone và phần tham chiếu": "Backing track, BPM, Key & Reference audio",
  "Gửi file WAV/MP3, sheet, MIDI hoặc audio mẫu; ghi rõ vị trí cần nhạc cụ, cảm xúc, kỹ thuật mong muốn và thời hạn nhận file.": "Send WAV/MP3, sheet, MIDI, or demo audio with desired instrument cues, mood, and deadline.",
  "Gửi beat & nhận báo giá →": "Send beat & get quote →",
  "THÔNG TIN CHUYÊN MÔN": "TECHNICAL SPECIFICATIONS",
  "Xem quy trình, file bàn giao và bản quyền": "View process, deliverables & licensing",
  "Ẩn quy trình và chính sách": "Hide process and policies",
  "HÌNH THỨC THU": "RECORDING MODES",
  "Linh hoạt theo dự án": "Flexible to project needs",
  "QUY TRÌNH": "WORKFLOW",
  "Từ brief đến file gốc": "From brief to master stems",
  "FILE BÀN GIAO": "DELIVERABLES",
  "Sẵn sàng cho producer": "Ready for producers",
  "CHỈNH SỬA & BẢN QUYỀN": "REVISIONS & LICENSING",
  "Minh bạch trước khi thu": "Transparent before recording",
  "CẦN THU GẤP HOẶC NHIỀU NHẠC CỤ?": "NEED RUSH DELIVERY OR MULTIPLE INSTRUMENTS?",
  "Gửi dự án để được tư vấn đội hình và thời gian bàn giao.": "Send your project to discuss arrangement, lineup, and rush delivery.",
  "Liên hệ thu gấp →": "Rush order contact →",

  // Articles & Knowledge
  "KIẾN THỨC & CẢM HỨNG": "KNOWLEDGE & INSPIRATION",
  "Bài viết mới": "Recent Articles",
  "Những hướng dẫn ngắn gọn, dễ áp dụng để bạn hiểu nhạc cụ và luyện tập đúng cách.": "Concise, actionable guides to help you understand traditional instruments and practice effectively.",
  "Đọc bài viết": "Read article",
  "Đọc bài viết <span>→</span>": "Read article <span>→</span>",
  "CHIA SẺ KIẾN THỨC · HOÀN TOÀN MIỄN PHÍ": "KNOWLEDGE SHARING · 100% FREE",
  "Hướng dẫn miễn phí": "Free Tutorials & Guides",
  "Nơi tổng hợp video YouTube, TikTok và bài viết hữu ích. Bạn chỉ cần thay đường dẫn trong từng nội dung để giới thiệu kênh và chia sẻ kiến thức tới học viên.": "Curated collection of video tutorials, tips, and articles for flute learners.",
  "Xem trên YouTube": "Watch on YouTube",
  "Xem trên TikTok": "Watch on TikTok",
  "Sẵn sàng để gắn nội dung của bạn": "Ready for learning resources",
  "Gửi link cần cập nhật": "Submit learning resource",
  "← Tất cả bài viết": "← All Articles",
  "Quay lại danh sách bài viết": "Back to articles list",

  // Flute Tabs
  "LỜI BÀI HÁT · NỐT CẢM ÂM": "LYRICS · FLUTE TABS",
  "Cảm âm sáo trúc": "Bamboo Flute Tabs",
  "Chọn tên bài và bấm dấu “+” để xem lời cùng nốt cảm âm. Bấm “−” để thu gọn khi không cần sử dụng.": "Click '+' to view lyrics with corresponding flute notation. Click '-' to collapse.",
  "TÊN ĐẦY ĐỦ": "FULL TITLE",
  "Hướng dẫn đọc:": "Reading guide:",
  "Dấu “—” là ngân dài; số ² là nốt ở quãng cao. Bạn có thể thay nội dung mẫu bằng lời và cảm âm của từng bài.": "Dash '—' denotes sustained notes; superscript ² denotes higher octave. Notes align directly with lyrics.",
  "CHƯA CÓ BÀI BẠN CẦN?": "CAN'T FIND YOUR SONG?",
  "Yêu cầu cảm âm một bài mới": "Request a Custom Flute Tab",
  "Gửi tên bài, tone sáo và đường dẫn nghe để được tư vấn.": "Send song title, flute key, and audio link to get assistance.",
  "Liên hệ yêu cầu →": "Submit tab request →",

  // Social & Follow
  "THEO DÕI SÁO TRÚC ÂU CƠ": "FOLLOW AU CO BAMBOO FLUTE",
  "Kết nối với chúng tôi": "Connect With Us",
  "KẾT NỐI VỚI CHÚNG TÔI": "CONNECT WITH US",
  "THÔNG BÁO BẢN QUYỀN": "COPYRIGHT NOTICE",
  "CÁC BỘ MÔN": "DISCIPLINES",
  "DỊCH VỤ CHÍNH": "MAIN SERVICES",
  "Địa chỉ trung tâm:": "Academy Address:",
  "Hotline tư vấn:": "Consultation Hotline:",
  "Email liên hệ:": "Contact Email:",
  "Giờ làm việc:": "Operating Hours:",
  "8:00 - 21:00 (Tất cả các ngày trong tuần)": "8:00 AM - 9:00 PM (Monday - Sunday)",

  // Contact Form
  "BẮT ĐẦU HÀNH TRÌNH": "BEGIN YOUR MUSICAL JOURNEY",
  "Để tiếng sáo cất lời.": "Let your melody speak.",
  "Để lại thông tin, Sáo Trúc Âu Cơ sẽ liên hệ tư vấn lớp học, chọn sáo hoặc dịch vụ phù hợp.": "Leave your information, Au Co Bamboo Flute will contact you for course, instrument, or service advice.",
  "Họ và tên": "Full Name",
  "Tên của bạn": "Your full name",
  "Số điện thoại": "Phone Number",
  "Số điện thoại liên hệ": "Your contact phone/Zalo",
  "Bộ môn bạn quan tâm": "Discipline of Interest",
  "Mua sáo & phụ kiện": "Buy Flute & Accessories",
  "Sheet nhạc & giáo trình": "Sheet Music & Curriculum",
  "Thu âm / Booking biểu diễn": "Audio Recording / Artist Booking",
  "Lời nhắn": "Message",
  "Mục tiêu hoặc nhu cầu của bạn": "Your goals, questions, or specific needs",
  "Gửi yêu cầu →": "Submit Request →",
  "Đang gửi…": "Sending…",
  "Yêu cầu đã được gửi thành công. Sáo Trúc Âu Cơ sẽ liên hệ lại với bạn sớm nhất.": "Request submitted successfully! Au Co Bamboo Flute will contact you shortly.",

  // Payment Modal
  "Thanh Toán Qua VietQR": "VietQR Instant Payment",
  "THÔNG TIN CHUYỂN KHOẢN": "BANK TRANSFER DETAILS",
  "Ngân hàng:": "Bank:",
  "Số tài khoản:": "Account No.:",
  "Chủ tài khoản:": "Account Holder:",
  "Sao chép": "Copy",
  "Số tiền thanh toán:": "Amount to pay:",
  "Nhập số tiền (VNĐ)": "Enter amount (VND)",
  "Nội dung chuyển khoản:": "Transfer memo:",
  "Nhập nội dung chuyển khoản": "Enter transfer description",
  "THÔNG TIN NGƯỜI MUA": "CUSTOMER INFORMATION",
  "Họ và tên (không bắt buộc)": "Full Name (optional)",
  "Nhập họ tên của bạn": "Enter your full name",
  "Số điện thoại / Zalo nhận file *": "Phone / Zalo to receive file *",
  "Nhập số điện thoại Zalo": "Enter phone or Zalo number",
  "Email nhận khóa học": "Email to receive course files",
  "Email của bạn (nếu có)": "Your email (optional)",
  "↓ Tải / Mở ảnh QR": "↓ Download / Open QR Code",
  "● Xác nhận đã chuyển khoản": "● Confirm Payment Completed",
  "Đang gửi thông báo...": "Sending notification...",
  "✓ Đã gửi xác nhận": "✓ Confirmation Sent",
  "Đã gửi thông báo cho Sáo Trúc Âu Cơ. Giao dịch sẽ được kiểm tra trước khi cấp khóa học hoặc sản phẩm.": "Notification sent to Au Co Bamboo Flute. Your order will be verified and delivered shortly.",
  "Chưa gửi được thông báo. Vui lòng thử lại hoặc liên hệ Zalo 0374 261 368.": "Could not send notification. Please try again or contact Zalo (+84) 374 261 368.",
  "Liên hệ báo giá": "Request quote",

  // Detail pages & Shared
  "Chia sẻ bài viết ↗": "Share article ↗",
  "← Quay lại trang trước": "← Go back",
  "← Quay lại danh sách": "← Back to list",
  "← Quay lại trang chủ": "← Back to Homepage",
  "Quay lại trang chủ": "Back to Homepage",
  "Quay lại danh mục": "Back to catalog",
  "Không tìm thấy nội dung": "Content not found",
  "Đang tải nội dung…": "Loading content…",
  "Đang tải bài viết…": "Loading article…",
  "Học mọi lúc · Xem lại trọn đời": "Learn anytime · Lifetime access",
  "tài liệu hiện có": "documents available",
  "nội dung": "lessons",
  "bài": "songs",
};

// Case-insensitive lookup map built at startup
const lowerPhraseMap: Record<string, string> = {};
for (const [key, value] of Object.entries(exactPhraseMap)) {
  lowerPhraseMap[key.toLowerCase()] = value;
}

// Word-level and domain dictionary for heuristic translations
const termDictionary: [RegExp, string][] = [
  // Disciplines & Instruments
  [/sáo trúc việt nam/gi, "Vietnamese bamboo flute"],
  [/sáo trúc chuẩn âm/gi, "concert-pitch bamboo flute"],
  [/sáo trúc/gi, "bamboo flute"],
  [/sáo dizi trung quốc/gi, "Chinese Dizi flute"],
  [/sáo dizi/gi, "Dizi flute"],
  [/động tiêu \(xiao\)/gi, "Dongxiao (Xiao flute)"],
  [/động tiêu & xiao/gi, "Dongxiao & Xiao flute"],
  [/động tiêu/gi, "Dongxiao flute"],
  [/tiêu xiao/gi, "Xiao flute"],
  [/sáo mèo \/ sáo h'mông/gi, "Hmong flute / Bawu"],
  [/sáo mèo cặp bằng nứa/gi, "bamboo double Bawu / Cat flute"],
  [/sáo mèo đơn bằng gỗ/gi, "wooden single Bawu / Cat flute"],
  [/sáo mèo/gi, "Cat flute (Bawu)"],
  [/sáo h’mông|sáo h'mông/gi, "Hmong flute"],
  [/sáo recorder/gi, "Recorder flute"],
  [/sáo dọc nứa/gi, "bamboo end-blown flute"],
  [/sáo dọc trúc/gi, "traditional end-blown flute"],
  [/sáo dọc/gi, "end-blown flute"],
  [/sáo ngang việt nam/gi, "Vietnamese transverse flute"],
  [/sáo ngang/gi, "transverse flute"],
  [/sáo nứa bắc/gi, "Northern bamboo flute"],
  [/sáo nứa/gi, "Neohouzeaua bamboo flute"],
  [/đàn tranh/gi, "Zither (Dan Tranh)"],
  [/đàn bầu/gi, "Monochord (Dan Bau)"],
  [/đàn nhị/gi, "Erhu (Dan Nhi)"],
  [/nhạc cụ dân tộc/gi, "traditional ethnic instruments"],
  [/nhạc cụ thật/gi, "real instruments"],
  [/nhạc cụ/gi, "instrument"],
  [/các bộ môn dân tộc/gi, "traditional ethnic instruments"],
  [/các bộ môn/gi, "disciplines"],
  [/bộ môn/gi, "discipline"],

  // Classes & Courses
  [/lớp học trực tiếp & online/gi, "direct & online classes"],
  [/lớp học các bộ môn/gi, "instrument classes & disciplines"],
  [/lớp học/gi, "classes"],
  [/đăng ký lớp học/gi, "class enrollment"],
  [/khóa học quay sẵn & video/gi, "video courses & lessons"],
  [/khóa học quay sẵn/gi, "video courses & masterclasses"],
  [/course quay sẵn/gi, "video masterclasses"],
  [/khóa học/gi, "course"],
  [/video bài giảng hd từ nhập môn đến nâng cao/gi, "HD masterclass video lessons from beginner to advanced"],
  [/video bài giảng hd/gi, "HD masterclass video lessons"],
  [/học mọi lúc và xem lại trọn đời/gi, "learn anytime with lifetime access"],
  [/học mọi lúc, xem lại trọn đời/gi, "learn anytime, lifetime access"],
  [/học mọi lúc/gi, "learn anytime"],
  [/xem lại trọn đời/gi, "lifetime access"],

  // Teaching / Study formats
  [/học tại trung tâm, gia sư tại nhà hoặc online 1 kèm 1 với lịch linh động/gi, "study at academy, in-home tutoring, or 1-on-1 online with flexible schedules"],
  [/học tại trung tâm/gi, "learn at academy"],
  [/gia sư tại nhà/gi, "private in-home tutoring"],
  [/online 1 kèm 1/gi, "1-on-1 online"],
  [/lịch linh động/gi, "flexible schedule"],

  // Flutes & Accessories
  [/sáo & phụ kiện tuyển chọn/gi, "handpicked flutes & accessories"],
  [/sáo & phụ kiện/gi, "flutes & accessories"],
  [/cùng phụ kiện được tuyển chọn/gi, "and handpicked accessories"],
  [/phụ kiện/gi, "accessories"],
  [/chuẩn âm/gi, "concert pitch"],
  [/tuyển chọn/gi, "curated"],

  // Materials & Sheets
  [/giáo trình & sheet chuyển soạn/gi, "curriculum & arranged sheets"],
  [/giáo trình & sheet/gi, "curriculum & sheet music"],
  [/giáo trình kỹ thuật, sheet nhạc và bản chuyển soạn theo yêu cầu biểu diễn/gi, "technique method books, sheet music, and custom arrangements for live performance"],
  [/giáo trình/gi, "curriculum"],
  [/sheet chuyển soạn/gi, "arranged sheet music"],
  [/sheet nhạc/gi, "sheet music"],
  [/sheet/gi, "sheet music"],
  [/bản chuyển soạn/gi, "custom arrangement"],
  [/chuyển soạn/gi, "arrangement"],
  [/cảm âm/gi, "flute tabs"],
  [/nốt cảm âm/gi, "numbered notation"],

  // Recording & Studio
  [/thu âm & quay video/gi, "audio recording & music videos"],
  [/thu âm, mixing, quay hình và dựng video chỉn chu cho học viên, nghệ sĩ/gi, "multi-track audio recording, mixing, cinematography, and video editing for students and artists"],
  [/thu âm nhạc cụ thật/gi, "real instrument studio recording"],
  [/thu âm/gi, "audio recording"],
  [/quay video/gi, "video production"],
  [/quay hình và dựng video/gi, "filming and video editing"],
  [/quay hình/gi, "filming"],
  [/dựng video/gi, "video editing"],

  // Booking & Performances
  [/booking nghệ sĩ biểu diễn/gi, "artist performance booking"],
  [/booking nghệ sĩ/gi, "artist booking"],
  [/độc tấu sáo, hòa tấu và ban nhạc dân tộc cho sự kiện, sân khấu, lễ hội/gi, "flute soloists, ensembles, and traditional folk bands for events and festivals"],
  [/độc tấu sáo/gi, "flute solo"],
  [/độc tấu/gi, "solo performance"],
  [/song tấu/gi, "duet performance"],
  [/hòa tấu/gi, "ensemble performance"],
  [/ban nhạc dân tộc/gi, "traditional folk band"],
  [/biểu diễn/gi, "performance"],
  [/sự kiện, sân khấu, lễ hội/gi, "events, stages, and festivals"],
  [/sự kiện/gi, "events"],
  [/sân khấu/gi, "stages"],
  [/lễ hội/gi, "festivals"],

  // CTAs & Buttons
  [/xem lớp học/gi, "explore classes"],
  [/đăng ký ngay/gi, "enroll now"],
  [/khám phá/gi, "explore"],
  [/xem khóa học/gi, "view courses"],
  [/xem course/gi, "view courses"],
  [/xem tài liệu/gi, "view materials"],
  [/xem các gói/gi, "view packages"],
  [/xem gói booking/gi, "view booking options"],
  [/xem dịch vụ thu/gi, "view recording services"],
  [/xem chi tiết/gi, "view details"],
  [/mua ngay qua vietqr/gi, "buy via VietQR"],
  [/nhận tư vấn/gi, "get consultation"],
  [/gửi yêu cầu tư vấn/gi, "get consultation"],
  [/gửi yêu cầu/gi, "submit request"],
  [/liên hệ qua zalo/gi, "contact via Zalo"],

  // General Musical & Performance terms
  [/người mới bắt đầu/gi, "beginners"],
  [/người mới học/gi, "beginners"],
  [/nhập môn/gi, "foundation"],
  [/cơ bản/gi, "foundation"],
  [/nâng cao/gi, "advanced"],
  [/tổng hợp/gi, "comprehensive"],
  [/dân ca ba miền/gi, "folk music of three regions"],
  [/dân ca/gi, "folk music"],
  [/nhạc cổ phong/gi, "oriental classical music"],
  [/nhạc cổ/gi, "classical music"],
  [/nhạc trẻ/gi, "modern pop music"],
  [/trữ tình & bolero/gi, "lyrical ballads & Bolero"],
  [/trữ tình/gi, "lyrical ballad"],
  [/thiếu nhi/gi, "children songs"],
  [/ngũ cung/gi, "pentatonic"],
  [/hướng dẫn/gi, "tutorial"],
  [/luyện tập/gi, "practice"],
  [/kỹ thuật/gi, "technique"],
  [/cột hơi/gi, "breath column"],
  [/khẩu hình/gi, "embouchure"],
  [/ngón bấm/gi, "fingering"],
  [/màng rung/gi, "buzzing membrane"],
  [/lam đồng/gi, "free reed"],
  [/rung hơi/gi, "vibrato"],
  [/đánh lưỡi kép/gi, "double tonguing"],
  [/đánh lưỡi/gi, "tonguing"],
  [/vuốt ngón/gi, "finger glissando"],
  [/luyến láy/gi, "grace note ornamentation"],
  [/luyến, láy/gi, "slurs and grace notes"],
  [/liên hệ báo giá/gi, "Request a quote"],
  [/liên hệ/gi, "Contact for pricing"],
  [/miễn phí/gi, "Free"],
  [/bảo hành/gi, "Warranty"],
  [/chính hãng/gi, "Authentic"],
  [/trọn đời/gi, "Lifetime"],
  [/đặt cọc/gi, "Deposit"],
  [/thanh toán/gi, "Payment"],
  [/chuyển khoản/gi, "Bank transfer"],
  [/bài viết/gi, "article"],
  [/tài liệu/gi, "materials"],
  [/học viên, nghệ sĩ/gi, "students and artists"],
  [/học viên/gi, "students"],
  [/nghệ sĩ/gi, "artists"],
  [/và nhiều nhạc cụ dân tộc khác/gi, "and various other traditional instruments"],
  [/nhạc cụ khác/gi, "other instruments"],
  [/chỉn chu/gi, "meticulously polished"],
  [/theo yêu cầu biểu diễn/gi, "tailored for live performance"],
  [/theo yêu cầu/gi, "on demand"],
  [/chất lượng cao/gi, "high quality"],
  [/chuyên nghiệp/gi, "professional"],
];

/**
 * Automatically translates Vietnamese text to English.
 * Preserves numbers, links, code, and returns natural translations.
 */
export function translateViToEn(text: string): string {
  if (!text) return "";
  const trimmed = text.trim();

  // 1. Direct exact phrase match
  if (exactPhraseMap[trimmed]) {
    return exactPhraseMap[trimmed];
  }

  // 2. Case-insensitive exact phrase match
  const lowerTrimmed = trimmed.toLowerCase();
  if (lowerPhraseMap[lowerTrimmed]) {
    const match = lowerPhraseMap[lowerTrimmed];
    // If original was ALL CAPS, output ALL CAPS
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
      return match.toUpperCase();
    }
    return match;
  }

  // 3. Format price strings e.g. "900.000đ" -> "900,000 VND"
  if (/^\d{1,3}(\.\d{3})+\s*(?:đ|vnd|vnđ)?$/i.test(trimmed)) {
    return trimmed.replace(/\./g, ",").replace(/\s*(?:đ|vnd|vnđ)/i, "") + " VND";
  }
  if (/^từ\s+(\d{1,3}(\.\d{3})+.*)$/i.test(trimmed)) {
    const rawNum = trimmed.replace(/^từ\s+/i, "");
    return "From " + rawNum.replace(/\./g, ",").replace(/đ/gi, " VND");
  }

  // 4. Multi-line strings translation
  if (text.includes("\n")) {
    return text
      .split("\n")
      .map((line) => translateViToEn(line))
      .join("\n");
  }

  // 5. Bullet lists
  if (/^[✓•✦\-0-9.]+\s+/.test(trimmed)) {
    const prefixMatch = trimmed.match(/^([✓•✦\-0-9.]+\s+)(.*)$/);
    if (prefixMatch) {
      return prefixMatch[1] + translateViToEn(prefixMatch[2]);
    }
  }

  // 6. Dictionary heuristic replacements
  let result = text;
  for (const [pattern, replacement] of termDictionary) {
    result = result.replace(pattern, (matched) => {
      // If the matched string was all uppercase, make replacement uppercase
      if (matched === matched.toUpperCase() && matched.length > 2) {
        return replacement.toUpperCase();
      }
      // If first letter was uppercase, capitalize replacement
      if (matched[0] === matched[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  // 7. Clean up remaining generic connectors if found
  result = result
    .replace(/\bvà\b/gi, "and")
    .replace(/\bhoặc\b/gi, "or")
    .replace(/\btừ\b/gi, "from")
    .replace(/\bđến\b/gi, "to")
    .replace(/\bcho\b/gi, "for")
    .replace(/\bvới\b/gi, "with")
    .replace(/\btại\b/gi, "at")
    .replace(/\bcủa\b/gi, "of")
    .replace(/\btrong\b/gi, "in")
    .replace(/\btrên\b/gi, "on")
    .replace(/\btheo\b/gi, "by")
    .replace(/\bcùng\b/gi, "along with");

  return result;
}
