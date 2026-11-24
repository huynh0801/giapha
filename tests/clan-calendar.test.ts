import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  getDayVanNienData,
  getMonthCalendarGrid,
  findAuspiciousDays,
  TRUC_MAP,
  SAO_MAP,
  THIEN_SHEN_MAP,
} from "../utils/calendar/vanNienHelper";

function read(filePath: string) {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), "utf8");
}

test("vanNienHelper correctly computes solar, lunar, can chi, astrology, and traditional customs", () => {
  // Reference date: 24/11/2026 (matching reference image)
  const date = new Date(2026, 10, 24); // Month 10 = November
  const data = getDayVanNienData(date);

  assert.equal(data.solarDay, 24, "Solar day must be 24");
  assert.equal(data.solarMonth, 11, "Solar month must be 11");
  assert.equal(data.solarYear, 2026, "Solar year must be 2026");
  assert.equal(data.weekdayName, "Thứ Ba", "Weekday must be Thứ Ba");

  assert.equal(data.lunarDay, 16, "Lunar day must be 16");
  assert.equal(data.lunarMonth, 10, "Lunar month must be 10");
  assert.equal(data.lunarYear, "Năm Bính Ngọ", "Lunar year must be Năm Bính Ngọ");
  assert.equal(data.lunarDayStr, "Ngày 16 tháng 10", "Lunar day string must be Ngày 16 tháng 10");
  assert.equal(data.lunarDayCanChi, "Nhâm Dần", "Day Can Chi must be Nhâm Dần");

  assert.equal(data.tietKhi, "Tiết Tiểu tuyết", "Tiết khí must be Tiết Tiểu tuyết");
  assert.equal(data.truc, "Trực Bình", "Trực must be Trực Bình");
  assert.equal(data.saoName, "Sao Thất", "Sao must be Sao Thất");
  assert.equal(data.saoFullName, "Sao Thất Hỏa Trư", "Full sao name must be Sao Thất Hỏa Trư");
  assert.equal(data.saoType, "cát tinh", "Sao type must be cát tinh");

  // In this date, day is Heidao (Hắc đạo) with Tian Shen Thiên Lao
  assert.equal(data.isHoangDao, false, "Must be Hắc đạo (isHoangDao = false)");
  assert.equal(data.tianShenName, "Thiên Lao", "Tian Shen must be Thiên Lao");
  assert.match(data.reasonText, /Ngày Hắc đạo \(sao Thiên Lao — giam hãm, trì trệ\)/, "Reason text must explain Hắc đạo Thiên Lao");
  assert.match(data.reasonText, /Trực Bình: bằng phẳng, êm xuôi/, "Reason text must explain Trực Bình");

  // Auspicious hours (giờ hoàng đạo)
  assert.ok(data.auspiciousHours.length >= 6, "Must compute at least 6 auspicious hours");
  assert.ok(data.auspiciousHours.some((h) => h.startsWith("Tý")), "Tý must be auspicious");
  assert.ok(data.auspiciousHours.some((h) => h.startsWith("Sửu")), "Sửu must be auspicious");
  assert.ok(data.auspiciousHours.some((h) => h.startsWith("Thìn")), "Thìn must be auspicious");
  assert.ok(data.auspiciousHours.some((h) => h.startsWith("Tỵ")), "Tỵ must be auspicious");
  assert.ok(data.auspiciousHours.some((h) => h.startsWith("Mùi")), "Mùi must be auspicious");
  assert.ok(data.auspiciousHours.some((h) => h.startsWith("Tuất")), "Tuất must be auspicious");
});

test("ClanCalendarCard component exists and exports properly", () => {
  const cardFile = read("components/dashboard/ClanCalendarCard.tsx");

  assert.match(cardFile, /export function ClanCalendarCard/, "Must export ClanCalendarCard component");
  assert.match(cardFile, /Sự kiện trong dòng họ/i, "Must contain Clan Events section title");
  assert.match(cardFile, /Hôm nay \(/, "Must contain today tab");
  assert.match(cardFile, /7 ngày \(/, "Must contain 7 days tab");
  assert.match(cardFile, /30 ngày \(/, "Must contain 30 days tab");
  assert.match(cardFile, /Phong tục hôm nay/i, "Must contain Folk Customs section");
  assert.match(cardFile, /Tuỳ chọn hiển thị/i, "Must contain settings toggle");
  assert.match(cardFile, /Giờ hắc đạo \(tránh việc lớn\)/, "Must contain Giờ hắc đạo in ClanCalendarCard");
  assert.match(cardFile, /Nên tránh/, "Must contain Nên tránh in ClanCalendarCard");
  assert.match(cardFile, /Mở lịch & xem chi tiết ngày này/, "Must contain detail footer action");
});

test("ClanCalendarCard and HeritageCalendarDetailView are integrated in dashboard and events pages", () => {
  const dashboard = read("app/dashboard/[familySlug]/page.tsx");
  const eventsPage = read("app/dashboard/[familySlug]/events/page.tsx");

  assert.match(dashboard, /import ClanCalendarCard from "@/);
  assert.match(dashboard, /<ClanCalendarCard/);

  assert.match(eventsPage, /import HeritageCalendarDetailView from "@/);
  assert.match(eventsPage, /<HeritageCalendarDetailView/);
});

test("vanNienHelper computes NaYin, Tam Nuong, Nguyet Ky, Month Grid, and Auspicious Days", () => {
  // Reference date: 26/11/2026 (matching reference detail screenshot)
  const date26 = new Date(2026, 10, 26);
  const data26 = getDayVanNienData(date26);

  assert.equal(data26.solarDay, 26);
  assert.equal(data26.solarMonth, 11);
  assert.equal(data26.weekdayName, "Thứ Năm");
  assert.equal(data26.lunarDay, 18);
  assert.equal(data26.lunarMonth, 10);
  assert.equal(data26.lunarDayCanChi, "Giáp Thìn");
  assert.equal(data26.truc, "Trực Chấp");
  assert.equal(data26.saoName, "Sao Khuê");
  assert.equal(data26.tietKhi, "Tiết Tiểu tuyết");
  assert.equal(data26.naYin, "Phú Đăng Hỏa");
  assert.equal(data26.isHoangDao, true);
  assert.equal(data26.tianShenName, "Tư Mệnh");
  assert.equal(data26.isTamNuong, true, "18 AL must be Tam Nuong");
  assert.equal(data26.isNguyetKy, false);

  // Month grid test for November 2026
  const grid = getMonthCalendarGrid(2026, 11);
  assert.ok(grid.length >= 35 && grid.length % 7 === 0, "Grid must be multiple of 7");
  const cell26 = grid.find(
    (c) => c.isCurrentMonth && c.solarDay === 26 && c.solarMonth === 11,
  );
  assert.ok(cell26, "Must find cell for 26/11");
  assert.equal(cell26.lunarDay, 18);
  assert.equal(cell26.isHoangDao, true);
  assert.equal(cell26.isTamNuong, true);

  // Auspicious days finder test for "opening" (Khai trương) within 30 days
  const results = findAuspiciousDays("opening", 30, date26);
  assert.ok(results.length >= 2, "Must find auspicious opening dates");
  // November 29th and Dec 12th are auspicious opening days
  const hasNov29 = results.some(
    (r) => r.dayData.solarDay === 29 && r.dayData.solarMonth === 11,
  );
  const hasDec12 = results.some(
    (r) => r.dayData.solarDay === 12 && r.dayData.solarMonth === 12,
  );
  assert.ok(hasNov29, "Nov 29th must be auspicious opening date");
  assert.ok(hasDec12, "Dec 12th must be auspicious opening date");
});

test("HeritageCalendarDetailView component exists and exports properly", () => {
  const viewFile = read("components/dashboard/HeritageCalendarDetailView.tsx");

  assert.match(viewFile, /export default function HeritageCalendarDetailView/);
  assert.match(viewFile, /monthCells/);
  assert.match(viewFile, /Tìm Ngày Đẹp Cho Việc Lớn/i);
  assert.match(viewFile, /Vì sao\?/);
  assert.match(viewFile, /Giờ tốt \(hoàng đạo\)/);
  assert.match(viewFile, /Nên làm/);
  assert.match(viewFile, /Nên tránh/);
});
