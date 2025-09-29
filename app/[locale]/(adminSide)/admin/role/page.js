import initTranslations from "@/app/i18n";
import Countries from "../../../../components/admin/Role";
import TranslationProvider from "@/app/components/TranslationProvider";
const i18nNamespaces = ["common"];
const Page = async ({ params }) => {
  const { locale } = await params;
  console.log("params", locale);
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <TranslationProvider
      locale={locale}
      namespaces={i18nNamespaces}
      resources={resources}>
      <Countries />
    </TranslationProvider>
  );
}
export default Page