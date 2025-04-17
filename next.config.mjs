// next.config.mjs
import withPWA from "next-pwa";

const pwaOptions = {
  dest: "public",
  runtimeCaching: [],
  disable: process.env.NODE_ENV === "development",
};

const nextConfig = {
  experimental: { appDir: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA(pwaOptions)(nextConfig);
