"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long"),
  age: z.coerce.number().min(18, "You must be at least 18 years old"),
});

export default function ProfileForm() {
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      age: 18,
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    const input = document.getElementById("photo-upload") as HTMLInputElement;
    if (input) input.value = "";
  };

  function onSubmit(data: any) {
    alert("Employee record saved successfully!");
    console.log("Form data:", data);
    console.log("Attached photo:", photoFile?.name || "No photo");
    setSubmittedData({
      ...data,
      photoName: photoFile?.name || "No photo attached",
    });
  }

  if (submittedData) {
    return (
      <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Submitted Data</h2>
        <div className="space-y-3 text-lg">
          <p>
            <strong>Name:</strong> {submittedData.fullName}
          </p>
          <p>
            <strong>Email:</strong> {submittedData.email || "Not provided"}
          </p>
          <p>
            <strong>Phone:</strong> {submittedData.phoneNumber}
          </p>
          <p>
            <strong>Age:</strong> {submittedData.age}
          </p>
          <p>
            <strong>Photo:</strong> {submittedData.photoName}
          </p>
        </div>
        {photoPreview && (
          <image
            src={photoPreview}
            alt="Employee"
            className="mt-6 max-h-64 rounded-lg mx-auto shadow"
          />
        )}
        <Button
          onClick={() => setSubmittedData(null)}
          className="mt-8 w-full"
          size="lg"
        >
          Edit
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-sm max-w-2xl  mx-auto p-6 bg-white rounded-xl shadow-lg"
      >
        {/* PHOTO UPLOAD */}
        <div className=" space-y-1">
          <FormLabel className="text-xl font-bold mb-10">
            Employee Record Photo
          </FormLabel>

          {!photoPreview ? (
            <label
              htmlFor="photo-upload"
              className="mb-5 flex flex-col items-center justify-center w-full h-40 border-4 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
            >
              <div className="flex flex-col items-center justify-center  pt-10 pb-2">
                <Upload className="w-10 h-10 mb-6 text-gray-400" />
                <p className="text-lg font-medium text-gray-700 px-2 text-center">
                  Click to upload or drag & drop
                </p>
                <p className="text-sm text-gray-500 mt-2 mb-3">JPG, PNG</p>
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          ) : (
            <div className="relative">
              <image
                src={photoPreview}
                alt="Employee preview"
                className="w-full max-h-96 object-contain rounded-2xl shadow-2xl"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-6 -right-6 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-xl"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
          )}
        </div>

        {/* FORM FIELDS */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input className="mb-3" placeholder="Abebe Kebede" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (optional)</FormLabel>
              <FormControl>
                <Input
                  className="mb-3"
                  type="email"
                  placeholder="abebe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  className="mb-3"
                  placeholder="+251 911 234 567"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  className="mb-3"
                  type="number"
                  placeholder="32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full">
          Save Employee Record
        </Button>
      </form>
    </Form>
  );
}
