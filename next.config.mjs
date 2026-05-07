import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  // ... rest of config
};

export default withNextIntl(nextConfig);
