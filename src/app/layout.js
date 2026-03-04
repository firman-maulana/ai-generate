// FONT CSS (LOCAL)
import "@/styles/fonts.css";

// TEMPLATE CSS (WAJIB)
import "@/styles/main-D56khq2h.css";

import SessionProvider from "@/components/SessionProvider";

export const metadata = {
  title: "AI Generator Video",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-force-theme="light" className="light">
      <body className="bg-white">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}