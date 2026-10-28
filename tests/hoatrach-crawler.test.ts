import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseArticleDetail, extractArticleListUrls } from '../lib/crawler/hoatrach';

test('extractArticleListUrls extracts article URLs sorted by epoch timestamp descending', () => {
  const sampleHtml = `
    <div class="artItem">
      <a href="https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/0/1793161906731" class="article_title_link">Tin 1</a>
    </div>
    <div class="artItem">
      <a href="https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/541511447209827415/1793171184429" class="article_title_link">Tin 2</a>
    </div>
    <div class="artItem">
      <!-- duplicate link with encoded &amp; -->
      <a href="https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/0/1793161906731" class="continue">Xem tiếp</a>
    </div>
  `;
  const urls = extractArticleListUrls(sampleHtml);
  assert.equal(urls.length, 2);
  assert.equal(urls[0], 'https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/541511447209827415/1793171184429');
  assert.equal(urls[1], 'https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/0/1793161906731');
});

test('parseArticleDetail extracts title, date, excerpt and content', () => {
  const sampleDetailHtml = `
    <h3 class="h1_title_news">NỀN KINH TẾ HÒA TRẠCH: BẢN HỢP ÂM GIỮA ĐẤT LIỀN VÀ BIỂN CẢ</h3>
    <p id="pPost-date">Ngày đăng: 28/10/2026</p>
    <div class="article_summary_detail"><span class="summary_detail_news"><p>Kinh tế xã...</p></span></div>
    <div class="detail_content_news">
      <script>alert("test");</script>
      <div class="ho_tro">Print button</div>
      <p>Chi tiết bài viết xã Hòa Trạch...</p>
    </div>
  `;
  const parsed = parseArticleDetail(sampleDetailHtml, 'https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/0/1793171184429');
  assert.equal(parsed.title, 'NỀN KINH TẾ HÒA TRẠCH: BẢN HỢP ÂM GIỮA ĐẤT LIỀN VÀ BIỂN CẢ');
  assert.match(parsed.excerpt, /Kinh tế xã/);
  assert.match(parsed.content, /Chi tiết bài viết/);
  // Script should be stripped
  assert.ok(!parsed.content.includes('<script>'));
  // Source citation appended
  assert.match(parsed.content, /Nguồn: Cổng thông tin điện tử UBND Xã Hòa Trạch/);
  assert.equal(parsed.dateStr, '28/10/2026');
});

test('parseArticleDetail handles fallback when date or summary is missing', () => {
  const emptyHtml = `<div class="detail_content_news"><p>Nội dung ngắn</p></div>`;
  const parsed = parseArticleDetail(emptyHtml, 'https://hoatrach.quangtri.gov.vn/chi-tiet-tin/-/view-article/1/0/1793171184429');
  assert.ok(parsed.title);
  assert.ok(parsed.publishedAt);
  assert.match(parsed.content, /Nội dung ngắn/);
});
