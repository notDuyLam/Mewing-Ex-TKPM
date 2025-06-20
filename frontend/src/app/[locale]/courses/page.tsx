import CourseClient from "./CourseClient"; // client-side component
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationProvider";
import LanguageToggleButton from "@/components/ChangeLangButton";
const i18nNamespaces = ["courses", "common"];

export default async function CoursesPage({
  params,
}: {
  params: { locale: string; studentId: string };
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
      <CourseClient/>
    </TranslationsProvider>
  );
}
