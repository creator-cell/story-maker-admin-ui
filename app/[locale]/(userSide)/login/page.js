import initTranslations from "@/app/i18n";
// import Login from "../../components/Login";
import Login from "@/app/components/auth/Login";
import TranslationProvider from "@/app/components/TranslationProvider";
const i18nNamespaces = ["common"];

const Page = async ({ params }) => {
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  console.log("locale", locale);
  return (
    <>
      <TranslationProvider
        locale={locale}
        namespaces={i18nNamespaces}
        resources={resources}
      >
        <Login />
      </TranslationProvider>
    </>
  );
};
export default Page;
