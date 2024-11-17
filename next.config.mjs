/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse']
  }
};

export default nextConfig;
