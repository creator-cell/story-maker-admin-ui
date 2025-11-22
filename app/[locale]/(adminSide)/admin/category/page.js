import initTranslations from "@/app/i18n";
import Categories from "../../../../components/admin/category/Category";
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
      resources={resources}
    >
      <Categories />
    </TranslationProvider>
  )
}
export default Page