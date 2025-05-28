import StudentClient from "./StudentClient"; // client-side component
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/components/TranslationProvider";

const i18nNamespaces = ["student", "student_table"];

export default async function StudentPage({
  params,
}: {
  params: { locale: string; studentId: string };
}) {
  const { locale, studentId } = params;

  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <StudentClient studentId={studentId} />
    </TranslationsProvider>
  );
}
