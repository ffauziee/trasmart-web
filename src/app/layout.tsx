import "./globals.css";
import type { Metadata } from "next";
// import { ThemeProvider } from "./context/themeContext";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TrasMart",
  description: "Convert your waste into points",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable}`}>
        {/* <ThemeProvider>{children}</ThemeProvider> */}
        {children}
      </body>
    </html>
  );
}
