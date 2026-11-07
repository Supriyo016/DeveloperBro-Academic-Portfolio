export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim().replace(/\/$/, "");

export interface NavItem {
  href: string;
  label: string;
}

export const rssAlternate = { "application/rss+xml": [{ url: "/feed.xml", title: "DeveloperBro. research notes" }] };

export const primaryNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research Works" },
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About Me" },
  { href: "/contact", label: "Contact" },
];

export const secondaryNav: NavItem[] = [
  { href: "/publications", label: "Publications" },
  { href: "/education", label: "Academic journey" },
  { href: "/skills", label: "Skills" },
  { href: "/achievements", label: "Achievements" },
  { href: "/github", label: "GitHub" },
  { href: "/cv", label: "Academic CV" },
];
