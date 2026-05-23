import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});
export const metadata = {
    title: {
        default: "XONET — Freelancer Portal",
        template: "%s — XONET",
    },
    description: "XONET Client Portal — the premium workspace for modern freelancers.",
};
export default function RootLayout({ children }) {
    return (<html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>);
}
