# Frontend Development Plan (The Guardian Editorial Clone)
## Portal Berita Next.js + Tailwind CSS (Terintegrasi Backend CodeIgniter 3 API)

---

## 1. Ringkasan Eksekutif & Konsep Desain

Pengembangan frontend ini bertujuan untuk membangun antarmuka web portal berita modern untuk **KoranKu (Harian Momentum)** dengan mengadopsi standar visual kelas dunia dari **The Guardian** (`theguardian.com`), dengan karakteristik utama:

- **Estetika Editorial Klasik & Tegas**:
  - **Header & Masthead**: Deep Guardian Navy (`#052962`), tanggal publikasi lengkap, logo serif berwibawa, navigasi tab rubrik utama, dan *topic pills bar*.
  - **Tipografi Berita**: Menggunakan font Serif elegan (*Playfair Display* / *Merriweather* via `next/font/google`) untuk judul berita (*headline*), dipadukan dengan Sans-Serif modern (*Inter* / *Source Sans 3*) untuk isi berita dan metadata.
  - **Struktur Grid Kolom**: Hairline border pembatas antar kolom (*clean 1px editorial rule* `border-stone-300`), tata letak berita utama (*Lead Story*) dominan di kiri, disusul berita sekunder 2-3 kolom.
  - **Rubrik Sentilan & Opini Khusus**: Background bernuansa *warm paper tint* (`#fef6eb` / `#faf5ee`), kutipan petik ganda oranye (`""`), avatar foto lingkaran (*circular cutout*) penulis kolom / wartawan, dan byline tebal.
  - **Badging & Live Tag**: Tag kategori (*kicker / eyebrow*) berwarna kontras dan badge merah menyala (`🔴 TERKINI` / `🔴 LIVE`).
  - **Footer Guardian Style**: Warna dasar *Deep Navy* dengan daftar navigasi lengkap, newsletter callout, dan tombol *Back to Top*.

---

## 2. Solusi Kompatibilitas Editor Backend dengan Tailwind CSS

> [!IMPORTANT]
> **Tantangan**: 
> Backend CodeIgniter menghasilkan konten berita (`isi_artikel`) dari editor WYSIWYG (TinyMCE/Summernote) berupa tag HTML mentah yang mengandung `<p>`, `<b>`, `<font face="..." style="...">`, `<table>`, `<iframe>`, `<blockquote>`, dsb. Sementara itu, Tailwind CSS memiliki *Preflight CSS Reset* yang secara default menghilangkan format tag-tag tersebut.
>
> **Solusi Teknis**:
> 1. Memasang dan mengonfigurasi plugin resmi **`@tailwindcss/typography`**.
> 2. Membungkus konten berita dalam wrapper `<article className="prose prose-lg max-w-none article-content">`.
> 3. Menambahkan kustomisasi CSS di `globals.css` untuk menangani elemen warisan editor backend:
>    - Mendukung inline font style `<font>`, `style="font-size:..."`, `style="color:..."`.
>    - Membuat semua `<img>` dalam artikel menjadi `rounded`, `max-w-full`, `h-auto`, dengan caption otomatis di bawah gambar.
>    - Membuat `<iframe>` (embed YouTube) otomatis responsif (*16:9 aspect-ratio container*).
>    - Membuat elemen `<table>` memiliki *horizontal scroll wrapper* agar tidak merusak layout mobile.

---

## 3. Pemetaan Rubrik Baru ke Kategori Backend API

Sesuai arahan, berikut 12 rubrik utama dan pemetaannya terhadap data API/kategori di backend:

| No | Nama Rubrik | Karakteristik Tampilan | Pemetaan Kategori API / Sumber Data |
|---|---|---|---|
| 1 | **Sentilan** | Format kolom catatan pinggir, kutipan tajam, foto lingkaran kolumnis, background krem hangat (`#fef6eb`) | Kategori `nyekhita` / `/api/v1/categories/nyekhita/news` |
| 2 | **Sosok** | Profil tokoh, figur inspiratif, wawancara mendalam | Kategori `wawancara` / `profil` / `/api/v1/categories/wawancara/news` |
| 3 | **Hukum & Kriminal** | Aksen border merah-marun, berita kejaksaan, pengadilan, kepolisian | Kategori `hukum` / `/api/v1/categories/hukum/news` |
| 4 | **Politik** | Berita legislatif, parpol, dinamika pilkada & pilpres | Kategori `politik`, `lampung-memilih` |
| 5 | **Pendidikan** | Isu sekolah, kampus, beasiswa, dunia literasi & riset | Kategori `pendidikan` / `/api/v1/categories/pendidikan/news` |
| 6 | **Pemerintahan** | Kebijakan publik, OPD, Pemprov, Pemkab / Pemkot | Kategori `pemerintahan`, `sosial` |
| 7 | **Olahraga** | Pertandingan liga, sepakbola, PON, atlet daerah | Kategori `gelanggang` / `/api/v1/categories/gelanggang/news` |
| 8 | **Budaya & Pariwisata** | Seni tradisi, pariwisata Lampung, kuliner, hotel | Kategori `seni-budaya`, `pariwisata`, `kuliner` |
| 9 | **Ekonomi & Bisnis** | Keuangan, perbankan, inflasi, pasar modal, UMKM | Kategori `ekonomi` / `/api/v1/categories/ekonomi/news` |
| 10 | **Opini** | Tulisan gagasan dari akademisi, pakar, dan publik | Kategori `opini` / `/api/v1/categories/opini/news` |
| 11 | **Nasional** | Berita terkini dari ibukota dan nusantara | Kategori `nasional`, `umum` |
| 12 | **Daerah** | Tab filter 15 Kabupaten/Kota di Provinsi Lampung | Endpoint `/api/v1/daerah` & `/api/v1/daerah/{id}/news` |

---

## 4. Struktur Direktori Proyek Next.js (`koranku-fe`)

```
koranku-fe/
├── app/
│   ├── layout.tsx                  # Root layout (Masthead Guardian, Nav, Footer, Metadata)
│   ├── page.tsx                    # Beranda Utama (The Guardian Editorial Grid)
│   ├── [rubrik]/
│   │   └── page.tsx                # Listing Berita per Rubrik (ISR)
│   ├── read/
│   │   └── [id]/
│   │       └── [slug]/
│   │           └── page.tsx        # Detail Berita (Article View + Editor HTML prose)
│   ├── daerah/
│   │   ├── page.tsx                # Direktori Berita Seluruh Kabupaten/Kota
│   │   └── [idkab]/
│   │       └── page.tsx            # Berita spesifik Kabupaten/Kota
│   ├── tag/
│   │   └── [slug]/
│   │       └── page.tsx            # Berita berdasarkan Tag
│   ├── pencarian/
│   │   └── page.tsx                # Halaman Hasil Pencarian
│   ├── indeks/
│   │   └── page.tsx                # Arsip Berita per Bulan/Tahun
│   ├── informasi/
│   │   └── [slug]/
│   │       └── page.tsx                # Halaman Statis (Redaksi, Pedoman Siber, dll)
│   ├── kontak/
│   │   └── page.tsx                # Formulir Kontak Redaksi
│   ├── sitemap.ts                  # Dynamic Sitemap Generator (konsumsi /api/v1/seo/sitemap-data)
│   └── robots.ts                   # Dynamic Robots.txt
├── components/
│   ├── header/
│   │   ├── TopUtilityBar.tsx       # Edisi, tanggal, search toggle
│   │   ├── MastheadLogo.tsx        # Logo The Guardian Style
│   │   ├── PrimaryNav.tsx          # Baris 1: Tab Rubrik Utama
│   │   ├── SubNavBar.tsx           # Baris 2: Topic Pills Bar
│   │   └── BreakingNewsTicker.tsx  # Ticker berita terkini
│   ├── cards/
│   │   ├── LeadStoryCard.tsx       # Berita utama besar dengan gambar dominan
│   │   ├── EditorialCard.tsx       # Kartu berita standar dengan border 1px
│   │   ├── CompactStoryCard.tsx    # List berita ringkas dengan nomor urut / jam
│   │   ├── SentilanCard.tsx        # Kartu Sentilan/Opini (Kutipan + Avatar Kolumnis)
│   │   └── VideoCard.tsx           # Kartu featured video dengan play icon
│   ├── sections/
│   │   ├── HeroSection.tsx         # Grid headline 3 kolom The Guardian
│   │   ├── SentilanSection.tsx     # Section khusus Sentilan & Opini berlatar krem
│   │   ├── RubrikFeedSection.tsx   # Reusable block rubrik dengan border-top tebal
│   │   ├── DaerahSection.tsx       # Tab switcher 15 kabupaten/kota
│   │   └── VideoMediaSection.tsx   # Galeri video MomentumTV
│   ├── sidebar/
│   │   ├── PopularWidget.tsx       # 1-5 Berita Terpopuler
│   │   ├── AdBannerWidget.tsx      # Slot banner iklan
│   │   └── TrendingTagsWidget.tsx  # Cloud tags terpopuler
│   └── footer/
│       ├── FooterMain.tsx          # Footer deep navy 4 kolom
│       └── BackToTop.tsx           # Tombol scroll back to top
├── lib/
│   ├── api.ts                      # Client fetcher terpusat ke backend CI3
│   ├── types.ts                    # TypeScript interface (Article, Category, Meta, dll)
│   └── utils.ts                    # Format tanggal Indo, truncate text, share URL
└── tailwind.config.ts              # Konfigurasi warna Guardian & Typography plugin
```

---

## 5. Checklist Pengembangan Bertahap (Development Checklist per Phase)

### [x] Phase 1: Inisialisasi Proyek & Fondasi Desain
- [x] Inisialisasi Next.js (App Router, TypeScript, Tailwind CSS, ESLint).
- [x] Konfigurasi `next.config.ts` untuk mengizinkan domain gambar backend (`images.remotePatterns`).
- [x] Pasang plugin `@tailwindcss/typography` dan konfigurasi `@theme` di `globals.css`.
- [x] Konfigurasi palet warna The Guardian di CSS (`guardian-navy`, `guardian-yellow`, `guardian-coral`, `guardian-red`, `guardian-cream`, `guardian-rule`).
- [x] Konfigurasi font Google di `app/layout.tsx`:
  - *Playfair Display* (Headings & Quotes)
  - *Inter* (Body & Navigation)
- [x] Tambahkan styling kompatibilitas editor backend di `app/globals.css` (reset `<font>`, table scrolling, responsive video iframe).

---

### [x] Phase 2: Layer Integrasi API Backend
- [x] Buat file `lib/types.ts` mendefinisikan interface: `Article`, `Category`, `Region`, `PageMeta`, `MenuNode`, `Advertisement`, `RUBRICS`.
- [x] Buat file `lib/api.ts` dengan helper `fetchAPI` yang terhubung ke CodeIgniter 3 API:
  - `getSiteMeta()`, `getMenus()`, `getAds(posisi)`, `getOnlineStats()`
  - `getHomeData()`, `getHeadlines()`, `getHotnews()`, `getVideos()`
  - `getNewsList(params)`, `getNewsDetail(id)`, `getRelatedNews(id)`
  - `getCategories()`, `getCategoryNews(slug, page)`
  - `getTags()`, `getTagNews(slug, page)`
  - `getRegions()`, `getRegionNews(idkab, page)`
  - `getPopularNews()`, `getRecentNews()`, `searchNews(keyword, page)`
  - `getStaticPages()`, `getStaticPageDetail(slug)`
  - `postComment(idart, data)`, `incrementView(idart)`

---

### [x] Phase 3: Komponen Global (Header, Navigasi, Footer The Guardian)
- [x] **Top Utility Bar**: Tanggal hari ini format Indonesia, edisi, e-paper badge, dan tombol search toggle.
- [x] **Masthead Logo**: Logo teks besar serif Harian Momentum bergaya The Guardian dengan tagline resmi.
- [x] **Primary Nav Bar**: Navigasi 12 rubrik utama dengan hover highlight dan status aktif.
- [x] **Subnav Pills Bar**: Filter topik populer (Pilkada, Pemutihan Pajak, Bhayangkara Presisi FC, Wisata, Kabar Daerah).
- [x] **Footer Deep Navy**: Logo footer, grid 12 rubrik, menu informasi redaksi, copyright, dan tombol *Kembali ke Atas*.

---

### [x] Phase 4: Halaman Beranda (The Guardian Home Layout)
- [x] **Hero Lead Section**:
  - Kolom Utama: 1 Berita utama besar dengan judul serif tebal dan gambar landscape dominan (`LeadStoryCard.tsx`).
  - Kolom Samping: 2 Berita headline pendukung dengan border 1px pembatas (`EditorialCard.tsx`).
  - Kolom Ketiga: Sidebar Berita Terpopuler (*Numbered List 1-5* bergaya The Guardian).
- [x] **Section Sentilan & Opini (Guardian Opinion Showcase)**:
  - Background warm cream `#fef6eb`, aksen oranye coral `#c74600`.
  - Kutipan besar bergaya editorial, avatar lingkaran kolumnis, byline nama penulis (`SentilanCard.tsx`).
- [x] **Grid Rubrik Utama**:
  - Blok Hukum & Kriminal (Aksen merah marun).
  - Blok Politik & Pemerintahan.
  - Blok Pendidikan & Olahraga.
  - Blok Ekonomi & Bisnis, Budaya & Pariwisata, Kabar Nasional.
- [x] **Tab Filter Berita Daerah**:
  - Tab pill interaktif untuk 15 kabupaten/kota di Lampung tanpa reload halaman.
- [x] **Section Featured Videos / MomentumTV**:
  - Container multimedia gelap dengan kartu video responsif dan play button overlay (`VideoGallerySection.tsx`).

---

### [x] Phase 5: Halaman Detail Berita & Pembaca Artikel
- [x] Breadcrumb navigasi (*Home > Rubrik > Judul*).
- [x] Header artikel: Kicker kategori & kabupaten, judul serif besar, byline wartawan, tanggal dan jam publikasi, counter pembaca.
- [x] **Article Body Rendering**:
  - Menggunakan wrapper `.article-content prose prose-lg` menjamin semua format tag editor backend (`<font>`, inline styles, responsive tables, YouTube iframe 16:9) ter-render sempurna.
- [x] Sambungan halaman multi-page (*Bagian 1, 2, 3*) jika artikel memiliki parent idart.
- [x] Social share bar (WhatsApp, Facebook, X / Twitter, Salin URL).
- [x] Widget Berita Terkait (*Related Articles*).
- [x] Komponen Komentar: List komentar disetujui + form kirim komentar baru dengan validasi.
- [x] Non-blocking view counter trigger otomatis saat halaman dimuat (`incrementView`).

---

### [x] Phase 6: Halaman Rubrik, Kategori, Daerah & Pencarian
- [x] Halaman rubrik dinamis `app/[rubrik]/page.tsx` memetakan ke 12 rubrik dengan pagination.
- [x] Halaman direktori daerah `app/daerah/page.tsx` dan detail daerah `app/daerah/[idkab]/page.tsx`.
- [x] Halaman pencarian `app/pencarian/page.tsx` dengan form input kata kunci dan hasil real-time.

---

### [x] Phase 7: Halaman Statis & Formulir Kontak
- [x] Halaman statis `app/informasi/[slug]/page.tsx` (Tentang Kami, Susunan Redaksi, Pedoman Media Siber, Disclaimer).
- [x] Halaman kontak redaksi `app/kontak/page.tsx` dengan formulir terintegrasi API dan informasi kantor.

---

### [x] Phase 8: Optimasi & Verifikasi Produksi
- [x] Dynamic OpenGraph & Twitter metadata pada setiap halaman artikel.
- [x] Image Optimization via `next/image` dengan `remotePatterns` terkonfigurasi.
- [x] Production build testing (`next build`) berhasil 100% tanpa error TypeScript.
- [x] Browser testing via subagent: verifikasi tampilan The Guardian clone pada resolusi penuh.

---
*Rencana ini disusun di dalam direktori `koranku-fe` sebagai acuan resmi pengerjaan frontend Next.js.*
