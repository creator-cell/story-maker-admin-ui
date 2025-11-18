import initTranslations from "@/app/i18n";
import UserChat from "@/app/components/admin/SupportTicketChat";
import TranslationProvider from "@/app/components/TranslationProvider";

const i18nNamespaces = ["common"];
const Page = async ({ params }) => {
  const { locale } = await params;
  console.log("params", locale);
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  const ticketId = params.ID;
  return (
    <TranslationProvider
      locale={locale}
      namespaces={i18nNamespaces}
      resources={resources}
    >
      <UserChat ticketId={ticketId} />
    </TranslationProvider>
  );
}

export default Page