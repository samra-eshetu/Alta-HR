import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Alta HR",
  description: "HR module for ALTA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/*Header*/}
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg">
                <Image
                  src="/alta-logo.jpg"
                  alt="Alta Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <h1 className="tet-2xl font-bold text-gray-900">
                Alta HR System
              </h1>
            </div>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    href="/"
                    className="flex items-center px-4 py-2 text-lg font-medium hover:bg-accent rounded-md"
                  >
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/Form"
                    className="flex items-center px-4 py-2 text-lg font-medium hover:bg-accent rounded-md"
                  >
                    Forms
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-lg font-medium [&>svg]:hidden">
                    Chat
                  </NavigationMenuTrigger>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/chat"
                      className="flex items-center px-4 py-2 text-lg font-medium hover:bg-accent rounded-md"
                    ></Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </header>
        {/*Page Content*/}
        <Providers>{children}</Providers>;{/*Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>© 2025 Alta Computec</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
