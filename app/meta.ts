// import { Metadata } from "next";
import { siteConfig } from "@/config/site"
import { absoluteUrl } from "@/lib/utils"
import type { Metadata } from "next"

const metadata: Metadata = {
  // title: "ScriptGen | Home",
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  themeColor: siteConfig.theme_color,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    // type: siteConfig.type,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: absoluteUrl("/og.jpg"),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
      {
        url: "/assets/img-2.png",
        width: 800,
        height: 600,
        alt: `${siteConfig.name}`,
      },
      {
        url: "/assets/img-2.png",
        width: 1800,
        height: 1600,
        alt: `${siteConfig.name}`,
      },
    ],
    locale: siteConfig.locale,
    authors: ["Amin Benz"],
    // publishedTime: '2023-01-01T00:00:00.000Z',
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    siteId: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: siteConfig.creator,
  },
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon-16x16.png",
    apple: "/icons/apple-touch-icon.png",
    other: {
      rel: "/icons/apple-touch-icon",
      url: "/icons/apple-touch-icon.png",
    },
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  generator: siteConfig.name,
  applicationName: siteConfig.name,
  category: siteConfig.category,
  publisher: siteConfig.publisher,
  // colorScheme: siteConfig.color_scheme,
  // referrer: "origin-when-cross-origin",
  // formatDetection: {
  //   email: false,
  //   address: false,
  //   telephone: false,
  // },
  // robots: {
  //   index: false,
  //   follow: true,
  //   nocache: true,
  //   googleBot: {
  //     index: true,
  //     follow: false,
  //     noimageindex: true,
  //     "max-video-preview": -1,
  //     "max-image-preview": "large",
  //     "max-snippet": -1,
  //   },
  // },
}

export default metadata
