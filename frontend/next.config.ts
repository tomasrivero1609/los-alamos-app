import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8055",
        pathname: "/assets/**",
      },
      // En producción añadir tu dominio de Directus (ej. cms.tudominio.com)
      // { protocol: "https", hostname: "cms.tudominio.com", pathname: "/assets/**" },
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
