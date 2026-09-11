import React from "react";

interface JsonLdProps {
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function NewsArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  category,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  category?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    description: description,
    image: imageUrl ? [imageUrl] : [],
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName || "Redaksi korankuid",
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "korankuid",
      url: "https://korankuid.com",
      logo: {
        "@type": "ImageObject",
        url: "https://korankuid.com/images/logo.png",
      },
    },
    articleSection: category || "Berita",
    inLanguage: "id-ID",
  };

  return <JsonLd data={schema} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={schema} />;
}

export function WebsiteAndOrgJsonLd({
  siteUrl = "https://korankuid.com",
  siteName = "korankuid",
  logoUrl,
}: {
  siteUrl?: string;
  siteName?: string;
  logoUrl?: string;
}) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteName,
    alternateName: ["korankuid", "koranku.id", "koranku"],
    url: siteUrl,
    logo: logoUrl || `${siteUrl}/images/logo.png`,
    sameAs: [
      "https://facebook.com/korankuid",
      "https://twitter.com/korankuid",
      "https://instagram.com/korankuid",
      "https://youtube.com/@korankuid",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/pencarian?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={websiteSchema} />
    </>
  );
}

export function ItemListJsonLd({
  name,
  description,
  itemList,
}: {
  name: string;
  description?: string;
  itemList: { name: string; url: string; image?: string; position: number }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    itemListElement: itemList.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      url: item.url,
      name: item.name,
      image: item.image,
    })),
  };

  return <JsonLd data={schema} />;
}
