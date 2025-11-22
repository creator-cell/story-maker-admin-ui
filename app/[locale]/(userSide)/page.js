// import Login from "../../components/Login";
import Login from "@/app/components/auth/Login";
import initTranslations from "@/app/i18n";
import TranslationProvider from "@/app/components/TranslationProvider";
import { ThemeProvider } from "next-themes";

const i18nNamespaces = ["common"];
const Home = async ({ params }) => {
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <>
    <ThemeProvider attribute="data-bs-theme" defaultTheme="light">
      <TranslationProvider
        locale={locale}
        namespaces={i18nNamespaces}
        resources={resources}
      >
        <Login />
      </TranslationProvider>
    </ThemeProvider>
    </>
  );
};
export default Home;
