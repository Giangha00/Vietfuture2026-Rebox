# ReBox · brand-spec

Nguồn: app `rebox` (`src/app/globals.css`, `public/logo.svg`) + grammar pitch đã chốt 2026-08-19.

## Logo
- File: `assets/logo.svg` (mark hộp trắng trên nền `#004d40`, bo 14px)
- Wordmark: **ReBox** — DM Sans 700, màu `--brand-primary`
- Không vẽ lại logo bằng CSS/SVG khác

## Ảnh sản phẩm (bắt buộc dùng file thật)
- Thư mục: `assets/products/` — seed `rebox-backend/public/seed/`
- Keyboards: `keyboard-custom-65.jpg`, `keyboard-designer.jpg`, `keyboard-rgb-blue.jpg`, `keyboard-rgb-purple.jpg`, `keyboard-rgb-rainbow.jpg`
- Mice: `mouse-logitech-white.jpg`, `mouse-logitech-g.jpg`, `mouse-honeycomb.jpg`, `mouse-rgb.jpg`
- Monitors: `monitor-lg.jpg`, `monitor-gaming.jpg`, `monitor-workstation.jpg`, `monitor-dual.jpg`
- Catalog listing: `catalog.md`

## UI product
- Homepage hiện tại: Navbar trắng + Hero `#f5f3ee` + Category circles + Product rails + How it works
- Accent UI: `#004d40`, nút primary bo `rounded-xl`, card product `rounded-2xl` + border `#e5e7eb`
- Cover deck tái hiện UI này bằng HTML, ảnh lấy từ seed (không stock Unsplash — hero gốc 403)

## Màu
- `--brand-primary`: `#004d40`
- `--brand-primary-dark`: `#003830`
- `--brand-soft`: `#e6f2ed`
- `--brand-mint`: `#c6ead3`
- `--ink`: `#111827`
- `--body`: `#4B5568`
- `--muted`: `#666666`
- `--bg`: `#FFFFFF`
- `--glow`: radial `#e6f2ed` góc trên-phải
- `--border`: `#e5e7eb`
- `--problem`: `#B42318` (chỉ cột hạn chế)
- `--positive`: `#0F766E`

## Chữ
- Display + body: `"DM Sans", "Be Vietnam Pro", sans-serif` (font app)
- Không Inter / Roboto làm display

## Hình khối
- Card radius: 20px
- Icon tile: 12px, nền `--brand-soft`
- Border 1px `--border`
- Shadow: `0 10px 32px rgba(17,24,39,0.06)`

## Canvas
- 1920×1080, margin 64px, title trái

## Chữ ký 120%
- Glow xanh rừng góc phải (không xanh royal)
- Số/icon/phase title = `--brand-primary`
- UI cover phải nhận ra ReBox app (logo + xanh rừng + card listing)

## Cấm
- Accent xanh royal của mẫu cũ
- Logo đỏ / nút đỏ brand cũ
- Emoji bullet, Inter display, card viền trái màu
- Ảnh stock / SVG vẽ sản phẩm thay ảnh seed
- Bịa category Thời trang / Điện thoại khi không có ảnh thật trong project
