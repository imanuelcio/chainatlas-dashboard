import { Inter, Roboto_Mono } from "next/font/google";

// Font configuration
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

// Import global styles
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Web3 Project Management Dashboard",
  description: "Manage your Web3 projects, events, badges, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans bg-background text-foreground`}
      >
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
