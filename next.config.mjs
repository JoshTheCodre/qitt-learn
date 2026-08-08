/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // pdf-parse pulls in pdfjs-dist, which must not be bundled by webpack — load it as a
  // normal Node module on the server so PDF text extraction works in the API route.
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
};

export default nextConfig;
