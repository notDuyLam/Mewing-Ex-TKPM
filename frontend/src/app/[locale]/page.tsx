import HomeClient from "./HomeClient"; // client-side component
import initTranslations from "../i18n";
import TranslationsProvider from "@/components/TranslationProvider";

const i18nNamespaces = [
  "home",
  "common",
  "add_student",
  "filter",
  "manage_options",
  "student",
  "student_table",
];

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <HomeClient />
    </TranslationsProvider>
  );
}
