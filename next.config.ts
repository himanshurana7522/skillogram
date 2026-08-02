import type { NextConfig } from "next";

// Vercel deployment safety check
// If user sets empty variables in Vercel UI, prevent NextAuth & Next.js from throwing ERR_INVALID_URL
if (process.env.NEXTAUTH_URL === "") {
  delete process.env.NEXTAUTH_URL;
}
if (process.env.NEXT_PUBLIC_APP_URL === "") {
  delete process.env.NEXT_PUBLIC_APP_URL;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

export default nextConfig;
