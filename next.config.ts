// next.config.ts
// X-Frame-Options: DENY: Prevents your site from being embedded in iframes (clickjacking protection)
// X-Content-Type-Options: nosniff: Prevents MIME type sniffing
// Referrer-Policy: strict-origin-when-cross-origin: Controls how much referrer information is sent
// eslint-disable-next-line no-undef
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
