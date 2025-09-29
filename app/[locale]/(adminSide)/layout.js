import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import "react-phone-number-input/style.css";
import AdminSidebar from "../../layout/sidebar/AdminSidebar";
import { ToastContainer } from "react-toastify";
import { LoaderProvider } from "../../helper/LoaderContext";
import LoaderManager from "../../helper/LoaderManager";
import Script from "next/script";
import { UserProvider } from "../../helper/UserProvider";
import { ThemeProvider } from "next-themes";
import initTranslations from "../../i18n";
import TranslationProvider from "../../components/TranslationProvider";
const i18nNamespaces = ["common"];
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Story Maker",
  description: "Story Maker",
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/fevicon.png" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist+Sans&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
          integrity="sha512-DxV+EoADOkOygM4IR9yXP8Sb2qwgidEmeqAEmDKIOfPRQZOWbXCzLC6vjbZyy0vPisbH2SyW27+ddLVCN+OMzQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        data-bs-theme="light"
      >
        <ThemeProvider attribute="data-bs-theme" defaultTheme="light">
          <UserProvider>
            {" "}
            <LoaderProvider>
              <LoaderManager />
              <TranslationProvider
                locale={locale}
                namespaces={i18nNamespaces}
                resources={resources}
              >
                <AdminSidebar locale={locale} />
                {children}
                <ToastContainer />
              </TranslationProvider>
            </LoaderProvider>
          </UserProvider>
        </ThemeProvider>

        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
