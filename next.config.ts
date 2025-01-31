import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['*','www.google.com'], // Permite qualquer domínio
  }
};

export default nextConfig;
