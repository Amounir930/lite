import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // Ensure we use a valid locale, fallback to default
  const activeLocale = locale && routing.locales.includes(locale as any) 
    ? locale 
    : routing.defaultLocale;

  return {
    locale: activeLocale, // 💡 This was missing
    messages: (await import(`../../messages/${activeLocale}.json`)).default,
  };
});
