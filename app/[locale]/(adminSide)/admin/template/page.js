import initTranslations from "@/app/i18n";
import Template from "@/app/components/admin/tenplate/Templates";
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
      <Template />
    </TranslationProvider>
  );
}
export default Page
