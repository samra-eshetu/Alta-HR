"use client";

import {ChangeEvent, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {EmployeeType} from "@/types"
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import axios from "axios";
import { DatePicker } from "../custom/datePicker";
import Image from 'next/image'


const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  email: z.email("Invalid email address").optional(),
  phoneNumber: z.coerce
    .string()
    .min(10, "Phone number must be at least 10 digits long"),
  dateOfBirth: z.date()
});

export default function ProfileForm() {
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading,setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: new Date(),
    },
  });

  const saveData = gql(`
        mutation MyMutation {
        insert_employees(objects: {first_name: $firstName, last_name: $lastName, phone: $phoneNumber, email: $email}) {
          affected_rows
        }
    }
  `)

  const [myMutation] = useMutation(saveData)
  function onSubmit (data: any) {
    alert("Employee record saved successfully!"); // TODO: change this to toast
    console.log("Form submitted:", data);
    setSubmittedData({
      ...data,
      photoName: photoFile?.name || "No photo attached",
    });
    myMutation({variables:data})
  }

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

  async function processWithAI(){
    if(!photoFile) return;

    const formData  = new FormData()
    formData.append("file", photoFile);
    try {
      setLoading(true)
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      const res = await axios.post(`${BACKEND_URL}/extractText`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const employeeRec:EmployeeType = res.data;
      form.reset({
        fullName: `${employeeRec.firstName} ${employeeRec.lastName}`,
        email: employeeRec.email,
        phoneNumber: employeeRec.phoneNumber,
        dateOfBirth: employeeRec.age,
      });

    } catch (err) {
      console.error(err);
    }finally{
      setLoading(false)
    }
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
          <Image
            src={photoPreview}
            alt="Employee"
            width={16 * 20}
            height={9 * 20}
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
        <div className=" space-y-1  flex items-center justify-center flex-col">
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
                <p className="text-sm text-gray-500 mt-2 mb-3">JPG, PNG, PDF</p>
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
            <div className="relative w-fit">
              {
                photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Employee preview"
                    className="w-full max-h-40 object-contain rounded-2xl shadow-2xl"
                  />
                )
              }
              <button
                onClick={removePhoto}
                className="absolute -top-6 -right-6 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* FORM FIELDS */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="mt-10">
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
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <DatePicker  value={field.value} onChange={field.onChange}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full gap-3 items-center mt-3">
            <Button type="submit" size="lg" className="flex-1 cursor-pointer">
              Save Employee Record
            </Button>

          {
            photoFile?(
              <Button className="cursor-pointer" variant="secondary" onClick={()=>{processWithAI()}}>
                  extract Text
              </Button>
            ):null
          }
        </div>
      </form>
    </Form>
  );
}
