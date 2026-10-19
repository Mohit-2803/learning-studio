import "./styles.css";
import type { ReactNode } from "react";

export const metadata: import("next").Metadata = {
  title: "Learning Studio · Learn by building",
  description:
    "Learn practical software skills through clear lessons, working examples, and hands-on labs.",
  icons: { icon: "/brand-mark.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
