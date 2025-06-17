import HomeClient from "./HomeClient"; // client-side component
import initTranslations from "../i18n";
import TranslationsProvider from "@/components/TranslationProvider";
import ChangeLangButton from "@/components/ChangeLangButton"

const i18nNamespaces = [
  "home",
  "common",
  "add_student",
  "filter",
  "manage_options",
  "student",
  "student_table",
  "export_file",
  "import_file",
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
        <ChangeLangButton/>
      <HomeClient />
    </TranslationsProvider>
  );
}
