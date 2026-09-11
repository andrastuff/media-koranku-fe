export interface Article {
  idart: string | number;
  idadm?: string | number;
  idkab?: string | number;
  idkat?: string | number;
  headlines?: string | number;
  utama?: string | number;
  judul_artikel: string;
  slug?: string;
  public_slug?: string;
  isi_artikel: string;
  img?: string;
  img_thumb_url?: string;
  img_full_url?: string;
  read_url?: string;
  tanggal: string;
  view?: string | number;
  comment_count?: string | number;
  tag?: string;
  parent?: string | number;
  wartawan?: string;
  kategori?: string;
  kabupaten?: string;
  embed?: string;
  parts?: Article[];
  pages?: ArticlePageItem[];
  current_page?: number;
  total_pages?: number;
  related?: Article[];
}

export interface ArticlePageItem {
  page_number: number;
  idart: string | number;
  judul_artikel: string;
  public_slug?: string;
  read_url?: string;
  is_active: boolean;
}

export interface HomeData {
  headlines: Article[];
  hotnews: Article[];
  categories_feed: Record<string, Article[]>;
  daerah: Article[];
  popular: Article[];
  recent: Article[];
  banner_mid: AdItem[];
}

export interface Category {
  idkat: string | number;
  kategori: string;
  slug: string;
  status?: string;
}

export interface Region {
  idkab: string | number;
  kabupaten: string;
  slug: string;
  status?: string;
}

export interface TagItem {
  id_tag?: string | number;
  nama_tag: string;
  tag_seo?: string;
  count?: string | number;
}

export interface MenuNode {
  id: number;
  parent_id: number;
  title: string;
  name: string;
  slug: string;
  link: string;
  target_url: string;
  order: number;
  children: MenuNode[];
}

export interface AdItem {
  idads: string | number;
  posisi: string;
  link?: string;
  keterangan?: string;
  img?: string;
  img_path?: string;
  img_url?: string;
}

export interface CommentItem {
  idcomment: string | number;
  idart: string | number;
  nama: string;
  comment: string;
  date: string;
  parent?: string | number;
}

export interface StaticPage {
  idpages: string | number;
  judul: string;
  slug: string;
  content?: string;
}

export interface SiteMeta {
  judul: string;
  deskripsi: string;
  logo?: string;
  logo_path?: string;
  logo_url?: string;
  footer_logo?: string;
  footer_logo_path?: string;
  footer_logo_url?: string;
  icon_url?: string;
  alamat?: string;
  telp?: string;
  telp2?: string;
  email?: string;
  fb?: string;
  twitter?: string;
  linked?: string;
  youtube?: string;
  maps?: string;
  footer?: string;
}

export interface PaginationMeta {
  total_records: number;
  current_page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  code: number;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

// 12 Requested Rubrics Definition
export interface RubricConfig {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  colorBadge: string;
  description: string;
  isOpinionStyle?: boolean;
}

export const RUBRICS: RubricConfig[] = [
  {
    id: "sentilan",
    name: "Sentilan",
    slug: "sentilan",
    categorySlug: "nyekhita",
    colorBadge: "bg-[#c74600] text-white",
    description: "Tulisan kolom catatan pinggir dan ulasan kritis berani",
    isOpinionStyle: true,
  },
  {
    id: "sosok",
    name: "Sosok",
    slug: "sosok",
    categorySlug: "wawancara",
    colorBadge: "bg-[#052962] text-white",
    description: "Profil tokoh, inspirator, dan wawancara mendalam",
  },
  {
    id: "hukum-kriminal",
    name: "Hukum & Kriminal",
    slug: "hukum-kriminal",
    categorySlug: "hukum",
    colorBadge: "bg-[#cc0000] text-white",
    description: "Perkembangan kasus hukum, kejaksaan, peradilan, kepolisian",
  },
  {
    id: "politik",
    name: "Politik",
    slug: "politik",
    categorySlug: "politik",
    colorBadge: "bg-[#005689] text-white",
    description: "Dinamika partai politik, parlemen, pilkada, dan pemilu",
  },
  {
    id: "pendidikan",
    name: "Pendidikan",
    slug: "pendidikan",
    categorySlug: "pendidikan",
    colorBadge: "bg-[#185e30] text-white",
    description: "Kabar dunia kampus, sekolah, literasi, dan beasiswa",
  },
  {
    id: "pemerintahan",
    name: "Pemerintahan",
    slug: "pemerintahan",
    categorySlug: "pemerintahan",
    colorBadge: "bg-[#333333] text-white",
    description: "Kebijakan publik, program Pemprov dan Pemkab/Pemkot",
  },
  {
    id: "olahraga",
    name: "Olahraga",
    slug: "olahraga",
    categorySlug: "gelanggang",
    colorBadge: "bg-[#0084c6] text-white",
    description: "Sepakbola, kompetisi lokal, PON, dan prestasi atlet",
  },
  {
    id: "budaya-pariwisata",
    name: "Budaya & Pariwisata",
    slug: "budaya-pariwisata",
    categorySlug: "seni-budaya",
    colorBadge: "bg-[#8b2252] text-white",
    description: "Eksotisme pariwisata Lampung, seni tradisi, dan kuliner",
  },
  {
    id: "ekonomi-bisnis",
    name: "Ekonomi & Bisnis",
    slug: "ekonomi-bisnis",
    categorySlug: "ekonomi",
    colorBadge: "bg-[#805000] text-white",
    description: "Kabar perbankan, investasi, UMKM, dan denyut pasar",
  },
  {
    id: "opini",
    name: "Opini",
    slug: "opini",
    categorySlug: "opini",
    colorBadge: "bg-[#e05e00] text-white",
    description: "Gagasan, analisis tajam, dan pemikiran akademisi",
    isOpinionStyle: true,
  },
  {
    id: "nasional",
    name: "Nasional",
    slug: "nasional",
    categorySlug: "nasional",
    colorBadge: "bg-[#b30000] text-white",
    description: "Sorotan peristiwa nasional dari pusat dan nusantara",
  },
  {
    id: "daerah",
    name: "Daerah",
    slug: "daerah",
    categorySlug: "daerah",
    colorBadge: "bg-[#052962] text-white",
    description: "Kabar terkini dari 15 Kabupaten/Kota se-Provinsi Lampung",
  },
];
