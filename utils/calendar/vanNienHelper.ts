import { Solar, Lunar } from "lunar-javascript";

// ── Can Chi Mappings ──────────────────────────────────────────────────────────
const THIEN_CAN: Record<string, string> = {
  甲: "Giáp",
  乙: "Ất",
  丙: "Bính",
  丁: "Đinh",
  戊: "Mậu",
  己: "Kỷ",
  庚: "Canh",
  辛: "Tân",
  壬: "Nhâm",
  癸: "Quý",
};

const DIA_CHI: Record<string, string> = {
  子: "Tý",
  丑: "Sửu",
  寅: "Dần",
  卯: "Mão",
  辰: "Thìn",
  巳: "Tỵ",
  午: "Ngọ",
  未: "Mùi",
  申: "Thân",
  酉: "Dậu",
  戌: "Tuất",
  亥: "Hợi",
};

export function ganZhiToVietnamese(ganZhi: string): string {
  if (!ganZhi || ganZhi.length < 2) return ganZhi;
  const can = THIEN_CAN[ganZhi[0]] ?? ganZhi[0];
  const chi = DIA_CHI[ganZhi[1]] ?? ganZhi[1];
  return `${can} ${chi}`;
}

// ── 12 Trực (12 Duty Officers) ────────────────────────────────────────────────
export const TRUC_MAP: Record<string, { name: string; desc: string }> = {
  建: { name: "Kiến", desc: "khởi công, xuất hành thuận lợi" },
  除: { name: "Trừ", desc: "trừ tà, dẹp bỏ chướng ngại, trị bệnh" },
  满: { name: "Mãn", desc: "đầy đủ, sung túc, tốt cầu tài lộc" },
  平: { name: "Bình", desc: "bằng phẳng, êm xuôi" },
  定: { name: "Định", desc: "ổn định, tốt ký kết giao ước, đính hôn" },
  执: { name: "Chấp", desc: "nắm giữ, tốt xây dựng, đặt nền móng" },
  破: { name: "Phá", desc: "đổ vỡ, hao tán, kiêng khởi sự việc lớn" },
  危: { name: "Nguy", desc: "bấp bênh, cần cẩn trọng mọi bề" },
  成: { name: "Thành", desc: "thành công, tốt hôn thú, khai trương" },
  收: { name: "Thâu", desc: "thu hoạch, gom góp tài lộc về nhà" },
  开: { name: "Khai", desc: "mở mang, tốt mở cửa hàng, đón sinh khí mới" },
  闭: { name: "Bế", desc: "khép kín, tốt an táng, kiêng chi tiền lớn" },
};

// ── Nhị Thập Bát Tú (28 Lunar Mansions) ────────────────────────────────────────
export const SAO_MAP: Record<
  string,
  { name: string; fullName: string; type: "cát tinh" | "hung tinh"; desc: string }
> = {
  室: { name: "Thất", fullName: "Sao Thất Hỏa Trư", type: "cát tinh", desc: "Tốt xây dựng, cưới hỏi, khai trương, cầu công danh." },
  角: { name: "Giác", fullName: "Sao Giác Mộc Giao", type: "cát tinh", desc: "Tốt xuất hành, hôn nhân, thăng quan tiến chức." },
  亢: { name: "Cang", fullName: "Sao Cang Kim Long", type: "hung tinh", desc: "Nên cẩn trọng kiện tụng, kiêng cất nóc nhà." },
  氐: { name: "Đê", fullName: "Sao Đê Thổ Lạc", type: "hung tinh", desc: "Kiêng cưới hỏi, đi xa nên chú ý an toàn." },
  房: { name: "Phòng", fullName: "Sao Phòng Nhật Thố", type: "cát tinh", desc: "Tốt trăm việc, vượng tài lộc, gia đạo hưng thịnh." },
  心: { name: "Tâm", fullName: "Sao Tâm Nguyệt Hồ", type: "hung tinh", desc: "Nên giữ gìn lời ăn tiếng nói, kiêng giao dịch mạo hiểm." },
  尾: { name: "Vĩ", fullName: "Sao Vĩ Hỏa Hổ", type: "cát tinh", desc: "Tốt cưới gả, đào đất, nhập trạch, cầu tự con cái." },
  箕: { name: "Cơ", fullName: "Sao Cơ Thủy Báo", type: "cát tinh", desc: "Tốt khai mương rãnh, xuất hành may mắn đón lộc." },
  斗: { name: "Đẩu", fullName: "Sao Đẩu Mộc Giải", type: "cát tinh", desc: "Tốt xây cất, chăn nuôi, trồng trọt sinh sôi nảy nở." },
  牛: { name: "Ngưu", fullName: "Sao Ngưu Kim Ngưu", type: "hung tinh", desc: "Kiêng cưới hỏi, đi xa cẩn trọng." },
  女: { name: "Nữ", fullName: "Sao Nữ Thổ Bức", type: "hung tinh", desc: "Kiêng khởi công, đề phòng tranh chấp bất hòa." },
  虚: { name: "Hư", fullName: "Sao Hư Nhật Thử", type: "hung tinh", desc: "Hao tán hư hao, kiêng mở tiệm, ký kết hợp đồng." },
  危: { name: "Nguy", fullName: "Sao Nguy Nguyệt Yến", type: "hung tinh", desc: "Kiêng việc liều lĩnh, giữ bình an gia đạo." },
  壁: { name: "Bích", fullName: "Sao Bích Thủy Dụ", type: "cát tinh", desc: "Tốt mở mang đất đai, xây nhà, cầu vinh hiển." },
  奎: { name: "Khuê", fullName: "Sao Khuê Mộc Lang", type: "hung tinh", desc: "Kiêng cất nóc, đào giếng, cần giữ chữ tín." },
  娄: { name: "Lâu", fullName: "Sao Lâu Kim Cẩu", type: "cát tinh", desc: "Tốt động thổ, nhập học, tế tự dâng hương gia tiên." },
  胃: { name: "Vị", fullName: "Sao Vị Thổ Dĩ", type: "cát tinh", desc: "Tốt kho tàng, tích lũy của cải, mua sắm vật dụng." },
  昴: { name: "Mão", fullName: "Sao Mão Nhật Kê", type: "hung tinh", desc: "Kiêng kiện cáo, đề phòng thị phi khẩu thiệt." },
  毕: { name: "Tất", fullName: "Sao Tất Nguyệt Ô", type: "cát tinh", desc: "Tốt cưới hỏi, đào móng, xuất hành hanh thông." },
  觜: { name: "Chủy", fullName: "Sao Chủy Hỏa Hầu", type: "hung tinh", desc: "Kiêng việc mạo hiểm, dẹp bớt việc phức tạp." },
  参: { name: "Sâm", fullName: "Sao Sâm Thủy Viên", type: "cát tinh", desc: "Tốt giao thương buôn bán, tạo phúc đức." },
  井: { name: "Tỉnh", fullName: "Sao Tỉnh Mộc Hãn", type: "cát tinh", desc: "Tốt tu bổ sửa sang nhà cửa, đào giếng khơi dòng." },
  鬼: { name: "Quỷ", fullName: "Sao Quỷ Kim Dương", type: "hung tinh", desc: "Kiêng cưới hỏi, nên tụng kinh niệm phật cầu an." },
  柳: { name: "Liễu", fullName: "Sao Liễu Thổ Chương", type: "hung tinh", desc: "Kiêng dời nhà, kiêng tranh cãi, giữ hòa khí." },
  星: { name: "Tinh", fullName: "Sao Tinh Nhật Mã", type: "cát tinh", desc: "Tốt dựng nhà, cưới gả, chăm sóc phụng dưỡng mộ phần." },
  张: { name: "Trương", fullName: "Sao Trương Nguyệt Lộc", type: "cát tinh", desc: "Tốt cầu tài lộc, mở cửa hàng kinh doanh, giao hảo." },
  翼: { name: "Dực", fullName: "Sao Dực Hỏa Xà", type: "hung tinh", desc: "Kiêng đi xa đường thủy, cẩn trọng giấy tờ khế ước." },
  轸: { name: "Chẩn", fullName: "Sao Chẩn Thủy Dẫn", type: "cát tinh", desc: "Tốt trăm việc, thăng tiến sự nghiệp, gia đạo yên vui." },
};

// ── 12 Thần Nhật (Huangdao / Heidao) ──────────────────────────────────────────
export const THIEN_SHEN_MAP: Record<
  string,
  { name: string; isHoangDao: boolean; desc: string }
> = {
  青龙: { name: "Thanh Long", isHoangDao: true, desc: "tài lộc hanh thông, vạn sự thuận buồm xuôi gió" },
  明堂: { name: "Minh Đường", isHoangDao: true, desc: "quý nhân phù trợ, gia đạo êm ấm cát tường" },
  天刑: { name: "Thiên Hình", isHoangDao: false, desc: "xung khắc, dễ sinh bất hòa tranh chấp" },
  朱雀: { name: "Chu Tước", isHoangDao: false, desc: "khẩu thiệt, thị phi, nên nhẫn nhịn giữ hòa khí" },
  金匮: { name: "Kim Quỹ", isHoangDao: true, desc: "kho vàng kho bạc, phát tài vượng lộc" },
  天德: { name: "Thiên Đức", isHoangDao: true, desc: "phúc đức trời ban, gặp hung hóa cát" },
  白虎: { name: "Bạch Hổ", isHoangDao: false, desc: "tai ương bất ngờ, tránh việc mạo hiểm" },
  玉堂: { name: "Ngọc Đường", isHoangDao: true, desc: "vinh hoa phú quý, thi cử công danh đỗ đạt" },
  天牢: { name: "Thiên Lao", isHoangDao: false, desc: "giam hãm, trì trệ" },
  玄武: { name: "Huyền Vũ", isHoangDao: false, desc: "thất thoát tiền tài, đề phòng tiểu nhân" },
  司命: { name: "Tư Mệnh", isHoangDao: true, desc: "sinh khí dồi dào, vạn sự hanh thông tốt đẹp" },
  勾陈: { name: "Câu Trận", isHoangDao: false, desc: "vướng mắc trở ngại, việc tiến hành chậm trễ" },
};

// ── 24 Tiết Khí (Solar Terms) ────────────────────────────────────────────────
export const JIE_QI_MAP: Record<string, string> = {
  立春: "Lập xuân",
  雨水: "Vũ thủy",
  惊蛰: "Kinh trập",
  春分: "Xuân phân",
  清明: "Thanh minh",
  谷雨: "Cốc vũ",
  立夏: "Lập hạ",
  小满: "Tiểu mãn",
  芒种: "Mang chủng",
  夏至: "Hạ chí",
  小暑: "Tiểu thử",
  大暑: "Đại thử",
  立秋: "Lập thu",
  处暑: "Xử thử",
  白露: "Bạch lộ",
  秋分: "Thu phân",
  寒露: "Hàn lộ",
  霜降: "Sương giáng",
  立冬: "Lập đông",
  小雪: "Tiểu tuyết",
  大雪: "Đại tuyết",
  冬至: "Đông chí",
  小寒: "Tiểu hàn",
  大寒: "Đại hàn",
};

// ── Việc Nên Làm & Kiêng Cữ ──────────────────────────────────────────────────
export const YI_MAP: Record<string, string> = {
  动土: "Động thổ",
  修造: "Xây dựng",
  修饰垣墙: "Xây dựng",
  筑堤: "Xây dựng, đắp đập",
  开市: "Khai trương",
  出行: "Xuất hành",
  嫁娶: "Cưới hỏi",
  祭祀: "Tế lễ, dâng hương",
  入宅: "Nhập trạch",
  移徙: "Dời nhà",
  安葬: "An táng",
  破土: "Phá thổ",
  祈福: "Cầu phúc",
  纳财: "Nạp tài, gom lộc",
  交易: "Giao dịch",
  立券: "Ký kết giao ước",
  安门: "Lắp cửa",
  裁衣: "May vá",
  会亲友: "Họp mặt thân hữu",
};

export const JI_MAP: Record<string, string> = {
  动土: "Động thổ",
  造庙: "Xây chùa miếu",
  谢土: "Tạ thổ",
  作灶: "Đặt bếp",
  作梁: "Gác đòn dông",
  伐木: "Đốn gỗ lớn",
  安葬: "An táng",
  行丧: "Đưa tang",
  修坟: "Sửa phần mộ",
  探病: "Thăm người ốm nặng",
  出货财: "Xuất tiền của lớn",
  开市: "Khai trương",
  嫁娶: "Cưới hỏi",
};

// ── Lục Thập Hoa Giáp Nạp Âm ──────────────────────────────────────────────────
export const NA_YIN_MAP: Record<string, string> = {
  海中金: "Hải Trung Kim",
  炉中火: "Lư Trung Hỏa",
  大林木: "Đại Lâm Mộc",
  路旁土: "Lộ Bàng Thổ",
  剑锋金: "Kiếm Phong Kim",
  山头火: "Sơn Đầu Hỏa",
  涧下水: "Giản Hạ Thủy",
  城头土: "Thành Đầu Thổ",
  白蜡金: "Bạch Lạp Kim",
  杨柳木: "Dương Liễu Mộc",
  泉中水: "Tuyền Trung Thủy",
  屋上土: "Ốc Thượng Thổ",
  霹雳火: "Tích Lịch Hỏa",
  松柏木: "Tùng Bách Mộc",
  长流水: "Trường Lưu Thủy",
  沙中金: "Sa Trung Kim",
  山下火: "Sơn Hạ Hỏa",
  平地木: "Bình Địa Mộc",
  壁上土: "Bích Thượng Thổ",
  金箔金: "Kim Bạch Kim",
  覆灯火: "Phú Đăng Hỏa",
  天河水: "Thiên Hà Thủy",
  大驿土: "Đại Dịch Thổ",
  钗钏金: "Thoa Xuyến Kim",
  桑柘木: "Tang Đố Mộc",
  大溪水: "Đại Khê Thủy",
  沙中土: "Sa Trung Thổ",
  天上火: "Thiên Thượng Hỏa",
  石榴木: "Thạch Lựu Mộc",
  大海水: "Đại Hải Thủy",
};

export function isTamNuong(lunarDay: number): boolean {
  return [3, 7, 13, 18, 22, 27].includes(lunarDay);
}

export function isNguyetKy(lunarDay: number): boolean {
  return [5, 14, 23].includes(lunarDay);
}

export function getTraditionalHoliday(
  solarDay: number,
  solarMonth: number,
  lunarDay: number,
  lunarMonth: number,
): string | null {
  // Âm lịch
  if (lunarMonth === 1) {
    if (lunarDay === 1) return "Tết Nguyên Đán";
    if (lunarDay === 2) return "Mùng 2 Tết";
    if (lunarDay === 3) return "Mùng 3 Tết";
    if (lunarDay === 15) return "Rằm tháng Giêng (Tết Thượng Nguyên)";
  }
  if (lunarMonth === 3 && lunarDay === 3) return "Tết Hàn Thực";
  if (lunarMonth === 3 && lunarDay === 10) return "Giỗ Tổ Hùng Vương";
  if (lunarMonth === 4 && lunarDay === 15) return "Lễ Phật Đản";
  if (lunarMonth === 5 && lunarDay === 5) return "Tết Đoan Ngọ";
  if (lunarMonth === 7 && lunarDay === 15) return "Lễ Vu Lan Báo Hiếu";
  if (lunarMonth === 8 && lunarDay === 15) return "Tết Trung Thu";
  if (lunarMonth === 9 && lunarDay === 9) return "Tết Trùng Cửu";
  if (lunarMonth === 10 && lunarDay === 10) return "Tết Trùng Thập";
  if (lunarMonth === 12 && lunarDay === 23) return "Lễ cúng Ông Táo";
  if (lunarMonth === 12 && (lunarDay === 29 || lunarDay === 30)) return "Lễ Tất Niên";

  // Dương lịch
  if (solarDay === 1 && solarMonth === 1) return "Tết Dương lịch";
  if (solarDay === 30 && solarMonth === 4) return "Giải phóng miền Nam";
  if (solarDay === 1 && solarMonth === 5) return "Quốc tế Lao động";
  if (solarDay === 2 && solarMonth === 9) return "Quốc khánh";
  if (solarDay === 20 && solarMonth === 11) return "Ngày Nhà giáo Việt Nam";

  return null;
}

// ── Phong Tục Cổ Truyền Việt Nam (Folk Customs) ──────────────────────────────
export interface TraditionalCustom {
  title: string;
  desc: string;
}

export function getTraditionalCustom(lunarDay: number, lunarMonth: number): TraditionalCustom {
  if (lunarDay === 23 && lunarMonth === 12) {
    return {
      title: "Lễ cúng ông Công ông Táo (23 tháng Chạp)",
      desc: "Ngày 23 tháng Chạp âm lịch, các gia đình làm lễ tiễn ông Công ông Táo (Táo quân) cưỡi cá chép về trời, báo cáo với Ngọc Hoàng mọi việc trong nhà suốt một năm qua.",
    };
  }
  if ((lunarDay === 30 || lunarDay === 29) && lunarMonth === 12) {
    return {
      title: "Lễ Tất niên chiều 30 Tết",
      desc: "Bữa cơm sum họp đại gia đình cuối năm và lễ cúng tạ ơn trời đất, thần linh, rước ông bà tổ tiên về ăn Tết cùng con cháu.",
    };
  }
  if (lunarDay === 1 && lunarMonth === 1) {
    return {
      title: "Tết Nguyên Đán (Mùng 1 Tết)",
      desc: "Khởi đầu năm mới đại cát, con cháu tề tựu dâng hương gia tiên, chúc thọ ông bà cha mẹ và xuất hành cầu bình an may mắn.",
    };
  }
  if (lunarDay === 2 && lunarMonth === 1) {
    return {
      title: "Mùng 2 Tết (Tết Mẹ - Bên ngoại)",
      desc: "Con cháu về chúc Tết họ ngoại, thăm hỏi người thân bên mẹ, gắn kết nghĩa tình gia tộc hai họ nội ngoại bền chặt.",
    };
  }
  if (lunarDay === 3 && lunarMonth === 1) {
    return {
      title: "Mùng 3 Tết (Tết Thầy - Lễ Hóa vàng)",
      desc: "Tri ân thầy cô giáo dạy dỗ và làm lễ tạ tổ tiên (hóa vàng), hoàn tất ba ngày Tết đầu năm ấm cúng.",
    };
  }
  if (lunarDay === 15 && lunarMonth === 1) {
    return {
      title: "Lễ Thượng Nguyên (Rằm tháng Giêng)",
      desc: "Dân gian có câu 'Lễ Phật quanh năm không bằng ngày Rằm tháng Giêng'. Các gia đình làm mâm cỗ dâng cúng tổ tiên cầu quốc thái dân an, gia hòa vạn sự hưng.",
    };
  }
  if (lunarDay === 3 && lunarMonth === 3) {
    return {
      title: "Tết Hàn Thực (Bánh trôi bánh chay)",
      desc: "Các gia đình làm bánh trôi, bánh chay thanh bạch dâng cúng Phật và gia tiên, nhớ về cội nguồn tổ tiên với lòng hiếu kính thành kính.",
    };
  }
  if (lunarDay === 10 && lunarMonth === 3) {
    return {
      title: "Giỗ Tổ Hùng Vương (10 tháng Ba)",
      desc: "Cả nước tưởng nhớ công đức dựng nước của các Vua Hùng: 'Dù ai đi ngược về xuôi / Nhớ ngày Giỗ Tổ mùng mười tháng ba'.",
    };
  }
  if (lunarDay === 15 && lunarMonth === 4) {
    return {
      title: "Đại lễ Phật Đản (Phật lịch)",
      desc: "Tưởng niệm ngày đản sinh của Đức Phật Thích Ca Mâu Ni, hướng thiện, ăn chay niệm phật, cầu an cho tổ tiên cửu huyền thất tổ.",
    };
  }
  if (lunarDay === 5 && lunarMonth === 5) {
    return {
      title: "Tết Đoan Ngọ (Giết sâu bọ)",
      desc: "Tết Đoan Dương lúc chính ngọ, cả nhà ăn rượu nếp, hoa quả chua dâng cúng tổ tiên và trừ bỏ tà khí, phòng dịch bệnh cho mọi người.",
    };
  }
  if (lunarDay === 15 && lunarMonth === 7) {
    return {
      title: "Đại lễ Vu Lan Báo Hiếu & Xá tội vong nhân",
      desc: "Rằm tháng Bảy là mùa Vu Lan báo hiếu công ơn sinh thành dưỡng dục của cha mẹ, đồng thời làm lễ xá tội vong nhân, bố thí chúng sinh phổ độ.",
    };
  }
  if (lunarDay === 15 && lunarMonth === 8) {
    return {
      title: "Tết Trung Thu (Tết Đoàn Viên)",
      desc: "Rằm tháng Tám trăng tròn viên mãn, gia đình quây quần bên mâm cỗ cúng trăng, thưởng thức bánh dẻo bánh nướng và rước đèn trông trăng.",
    };
  }
  if (lunarDay === 9 && lunarMonth === 9) {
    return {
      title: "Tết Trùng Cửu (Lễ Đăng Cao)",
      desc: "Ngày 9 tháng 9 âm lịch, phong tục đăng cao ngắm cảnh, uống trà hoa cúc và mừng thọ, chúc thọ các bậc cao niên trong họ trường thọ khang ninh.",
    };
  }
  if (lunarDay === 10 && lunarMonth === 10) {
    return {
      title: "Tết Trùng Thập (Tết Cơm Mới - Tết Thầy Thuốc)",
      desc: "Mừng vụ mùa bội thu, các gia đình làm bánh dầy, nấu cơm mới dâng cúng tổ tiên và thần nông tạ ơn trời đất cho mùa màng tươi tốt.",
    };
  }
  if (lunarDay === 1) {
    return {
      title: "Lễ Sóc (Cúng Mùng Một đầu tháng)",
      desc: "Dâng hương hoa, chén nước sạch và hoa quả tươi lên bàn thờ tổ tiên cầu bình an, may mắn và hanh thông cho cả gia đình trong tháng mới.",
    };
  }
  if (lunarDay === 15) {
    return {
      title: "Lễ Vọng (Cúng Rằm giữa tháng)",
      desc: "Rằm là thời điểm trăng tròn sáng nhất trong tháng. Gia chủ lau dọn bàn thờ, dâng cúng gia tiên tỏ lòng hiếu thảo và cầu chúc gia đạo ấm êm.",
    };
  }

  // Default seasonal custom
  return {
    title: "Nếp sống gia phong & Dâng hương gia tiên",
    desc: "Mỗi ngày con cháu gìn giữ nếp nhà thuần hậu, thắp nén tâm hương tưởng nhớ công ơn tiên tổ, sống hòa thuận hiếu nghĩa và dưỡng thiện tích đức.",
  };
}

// ── Comprehensive Day Details ────────────────────────────────────────────────
export interface DayVanNienData {
  solarDate: Date;
  solarDay: number;
  solarMonth: number;
  solarYear: number;
  weekdayName: string; // e.g. "Thứ Ba"
  lunarDay: number;
  lunarMonth: number;
  lunarYear: string; // e.g. "Năm Bính Ngọ"
  lunarMonthStr: string; // e.g. "Kỷ Hợi"
  lunarDayStr: string; // e.g. "Ngày 16 tháng 10"
  lunarDayCanChi: string; // e.g. "Nhâm Dần"
  isLeapMonth: boolean;
  tietKhi: string; // e.g. "Tiết Tiểu tuyết"
  truc: string; // e.g. "Trực Bình"
  trucDesc: string; // e.g. "bằng phẳng, êm xuôi"
  saoName: string; // e.g. "Sao Thất"
  saoFullName: string; // e.g. "Sao Thất Hỏa Trư"
  saoType: "cát tinh" | "hung tinh";
  saoDesc: string; // e.g. "Tốt xây dựng, cưới hỏi, khai trương, cầu công danh."
  isHoangDao: boolean;
  tianShenName: string; // e.g. "Thiên Lao"
  tianShenDesc: string; // e.g. "giam hãm, trì trệ"
  reasonText: string;
  auspiciousHours: string[]; // e.g. ["Tý (23h–1h)", "Sửu (1h–3h)", ...]
  inauspiciousHours: string[]; // e.g. ["Dần (3h–5h)", ...]
  goodActivities: string[]; // e.g. ["Xây dựng, động thổ"]
  badActivities: string[];
  traditionalCustom: TraditionalCustom;
  naYin: string; // e.g. "Phú Đăng Hỏa"
  isTamNuong: boolean;
  isNguyetKy: boolean;
  holiday: string | null;
}

const DOUBLE_HOURS = [
  { name: "Tý", range: "23h–1h", h: 0 },
  { name: "Sửu", range: "1h–3h", h: 2 },
  { name: "Dần", range: "3h–5h", h: 4 },
  { name: "Mão", range: "5h–7h", h: 6 },
  { name: "Thìn", range: "7h–9h", h: 8 },
  { name: "Tỵ", range: "9h–11h", h: 10 },
  { name: "Ngọ", range: "11h–13h", h: 12 },
  { name: "Mùi", range: "13h–15h", h: 14 },
  { name: "Thân", range: "15h–17h", h: 16 },
  { name: "Dậu", range: "17h–19h", h: 18 },
  { name: "Tuất", range: "19h–21h", h: 20 },
  { name: "Hợi", range: "21h–23h", h: 22 },
];

export function getDayVanNienData(targetDate: Date): DayVanNienData {
  const solar = Solar.fromYmd(
    targetDate.getFullYear(),
    targetDate.getMonth() + 1,
    targetDate.getDate(),
  );
  const lunar = solar.getLunar();

  const weekdayName = targetDate.toLocaleDateString("vi-VN", {
    weekday: "long",
  });
  // Capitalize first letter: "thứ ba" -> "Thứ Ba"
  const formattedWeekday =
    weekdayName.charAt(0).toUpperCase() + weekdayName.slice(1);

  const rawDayGanZhi = lunar.getDayInGanZhi();
  const rawMonthGanZhi = lunar.getMonthInGanZhi();
  const rawYearGanZhi = lunar.getYearInGanZhi();

  const lunarDayCanChi = ganZhiToVietnamese(rawDayGanZhi);
  const lunarMonthCanChi = ganZhiToVietnamese(rawMonthGanZhi);
  const lunarYearCanChi = ganZhiToVietnamese(rawYearGanZhi);

  // Tiết khí (Solar Term)
  const rawJieQi = lunar.getPrevJieQi(true)?.getName() || "";
  const vietJieQi = JIE_QI_MAP[rawJieQi] || rawJieQi || "Tiểu tuyết";

  // Trực (ZhiXing)
  const rawZhiXing = lunar.getZhiXing();
  const trucInfo = TRUC_MAP[rawZhiXing] || {
    name: rawZhiXing || "Bình",
    desc: "bình hòa, êm xuôi",
  };

  // Nhị thập bát tú (28 Mansions / Sao)
  const rawXiu = lunar.getXiu();
  const saoInfo = SAO_MAP[rawXiu] || {
    name: rawXiu || "Thất",
    fullName: `Sao ${rawXiu || "Thất"}`,
    type: "cát tinh",
    desc: "Tốt xây dựng, cất nóc, tạo tác công danh.",
  };

  // Thần nhật (Hoàng đạo / Hắc đạo)
  const rawTianShen = lunar.getDayTianShen();
  const tianShenInfo = THIEN_SHEN_MAP[rawTianShen] || {
    name: rawTianShen || "Thiên Lao",
    isHoangDao: lunar.getDayTianShenType() === "黄道",
    desc: lunar.getDayTianShenType() === "黄道" ? "cát lành hanh thông" : "giam hãm, trì trệ",
  };

  const isHoangDao = tianShenInfo.isHoangDao;
  const reasonText = isHoangDao
    ? `Ngày Hoàng đạo (sao ${tianShenInfo.name} — ${tianShenInfo.desc}) — vạn sự hanh thông, cát lành. Trực ${trucInfo.name}: ${trucInfo.desc}.`
    : `Ngày Hắc đạo (sao ${tianShenInfo.name} — ${tianShenInfo.desc}) — nên kiêng việc lớn. Trực ${trucInfo.name}: ${trucInfo.desc}.`;

  // Giờ tốt (Hoàng đạo) & Giờ tránh (Hắc đạo)
  const auspiciousHours: string[] = [];
  const inauspiciousHours: string[] = [];
  for (const dh of DOUBLE_HOURS) {
    const timeSolar = Solar.fromYmdHms(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      targetDate.getDate(),
      dh.h,
      0,
      0,
    );
    const timeLunar = timeSolar.getLunar();
    if (timeLunar.getTime().getTianShenType() === "黄道") {
      auspiciousHours.push(`${dh.name} (${dh.range})`);
    } else {
      inauspiciousHours.push(`${dh.name} (${dh.range})`);
    }
  }

  // Việc nên làm (Yi)
  const rawYi = lunar.getDayYi();
  const goodSet = new Set<string>();
  for (const item of rawYi) {
    if (YI_MAP[item]) {
      goodSet.add(YI_MAP[item]);
    }
  }
  const goodActivities =
    goodSet.size > 0
      ? Array.from(goodSet).slice(0, 4)
      : ["Cầu tài lộc, bình an", "Dâng hương gia tiên"];

  // Việc kiêng làm (Ji)
  const rawJi = lunar.getDayJi();
  const badSet = new Set<string>();
  for (const item of rawJi) {
    if (JI_MAP[item]) {
      badSet.add(JI_MAP[item]);
    }
  }
  const badActivities = Array.from(badSet).slice(0, 4);

  const lDay = lunar.getDay();
  const lMonth = Math.abs(lunar.getMonth());
  const isLeap = lunar.getMonth() < 0;

  const traditionalCustom = getTraditionalCustom(lDay, lMonth);

  // NaYin (Lục Thập Hoa Giáp Nạp Âm)
  const rawNaYin = lunar.getDayNaYin();
  const naYin = NA_YIN_MAP[rawNaYin] || rawNaYin || "Phú Đăng Hỏa";

  const tamNuong = isTamNuong(lDay);
  const nguyetKy = isNguyetKy(lDay);
  const holiday = getTraditionalHoliday(
    targetDate.getDate(),
    targetDate.getMonth() + 1,
    lDay,
    lMonth,
  );

  return {
    solarDate: targetDate,
    solarDay: targetDate.getDate(),
    solarMonth: targetDate.getMonth() + 1,
    solarYear: targetDate.getFullYear(),
    weekdayName: formattedWeekday,
    lunarDay: lDay,
    lunarMonth: lMonth,
    lunarYear: `Năm ${lunarYearCanChi}`,
    lunarMonthStr: lunarMonthCanChi,
    lunarDayStr: `Ngày ${lDay} tháng ${lMonth}${isLeap ? " (Nhuận)" : ""}`,
    lunarDayCanChi,
    isLeapMonth: isLeap,
    tietKhi: `Tiết ${vietJieQi}`,
    truc: `Trực ${trucInfo.name}`,
    trucDesc: trucInfo.desc,
    saoName: `Sao ${saoInfo.name}`,
    saoFullName: saoInfo.fullName,
    saoType: saoInfo.type,
    saoDesc: saoInfo.desc,
    isHoangDao,
    tianShenName: tianShenInfo.name,
    tianShenDesc: tianShenInfo.desc,
    reasonText,
    auspiciousHours,
    inauspiciousHours,
    goodActivities,
    badActivities,
    traditionalCustom,
    naYin,
    isTamNuong: tamNuong,
    isNguyetKy: nguyetKy,
    holiday,
  };
}

// ── Month Calendar Grid ───────────────────────────────────────────────────────
export interface MonthCalendarCell {
  date: Date;
  solarDay: number;
  solarMonth: number;
  solarYear: number;
  lunarDay: number;
  lunarMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoangDao: boolean;
  isTamNuong: boolean;
  isNguyetKy: boolean;
  holiday: string | null;
  tianShenName: string;
  truc: string;
}

export function getMonthCalendarGrid(year: number, month: number): MonthCalendarCell[] {
  const cells: MonthCalendarCell[] = [];
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();

  // Vietnam/ISO Monday = 0, ..., Sunday = 6
  const startDayOfWeek = (firstDay.getDay() + 6) % 7;

  // Leading days from previous month
  const prevMonthLastDate = new Date(year, month - 1, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDate - i;
    const prevDate = new Date(year, month - 2, d);
    const s = Solar.fromYmd(prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate());
    const l = s.getLunar();
    const lDay = l.getDay();
    const lMonth = Math.abs(l.getMonth());
    const isHoangDao = l.getDayTianShenType() === "黄道";
    const rawZhiXing = l.getZhiXing();
    const trucName = TRUC_MAP[rawZhiXing]?.name || rawZhiXing;
    const rawTianShen = l.getDayTianShen();
    const tianShenName = THIEN_SHEN_MAP[rawTianShen]?.name || rawTianShen;

    cells.push({
      date: prevDate,
      solarDay: d,
      solarMonth: prevDate.getMonth() + 1,
      solarYear: prevDate.getFullYear(),
      lunarDay: lDay,
      lunarMonth: lMonth,
      isCurrentMonth: false,
      isToday:
        today.getDate() === d &&
        today.getMonth() === prevDate.getMonth() &&
        today.getFullYear() === prevDate.getFullYear(),
      isHoangDao,
      isTamNuong: isTamNuong(lDay),
      isNguyetKy: isNguyetKy(lDay),
      holiday: getTraditionalHoliday(d, prevDate.getMonth() + 1, lDay, lMonth),
      tianShenName,
      truc: trucName,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month - 1, d);
    const s = Solar.fromYmd(year, month, d);
    const l = s.getLunar();
    const lDay = l.getDay();
    const lMonth = Math.abs(l.getMonth());
    const isHoangDao = l.getDayTianShenType() === "黄道";
    const rawZhiXing = l.getZhiXing();
    const trucName = TRUC_MAP[rawZhiXing]?.name || rawZhiXing;
    const rawTianShen = l.getDayTianShen();
    const tianShenName = THIEN_SHEN_MAP[rawTianShen]?.name || rawTianShen;

    cells.push({
      date: curDate,
      solarDay: d,
      solarMonth: month,
      solarYear: year,
      lunarDay: lDay,
      lunarMonth: lMonth,
      isCurrentMonth: true,
      isToday:
        today.getDate() === d &&
        today.getMonth() === month - 1 &&
        today.getFullYear() === year,
      isHoangDao,
      isTamNuong: isTamNuong(lDay),
      isNguyetKy: isNguyetKy(lDay),
      holiday: getTraditionalHoliday(d, month, lDay, lMonth),
      tianShenName,
      truc: trucName,
    });
  }

  // Trailing days from next month to complete row
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const nextDate = new Date(year, month, d);
    const s = Solar.fromYmd(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate());
    const l = s.getLunar();
    const lDay = l.getDay();
    const lMonth = Math.abs(l.getMonth());
    const isHoangDao = l.getDayTianShenType() === "黄道";
    const rawZhiXing = l.getZhiXing();
    const trucName = TRUC_MAP[rawZhiXing]?.name || rawZhiXing;
    const rawTianShen = l.getDayTianShen();
    const tianShenName = THIEN_SHEN_MAP[rawTianShen]?.name || rawTianShen;

    cells.push({
      date: nextDate,
      solarDay: d,
      solarMonth: nextDate.getMonth() + 1,
      solarYear: nextDate.getFullYear(),
      lunarDay: lDay,
      lunarMonth: lMonth,
      isCurrentMonth: false,
      isToday:
        today.getDate() === d &&
        today.getMonth() === nextDate.getMonth() &&
        today.getFullYear() === nextDate.getFullYear(),
      isHoangDao,
      isTamNuong: isTamNuong(lDay),
      isNguyetKy: isNguyetKy(lDay),
      holiday: getTraditionalHoliday(d, nextDate.getMonth() + 1, lDay, lMonth),
      tianShenName,
      truc: trucName,
    });
  }

  return cells;
}

// ── Tìm Ngày Đẹp Cho Việc Lớn (Auspicious Date Finder) ────────────────────────
export type AuspiciousActivityKey =
  | "all"
  | "wedding"
  | "housewarming"
  | "construction"
  | "opening"
  | "travel"
  | "burial"
  | "worship"
  | "contract";

export interface AuspiciousDayResult {
  date: Date;
  dayData: DayVanNienData;
  reason: string;
}

export const ACTIVITY_OPTIONS: {
  key: AuspiciousActivityKey;
  label: string;
  icon: string;
  description: string;
}[] = [
  { key: "all", label: "Tất cả ngày tốt", icon: "CalendarDays", description: "Ngày hoàng đạo, cát tinh trợ mệnh" },
  { key: "wedding", label: "Cưới hỏi", icon: "HeartHandshake", description: "Hôn thú, đính hôn, nạp thái" },
  { key: "housewarming", label: "Về nhà mới", icon: "Home", description: "Nhập trạch, an cư lạc nghiệp" },
  { key: "construction", label: "Xây dựng, động thổ", icon: "Hammer", description: "Đào móng, cất nóc, tạo tác" },
  { key: "opening", label: "Khai trương, mở hàng", icon: "Store", description: "Mở cửa hàng, đón tài lộc" },
  { key: "travel", label: "Xuất hành, đi xa", icon: "Navigation", description: "Đi xa cầu tài, bình an thuận buồm" },
  { key: "burial", label: "An táng, cải táng", icon: "Shield", description: "Tạ thổ, yên nghỉ tiên tổ" },
  { key: "worship", label: "Cúng lễ, cầu phúc", icon: "Flame", description: "Tế tự gia tiên, dâng hương cầu an" },
  { key: "contract", label: "Ký kết, giao dịch", icon: "FileSignature", description: "Giao thương, khế ước hợp tác" },
];

export function findAuspiciousDays(
  activity: AuspiciousActivityKey,
  daysCount: number = 30,
  startDate?: Date,
): AuspiciousDayResult[] {
  const start = startDate ? new Date(startDate) : new Date();
  const results: AuspiciousDayResult[] = [];

  for (let i = 0; i < daysCount; i++) {
    const cur = new Date(start);
    cur.setDate(cur.getDate() + i);
    const dayData = getDayVanNienData(cur);

    // Rule: Avoid Tam Nương and Nguyệt Kỵ for major auspicious activities
    if (dayData.isTamNuong || dayData.isNguyetKy) {
      continue;
    }

    // Must generally be Hoàng đạo
    if (!dayData.isHoangDao && activity !== "burial") {
      continue;
    }

    const rawTruc = dayData.truc.replace("Trực ", "");

    let matches = false;
    let reason = "";

    switch (activity) {
      case "wedding":
        if (["Định", "Thành", "Mãn", "Khai"].includes(rawTruc)) {
          matches = true;
          reason = `Trực ${rawTruc} tốt cho kết duyên, gia đạo thuận hòa.`;
        }
        break;
      case "housewarming":
        if (["Thành", "Định", "Khai", "Mãn"].includes(rawTruc)) {
          matches = true;
          reason = `Trực ${rawTruc} hưng vượng, sinh khí dồi dào khi nhập trạch.`;
        }
        break;
      case "construction":
        if (["Kiến", "Chấp", "Định", "Thành"].includes(rawTruc)) {
          matches = true;
          reason = `Trực ${rawTruc} đắc lợi cho việc xây móng, gác đòn dông, vững chãi muôn đời.`;
        }
        break;
      case "opening":
        if (["Khai", "Mãn", "Thành", "Định"].includes(rawTruc)) {
          matches = true;
          reason = `Trực ${rawTruc} đại cát để mở cửa tiệm, gom lộc tài, buôn may bán đắt.`;
        }
        break;
      case "travel":
        if (["Kiến", "Khai", "Thành", "Mãn"].includes(rawTruc)) {
          matches = true;
          reason = `Trực ${rawTruc} thông suốt bốn phương, xuất hành cát khánh.`;
        }
        break;
      case "burial":
        if (["Bế", "Định", "Chấp"].includes(rawTruc)) {
          matches = true;
          reason = `Trực ${rawTruc} an tĩnh, tề chỉnh, thích hợp an táng mồ mả tổ tiên.`;
        }
        break;
      case "worship":
        if (["Trừ", "Định", "Thành", "Mãn", "Khai"].includes(rawTruc) || [1, 15].includes(dayData.lunarDay)) {
          matches = true;
          reason = `Thanh tịnh, tốt cho dâng lễ gia tiên, cầu phúc bình an.`;
        }
        break;
      case "contract":
        if (["Định", "Thành", "Thâu", "Mãn"].includes(rawTruc)) {
          matches = true;
          reason = `Trực ${rawTruc} giao dịch vững vàng, đôi bên cùng có lợi.`;
        }
        break;
      case "all":
      default:
        if (dayData.isHoangDao && dayData.saoType === "cát tinh") {
          matches = true;
          reason = `Ngày Hoàng đạo, sao ${dayData.saoName} cát tinh, vạn sự thuận lợi.`;
        }
        break;
    }

    if (matches) {
      results.push({
        date: cur,
        dayData,
        reason,
      });
    }
  }

  return results;
}
