#!/usr/bin/env node
/** Generate Path A (960×540pt) HTML slides for html2pptx. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, 'pptx-slides');
fs.mkdirSync(out, { recursive: true });

const css = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 960pt; height: 540pt; font-family: Arial, Helvetica, sans-serif; background: #FFFFFF; overflow: hidden; }
`;

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>${css}</style>
</head>
<body>
${body}
</body>
</html>
`;
}

const G = '#004d40';
const INK = '#111827';
const BODY = '#4B5568';
const BORDER = '#E5E7EB';
const SOFT = '#E6F2ED';
const MUTED = '#666666';

const header = (h, s) => `
<div style="position:absolute; top:28pt; left:36pt; width:888pt;">
  <h1 style="font-size:26pt; color:${INK}; font-weight:700;">${h}</h1>
  ${s ? `<p style="font-size:13pt; color:${BODY}; margin-top:8pt;">${s}</p>` : ''}
</div>`;

const card = (x, y, w, h, inner) => `
<div data-pptx-merge="true" style="position:absolute; top:${y}pt; left:${x}pt; width:${w}pt; height:${h}pt; background:#FFFFFF; border:1px solid ${BORDER}; border-radius:10pt; padding:16pt 18pt;">
${inner}
</div>`;

const h2 = (t, c = INK) => `<h2 style="font-size:15pt; color:${c}; font-weight:700;">${t}</h2>`;
const p = (t, extra = '') => `<p style="font-size:12pt; color:${BODY}; margin-top:8pt;${extra}">${t}</p>`;
const pSmall = (t, c = G) => `<p style="font-size:11pt; color:${c}; margin-top:10pt; font-weight:700;">${t}</p>`;

const files = {};

files['01-cover.html'] = page('P01 Cover', `
<img src="../assets/logo.png" style="position:absolute; left:36pt; top:36pt; width:28pt; height:28pt;" />
<div style="position:absolute; left:72pt; top:40pt; width:400pt;">
  <p style="font-size:10pt; color:${G}; font-weight:700;">ESCROW PROTECTED MARKETPLACE</p>
</div>
<div style="position:absolute; left:36pt; top:90pt; width:420pt;">
  <h1 style="font-size:32pt; color:${INK}; font-weight:700; line-height:1.15;"><span style="color:${G};">REBOX</span>: Sàn C2C Thế Hệ Mới</h1>
  <p style="font-size:16pt; color:${INK}; font-weight:700; margin-top:14pt;">Đăng bán dễ dàng — Giao dịch an toàn tuyệt đối</p>
  <p style="font-size:13pt; color:${BODY}; margin-top:12pt;">Tái định nghĩa thị trường đồ cũ tại Việt Nam bằng lớp hạ tầng tín nhiệm: ví escrow, mô tả tình trạng chuẩn, và trọng tài khi có tranh chấp.</p>
</div>
<div style="position:absolute; left:36pt; top:430pt; width:200pt; background:${SOFT}; border-radius:20pt; padding:8pt 14pt;">
  <p style="font-size:10pt; color:${G}; font-weight:700;">Keyboards · Mice · Monitors</p>
</div>
<div style="position:absolute; left:248pt; top:430pt; width:200pt; background:${SOFT}; border-radius:20pt; padding:8pt 14pt;">
  <p style="font-size:10pt; color:${G}; font-weight:700;">Ảnh listing catalog thật</p>
</div>
<img src="../assets/cover-ui.png" style="position:absolute; left:490pt; top:28pt; width:442pt; height:484pt;" />
`);

files['02-van-de.html'] = page('P02 Vấn đề', `
${header('Vấn Đề Thực Tế Của Thị Trường C2C', 'Khảo sát 10 người dùng (08/2026): kênh chính vẫn là Facebook và bạn bè — niềm tin thì không đi cùng.')}
${card(36, 120, 288, 350, `
  ${h2('Ma sát trong thương lượng')}
  ${p('Người bán <strong>ngập tin nhắn ảo</strong>, người mua trả giá không hồi kết. 6/10 đang mua–bán qua Facebook hoặc hội nhóm.')}
  ${pSmall('Kênh: bạn bè 7 · Facebook 6 · Shopee 4')}
`)}
${card(336, 120, 288, 350, `
  ${h2('Niềm tin bằng KHÔNG')}
  ${p('<strong>6 trên 10</strong> đã nhận hàng không giống mô tả. Nỗi lo #1: người bán không uy tín, hàng lỗi giấu, ảnh không phải hàng thật.')}
  ${pSmall('Q10 — hàng ≠ thông tin: 6 Có / 4 Chưa từng')}
`)}
${card(636, 120, 288, 350, `
  ${h2('Thiếu lớp bảo chứng')}
  ${p('Điều làm họ tin: <strong>đánh giá, ảnh thật, mô tả tình trạng, kiểm định, hoàn tiền</strong>. Escrow mới được 2/10 nhắc.')}
  ${pSmall('8/10 sẵn sàng thử nền tảng kiểu ReBox')}
`)}
`);

files['03-giai-phap.html'] = page('P03 Giải pháp', `
${header('Giải Pháp Từ ReBox', 'Kiến tạo lớp hạ tầng tín nhiệm (Trust Layer) cho mọi giao dịch C2C.')}
${card(36, 120, 288, 350, `
  ${h2('Giao dịch 1 chạm')}
  ${p('Khảo sát: người bán mệt vì trả giá. ReBox chuẩn hóa <strong>Smart Offer + chốt đơn dứt khoát</strong> trên listing có schema (layout, switch, DPI).')}
`)}
${card(336, 120, 288, 350, `
  ${h2('Ví Escrow bảo chứng')}
  ${p('Tiền người mua <strong>tạm giữ trên ReBox</strong> tới khi nhận hàng đúng mô tả. Đúng mô hình nền tảng giữ tiền, chỉ giải ngân khi giao dịch xong.')}
`)}
${card(636, 120, 288, 350, `
  ${h2('Vận chuyển + ẩn danh')}
  ${p('Courier lấy hàng tại seller, giao tận nơi. Không lộ SĐT trên hội nhóm — <strong>nền tảng đứng giữa</strong> thay vì inbox Facebook.')}
`)}
`);

files['04-san-pham.html'] = page('P04 Sản phẩm', `
${header('Sản Phẩm: Tối Ưu Hóa Hành Vi Người Dùng', 'Một phía cần an toàn khi xuống tiền. Một phía cần bán nhanh, không trực chiến inbox.')}
${card(36, 115, 438, 360, `
  ${h2('Người mua — An toàn &amp; tiện', G)}
  ${p('<strong>Chốt đơn dứt khoát:</strong> giá niêm yết + offer có khung, không mặc cả 40 tin nhắn.')}
  ${p('<strong>Smart Offer:</strong> đề xuất mức giá theo tình trạng listing (Like New / Good / Fair).')}
  ${p('<strong>Điểm tín nhiệm:</strong> seller verified, rating, lịch sử — đúng thứ 10/10 người khảo sát cần để tin.')}
`)}
${card(486, 115, 438, 360, `
  ${h2('Người bán — Bán nhanh &amp; nhàn', G)}
  ${p('<strong>AI Vision auto-tag:</strong> nhận diện bàn phím / chuột / màn hình, điền schema category.')}
  ${p('<strong>Đăng 1 lần:</strong> listing chuẩn, courier tới lấy — 5/10 chưa từng bán vì không biết định giá / giao hàng.')}
  ${p('<strong>Chống hoàn hàng gian lận:</strong> ảnh 6 mặt + escrow, trọng tài dựa trên bằng chứng.')}
`)}
`);

const item = (img, name, meta, price, x, y) => `
<img src="../assets/products/${img}" style="position:absolute; left:${x}pt; top:${y}pt; width:64pt; height:64pt;" />
<div style="position:absolute; left:${x + 74}pt; top:${y}pt; width:200pt;">
  <h3 style="font-size:11pt; color:${INK}; font-weight:700;">${name}</h3>
  <p style="font-size:9pt; color:${MUTED}; margin-top:3pt;">${meta}</p>
  <p style="font-size:12pt; color:${G}; font-weight:700; margin-top:4pt;">${price}</p>
</div>`;

files['05-danh-muc.html'] = page('P05 Catalog', `
${header('Danh Mục Đang Chạy — Ảnh Catalog Thật', 'Niche-first: Keyboards · Mice · Monitors. Ảnh seed backend; seller fictional hóa theo persona khảo sát.')}
<div style="position:absolute; left:36pt; top:108pt; width:288pt; height:370pt; background:#FFFFFF; border:1px solid ${BORDER}; border-radius:10pt;"></div>
<div style="position:absolute; left:36pt; top:120pt; width:288pt; padding:0 16pt;">
  <h2 style="font-size:14pt; color:${INK}; font-weight:700;">Keyboards</h2>
</div>
${item('keyboard-custom-65.jpg', 'Keychron K2 V2 Brown · 98%', 'Like New · Minh Trần · Q.1', '$79', 52, 155)}
${item('keyboard-designer.jpg', 'Akko 3068B Plus Hot-swap', 'Good · Hà Lê · Cầu Giấy', '$69', 52, 240)}
${item('keyboard-rgb-blue.jpg', 'Logitech G Pro X TKL', 'Good · An Bùi', '$115', 52, 325)}

<div style="position:absolute; left:336pt; top:108pt; width:288pt; height:370pt; background:#FFFFFF; border:1px solid ${BORDER}; border-radius:10pt;"></div>
<div style="position:absolute; left:336pt; top:120pt; width:288pt; padding:0 16pt;">
  <h2 style="font-size:14pt; color:${INK}; font-weight:700;">Mice</h2>
</div>
${item('mouse-logitech-white.jpg', 'Logitech G Pro X Superlight', 'Like New · Lan Nguyễn · Q.3', '$110', 352, 155)}
${item('mouse-honeycomb.jpg', 'Razer Viper V2 Pro', 'Good · Đức Phạm · Đống Đa', '$125', 352, 240)}
${item('mouse-logitech-g.jpg', 'Logitech MX Master 3S', 'Like New · Khoa Vũ', '$85', 352, 325)}

<div style="position:absolute; left:636pt; top:108pt; width:288pt; height:370pt; background:#FFFFFF; border:1px solid ${BORDER}; border-radius:10pt;"></div>
<div style="position:absolute; left:636pt; top:120pt; width:288pt; padding:0 16pt;">
  <h2 style="font-size:14pt; color:${INK}; font-weight:700;">Monitors</h2>
</div>
${item('monitor-lg.jpg', 'LG UltraGear 27" 165Hz', 'Like New · Khoa Vũ · Tân Bình', '$220', 652, 155)}
${item('monitor-gaming.jpg', 'Samsung Odyssey G5 27"', 'Good · An Bùi', '$195', 652, 240)}
${item('monitor-workstation.jpg', 'Dell S2721DGF 27" 165Hz', 'Like New · Minh Trần', '$240', 652, 325)}
`);

files['06-cong-nghe.html'] = page('P06 Công nghệ', `
${header('Công Nghệ Cốt Lõi: Bảo Mật &amp; Trung Lập', 'ReBox không chỉ là app bán hàng, mà là hệ thống trọng tài C2C công bằng cho cá nhân.')}
${card(36, 120, 288, 350, `
  ${h2('Trọng tài trung lập')}
  ${p('Kết hợp <strong>điểm tín nhiệm lịch sử + AI đánh giá ảnh/video 6 mặt</strong> khi khiếu nại — đúng thứ khảo sát đòi nền tảng đứng ra giải quyết tranh chấp.')}
`)}
${card(336, 120, 288, 350, `
  ${h2('ReBox Payment Link')}
  ${p('Chia sẻ <strong>link thanh toán ReBox</strong> lên hội nhóm Facebook. Giữ traffic MXH (kênh 6/10 đang dùng) nhưng kéo giao dịch vào escrow.')}
`)}
${card(636, 120, 288, 350, `
  ${h2('Định danh chống fraud')}
  ${p('eKYC + tài khoản ngân hàng chính chủ trước khi rút tiền escrow. Chặn nick ảo lập rồi bỏ trốn — nỗi lo #1 khi mua đồ cũ online.')}
`)}
`);

const cell = (x, y, w, h, bg, inner) => `
<div data-pptx-merge="true" style="position:absolute; left:${x}pt; top:${y}pt; width:${w}pt; height:${h}pt; background:${bg}; padding:12pt 14pt;">
${inner}
</div>`;

files['07-canh-tranh.html'] = page('P07 Cạnh tranh', `
${header('Bản Đồ Cạnh Tranh &amp; Định Vị', 'Không đánh Shopee trên B2C. Đánh Facebook, hội nhóm, sàn rao vặt không có trọng tài.')}
${cell(36, 108, 180, 40, SOFT, `<p style="font-size:11pt; color:${INK}; font-weight:700;">Nền tảng</p>`)}
${cell(216, 108, 330, 40, '#FFFFFF', `<p style="font-size:11pt; color:#B42318; font-weight:700;">Hạn chế hiện tại với C2C</p>`)}
${cell(546, 108, 378, 40, SOFT, `<p style="font-size:11pt; color:${G}; font-weight:700;">Cách ReBox giải quyết</p>`)}

${cell(36, 148, 180, 108, '#F3F7F6', `<h3 style="font-size:13pt; color:${INK};">Facebook Groups</h3>`)}
${cell(216, 148, 330, 108, '#FFFFFF', `<p style="font-size:12pt; color:${BODY};">Lừa đảo, inbox hỗn loạn, không escrow. Kênh 6/10 đang dùng.</p>`)}
${cell(546, 148, 378, 108, '#F3F8F6', `<p style="font-size:12pt; color:${BODY};">→ <strong>ReBox Link</strong> + ví escrow. Giữ traffic hội nhóm, kéo thanh toán vào hạ tầng tin cậy.</p>`)}

${cell(36, 256, 180, 108, '#F3F7F6', `<h3 style="font-size:13pt; color:${INK};">Sàn rao vặt (Chợ Tốt)</h3>`)}
${cell(216, 256, 330, 108, '#FFFFFF', `<p style="font-size:12pt; color:${BODY};">Gặp mặt / COD, hàng ≠ ảnh. 6/10 từng nhận sai mô tả.</p>`)}
${cell(546, 256, 378, 108, '#EAF4F0', `<p style="font-size:12pt; color:${BODY};">→ <strong>Courier + kiểm hàng</strong> trước khi giải ngân. Schema tình trạng bắt buộc.</p>`)}

${cell(36, 364, 180, 108, '#F3F7F6', `<h3 style="font-size:13pt; color:${INK};">Sàn TMĐT (Shopee)</h3>`)}
${cell(216, 364, 330, 108, '#FFFFFF', `<p style="font-size:12pt; color:${BODY};">Thiết kế B2C, phí &amp; chính sách thiên shop. C2C cá nhân không phải gian hàng.</p>`)}
${cell(546, 364, 378, 108, '#F3F8F6', `<p style="font-size:12pt; color:${BODY};">→ <strong>C2C-native:</strong> 0% phí năm 1, trọng tài cho cá nhân, eKYC trước khi rút tiền.</p>`)}
`);

files['08-thi-truong.html'] = page('P08 Thị trường', `
${header('Quy Mô Thị Trường', '')}
<div style="position:absolute; left:36pt; top:160pt; width:340pt;">
  <h1 style="font-size:54pt; color:${G}; font-weight:700;">1.5 Tỷ</h1>
  <p style="font-size:18pt; color:${INK}; font-weight:700; margin-top:8pt;">USD (tại Việt Nam)</p>
  <p style="font-size:11pt; color:${MUTED}; margin-top:8pt;">TAM đồ cũ / C2C — số trong hồ sơ gọi vốn</p>
</div>
<div style="position:absolute; left:420pt; top:120pt; width:504pt;">
  <h2 style="font-size:14pt; color:${INK}; font-weight:700;">Nhu cầu đã có, niềm tin thì chưa</h2>
  <p style="font-size:12pt; color:${BODY}; margin-top:4pt;">9/10 từng mua đồ cũ. Kênh rải Facebook, bạn bè, Shopee — không ai cầm lớp escrow.</p>
  <h2 style="font-size:14pt; color:${INK}; font-weight:700; margin-top:16pt;">Wedge: phụ kiện công nghệ</h2>
  <p style="font-size:12pt; color:${BODY}; margin-top:4pt;">Q18: 5/10 muốn tập trung tech. ReBox mở Keyboards / Mice / Monitors — AOV cao, dễ schema.</p>
  <h2 style="font-size:14pt; color:${INK}; font-weight:700; margin-top:16pt;">Escrow chưa ai làm cho C2C cá nhân</h2>
  <p style="font-size:12pt; color:${BODY}; margin-top:4pt;">Shopee làm cho shop. Facebook không giữ tiền. ReBox lấp đúng lỗ đó.</p>
  <h2 style="font-size:14pt; color:${INK}; font-weight:700; margin-top:16pt;">Sẵn sàng thử</h2>
  <p style="font-size:12pt; color:${BODY}; margin-top:4pt;">8/10 “có thể sử dụng” nền tảng kiểu ReBox.</p>
</div>
`);

files['09-mo-hinh.html'] = page('P09 Business model', `
${header('Mô Hình Kinh Doanh', 'Hai pha: chiếm thanh khoản trước, mở take-rate sau. Không thu phí khi thị trường còn đang sợ.')}
${card(36, 115, 438, 360, `
  ${h2('Pha 1 · Chiếm user (Năm 1)', G)}
  ${p('<strong>0% phí giao dịch</strong> — hạ rào cho C2C cá nhân, đối trọng Shopee phí shop.')}
  ${p('<strong>Floating cash:</strong> float escrow (tiền nằm trên ví trước khi giải ngân) tài trợ burn.')}
  ${p('<strong>Supply seeding:</strong> bàn phím / chuột / monitor — AOV đủ lớn để học vận hành escrow.')}
`)}
${card(486, 115, 438, 360, `
  ${h2('Pha 2 · Mở doanh thu (Năm 2+)', G)}
  ${p('<strong>Take-rate ~3%</strong> khi thanh khoản và niềm tin đã khóa user.')}
  ${p('<strong>Boosted listing</strong> + kiểm định trả phí (6/10 rất quan tâm; sẵn sàng trả thêm nếu phí hợp lý).')}
  ${p('<strong>Authentication</strong> cho hàng giá trị cao (monitor / keyboard custom) trước khi giao.')}
`)}
`);

files['10-gtm.html'] = page('P10 GTM', `
${header('Chiến Lược GTM &amp; Giải Quyết “Thanh Khoản”', 'Vấn đề lớn nhất của C2C: có người mua thì không có người bán, và ngược lại.')}
${card(36, 108, 438, 175, `
  ${h2('1. Nguồn cung mồi (Supply seeding)')}
  ${p('B2B2C với shop tech / reseller bàn phím cơ — bơm listing Keychron, Akko, Logitech lên sàn trước khi chờ user tự đăng.')}
`)}
${card(486, 108, 438, 175, `
  ${h2('2. Công cụ cross-posting')}
  ${p('Đăng một lần trên ReBox, đẩy ra hội nhóm FB. Payment Link kéo giao dịch về escrow — không bỏ kênh 6/10 đang đứng.')}
`)}
${card(36, 298, 438, 175, `
  ${h2('3. Đánh ngách (Niche-first)')}
  ${p('Keyboards · Mice · Monitors. Đúng “phụ kiện công nghệ” trong khảo sát. Mở rộng phone/laptop khi escrow ổn.')}
`)}
${card(486, 298, 438, 175, `
  ${h2('4. Viral referral (CAC)')}
  ${p('Mời bạn bè — kênh #1 trong khảo sát (7/10). Credit escrow / phí ship. CAC thấp hơn ads vì C2C lan theo mạng quen.')}
`)}
`);

files['11-roadmap.html'] = page('P11 Roadmap', `
${header('Lộ Trình Phát Triển Sản Phẩm (T1 – T12)', '')}
<div style="position:absolute; left:50pt; top:268pt; width:860pt; height:3pt; background:${G};"></div>
${card(36, 300, 210, 165, `${h2('Quý 1: Launch Beta', G)}${p('Escrow + listing schema 3 category. eKYC rút tiền. Seed 100 listing tech tại HCM / Hà Nội.')}`)}
${card(262, 95, 210, 155, `${h2('Quý 2: 3PL &amp; Link', G)}${p('Courier pickup. ReBox Payment Link cho hội nhóm FB. AI Vision gắn tag keyboard / mouse / monitor.')}`)}
${card(488, 300, 210, 165, `${h2('Quý 3: Trọng tài', G)}${p('Luồng khiếu nại + ảnh 6 mặt. Kiểm định trả phí. Mở Smart Offer theo tình trạng.')}`)}
${card(714, 95, 210, 155, `${h2('Quý 4: Monetize', G)}${p('Thử take-rate trên boosted listing. Chuẩn bị phone/laptop khi thanh khoản ngách đã khóa.')}`)}
`);

files['12-van-hanh.html'] = page('P12 Vận hành', `
${header('Vận Hành &amp; Dự Phóng (3 Năm)', '')}
${card(36, 115, 438, 360, `
  ${h2('Chi phí vận hành (OPEX)', G)}
  ${p('CSKH mỏng + <strong>AI hỗ trợ khiếu nại</strong> (ảnh/video) — không dựng call center lớn năm 1.')}
  ${p('Courier đối tác, không tự build 3PL.')}
  ${p('<strong>Burn-rate:</strong> $12.000 – $15.000 / tháng (nhân sự cốt lõi + cloud + KYC).')}
`)}
${card(486, 115, 438, 360, `
  ${h2('Dự phóng &amp; ROI', G)}
  ${p('<strong>Năm 1 (zero-fee):</strong> 50k user hoạt động, ~$2M GMV, lợi nhuận âm.')}
  ${p('<strong>Năm 2 (monetize):</strong> take-rate 3%, ~$15M GMV, hòa vốn tháng 18–20.')}
  ${p('<strong>Năm 3 (scale):</strong> lãi ròng dương. ROI kỳ vọng 2.5–3 năm.')}
`)}
`);

files['13-doi-ngu.html'] = page('P13 Đội ngũ', `
${header('Đội Ngũ Triển Khai (Dự Án)', 'Bốn ghế — role bám product đang chạy. Chưa gắn tên cá nhân công khai.')}
${card(36, 108, 438, 175, `
  ${h2('Project Lead / Operations')}
  ${p('Escrow, khiếu nại, quan hệ 3PL. Giữ trọng tài trung lập không biến thành CSKH hô biến.')}
`)}
${card(486, 108, 438, 175, `
  ${h2('Tech Lead')}
  ${p('App Next.js + API Laravel + AI Vision/tag. Schema 3 category, ví, eKYC, moderation listing.')}
`)}
${card(36, 298, 438, 175, `
  ${h2('Product / UI-UX')}
  ${p('Luồng đăng bán 1 lần, offer, tin cậy trên PDP. Brand xanh rừng, card listing, homepage đang live.')}
`)}
${card(486, 298, 438, 175, `
  ${h2('Marketing / Growth')}
  ${p('Hội nhóm FB + Payment Link + referral bạn bè. Niche keyboard community trước khi mass ads.')}
`)}
`);

files['14-von.html'] = page('P14 Vốn', `
${header('Kế Hoạch Vốn &amp; Cổ Phần', '')}
<div style="position:absolute; left:36pt; top:170pt; width:340pt;">
  <h1 style="font-size:54pt; color:${G}; font-weight:700;">$300K</h1>
  <p style="font-size:16pt; color:${INK}; font-weight:700; margin-top:10pt;">Nhu cầu vốn (Pre-Seed / Seed)</p>
</div>
<div data-pptx-merge="true" style="position:absolute; left:400pt; top:130pt; width:524pt; height:340pt;">
  <p style="font-size:13pt; color:${BODY};">Runway <strong>18 tháng</strong> ở burn $12–15k/tháng. Đủ để beta ngách tech, khóa escrow, rồi mới mở take-rate.</p>
  <p style="font-size:13pt; color:${BODY}; margin-top:14pt;"><strong>Cổ phần chào bán:</strong> 10% – 15% tại valuation $2M – $3M.</p>
  <p style="font-size:13pt; color:${BODY}; margin-top:12pt;"><span style="color:${G}; font-weight:700;">45%</span> — Product / Tech: escrow, AI tag, app + API, KYC.</p>
  <p style="font-size:13pt; color:${BODY}; margin-top:10pt;"><span style="color:${G}; font-weight:700;">40%</span> — Growth: seeding listing, hội nhóm FB, referral.</p>
  <p style="font-size:13pt; color:${BODY}; margin-top:10pt;"><span style="color:${G}; font-weight:700;">15%</span> — Operations &amp; dự phòng: 3PL, tranh chấp, legal.</p>
</div>
`);

files['15-dong.html'] = page('P15 Đóng', `
<img src="../assets/logo.png" style="position:absolute; left:452pt; top:90pt; width:56pt; height:56pt;" />
<div style="position:absolute; left:80pt; top:170pt; width:800pt; text-align:center;">
  <h1 style="font-size:36pt; color:${G}; font-weight:700; text-align:center;">ReBox Đã Sẵn Sàng!</h1>
  <p style="font-size:16pt; color:${INK}; margin-top:14pt; text-align:center;">Kiến tạo chuẩn mực niềm tin mới cho thị trường đồ cũ Việt Nam.</p>
  <p style="font-size:13pt; color:${BODY}; margin-top:8pt; text-align:center;">Xin chân thành cảm ơn Ban Giám Khảo.</p>
</div>
<div style="position:absolute; left:250pt; top:390pt; width:460pt; height:44pt; border:1px solid ${BORDER}; border-radius:22pt; background:#FFFFFF;"></div>
<div style="position:absolute; left:250pt; top:400pt; width:460pt;">
  <p style="font-size:13pt; color:${INK}; font-weight:700; text-align:center;">rebox.vn   |   contact@rebox.vn</p>
</div>
`);

for (const [name, html] of Object.entries(files)) {
  fs.writeFileSync(path.join(out, name), html);
  console.log('wrote', name);
}
console.log('done', Object.keys(files).length);
