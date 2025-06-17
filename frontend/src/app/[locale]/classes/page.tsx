import ClassClient from "./ClassClient"; // client-side component
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationProvider";
import LanguageToggleButton from "@/components/ChangeLangButton";
const i18nNamespaces = ["classes", "common"];

export default async function ClassesPage({
  params,
}: {
  params: { locale: string; };
}) {
  const { locale } = await params;

  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <LanguageToggleButton/>
      <ClassClient/>

    </TranslationsProvider>
  );
}
