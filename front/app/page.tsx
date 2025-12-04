"use client";
import Link from "next/link";
import { Users, FileText, Calendar } from "lucide-react";

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
    href: "/Form?formType=employee",
    description:
      "Digitize paper records or add new employee profiles with photo upload.",
    icon: Users,
  },
  {
    title: "Leave Request Form",
    href: "/Form?formType=leave",
    description:
      "Submit and track annual leave, sick leave, or emergency requests.",
    icon: Calendar,
  },
  {
    title: "Complaint Form",
    href: "/Form?formType=compliant",
    description: "Report workplace issues confidentially.",
    icon: FileText,
  },
];

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
            {forms.map((form, index) => {
              const Icon = form.icon;
              return (
                <Card
                  key={index}
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
    </div>
  );
}
