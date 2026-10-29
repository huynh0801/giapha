import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractBaomoiNextData,
  extractBaomoiTagArticles,
  formatHighResCoverUrl,
  cleanTagLinks,
  buildArticleHtml,
  pruneOldCrawledNews,
  type BaomoiRawItem,
} from '../lib/crawler/baomoi';

test('extractBaomoiNextData parses json from __NEXT_DATA__ script block', () => {
  const html = `
    <html>
      <head><title>Báo Mới</title></head>
      <body>
        <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"resp":{"data":{"content":{"items":[{"id":123,"title":"Tin test"}]}}}}}}</script>
      </body>
    </html>
  `;
  const data = extractBaomoiNextData(html);
  assert.ok(data);
  assert.equal(data.props.pageProps.resp.data.content.items[0].id, 123);
});

test('extractBaomoiNextData returns null when script tag is absent or invalid', () => {
  assert.equal(extractBaomoiNextData('<div>no script</div>'), null);
  assert.equal(extractBaomoiNextData('<script id="__NEXT_DATA__" type="application/json">{invalid json</script>'), null);
});

test('extractBaomoiTagArticles correctly extracts items from content payload', () => {
  const nextData = {
    props: {
      pageProps: {
        resp: {
          data: {
            content: {
              items: [
                { id: 1, title: 'Bài viết 1' },
                { id: 2, title: 'Bài viết 2' },
              ],
            },
          },
        },
      },
    },
  };
  const items = extractBaomoiTagArticles(nextData);
  assert.equal(items.length, 2);
  assert.equal(items[0].title, 'Bài viết 1');
});

test('formatHighResCoverUrl replaces w250_r3x2 with w700_r16x9', () => {
  const thumb = 'https://photo-baomoi.bmcdn.me/w250_r3x2/2026_10_27_56_56366004/f2eed0727a399367ca28.jpg';
  const highRes = formatHighResCoverUrl(thumb);
  assert.equal(highRes, 'https://photo-baomoi.bmcdn.me/w700_r16x9/2026_10_27_56_56366004/f2eed0727a399367ca28.jpg');
  assert.equal(formatHighResCoverUrl(undefined), undefined);
});

test('cleanTagLinks removes internal tag anchors while preserving text', () => {
  const raw = 'Bí thư Tỉnh ủy <a class="tag-link" href="/quang-tri-tag11433.epi">Quảng Trị</a> đã kiểm tra.';
  const cleaned = cleanTagLinks(raw);
  assert.equal(cleaned, 'Bí thư Tỉnh ủy Quảng Trị đã kiểm tra.');
});

test('buildArticleHtml constructs semantic HTML with lead, paragraphs, images, and source citations', () => {
  const mockItem: BaomoiRawItem = {
    id: 56366004,
    title: 'Quảng Trị cần hơn 2.300 tỷ đồng chống xói lở',
    date: 1793112720,
    url: '/quang-tri-can-hon-2-300-ty-dong-c56366004.epi#|timeline|index0',
    description: 'Sau nhiều đợt mưa bão, bờ biển Nhật Lệ bị xói lở.',
    publisher: { name: 'Báo Xây Dựng' },
  };

  const detailContent = {
    bodys: [
      {
        type: 'text',
        content: 'Chiều 27/10, đoàn công tác đã đi kiểm tra thực tế.',
      },
      {
        type: 'image',
        content: 'https://photo-baomoi.bmcdn.me/w700_r1/sample.jpg',
        description: 'Đoàn công tác kiểm tra kè biển',
      },
      {
        type: 'text',
        content: 'Khu vực biển chịu tác động sóng lớn.',
      },
    ],
    originalUrl: 'https://baoxaydung.vn/article-123.htm',
    publisher: { name: 'Báo Xây Dựng' },
  };

  const html = buildArticleHtml(mockItem, detailContent);

  assert.match(html, /article-lead/);
  assert.match(html, /Sau nhiều đợt mưa bão, bờ biển Nhật Lệ bị xói lở/);
  assert.match(html, /Chiều 27\/10, đoàn công tác đã đi kiểm tra thực tế/);
  assert.match(html, /<figure class="my-6 text-center">/);
  assert.match(html, /https:\/\/photo-baomoi\.bmcdn\.me\/w700_r1\/sample\.jpg/);
  assert.match(html, /Đoàn công tác kiểm tra kè biển/);
  assert.match(html, /Nguồn tin: <strong>Báo Xây Dựng<\/strong>/);
  assert.match(html, /https:\/\/baoxaydung\.vn\/article-123\.htm/);
  assert.match(html, /https:\/\/baomoi\.com\/quang-tri-can-hon-2-300-ty-dong-c56366004\.epi/);
});

test('pruneOldCrawledNews respects maxKeep and deletes only excess old posts', async () => {
  let deletedIds: string[] = [];

  const mockSupabase = {
    from: (table: string) => ({
      select: (fields: string, opts?: any) => {
        if (opts?.count === 'exact') {
          return {
            eq: () => ({
              eq: () => Promise.resolve({ count: 105, error: null }),
            }),
          };
        }
        return {
          eq: () => ({
            eq: () => ({
              order: () => ({
                limit: (limit: number) =>
                  Promise.resolve({
                    data: Array.from({ length: limit }, (_, i) => ({ id: `old-post-${i + 1}` })),
                    error: null,
                  }),
              }),
            }),
          }),
        };
      },
      delete: () => ({
        in: (field: string, ids: string[]) => {
          deletedIds = ids;
          return Promise.resolve({ error: null });
        },
      }),
    }),
  };

  const res = await pruneOldCrawledNews(mockSupabase, 100);
  assert.equal(res.prunedCount, 5);
  assert.equal(deletedIds.length, 5);
  assert.equal(deletedIds[0], 'old-post-1');
});
