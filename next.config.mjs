import withPWA from "next-pwa";

export default withPWA({
  dest: "public",
  runtimeCaching: [],          // filled in gist for brevity
  disable: process.env.NODE_ENV === "development",
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
});
