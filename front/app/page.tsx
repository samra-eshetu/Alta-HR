"use client";

import * as React from "react";
import Link from "next/link";
import { Upload, Users, FileText, Calendar, Settings } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const forms = [
  {
    title: "Employee Profile Form",
    href: "/forms/profile",
    description:
      "Digitize paper records or add new employee profiles with photo upload.",
    icon: Users,
  },
  {
    title: "Leave Request Form",
    href: "/forms/leave",
    description:
      "Submit and track annual leave, sick leave, or emergency requests.",
    icon: Calendar,
  },
  {
    title: "Complaint Form",
    href: "/forms/complaint",
    description: "Report workplace issues confidentially.",
    icon: FileText,
  },
];

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Alta HR System</h1>
          </div>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg">
                  Forms
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-96 gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {forms.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5 text-blue-600" />
                                <div className="text-sm font-medium leading-none">
                                  {item.title}
                                </div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/settings" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Welcome to Alta HR Portal
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Digitize your 130+ paper employee records quickly and securely. HR
            staff can upload photos, fill forms, and save directly to the
            database.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {forms.map((form) => {
              const Icon = form.icon;
              return (
                <Card
                  key={form.href}
                  className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-500"
                >
                  <Link href={form.href} className="block p-6">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{form.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {form.description}
                      </CardDescription>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2025 Alta HR System • Built with love for efficiency</p>
        </div>
      </footer>
    </div>
  );
}
