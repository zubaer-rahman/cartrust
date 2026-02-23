/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@cartrust/ui",
    "@cartrust/auth",
    "@cartrust/db",
    "@cartrust/shared",
    "@cartrust/vehicle-core",
    "@cartrust/media",
    "@cartrust/payments",
    "@cartrust/rbac"
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
