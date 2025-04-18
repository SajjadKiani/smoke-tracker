import "@/styles/globals.css";
import { auth } from "@/auth";
import { Inter } from "next/font/google";
import Fab from "@/components/FAB";   // plain import

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  return { title: "Smoke ‑ Tracker PWA" };
}


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} min-h-screen`}>
        {children}
        {session && <Fab />}          {/* rendered only for signed‑in users */}
      </body>
    </html>
  );
}
