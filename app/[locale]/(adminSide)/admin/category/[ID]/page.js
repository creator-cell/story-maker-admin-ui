import TranslationProvider from "@/app/components/TranslationProvider";
import EditUser from "../../../../../components/admin/EditCategory";
import initTranslations from "@/app/i18n";
const i18nNamespaces = ["common"];
const Page = async ({ params }) => {
  const { locale } = await params;
  console.log("params", locale);
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  const roleId = params.ID;
  return (
    <TranslationProvider
      locale={locale}
      namespaces={i18nNamespaces}
      resources={resources}
    >
      <EditUser userId={roleId} />
    </TranslationProvider>
  );
}
export default Page
