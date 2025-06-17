"use client";
import i18nConfig from "@/i18nConfig";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LanguageToggleButton() {
  const { i18n, t, ready } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Đồng bộ ngôn ngữ từ URL khi component mount
  useEffect(() => {
    const localeFromUrl = pathname.split("/")[1] || i18nConfig.defaultLocale;
    if (
      i18n.language !== localeFromUrl &&
      i18nConfig.locales.includes(localeFromUrl)
    ) {
      i18n.changeLanguage(localeFromUrl);
    }
  }, [ pathname, i18n]);

  if (!ready) {
    return <div>Loading...</div>;
  }

  const toggleLanguage = async () => {
    const newLocale = i18n.language === "vi" ? "en" : "vi";
    const currentLocale = i18n.language;
    if (i18nConfig.locales.includes(newLocale)) {
      try {
        await i18n.changeLanguage(newLocale);
        document.documentElement.setAttribute("lang", newLocale);

        const pathWithoutLocale = pathname.startsWith(`/${currentLocale}`)
          ? pathname.slice(i18n.language.length + 1) || "/"
          : pathname;
        const newPath = `/${newLocale}${pathWithoutLocale}`;
        const query = searchParams.toString();
        const fullPath = query ? `${newPath}?${query}` : newPath;
        router.push(fullPath);
      } catch (error) {
        console.error(`Failed to switch to ${newLocale}:`, error);
      }
    }
  };

  return (
    <div className="w-full flex justify-end">
      <Button variant="outline" onClick={toggleLanguage}>
        {t(`languages.${i18n.language}`)}
      </Button>
    </div>
  );
}