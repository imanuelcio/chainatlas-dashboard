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
import ReactQueryProvider from "@/components/provider/ReactQueryProvider";

export const metadata = {
  title: "ChainAtlas",
  description: "ChainAtlas Dashboard",
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
        <ReactQueryProvider>
          <Toaster position="top-right" />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
