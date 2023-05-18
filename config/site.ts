import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "ScriptGen",
  title: "A starter template (lite)",
  description:
    "Experience the power of Next.js 13 and Typescript with our advanced starter template. Build large-scale applications easily with support for MDX, theming, and an authentication system, while ensuring 100% SEO and accessibility. Get a head start on your project today!",
  type: "website",
  url: "https://aminoo.vercel.app",
  logo: "/brand.svg",
  technologies: [
    "Nextjs13 (next-auth)",
    "Typescript",
    "Redux RTK",
    "SASS",
    "Tailwindcss",
    "Framer motion",
    "Flowbite",
  ],
  keywords: ["Starter template", "Next.js"],
  creator: "@aminbenz",
  publisher: "@aminbenz",
  authors: [{ name: "Amin Benz", url: "https://github.com/aminbenz" }],
  category: "Template",
  locale: "en-US",
  theme_color: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  color_scheme: "light dark",
  ogImage: "https://tx.aminbenz.com/og.jpg",
  links: {
    twitter: "https://twitter.com/aminbenz",
    github: "https://github.com/aminbenz/amino",
  },
}

export default siteConfig
