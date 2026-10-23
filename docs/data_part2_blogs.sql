BEGIN;
SET session_replication_role = 'replica';

-- 10. BÀI VIẾT BLOG
-- Table: public.blog_posts (13 rows)
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('50000000-0000-0000-0000-000000000002', 'system', NULL, 'Mỗi dòng họ một không gian quản trị riêng', 'moi-dong-ho-mot-khong-gian-quan-tri-rieng', 'Super Admin tạo dòng họ, gán Admin Dòng Họ và vẫn có quyền cứu hộ dữ liệu toàn hệ thống khi cần hỗ trợ kỹ thuật.', 'Mô hình multi-tenant giúp mỗi dòng họ có cây gia phả, thành viên, sự kiện và tài liệu riêng. Thành viên chỉ xem được khi membership active trong đúng dòng họ.', 'SẢN PHẨM', '/mo gio co va bao thap.jpg.jpg', NULL, true, 'published', 'public', '2026-07-06T21:44:22.524187+07:00', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('748545fb-dd7c-4490-99ea-ab0a1e632982', 'system', NULL, 'Đình Hoa Xá, Minh Ngự lâu cổ kính ven bờ sông Nhuệ', 'dinh-hoa-xa-minh-ngu-lau-co-kinh-ven-bo-song-nhue', '. Hoa Xá còn có tên gọi là làng Tó. Đình Hoa Xá và Minh Ngự lâu-(nghĩa là Lầu ngự sáng- thuộc thôn Tả Thanh Oai, xã Đại Thanh , Hà Nội,', '<p class="MsoNormal" align="left" style="margin-bottom: 0cm; line-height: normal; background: rgb(248, 245, 233);"><b><span style="font-size:24.0pt;font-family:&quot;unset&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;letter-spacing:-.1pt;
mso-font-kerning:18.0pt;mso-ligatures:none">Đình Hoa Xá, Minh Ngự lâu cổ kính đang được tu bổ<o:p></o:p></span></b></p><p class="MsoNormal" align="left" style="margin-bottom: 0cm; line-height: normal; background: rgb(248, 245, 233);"><b><span style="font-size:14.5pt;
font-family:&quot;unset&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">Tả
Thanh Oai, ấp Hoa Xá là một vùng đất có bề dày lịch sử. Hoa Xá còn có tên gọi
là làng Tó. Đình Hoa Xá và Minh Ngự lâu-(nghĩa là Lầu ngự sáng- thuộc thôn Tả
Thanh Oai, xã Đại Thanh , Hà Nội, tức xã Tả Thanh Oai, huyện Thanh Trì cũ.<o:p></o:p></span></b></p><p class="MsoNormal" align="left" style="margin: 6pt 0cm 12pt; line-height: normal; background: rgb(248, 245, 233);"><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">Đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ì</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">nh v</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> Minh Ng</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ự</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">u th</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ờ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> L</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ê</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> Ho</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">n c</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ù</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">Đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> H</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ồ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> phu nh</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">â</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">n -t</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ứ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">c c</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> g</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">á</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i l</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng T</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ó</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">, ho</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ặ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">c b</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> ch</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ú</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">a H</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n).<o:p></o:p></span></p><p class="MsoNormal" align="left" style="margin-bottom: 12pt; line-height: normal; background: rgb(248, 245, 233);"><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">Lê Hoàn làm quan t</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ớ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i ch</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ứ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c Th</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ậ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">p </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">o t</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ướ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng qu</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n. Khi qu</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">â</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">n T</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ố</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng sang x</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">â</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">m l</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ượ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">c n</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ướ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c ta năm 981, L</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ê</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> Ho</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">em qu</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n ch</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ố</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng gi</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ặ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c, chi</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n th</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ắ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng tr</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ở</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> v</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ề</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">, l</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ê</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n ng</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">i, tức vua L</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ê</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">Đạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i H</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">nh, thay nh</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">Đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">inh, tr</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ị</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> v</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ì</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> 24 n</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ă</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m. </span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">Ô</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng c</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ó</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> nhi</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ề</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">u c</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ng lao trong vi</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ệ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c b</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ả</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">o v</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ệ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> n</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ề</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">độ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ậ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">p d</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n t</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ộ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c v</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> x</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">â</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">y d</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ự</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đấ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">t n</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ướ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c cu</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ố</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i th</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> k</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ỷ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> X, </span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đầ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">u th</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> k</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ỷ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> XI.<o:p></o:p></span></p><p class="MsoNormal" align="left" style="margin-bottom: 12pt; line-height: normal; background: rgb(248, 245, 233);"><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">Khi chinh chi</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n qua v</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ù</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng Nhu</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ệ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> Giang, nhi</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ề</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">u ng</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ườ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i theo </span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ô</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">á</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">nh gi</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ặ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">c v</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> v</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ậ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n chuy</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ể</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n qu</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n l</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ươ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng. Ch</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">í</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">nh c</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">Đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> H</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ồ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">, sau n</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">y d</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">â</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">n gian g</span><span style="font-size:14.5pt;font-family:
&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ọ</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">i l</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> b</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> ch</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ú</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">a H</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ã</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ó</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng thuy</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ề</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n, g</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ó</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">p l</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ươ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng th</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ự</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c v</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> s</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">á</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ng t</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">o ra th</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ứ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ươ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng kh</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ô</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> ch</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">è</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> lam, gi</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ú</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">p qu</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">â</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">n L</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ê</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> Ho</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n chi</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n th</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ắ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng gi</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ặ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c.<o:p></o:p></span></p><p class="MsoNormal" align="left" style="margin-bottom: 12pt; line-height: normal; background: rgb(248, 245, 233);"><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"><figure class="blog-inline-image"><img src="https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/inline/1783473213847-f7a7499a-98e6-497d-a6ea-d72f4316ba4c.webp" alt="3(7).jpg"></figure><p><br></p><br></span></p><p class="MsoNormal" align="left" style="margin-bottom: 12pt; line-height: normal; background: rgb(248, 245, 233);"><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">Phá tan gi</span><span style="font-size:14.5pt;font-family:
&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ặ</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">c T</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ố</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng, L</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ê</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> Ho</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n tr</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ở</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i l</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng T</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ó</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">, ban cho </span><span style="font-size:14.5pt;font-family:
&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">Đ</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ô</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> H</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ồ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">m qu</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ý</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> phi, d</span><span style="font-size:14.5pt;font-family:
&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n l</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng l</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ấ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">y l</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">m vinh d</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ự</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ắ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m. Vua l</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i c</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ấ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">p ru</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ộ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đấ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">t, ti</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ề</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n c</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ủ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">a </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">để</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ậ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">p cung </span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ệ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ở</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> n</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ơ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i v</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ườ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n c</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ũ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">, g</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ọ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i l</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> </span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">“</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">Đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> H</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ồ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> phi cung</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">”</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">. Sau khi vua v</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> b</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> qu</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ý</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> phi qua </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đờ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i, d</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n l</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ng l</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ậ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">p </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ì</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">nh th</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ờ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> t</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i n</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ơ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ở</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> c</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ủ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">a b</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">, d</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ự</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng l</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ầ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">u Minh Ng</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ự</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">, nh</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> cung phi th</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">nh mi</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">u </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ệ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">để</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> th</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ờ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> hai ng</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ườ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i c</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ó</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> c</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ng v</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ớ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">i n</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ướ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c, v</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ớ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i l</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng.<o:p></o:p></span></p><p class="MsoNormal" align="left" style="margin-bottom: 12pt; line-height: normal; background: rgb(248, 245, 233);"><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">Đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ì</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">nh Hoa X</span><span style="font-size:14.5pt;font-family:
&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">á</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> v</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> Minh Ng</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ự</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">u to</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c tr</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ê</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n m</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ộ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">t khu </span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đấ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">t r</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ộ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng, b</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ê</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n t</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ả</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> ng</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n s</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ô</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng Nhu</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ệ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">. </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">Đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ì</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">nh quay h</span><span style="font-size:14.5pt;font-family:
&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ướ</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ng nam, ki</span><span style="font-size:14.5pt;font-family:
&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">n tr</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ú</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c b</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ề</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> th</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">, c</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ó</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> nhi</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ề</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">u c</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">y mu</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ỗ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m c</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ổ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> th</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ụ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> r</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ợ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">p m</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">á</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">t b</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ố</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n m</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ù</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">a. </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">Đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ì</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">nh c</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ó</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> 4 m</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">á</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">i, l</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ợ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">p ng</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ó</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">i m</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ũ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i h</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">i, 4 g</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ó</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">c </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ao cong. Trong </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ì</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">nh c</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ó</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> c</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ử</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">a v</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">õ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng, nhang </span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">á</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">n, kh</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">á</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m th</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ờ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">, ki</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ệ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">u r</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ướ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c, </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đượ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c ch</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m th</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ủ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng, ch</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ộ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng, ch</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m bong c</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">á</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">c h</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ì</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">nh r</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ồ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng l</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">á</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> mang d</span><span style="font-size:14.5pt;font-family:
&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ấ</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">u </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ấ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n ngh</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ệ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> thu</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ậ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">t th</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> k</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ỷ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> XVII, XVIII. </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">Đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ì</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">nh c</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ò</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n b</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ả</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">o l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ư</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">u </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đượ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">i h</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">c th</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ờ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">, t</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ượ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng b</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">Đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> H</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ồ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">, ng</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ự</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">a </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">á</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> th</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ờ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">i L</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ê</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">, bia </span><span style="font-size:14.5pt;font-family:
&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">á</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">, th</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ầ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n ph</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ả</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">, s</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ắ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c phong... l</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> nh</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ữ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng t</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">á</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">c ph</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ẩ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">m c</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ó</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> gi</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">á</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> tr</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ị</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ị</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ch s</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ử</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> v</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> ngh</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ệ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> thu</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ậ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">t.<o:p></o:p></span></p><p class="MsoNormal" align="left" style="margin-bottom: 12pt; line-height: normal; background: rgb(248, 245, 233);"><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"><figure class="blog-inline-image"><figure class="blog-inline-image"><img src="https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/inline/1783473292334-6cf90175-da73-4196-8a68-9aa56c6a249d.webp" alt="mieu-giao-ha-08042023 (1).jpg"></figure><p><br></p><br></figure></span></p><p class="MsoNormal" align="left" style="margin-bottom: 12pt; line-height: normal; background: rgb(248, 245, 233);"><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">Minh Ng</span><span style="font-size:14.5pt;font-family:
&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ự</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> l</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">u-mi</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">u b</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> ch</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ú</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">a H</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n- </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ở</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> qu</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ê</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> h</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ươ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng c</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ủ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">a b</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">Đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> H</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ồ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">. N</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ơ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i n</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">y v</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">o ng</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">y r</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ằ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m th</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">á</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng gi</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ê</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ng </span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ị</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ch, nh</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">n d</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">â</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">n l</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ễ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> h</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ộ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i, th</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ì</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> t</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ố</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i 14 t</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ượ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng v</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">à</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> ngai c</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ủ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">a </span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ô</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ng b</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> r</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ướ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">c v</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ề</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> Minh Ng</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ự</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">â</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">u. Sau khi t</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ắ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m r</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ử</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">a, </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ở</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> l</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">i m</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ộ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">t </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ê</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">m, t</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ớ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">i s</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">á</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ng h</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m r</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ằ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m th</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ì</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> r</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ướ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c tr</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ở</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> v</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ề</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> </span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ì</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">nh.<o:p></o:p></span></p><p class="MsoNormal" align="left" style="margin-bottom: 12pt; line-height: normal; background: rgb(248, 245, 233);"><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">Di tích </span><span style="font-size:14.5pt;font-family:
&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">đ</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ã</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> </span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">đượ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">c B</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ộ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> V</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ă</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n ho</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">á</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none"> v</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">à</span><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none"> Th</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;IBM Plex Serif&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ô</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng tin x</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">p h</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ạ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ng di t</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">í</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ch l</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ị</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">ch s</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ử</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">, ki</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ế</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">n tr</span><span style="font-size:
14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;IBM Plex Serif&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">ú</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">c ngh</span><span style="font-size:14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ệ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none"> thu</span><span style="font-size:
14.5pt;font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ậ</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">t n</span><span style="font-size:14.5pt;
font-family:&quot;Calibri&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:#222222;mso-font-kerning:0pt;mso-ligatures:none">ă</span><span style="font-size:14.5pt;font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;
mso-font-kerning:0pt;mso-ligatures:none">m 1994./.<o:p></o:p></span></p><p class="MsoNormal" align="left" style="margin-bottom: 12pt; line-height: normal; background: rgb(248, 245, 233);"><span style="font-size:14.5pt;
font-family:&quot;IBM Plex Serif&quot;,serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-bidi-font-family:&quot;Times New Roman&quot;;color:#222222;mso-font-kerning:0pt;
mso-ligatures:none">Hiện Đình Hoa Xác đang được nhà nước đầu tư tu bổ tôn tạo lại
từ thsng 6/2026. Dự kiến hoàn thành trước tết nguyên đán 2027<o:p></o:p></span></p><p>



















</p><p class="MsoNormal">Theo<font size="2"> <i><span style="line-height: 135%; font-family: &quot;IBM Plex Serif&quot;, serif; color: rgb(34, 34, 34); background: rgb(248, 245, 233);">Hà N</span></i><i><span style="line-height: 135%; font-family: Cambria, serif; color: rgb(34, 34, 34); background: rgb(248, 245, 233);">ộ</span></i><i><span style="line-height: 135%; font-family: &quot;IBM Plex Serif&quot;, serif; color: rgb(34, 34, 34); background: rgb(248, 245, 233);">i Danh th</span></i><i><span style="line-height: 135%; font-family: Cambria, serif; color: rgb(34, 34, 34); background: rgb(248, 245, 233);">ắ</span></i><i><span style="line-height: 135%; font-family: &quot;IBM Plex Serif&quot;, serif; color: rgb(34, 34, 34); background: rgb(248, 245, 233);">ng và Di tích t</span></i><i><span style="line-height: 135%; font-family: Cambria, serif; color: rgb(34, 34, 34); background: rgb(248, 245, 233);">ậ</span></i><i><span style="line-height: 135%; font-family: &quot;IBM Plex Serif&quot;, serif; color: rgb(34, 34, 34); background: rgb(248, 245, 233);">p 1</span></i></font><o:p></o:p></p>', 'VĂN HÓA DÒNG HỌ', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/covers/1783473369438-0b04c500-cea4-4551-950e-3385a9c5f688-dinh-hoa-xa-minh-ngu-lau-co-kinh-ven-bo-song-nhue.webp', 'system/covers/1783473369438-0b04c500-cea4-4551-950e-3385a9c5f688-dinh-hoa-xa-minh-ngu-lau-co-kinh-ven-bo-song-nhue.webp', true, 'published', 'public', '2026-07-24T16:52:24.18+07:00', NULL, '2026-07-08T08:16:11.007714+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('50000000-0000-0000-0000-000000000003', 'family', 'aaaaaaaa-0000-0000-0000-000000000001', 'Thông báo: tổ chức lễ Kỷ niệm  và tôn vinh chị em Dâu- Gái dòng họ Văn .', 'thong-bao', 'Thông báo: Nhân ngày Phụ nữ Việt Nam 20/10, Dòng họ tổ chức lễ Kỷ niệm  và tôn vinh chị em Dâu- Gái dòng họ Văn vào ngày 18/10/2026, (Chủ nhật) Tại Từ đường Họ Văn Hà Nội. Kính mời ông bà, cô dì chú bác và anh chị em tới tham dự.
Trân trọng!
Trưởng Ban Tổ chức: Văn Thành Công', '<p>Nội dung này thuộc blog riêng của dòng họ mẫu. Admin dòng họ có thể đăng thông báo, ghi chép lịch sử, hình ảnh tư liệu và kế hoạch sinh hoạt họ tộc tại đây.</p>', 'TIN NỘI BỘ DÒNG HỌ', '', NULL, false, 'draft', 'private', NULL, NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T22:48:16.785556+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('ef2f1cee-a3a2-45fc-8f26-b028e5248cd4', 'system', NULL, 'Nỗi trăn trở của các Dòng họ, đã có nền tảng gia phả số giaphadongho.com giải quyết', 'noi-tran-tro-cua-cac-dong-ho-da-co-nen-tang-gia-pha-so-giaphadongho-com-giai-quyet', 'Nỗi lo gia phả giấy cũ rách và những bất cập, giờ đây, đã có giaphadongho.com giải quyết tất cả', '<p><br></p><figure class="media-embed"><iframe src="https://www.youtube.com/embed/PoKdg-TB8yI" title="Video" allowfullscreen=""></iframe></figure><p><br></p>', 'VĂN HÓA DÒNG HỌ', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/covers/1790155782206-ec1ba1b2-5ec5-435d-8a4a-3b85c7ee6ed4-noi-tran-tro-cua-cac-dong-ho-da-co-nen-tang-gia-pha-so-giaphadongho-com-giai-quyet.webp', 'system/covers/1790155782206-ec1ba1b2-5ec5-435d-8a4a-3b85c7ee6ed4-noi-tran-tro-cua-cac-dong-ho-da-co-nen-tang-gia-pha-so-giaphadongho-com-giai-quyet.webp', true, 'published', 'public', '2026-08-13T01:39:40.296+07:00', NULL, '2026-08-13T01:39:40.508455+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('50000000-0000-0000-0000-000000000001', 'system', NULL, 'Số hóa gia phả trong không gian riêng tư', 'so-hoa-gia-pha-trong-khong-gian-rieng-tu', 'Gia phả số nên ưu tiên quyền riêng tư, chỉ thành viên được duyệt mới xem dữ liệu nội bộ.', '<p>Nền tảng giúp các dòng họ lưu giữ cây gia phả, tư liệu và ký ức theo từng không gian riêng. Dữ liệu mặc định là private, còn blog hệ thống có thể public khi không chứa thông tin nội bộ.</p>', 'VĂN HÓA DÒNG HỌ', '/family.jpg.png', NULL, true, 'published', 'public', '2026-07-24T16:50:27.869+07:00', NULL, '2026-07-07T21:44:22.524187+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('07a9bbc2-8fe0-403c-a84f-e9a8ab475029', 'system', NULL, 'GIAPHADONGHO.COM–NƠI LƯU GIỮ ĐẦY ĐỦ TRỌN VẸN CHÂN DUNG THÀNH VIÊN GIA ĐÌNH QUA CÁC THẾ HỆ', 'giaphadongho-com-noi-luu-giu-day-du-tron-ven-chan-dung-thanh-vien-gia-dinh-qua-cac-the-he', 'Những hình ảnh, nụ cười và ký ức về các thế hệ đi trước luôn được gìn giữ mãi mãi trên giaphadongho.com  cho con cháu đời sau.', '<p class="MsoNormal" align="left" style="line-height: normal;"><b><span style="font-size:13.5pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:none">GIAPHADONGHO.COM–NƠI
LƯU GIỮ ĐẦY ĐỦ TRỌN VẸN CHÂN DUNG THÀNH VIÊN GIA ĐÌNH QUA CÁC THẾ HỆ<o:p></o:p></span></b></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size:12.0pt;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
mso-font-kerning:0pt;mso-ligatures:none">Mỗi con người sinh ra đều có một cội
nguồn để hướng về, mỗi gia đình đều có một dòng chảy lịch sử riêng cần được
trân trọng và lưu truyền. Thời gian có thể bụi mờ theo năm tháng, nhưng những
hình ảnh, nụ cười và ký ức về các thế hệ đi trước luôn được gìn giữ mãi mãi
trên giaphadongho.com &nbsp;cho con cháu đời
sau.<o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size:12.0pt;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
mso-font-kerning:0pt;mso-ligatures:none">Với sứ mệnh làm cầu nối thiêng liêng
giữa quá khứ, hiện tại và tương lai, nền tảng gia phả số của các Dòng họ
giaphadongho.com mang đến một giải pháp số hóa toàn diện cho việc lưu trữ và
tôn vinh các giá trị gia đình:<o:p></o:p></span></p><ul type="disc">
 <li class="MsoNormal" style="line-height: normal;"><b><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
     mso-bidi-font-family:&quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:
     none">Giaphadongho.com lưu giữ chân dung sắc nét qua thời gian:</span></b><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
     mso-bidi-font-family:&quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:
     none"> Hệ thống tích hợp công nghệ tối ưu hóa và bảo tồn tư liệu hình ảnh
     chất lượng cao. Dù là những bức ảnh đen trắng xưa cũ của ông bà, tổ tiên
     hay những khoảnh khắc rạng rỡ đời thường của con cháu thế hệ trẻ hôm nay,
     tất cả đều được lưu trữ bền vững, sống động trên nền tảng cơ sở dữ liệu
     của gia tộc.<o:p></o:p></span></li>
 <li class="MsoNormal" style="line-height: normal;"><b><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
     mso-bidi-font-family:&quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:
     none">Giaphadongho.com Kết nối các thế hệ trên cùng một cây gia phả:</span></b><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
     mso-bidi-font-family:&quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:
     none"> Không chỉ là những tấm ảnh rời rạc, mỗi chân dung thành viên khi
     được tải lên sẽ gắn liền với vị trí trang trọng của họ trên sơ đồ cây gia
     hệ. Con cháu chỉ cần lướt nhẹ màn hình là có thể nhìn thấy diện mạo, thấu
     hiểu vai vế, thứ bậc và cuộc đời của từng cụ, từng người trong dòng tộc
     mình.<o:p></o:p></span></li>
 <li class="MsoNormal" style="line-height: normal;"><b><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
     mso-bidi-font-family:&quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:
     none">Giaphadongho.com là Không gian lưu niệm an toàn, bảo mật:</span></b><span style="font-size:12.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;
     mso-bidi-font-family:&quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:
     none"> Toàn bộ tư liệu hình ảnh, thông tin cá nhân của các thành viên đều
     được bảo vệ nghiêm ngặt trên hệ thống quản trị rạch ròi, giúp gia đình
     hoàn toàn an tâm khi gửi gắm những thước phim, bức ảnh vô giá của cuộc đời
     vào không gian lưu trữ chung của dòng họ.<o:p></o:p></span></li>
</ul><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size:12.0pt;
mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;
mso-font-kerning:0pt;mso-ligatures:none">Hãy cùng nền tảng gia phả dòng họ
giaphadongho.com dựng xây nên một bảo tàng ký ức số cho gia đình bạn – nơi mà
mỗi khi lật mở, diện mạo và tinh thần của các thế hệ đi trước vẫn luôn hiện
hữu, soi sáng và đồng hành cùng bước đường trưởng thành của con cháu mai sau.<o:p></o:p></span></p><p>









</p><p class="MsoNormal"><o:p>&nbsp;</o:p></p>', 'VĂN HÓA DÒNG HỌ', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/covers/1783441108699-42a22698-8012-4c5b-b8cf-573176df05bd-giaphadongho-com-noi-luu-giu-day-du-tron-ven-chan-dung-thanh-vien-gia-dinh-qua-cac-the-he.webp', 'system/covers/1783441108699-42a22698-8012-4c5b-b8cf-573176df05bd-giaphadongho-com-noi-luu-giu-day-du-tron-ven-chan-dung-thanh-vien-gia-dinh-qua-cac-the-he.webp', true, 'published', 'public', '2026-07-24T16:54:10.881+07:00', NULL, '2026-07-07T23:18:29.608758+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('854e0566-1e4d-4b4f-bd94-6928a7e1ec93', 'system', NULL, 'ĐẠI HỘI ĐẠI BIỂU HỌ TRẦN TP. HÀ NỘI LẦN III', 'thong-bao', 'Sự kết nối hoạt động tạo dựng của họ Trần Thủ Đô Hà Nội.chính là sự đoàn kết gắn bó củng cố niềm tin trong dòng họ, là nhân tố hàng đầu trong mọi thắng lợi.', '<p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#080809;mso-font-kerning:0pt;mso-ligatures:none">Ngày
9-8-2026 tại trung tâm hội nghị quốc gia Mỹ Đình - Hà Nội, Đại hội đại biểu họ
Trần Hà Nội khai mạc. đây là đại hội mang tầm cỡ lớn của họ Trần Việt Nam ! <o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#080809;mso-font-kerning:0pt;mso-ligatures:none">Sau
Đại hội lần thứ 3 nhiệm kỳ 2026-2031, họ Trần Hà Nội là " cái nôi"
kết nối các thế hệ chung huyết thống, sẽ lưu giữ cội nguồn của tổ tiên, những
giá trị cốt lõi. &nbsp;<o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#080809;mso-font-kerning:0pt;mso-ligatures:none">Thông
qua kỳ Đại hội có ý nghĩa sâu sắc, mang tầm giáo dục " Đạo Lý Uống Nước
Nhớ Nguồn " bảo tồn giá trị văn hoá lịch sử truyền thống của họ Trần ở mọi
thời đại, phát huy tinh thần đoàn kết, tương trợ lẫn từ xa xưa tới nay, coi
trọng vai trò của dòng họ. <o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#080809;mso-font-kerning:0pt;mso-ligatures:none">Hà Nội
được xem là " cái nôi" sản sinh ra nhiều nhân tài của họ Trần cống
hiến phục vụ cho đất nước, Là kho tàng văn hoá lịch sử được tiếp nối trao
truyền qua nhiều thế hệ. <o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#080809;mso-font-kerning:0pt;mso-ligatures:none">Nét
đặc trưng của họ Trần Hà Nội sẽ Hun đúc đắp bồi gìn giữ và phát huy nét đẹp văn
hoá truyền thống họ Trần Hà Nội nói riêng, họ Trần Việt Nam nói chung.<o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#080809;mso-font-kerning:0pt;mso-ligatures:none">Nối
tiếp tuyền thống tốt đẹp của tổ tiên, cha ông, các thế hệ con cháu họ Trần Hà
Nội khắc sâu trong tim niềm tự hào họ Trần Thủ Đô để kết nối xây dựng phong
trào hoạt động dòng họ, khuyến khích mọi thế hệ tham gia và phát triển ngày
càng lớn mạnh. Đội ngũ cán bộ hoạt động nhiệt tình và trách nhiệm, có tầm nhìn
và phương pháp tổ chức lãnh đạo xứng tầm theo phương châm " Quí Hồ Tinh,
Bất Quí Hồ Đa".</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#080809;mso-font-kerning:0pt;mso-ligatures:none">Sự tồn
tại và phát triển của dòng họ Trần theo tiến trình lịch sử phát triển của dân
tộc, mà thành quả to lớn trong sự nghiệp tổ chức xây dựng hoạt động hơn 30 năm
thành lập của BCH họ Trần Việt Nam! &nbsp;Sự kết
nối hoạt động tạo dựng của họ Trần Thủ Đô Hà Nội.chính là sự đoàn kết gắn bó
củng cố niềm tin trong dòng họ, là nhân tố hàng đầu trong mọi thắng lợi.<o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#080809;mso-font-kerning:0pt;mso-ligatures:none">Với
tinh thần đó, tin tưởng rằng những thành quả hoạt động trong nhiều năm xây dựng
kết nối hoạt động dòng họ với sự nhiệt tình và trách nhiệm tận tâm, tận lực của
BCH họ Trần Hà Nội, với sự phù hộ của các liệt tổ, liệt tông trong mọi hoạt
động của họ Trần Hà Nội, đại hội nhiệm kỳ lần thứ ba này sẽ thành công và có
nhiều triển vọng thuận lợi trong kết nối hoạt động mẫu mực về mọi mặt, để họ
Trần Hà Nội luôn là trái tim của cả nước, xứng đáng là tấm gương để chi nhánh họ
Trần mọi miền học tập và noi theo!<o:p></o:p></span></p><p>

















</p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><font color="#080809" size="2">Tin từ Lượng Trần- Trang FB Thông tin họ Trần Việt Nam</font></p>', 'VĂN HÓA DÒNG HỌ', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/covers/1784887030974-0dbb0c75-5d43-4e40-84ba-f6b8830b99d6-thong-bao.webp', 'system/covers/1784887030974-0dbb0c75-5d43-4e40-84ba-f6b8830b99d6-thong-bao.webp', true, 'published', 'public', '2026-07-24T16:57:11.724+07:00', NULL, '2026-07-24T16:57:11.956911+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('506aec6e-74f0-4b27-93dd-ec279dd183e3', 'system', NULL, 'BÍ ÂN 2 NGÔI MỘ GIÓ CHÙA PHÚC LÂM', 'bi-an-2-ngoi-mo-gio', '2 Mộ gió đều có dạng trụ vuông, giật cấp, nắp chóp thấp, phủ rêu phong cổ Kính', '<p><br></p>', 'VĂN HÓA DÒNG HỌ', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/covers/1784948789942-59ce86b9-d4e4-4311-93ca-0968dc87d2d7-bi-an-2-ngoi-mo-gio.webp', 'system/covers/1784948789942-59ce86b9-d4e4-4311-93ca-0968dc87d2d7-bi-an-2-ngoi-mo-gio.webp', true, 'published', 'public', '2026-07-25T10:06:30.649+07:00', NULL, '2026-07-25T10:06:31.396002+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('55ad5ada-4e56-4ff6-86ec-93b4af667b4a', 'system', NULL, 'TS. BÙI HẢI HƯNG- NGƯỜI ĐƯA  TRÍ TUỆ VIỆT LÊN BẢN ĐÔ AI THẾ GIỚI', 'ts-bui-hai-hung-nguoi-dua', 'Hiện nay, TS. Bùi Hải Hưng là Tổng giám đốc Công ty Cổ phần Nghiên cứu và Ứng dụng Trí tuệ nhân tạo VinAI', '<p class="MsoNormal"><span style="font-size: 16pt; line-height: 135%; color: rgb(51, 51, 51); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Tiến sĩ Bùi Hải Hưng, sinh
năm 1973, là Viện trưởng Viện Trí tuệ Nhân tạo VinAI Research, là người từng đoạt
Huy chương bạc Olympic Toán quốc tế 1989 cùng GS Ngô Bảo Châu. Ông lấy bằng tiến
sĩ ngành khoa học máy tính tại Úc năm 25 tuổi, giảng dạy tại các đại học danh
tiếng như Curtin và Monash. Với chuyên môn sâu về học máy, suy luận xác suất và
hiểu ngôn ngữ tự nhiên, ông có gần 90 công trình nghiên cứu và 3 bằng sáng chế
tại Mỹ. Từng làm việc tại Apple, Adobe Research, Google DeepMind và dẫn dắt
nhóm phát triển công nghệ cho Siri và dự án CALO, ông được xem là nhà sáng chế
hàng đầu trong lĩnh vực AI.</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><b><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Lấy
bằng tiến sĩ năm 25 tuổi, giảng dạy nhiều trường ĐH hàng đầu</span></b></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Ông
Bùi Hải Hưng, sinh năm 1973, từng học Đại học Tổng hợp Hà Nội.</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Năm
1989, ông tham dự kì thi Olympic Toán quốc tế cùng giáo sư Ngô Bảo Châu và
giành được Huy chương bạc.</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Năm 21
tuổi, ông Bùi Hải Hưng bắt đầu học tại trường Đại học Curtin (Úc). Chỉ trong
vòng 4 năm, từ năm 1994-1998, ông đã lấy được bằng cử nhân và sau đó là tiến sĩ
về khoa học máy tính tại đại học nước ngoài khi chỉ mới 25 tuổi.</span><span style="color: rgb(51, 51, 51); font-size: 16pt;">Sau
khi tốt nghiệp Đại học Curtin, TS Bùi Hải Hưng ở lại trường làm giảng viên từ
năm 2000 – 2003. Ba năm làm giảng viên (trợ lý giáo sư) khoa học máy tính tại
đại học Curtin, ông cũng được mời làm giảng dạy một số môn về trí tuệ nhân tạo,
toán học rời rạc, giao tiếp máy tính tại một số trường đại học, trong đó có Đại
học Monash (Úc).</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Không
chỉ tham gia giảng dạy các nội dung cơ bản, TS Bùi Hải Hưng còn hướng dẫn,
nghiên cứu các chủ đề nâng cao trong trí tuệ nhân tạo như mô hình đồ họa, mạng
thần kinh, mô hình đồ họa xác suất và học máy…</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Từ năm
2003, ông trở thành nhà khoa học máy tính, sau đó có gần 10 năm nghiên cứu tại
trung tâm trí tuệ nhân tạo SRI International (viện nghiên cứu Stanford), công
viên Menlo, CA, Mỹ.</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Đồng
thời, ông cũng là người chỉ đạo về kĩ thuật trong suy luận xác suất, một dự án
học máy của Cơ quan Chỉ đạo các Dự án nghiên cứu quốc phòng tiên tiến (DARPA),
thuộc Bộ Quốc phòng Mĩ. Phạm vi nghiên cứu ông Hưng đảm nhận là suy luận xác
suất và mô hình xác suất để hiểu ngôn ngữ tự nhiên.</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">&nbsp;Từ năm 2012 – 2014, ông phụ trách cao cấp nghiên cứu về việc hiểu ngôn ngữ
tự nhiên tại Nuance Comunications, Sunnyvale, CA, Mỹ.<o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">&nbsp;</span><span style="color: rgb(51, 51, 51); font-size: 16pt;">Lĩnh
vực nghiên cứu của ông quay quanh các vấn đề đầy thách thức, về cách làm sao cho
máy có thể hiểu hơn về con người, đây là vấn đề cốt yếu của các công nghệ hỗ
trợ thông minh, hỗ trợ cá nhân và quản lý đối thoại.</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Tại
trung tâm AI, SRI International, ông đứng đầu một nhóm nghiên cứu đa tổ chức
phát triển các công nghệ suy luận xác suất để hiểu được các hoạt động của người
dùng trong dự án CALO (dự án tách ra khỏi Siri).</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none"></span></p><figure class="blog-inline-image"><img src="https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/inline/1784888518879-cc93462f-8978-4c85-bcaa-5e642691cdff.webp" alt="1555553135343-tien-si-bui-hai-hung-la-ai-vi-sao-tien-si-hung-bo-google-ve-viet-nam-lam-viec-bb-baaacz1Ogi.jpg"></figure><p></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:18.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Trong
quãng thời gian làm việc này, tiến sĩ Hưng đã có đóng góp trong gần 90 công
trình bao gồm sách, các bài báo, luận văn, báo cáo kỹ thuật về các vấn đề Ai và
khoa học máy tính.</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:18.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Ông
được cấp 3 bằng sáng chế tại Mỹ vào các năm 2014, 2016 và 2018 về các ứng dụng
hỗ trợ người dùng trên thiết bị di động và hơn chục công trình đang chờ cấp
phép.<o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:16.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">&nbsp;</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><b><span style="font-size:18.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Chuyên
gia từ Apple, Adobe, Google DeepMind</span></b></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:18.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Ngoài
hoạt động nghiên cứu, giảng dạy tại các trường đại học, TS Bùi Hải Hưng còn làm
việc cho các công ty công nghệ hàng đầu thế giới ở mảng nghiên cứu, phát triển
về trí tuệ nhân tạo theo chuyên môn.</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:18.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">TS Bùi
Hải Hưng đã tham gia phát triển công cụ trợ lí ảo đầu tiên Siri trong iPhone
của Apple.</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:18.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Ông
cũng dẫn đầu một nhóm các nhà nghiên cứu đến từ nhiều trường đại học lớn như
Stanford, MIT và Berkeley để phát triển công nghệ nhận diện hành vi của con
người. Công nghệ này thuộc dự án được đánh giá là lớn nhất về trí tuệ nhân tạo
ở thời điểm đó - dự án Calo.</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:18.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none"></span></p><figure class="blog-inline-image"><img src="https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/inline/1784889092853-f83de0bc-2d01-475f-91c2-1d34c0053d4e.webp" alt="490385283_1177095184427214_7193817311019419437_n.jpg"></figure><p></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:18.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Sau
các dự án này, cuối năm 2014 đến đầu năm 2018, ông chuyển sang làm việc tại
Adobe Research với vị trí chuyên gia máy học và bắt đầu làm việc tại Google
DeepMind vào tháng 1/2018- một trong những đơn vị dẫn đầu thế giới về trí tuệ
nhân tạo, với những dự án táo bạo tưởng chừng không thể thực hiện được như xe
tự lái, kính Google… góp phần thay đổi cuộc sống con người.<o:p></o:p></span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:18.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Ông
làm việc với vị trí nghiên cứu cấp cao và được đánh giá là nhà sáng chế trí tuệ
nhân tạo tại Google.</span></p><p class="MsoNormal" style="margin-bottom: 0cm; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:18.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;;mso-bidi-font-family:
&quot;Times New Roman&quot;;color:#333333;mso-font-kerning:0pt;mso-ligatures:none">Tại
đây, TS Hưng có gần 100 công trình nghiên cứu khoa học được công bố trên các
tạp chí chuyên môn và hơn 10 bằng sáng chế về công nghệ được đánh giá cao tại
Mỹ.</span></p><p class="MsoNormal"><span style="font-size:18.0pt;line-height:135%;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-bidi-font-family:&quot;Times New Roman&quot;;color:#333333;
mso-font-kerning:0pt;mso-ligatures:none">Hiện nay, </span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">TS. Bùi H</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ả</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">i H</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ư</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ng là T</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ổ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ng giám </span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">đố</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">c Công ty C</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ổ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"> ph</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ầ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">n Nghiên c</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ứ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">u và </span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Ứ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ng d</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ụ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ng Trí tu</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ệ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"> nhân t</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ạ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">o VinAI, thu</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ộ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">c t</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ậ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">p </span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">đ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">oàn Vingroup (Vi</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ệ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">t
Nam) của</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">&nbsp;tỷ phú Phạm Nhật Vượng</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">. D</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ướ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">i s</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ự</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"> lãnh </span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">đạ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">o t</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ậ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">n tâm c</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ủ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">a ông, ch</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ỉ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"> trong vòng ch</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ư</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">a </span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">đầ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">y b</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ố</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">n n</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ă</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">m k</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ể</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"> t</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ừ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"> khi thành l</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ậ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">p, VinAI </span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">đ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ã tr</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ở</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"> thành m</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ộ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">t trong 20 công ty nghiên c</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ứ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">u Trí tu</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ệ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"> Nhân t</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ạ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">o hàng </span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">đầ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">u th</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ế</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"> gi</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ớ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">i - </span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">đạ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">i di</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ệ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">n duy nh</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ấ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">t t</span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ừ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"> </span><span style="font-size: 16pt; line-height: 135%; font-family: Calibri, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Đ</span><span style="font-size: 16pt; line-height: 135%; font-family: &quot;Segoe UI Historic&quot;, sans-serif; color: rgb(8, 8, 9); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">ông Nam Á. <o:p></o:p></span></p><p>

























































































</p><p class="MsoNormal"><span style="font-size: 10.5pt; line-height: 135%; font-family: Roboto; color: rgb(51, 51, 51); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Tổng hợp từ vietnambiz.vn
&amp; vietnammoi.vn</span><o:p></o:p></p>', 'VĂN HÓA DÒNG HỌ', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/covers/1784889123273-8f8b751c-da94-402d-8cf2-d03b6a741c66-ts-bui-hai-hung-nguoi-dua.webp', 'system/covers/1784889123273-8f8b751c-da94-402d-8cf2-d03b6a741c66-ts-bui-hai-hung-nguoi-dua.webp', true, 'published', 'public', '2026-07-24T17:32:04.06+07:00', NULL, '2026-07-24T17:32:04.903141+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('a5e34eb7-cebc-4c71-b76e-d277d6a98193', 'system', NULL, 'NHÀ THỜ CỔ HỌ DƯƠNG CẦN THƠ', 'tu-duong-ho-duong-can-tho-nha-binh-thuy-hon-100-nam-tuoi', 'Đây là một trong những ngôi nhà cổ hiếm hoi tại miền Tây Nam Bộ vẫn giữ được vẻ đẹp và sự vững chãi qua thời gian', '<p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size: 13.5pt; font-family: Arial, sans-serif; color: rgb(34, 34, 34); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Tọa lạc tại số 142–144 Bùi Hữu Nghĩa, phường Bình Thủy, quận
Bình Thủy, thành phố Cần Thơ, Nhà thờ họ Dương là một công trình cổ kính hơn
trăm năm tuổi, được xây dựng vào cuối thế kỷ XIX và hoàn tất vào những năm đầu
thế kỷ XX.&nbsp;</span></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size: 13.5pt; font-family: Arial, sans-serif; color: rgb(34, 34, 34); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Là một công trình kiến trúc nổi bật, Nhà thờ họ Dương trở thành
bối cảnh của nhiều bộ phim nổi tiếng trong và ngoài nước như: Những nẻo đường
phù sa, Chân trời nơi ấy, Người đẹp Tây Đô, Con nhà nghèo, đặc biệt là bộ phim
Người tình (L''amant) - một tác phẩm nổi tiếng của Pháp dựa trên tiểu thuyết
cùng tên, đã được dịch ra 43 thứ tiếng.&nbsp;</span><o:p></o:p></p><p class="MsoNormal" align="left" style="line-height: normal;"><figure class="blog-inline-image"><img src="https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/inline/1784885747210-7f3ad1ac-f3e1-4dc8-8c45-71eae1488f5c.webp" alt="Ngôi nhà từng được lấy bối cảnh trong bộ phim Người Tình của Pháp..jpg"><figcaption>Ngôi nhà từng được lấy làm bối cảnh bộ phim "Người Tình" của Pháp</figcaption></figure></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="color: rgb(34, 34, 34); font-family: Arial, sans-serif; font-size: 13.5pt;">Được xây dựng bởi ông Dương Chấn Kỷ (1880–1950)-&nbsp; một thương
gia trí thức và điền chủ giàu có, Nhà thờ họ Dương mang đậm dấu ấn của sự giao
thoa văn hóa Đông - Tây.&nbsp;</span></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="color: rgb(34, 34, 34); font-family: Arial, sans-serif; font-size: 13.5pt;">Kiến trúc ngôi nhà là sự kết hợp hài hòa giữa các yếu
tố truyền thống của phương Đông và các yếu tố hiện đại của phương Tây thời bấy
giờ. Công trình này được xây dựng theo kiểu "nội ứng ngoại hợp" với
phần bên trong mang đậm ảnh hưởng của mỹ thuật truyền thống Việt Nam, trong khi
mặt ngoài lại phản ánh các yếu tố kiến trúc Tây phương.</span></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="color: rgb(34, 34, 34); font-family: Arial, sans-serif; font-size: 13.5pt;"><figure class="blog-inline-image"><img src="https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/inline/1784885840350-8e5119aa-bc8c-4c4f-b03e-6b28e47014ed.webp" alt="cdn1z.reatimes.vn-652356615132086272-2025-4-22-_d25105c0528ebbd0e29fjpgavif-17453386289791908856323.jpg"></figure></span></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size: 13.5pt; font-family: Arial, sans-serif; color: rgb(34, 34, 34); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Nhà thờ họ Dương được thiết kế với 4cầu thang dẫn lên nhà
chính, trong đó hai cầu thang dẫn vào hai gian ngoài cùng và hai cầu thang hình
cánh cung uốn lượn dẫn vào gian giữa. Phần cửa gỗ lá sách, theo phong cách
Pháp, mang đến cảm giác tinh tế và sang trọng, đặc biệt với các hoa văn dây lá
nho và hình con sóc bằng xi măng.</span></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size: 13.5pt; font-family: Arial, sans-serif; color: rgb(34, 34, 34); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><figure class="blog-inline-image"><img src="https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/inline/1784885877242-a72e2c8f-d35b-43b8-b971-6e0c9848acae.webp" alt="cdn1z.reatimes.vn-652356615132086272-2025-4-22-_hinh-bai-tin-bhx-2024-10-08t1510-17453387734901321379620.jpg"></figure></span></p><p style="margin: 0cm 0cm 12pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:13.5pt;font-family:&quot;Arial&quot;,sans-serif;
color:#222222">Bên n</span><span style="color: rgb(34, 34, 34); font-family: Arial, sans-serif; font-size: 13.5pt;">goài của ngôi nhà là vườn cây ăn trái và hoa kiểng xanh
tốt, bao quanh không gian, mang lại một không khí mát mẻ và bình dị nhưng cũng
rất tao nhã. Đặc biệt, vào thời kỳ trước, ngôi nhà được gọi là "Vườn lan
Bình Thủy", nhờ vào niềm đam mê hoa lan của ông Dương Văn Ngôn, hậu duệ
đời thứ 5 của dòng họ Dương.</span></p><p style="margin: 0cm 0cm 12pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="color: rgb(34, 34, 34); font-family: Arial, sans-serif; font-size: 13.5pt;"><figure class="blog-inline-image"><img src="https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/inline/1784885914694-789fa229-1d04-435c-9c2e-92029443d6e0.webp" alt="cdn1z.reatimes.vn-652356615132086272-2025-4-22-_photo0jpg-1745338629711328857565.jpg"></figure></span></p><p style="margin: 0cm 0cm 12pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; outline: none;"><span style="font-size:13.5pt;font-family:&quot;Arial&quot;,sans-serif;
color:#222222">Một điểm đặc biệt nữa là bộ khung của ngôi nhà được làm từ 24
cột tròn bằng gỗ căm xe, cà chít - là loại gốc được ếp vào hàng quý hiếm. Các
cột gỗ này cao từ 4-6m, đặt trên các bệ đá tảng cổ bồng, tạo nên sự vững chãi
cho công trình. Hệ thống vì kèo truyền thống theo cấu trúc Nam Bộ cũng đóng vai
trò quan trọng trong việc tạo nên nét đặc sắc cho ngôi nhà.<o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size: 13.5pt; font-family: Arial, sans-serif; color: rgb(34, 34, 34); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">&nbsp;<figure class="blog-inline-image"><img src="https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/inline/1784885968134-39a5ddda-af6c-441b-b2e1-4f01cac5a283.webp" alt="cdn1z.reatimes.vn-652356615132086272-2025-4-22-_nha-co-binh-thuy-1-17453387186991763586833.jpg"></figure></span></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size: 13.5pt; font-family: Arial, sans-serif; color: rgb(34, 34, 34); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Ngoài ra, phong cách trang trí tinh tế trong từng không gian
trong nhà. Các phòng trong nhà được bài trí theo phong cách Tây Âu, với những
món đồ cổ quý giá như bộ bàn ghế Louis XV, chậu rửa men sứ trắng hoa xanh, và một
máy hát đĩa của Pháp. Nhà thờ họ Dương hiện là một trong những điểm đến thu hút
du khách và các nhà nghiên cứu, không chỉ vì kiến trúc độc đáo mà còn vì sự lưu
giữ những giá trị văn hóa đặc biệt qua các cổ vật quý hiếm.</span><o:p></o:p></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size: 13.5pt; font-family: Arial, sans-serif; color: rgb(34, 34, 34); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">&nbsp;<figure class="blog-inline-image"><img src="https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/inline/1784886010184-abdfef72-5aa8-40e2-a199-a128895ad423.webp" alt="cdn1z.reatimes.vn-652356615132086272-2025-4-22-_54ed827cd5323c6c6523jpgavif-1745338628806226733632.jpg"></figure></span></p><p style="margin: 0cm 0cm 12pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:13.5pt;font-family:&quot;Arial&quot;,sans-serif;
color:#222222">Với những giá trị về kiến trúc và văn hóa, Nhà thờ họ Dương đã
được Bộ Văn hóa, Thể thao và Du lịch công nhận là Di tích kiến trúc nghệ thuật
cấp Quốc gia. Ngôi nhà vẫn là một biểu tượng của sự giao thoa văn hóa, một
chứng nhân lịch sử của vùng đất Cần Thơ, thu hút sự chú ý của du khách và những
người yêu thích tìm hiểu về di sản văn hóa của miền Tây Nam Bộ.<o:p></o:p></span></p><p style="margin: 0cm 0cm 12pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><span style="font-size:13.5pt;font-family:&quot;Arial&quot;,sans-serif;
color:#222222"><figure class="blog-inline-image"><img src="https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/inline/1784886050706-8f12e551-e00b-431c-8917-915bc7e41bcb.webp" alt="cdn1z.reatimes.vn-652356615132086272-2025-4-22-_nhacobinhthuy-2-17453387738511415447803.jpg"></figure></span></p><p style="margin: 0cm 0cm 12pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; outline: none;"><span style="font-size:13.5pt;font-family:&quot;Arial&quot;,sans-serif;
color:#222222">Năm 2024, Từ đường Họ Dương- nhà Bình Thủy đã được bình chọn là
"Điểm đến du lịch hấp dẫn TP. HCM và 13 tỉnh, thành Đồng bằng sông Cửu
Long.<o:p></o:p></span></p><p style="margin: 0cm 0cm 12pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; outline: none;"><font color="#222222" face="Arial, sans-serif"><span style="font-size: 18px;">Nguồn: Internet</span></font></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size: 13.5pt; font-family: Arial, sans-serif; color: rgb(34, 34, 34); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">&nbsp;</span></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size: 13.5pt; font-family: Arial, sans-serif; color: rgb(34, 34, 34); background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">&nbsp;</span></p><p class="MsoNormal" align="left" style="line-height: normal;"><span style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:none">&nbsp;</span></p><p>































</p><p class="MsoNormal"><o:p>&nbsp;</o:p></p>', 'VĂN HÓA DÒNG HỌ', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/covers/1784886165450-4c4abdf2-7d39-43b5-8d56-0504df143f43-tu-duong-ho-duong-can-tho-nha-binh-thuy-hon-100-nam-tuoi.webp', 'system/covers/1784886165450-4c4abdf2-7d39-43b5-8d56-0504df143f43-tu-duong-ho-duong-can-tho-nha-binh-thuy-hon-100-nam-tuoi.webp', true, 'published', 'public', '2026-07-25T10:19:02.815+07:00', NULL, '2026-07-24T16:42:47.300119+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('5aeda94b-0c2d-41a8-aeaf-e2df5cd7eb4b', 'system', NULL, 'Nền tảng Gia phả Dòng họ giaphadongho.com được nhiều dòng họ chọn thay thế gia phả giấy', 'nen-tang-gia-pha-dong-ho-giaphadongho-com-duoc-nhieu-dong-ho-chon-thay-the-gia-pha-giay', NULL, '<p class="MsoNormal" align="left" style="line-height: normal;"><a href="https://www.giaphadongho.com/" target="_blank"><span style="font-size:
12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
color:blue;mso-font-kerning:0pt;mso-ligatures:none">giaphadongho.com</span></a><b><span style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:none"> là nền tảng gia phả
số-gia phả trực tuyến tại Việt Nam</span></b><span style="font-size:12.0pt;
font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-font-kerning:0pt;mso-ligatures:none">, được phát triển bởi </span><a href="https://www.giaphadongho.com/login" target="_blank"><span style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;color:blue;mso-font-kerning:0pt;mso-ligatures:none">Viện Di
sản Văn hóa Các Dòng họ Việt Nam</span></a><span style="font-size:12.0pt;
font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
mso-font-kerning:0pt;mso-ligatures:none">. Nền tảng gia phả số này cung cấp
giải pháp số hóa toàn diện giúp các dòng tộc lưu giữ, quản lý và truyền thừa
thông tin phả hệ từ dạng giấy truyền thống lên không gian mạng. <o:p></o:p></span></p><p class="MsoNormal" align="left" style="line-height: normal;"><b><span style="font-size:15.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:
&quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:none">Các tính năng và đặc
điểm nổi bật<o:p></o:p></span></b></p><p>



</p><ul style="margin-top:0cm" type="disc">
 <li class="MsoNormal" style="margin-bottom: 0cm; line-height: normal;"><b><span style="font-size:
     12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
     mso-font-kerning:0pt;mso-ligatures:none">Không gian quản trị riêng biệt</span></b><span style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:
     &quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:none">: Ứng dụng mô
     hình hệ thống hiện đại, mỗi dòng họ khi đăng ký sẽ sở hữu một không gian
     độc lập với cây gia phả, danh sách thành viên, sự kiện và tài liệu riêng. <o:p></o:p></span></li>
 <li class="MsoNormal" style="margin-bottom: 0cm; line-height: normal;"><b><span style="font-size:
     12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
     mso-font-kerning:0pt;mso-ligatures:none">Phả đồ trực quan</span></b><span style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:
     &quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:none">: Cho phép xây
     dựng cây gia phả nhiều đời, kết nối các thế hệ giúp con cháu dễ dàng theo
     dõi diện mạo, vai vế, thứ bậc và cuộc đời của từng người trong dòng tộc
     qua màn hình thiết bị. <o:p></o:p></span></li>
 <li class="MsoNormal" style="margin-bottom: 0cm; line-height: normal;"><b><span style="font-size:
     12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
     mso-font-kerning:0pt;mso-ligatures:none">Bảo mật và riêng tư</span></b><span style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:
     &quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:none">: Hệ thống phân
     quyền chặt chẽ (giữa Super Admin và Admin dòng họ); dữ liệu mang tính nội
     bộ cao, chỉ những thành viên được duyệt mới có quyền truy cập và xem thông
     tin. <o:p></o:p></span></li>
 <li class="MsoNormal" style="margin-bottom: 0cm; line-height: normal;"><b><span style="font-size:
     12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
     mso-font-kerning:0pt;mso-ligatures:none">Lưu trữ đa phương tiện</span></b><span style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:
     &quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:none">: Nơi lưu giữ
     trọn vẹn chân dung, hình ảnh, video và những thước phim kỷ niệm vô giá của
     gia đình qua các mốc thời gian. <o:p></o:p></span></li>
 <li class="MsoNormal" style="margin-bottom: 0cm; line-height: normal;"><b><span style="font-size:
     12.0pt;font-family:&quot;Arial&quot;,sans-serif;mso-fareast-font-family:&quot;Times New Roman&quot;;
     mso-font-kerning:0pt;mso-ligatures:none">Giải quyết hạn chế của gia phả
     giấy</span></b><span style="font-size:12.0pt;font-family:&quot;Arial&quot;,sans-serif;
     mso-fareast-font-family:&quot;Times New Roman&quot;;mso-font-kerning:0pt;mso-ligatures:
     none">: Khắc phục triệt để tình trạng tài liệu giấy bị ẩm mốc, mối mọt,
     rách hỏng theo năm tháng hoặc khó cập nhật khi có thành viên mới.&nbsp;</span><o:p></o:p></li>
</ul>', 'VĂN HÓA DÒNG HỌ', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/covers/1786694507366-6aa5c287-f96a-40aa-a325-861fcd6acccd-nen-tang-gia-pha-dong-ho-giaphadongho-com-duoc-nhieu-dong-ho-chon-thay-the-gia-pha-giay.webp', 'system/covers/1786694507366-6aa5c287-f96a-40aa-a325-861fcd6acccd-nen-tang-gia-pha-dong-ho-giaphadongho-com-duoc-nhieu-dong-ho-chon-thay-the-gia-pha-giay.webp', true, 'published', 'public', '2026-08-14T15:01:48.112+07:00', NULL, '2026-08-14T15:01:48.905259+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('cfc2b90e-fa29-406b-8dda-df6dfdc6ce91', 'system', NULL, 'ĐĂNG KÝ GIAPHADONGHO.COM TẠI ĐÂY', 'dang-ky-cay-gia-pha-truc-tuyen-manh-me-hien-dai-bao-mat-tai-day', '“Nước có sử, nhà có phả” - Gia phả chính là hồn cốt dòng họ, giaphadongho.com kết nối các thế hệ với cội nguồn,', '<div class="xdj266r x14z9mp xat24cr x1lziwak x1vvkbs x126k92a" style="white-space: pre-wrap; margin-inline: 0px; overflow-wrap: break-word; font-family: &quot;Segoe UI Historic&quot;, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif; color: rgb(8, 8, 9); font-size: 14px; animation-name: none !important; transition-property: none !important;"><div dir="auto" style="font-family: inherit; animation-name: none !important; transition-property: none !important;"><br></div></div><div class="x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a" style="white-space: pre-wrap; margin-inline: 0px; overflow-wrap: break-word; margin-top: 0.5em; font-family: &quot;Segoe UI Historic&quot;, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif; color: rgb(8, 8, 9); font-size: 14px; animation-name: none !important; transition-property: none !important;"><div dir="auto" style="font-family: inherit; animation-name: none !important; transition-property: none !important;"><span class="html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od" style="text-align: inherit; padding-inline: 0px; margin-inline: 1px; overflow-wrap: break-word; display: inline-flex; vertical-align: middle; width: 16px; height: 16px; font-family: inherit; animation-name: none !important; transition-property: none !important;"><img height="16" width="16" class="xz74otr x15mokao x1ga7v0g x16uus16 xbiv7yw" alt="❤️" referrerpolicy="origin-when-cross-origin" src="https://static.xx.fbcdn.net/images/emoji.php/v9/t6c/1/16/2764.png" style="border-style: none; border-start-start-radius: 0px; border-end-end-radius: 0px; border-start-end-radius: 0px; border-end-start-radius: 0px; object-fit: fill; animation-name: none !important; transition-property: none !important;"></span>Mục tiêu: Mỗi dòng họ 1 phả số riêng tư, hiện đại và bảo mật, Viện Khoa học Phát huy Truyền thống Di sản văn hoá Các Dòng họ Việt Nam cùng các cộng sự sử dụng khoa học &amp; công nghệ phụng sự các giá trị truyền thống. Nền tảng gia phả trực tuyến <span class="html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs" style="margin-inline: 0px; text-align: inherit; padding-inline: 0px; overflow-wrap: break-word; font-family: inherit; animation-name: none !important; transition-property: none !important;"><a class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj x1fey0fg x1s688f" href="https://l.facebook.com/l.php?u=http%3A%2F%2Fgiaphadongho.com%2F%3Ffbclid%3DIwcGRvZgVleHRuA2FlbQIxMABicmlkETF0VlpWOVpLNWpiNDJ4bElXc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHkRURIpselnZzzX59MAZy3vKwh9tmzoTV1pXWiZTjXIar_2H7X4quDkQ8u3N_aem_NeDL3geKv6t2vOsmEymQqQ&amp;h=AUDjLuarHo3eHVZ3cxF8NsbB9qg7p0i2mGVuqRQOanaCd5Uqo3aht-5VVcfjzjUfqXOxRE8jIAcOnio6Y3DPhXYmGpTRQs1VGgvokEgkQqUygXP7symv-FEgk0_4gMRqUzKLyOVKsND8ANvkIz7gntBznXU_3iA_&amp;__tn__=-UK-R&amp;c[0]=AUDv071FXPiMQVYpg0ph1hRUjwtZnEKwWVby5_VXpdf61bTF2loaAvE0GbqD-JQnMFhDxyjVhJDZsXxYaUEfyA4qNl7al3H3eB3EVgJvjw6N96X1iNE5A9KxPFBxjgp3CTx_2GxW5GAseQGTKEn0lZwHUaGYZBPpF92Jr-JTOK4XzD8bq_dNTqhOM0_mzqzw&amp;c[1]=AUALYL5XDtyVF-KWTxRQMX2IdxKIbn9hkHBMmKFQr41Qe5w6W3d6LBrlyUB2syQ83sDLMdES27LwvaHR0pip-naJtA_ZBTJxVoflXQQiHmdLLC72M2DI665_QzpEXQ2OZYkOBr6L3d8t7D0WBPejMk1HYL_CMl2OycMcGJlChkyPqP90ldvvmtdARr9IMYII" rel="nofollow noreferrer" role="link" tabindex="0" target="_blank" style="color: rgb(0, 100, 209); text-decoration: none; outline: none; border-inline-width: 0px; margin-inline: 0px; text-align: inherit; border-inline-style: none; padding-inline: 0px; -webkit-tap-highlight-color: transparent; list-style-type: none; touch-action: manipulation; background-color: transparent; display: inline; border-top-style: none; border-bottom-style: none; font-family: inherit; animation-name: none !important; transition-property: none !important;">giaphadongho.com</a></span> phục vụ việc bảo tồn và phát huy gia phả dòng họ- di sản truyền cho muôn đời kế thừa.</div></div><div class="x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a" style="white-space: pre-wrap; margin-inline: 0px; overflow-wrap: break-word; margin-top: 0.5em; font-family: &quot;Segoe UI Historic&quot;, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif; color: rgb(8, 8, 9); font-size: 14px; animation-name: none !important; transition-property: none !important;"><div dir="auto" style="font-family: inherit; animation-name: none !important; transition-property: none !important;"><span class="html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od" style="text-align: inherit; padding-inline: 0px; margin-inline: 1px; overflow-wrap: break-word; display: inline-flex; vertical-align: middle; width: 16px; height: 16px; font-family: inherit; animation-name: none !important; transition-property: none !important;"><img height="16" width="16" class="xz74otr x15mokao x1ga7v0g x16uus16 xbiv7yw" alt="☘️" referrerpolicy="origin-when-cross-origin" src="https://static.xx.fbcdn.net/images/emoji.php/v9/t14/1/16/2618.png" style="border-style: none; border-start-start-radius: 0px; border-end-end-radius: 0px; border-start-end-radius: 0px; border-end-start-radius: 0px; object-fit: fill; animation-name: none !important; transition-property: none !important;"></span><span class="html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs" style="margin-inline: 0px; text-align: inherit; padding-inline: 0px; overflow-wrap: break-word; font-family: inherit; animation-name: none !important; transition-property: none !important;"><a class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj x1fey0fg x1s688f" href="http://giaphadongho.com/?fbclid=IwcGRvZgVleHRuA2FlbQIxMABicmlkETF0VlpWOVpLNWpiNDJ4bElXc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHh9-dHP3uxiKzRIqqI7gutvIQ4b5_i8QRONU6fzBIOQf1QuH3dxSRMEf_-rI_aem_3oo0Qu7zTkgzMNXiek7nGA" rel="nofollow noreferrer" role="link" tabindex="0" target="_blank" style="color: rgb(0, 100, 209); text-decoration: none; outline: none; border-inline-width: 0px; margin-inline: 0px; text-align: inherit; border-inline-style: none; padding-inline: 0px; -webkit-tap-highlight-color: transparent; list-style-type: none; touch-action: manipulation; background-color: transparent; display: inline; border-top-style: none; border-bottom-style: none; font-family: inherit; animation-name: none !important; transition-property: none !important;">giaphadongho.com</a></span> đáp ứng các tính năng hiện đại &amp; bảo mật, phù hợp với văn hóa truyền thống Việt Nam, sử dụng lại đơn giản dễ dàng ngay cả với người cao tuổi hay những người không rành công nghệ . Để đạt được điều đó, là 1 quá trình nghiên cứu, phát triển bên bỉ . </div></div><div class="x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a" style="white-space: pre-wrap; margin-inline: 0px; overflow-wrap: break-word; margin-top: 0.5em; font-family: &quot;Segoe UI Historic&quot;, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif; color: rgb(8, 8, 9); font-size: 14px; animation-name: none !important; transition-property: none !important;"><div dir="auto" style="font-family: inherit; animation-name: none !important; transition-property: none !important;"><span class="html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs" style="margin-inline: 0px; text-align: inherit; padding-inline: 0px; overflow-wrap: break-word; font-family: inherit; animation-name: none !important; transition-property: none !important;"><a class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj x1fey0fg x1s688f" href="http://giaphadongho.com/?fbclid=IwcGRvZgVleHRuA2FlbQIxMABicmlkETF0VlpWOVpLNWpiNDJ4bElXc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHuSmgjDbGxLP7MFEeU0HdHoEn-LbzMVnXK2HSbkOki_5xwsUR3CdymMyV5mn_aem_gF7OLXtCpyGgdsm1SuHYGQ" rel="nofollow noreferrer" role="link" tabindex="0" target="_blank" style="color: rgb(0, 100, 209); text-decoration: none; outline: none; border-inline-width: 0px; margin-inline: 0px; text-align: inherit; border-inline-style: none; padding-inline: 0px; -webkit-tap-highlight-color: transparent; list-style-type: none; touch-action: manipulation; background-color: transparent; display: inline; border-top-style: none; border-bottom-style: none; font-family: inherit; animation-name: none !important; transition-property: none !important;">Giaphadongho.com</a></span> là nền tảng gia phả dòng họ đại chúng, dành cho tất cả các dòng họ trên cả nước, mỗi dòng họ 1 không gian gia phả riêng bảo mật , chỉ các thành viên dòng họ mới nhìn thấy.</div></div><div class="x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a" style="white-space: pre-wrap; margin-inline: 0px; overflow-wrap: break-word; margin-top: 0.5em; font-family: &quot;Segoe UI Historic&quot;, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif; color: rgb(8, 8, 9); font-size: 14px; animation-name: none !important; transition-property: none !important;"><div dir="auto" style="font-family: inherit; animation-name: none !important; transition-property: none !important;"><span class="html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od" style="text-align: inherit; padding-inline: 0px; margin-inline: 1px; overflow-wrap: break-word; display: inline-flex; vertical-align: middle; width: 16px; height: 16px; font-family: inherit; animation-name: none !important; transition-property: none !important;"><img height="16" width="16" class="xz74otr x15mokao x1ga7v0g x16uus16 xbiv7yw" alt="🌳" referrerpolicy="origin-when-cross-origin" src="https://static.xx.fbcdn.net/images/emoji.php/v9/t6b/1/16/1f333.png" style="border-style: none; border-start-start-radius: 0px; border-end-end-radius: 0px; border-start-end-radius: 0px; border-end-start-radius: 0px; object-fit: fill; animation-name: none !important; transition-property: none !important;"></span><span class="html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs" style="margin-inline: 0px; text-align: inherit; padding-inline: 0px; overflow-wrap: break-word; font-family: inherit; animation-name: none !important; transition-property: none !important;"><a class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj x1fey0fg x1s688f" href="http://giaphadongho.com/?fbclid=IwcGRvZgVleHRuA2FlbQIxMABicmlkETF0VlpWOVpLNWpiNDJ4bElXc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHuSmgjDbGxLP7MFEeU0HdHoEn-LbzMVnXK2HSbkOki_5xwsUR3CdymMyV5mn_aem_gF7OLXtCpyGgdsm1SuHYGQ" rel="nofollow noreferrer" role="link" tabindex="0" target="_blank" style="color: rgb(0, 100, 209); text-decoration: none; outline: none; border-inline-width: 0px; margin-inline: 0px; text-align: inherit; border-inline-style: none; padding-inline: 0px; -webkit-tap-highlight-color: transparent; list-style-type: none; touch-action: manipulation; background-color: transparent; display: inline; border-top-style: none; border-bottom-style: none; font-family: inherit; animation-name: none !important; transition-property: none !important;">Giaphadongho.com</a></span> là 1 minh chứng thành công của ứng dụng khoa học công nghệ để bảo tồn di sản văn hóa truyền thống.</div></div><div class="x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a" style="white-space: pre-wrap; margin-inline: 0px; overflow-wrap: break-word; margin-top: 0.5em; font-family: &quot;Segoe UI Historic&quot;, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif; color: rgb(8, 8, 9); font-size: 14px; animation-name: none !important; transition-property: none !important;"><div dir="auto" style="font-family: inherit; animation-name: none !important; transition-property: none !important;"><span class="html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od" style="text-align: inherit; padding-inline: 0px; margin-inline: 1px; overflow-wrap: break-word; display: inline-flex; vertical-align: middle; width: 16px; height: 16px; font-family: inherit; animation-name: none !important; transition-property: none !important;"><img height="16" width="16" class="xz74otr x15mokao x1ga7v0g x16uus16 xbiv7yw" alt="👉" referrerpolicy="origin-when-cross-origin" src="https://static.xx.fbcdn.net/images/emoji.php/v9/t51/1/16/1f449.png" style="border-style: none; border-start-start-radius: 0px; border-end-end-radius: 0px; border-start-end-radius: 0px; border-end-start-radius: 0px; object-fit: fill; animation-name: none !important; transition-property: none !important;"></span>Liên hệ:Viện Khoa học Phát huy Truyền thống Di sản văn hoá Các Dòng họ Việt Nam để được tư vấn và khởi tạo gia phả trực tuyến tiện lợi, xem gia phả mọi lúc mọi nơi ngay từ hôm nay.</div></div><div class="x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a" style="white-space: pre-wrap; margin-inline: 0px; overflow-wrap: break-word; margin-top: 0.5em; font-family: &quot;Segoe UI Historic&quot;, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif; color: rgb(8, 8, 9); font-size: 14px; animation-name: none !important; transition-property: none !important;"><div dir="auto" style="font-family: inherit; animation-name: none !important; transition-property: none !important;">Email: viendisanvanhoacdh@gmail.com</div><div dir="auto" style="font-family: inherit; animation-name: none !important; transition-property: none !important;">Hotline: 0948612110</div><div dir="auto" style="font-family: inherit; animation-name: none !important; transition-property: none !important;">Đăng ký qua <span class="html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs" style="margin-inline: 0px; text-align: inherit; padding-inline: 0px; overflow-wrap: break-word; font-family: inherit; animation-name: none !important; transition-property: none !important;"><a class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj x1fey0fg x1s688f" href="https://bit.ly/dangkygiaphadongho?fbclid=IwcGRvZgVleHRuA2FlbQIxMABicmlkETF0VlpWOVpLNWpiNDJ4bElXc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHnm9YvycUzjZibbjD4MJimn_sxWgI_yw-FR0DcebaAriC9iKVKS-uB6HOoZp_aem_BlHz3WJvC2uDaAKsx_CZBQ" rel="nofollow noreferrer" role="link" tabindex="0" target="_blank" style="color: rgb(0, 100, 209); text-decoration: none; outline: none; border-inline-width: 0px; margin-inline: 0px; text-align: inherit; border-inline-style: none; padding-inline: 0px; -webkit-tap-highlight-color: transparent; list-style-type: none; touch-action: manipulation; background-color: transparent; display: inline; border-top-style: none; border-bottom-style: none; font-family: inherit; animation-name: none !important; transition-property: none !important;">https://bit.ly/dangkygiaphadongho</a></span> </div><div dir="auto" style="font-family: inherit; animation-name: none !important; transition-property: none !important;">để sở hữu cây gia phả trực tuyến mạnh mẽ, hiện đại &amp; Bảo mật ngay hôm nay trên nền tảng <span class="html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs" style="margin-inline: 0px; text-align: inherit; padding-inline: 0px; overflow-wrap: break-word; font-family: inherit; animation-name: none !important; transition-property: none !important;"><a class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj x1fey0fg x1s688f" href="http://giaphadongho.com/?fbclid=IwcGRvZgVleHRuA2FlbQIxMABicmlkETF0VlpWOVpLNWpiNDJ4bElXc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHnm9YvycUzjZibbjD4MJimn_sxWgI_yw-FR0DcebaAriC9iKVKS-uB6HOoZp_aem_BlHz3WJvC2uDaAKsx_CZBQ" rel="nofollow noreferrer" role="link" tabindex="0" target="_blank" style="color: rgb(0, 100, 209); text-decoration: none; outline: none; border-inline-width: 0px; margin-inline: 0px; text-align: inherit; border-inline-style: none; padding-inline: 0px; -webkit-tap-highlight-color: transparent; list-style-type: none; touch-action: manipulation; background-color: transparent; display: inline; border-top-style: none; border-bottom-style: none; font-family: inherit; animation-name: none !important; transition-property: none !important;">giaphadongho.com.</a></span></div></div>', 'VĂN HÓA DÒNG HỌ', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/covers/1790165597574-24ca455e-a1ff-4e08-b32d-8adef6d77b35-dang-ky-cay-gia-pha-truc-tuyen-manh-me-hien-dai-bao-mat-tai-day.webp', 'system/covers/1790165597574-24ca455e-a1ff-4e08-b32d-8adef6d77b35-dang-ky-cay-gia-pha-truc-tuyen-manh-me-hien-dai-bao-mat-tai-day.webp', true, 'published', 'public', '2026-08-21T09:15:32.901+07:00', NULL, '2026-08-21T09:15:33.15375+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts ("id", "scope", "family_id", "title", "slug", "excerpt", "content", "category", "cover_image_url", "cover_image_path", "is_published", "status", "visibility", "published_at", "author_id", "created_at", "updated_at") VALUES ('20e440c5-c8eb-4315-aeda-f4c986593cd0', 'system', NULL, 'Nhiều dòng họ lựa chọn giaphadongho.com thay thế gia phả giấy', 'nhieu-dong-ho-lua-chon-gipahdongho-com-thay-the-gia-pha-giay', 'Nền tảng gia phả số Giaphadongho.com sử dụng công nghệ số hiện đại & bảo mật. Giúp giữ gìn truyền thống và kết nối các thế hệ,', '<p><br></p><figure class="media-embed"><iframe src="https://www.youtube.com/embed/aYs4D9Dv5i4" title="Video" allowfullscreen=""></iframe></figure><p><br></p>', 'VĂN HÓA DÒNG HỌ', 'https://srsckyplvrwuweqbcegk.supabase.co/storage/v1/object/public/blog-images/system/covers/1786762572094-ad767337-5b39-4b81-b45b-34df9c666e51-nhieu-dong-ho-lua-chon-gipahdongho-com-thay-the-gia-pha-giay.webp', 'system/covers/1786762572094-ad767337-5b39-4b81-b45b-34df9c666e51-nhieu-dong-ho-lua-chon-gipahdongho-com-thay-the-gia-pha-giay.webp', true, 'published', 'public', '2026-08-15T09:56:12.752+07:00', NULL, '2026-08-15T09:56:12.937958+07:00', '2026-09-29T23:21:06.762569+07:00') ON CONFLICT (id) DO NOTHING;


COMMIT;
