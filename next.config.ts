import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingIncludes: { "/**": ["./src/content/articles/**"] },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/blog/:slug", destination: "/blogs/:slug", permanent: true },
      // Pages removed when Projects and Research Works were narrowed
      { source: "/documents/academic-cv-public.pdf", destination: "/documents/Supriyo_Sarkar_Academic_CV.pdf", permanent: true },
      { source: "/research/federated-knowledge-distillation", destination: "/research/knowledge-distillation-ckks-federated-learning", permanent: true },
      { source: "/projects/federated-alzheimers-benchmark", destination: "/research/federated-alzheimers-detection", permanent: true },
      { source: "/projects/ibmq-gate-assessment", destination: "/research/quantum-gate-assessment", permanent: true },
      { source: "/projects/developerbro-portfolio", destination: "/projects/developerbro-academic-portfolio", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/documents/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: "public, max-age=3600" },
          // Downloadable from the site, but kept out of search results because the CV includes personal details.
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
