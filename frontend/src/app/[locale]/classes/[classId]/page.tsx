import ClassDetailsClient from "./ClassDetailsClient"; // client-side component
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationProvider";

const i18nNamespaces = ["class_details"];

export default async function ClassDetailsPage({
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
      <ClassDetailsClient/>
    </TranslationsProvider>
  );
}
