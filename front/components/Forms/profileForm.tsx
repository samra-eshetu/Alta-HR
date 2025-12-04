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
import { parse } from "date-fns";

const phoneRegex =
  /^(?:\+251|251|0)(7\d{8}|9\d{8})$/;

const formSchema = z.object({
  fullName: z.string().min(2),
  email: z.email().optional(),
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Invalid Ethiopian phone number"),
  dateOfBirth: z.date(),
});

export default function ProfileForm() {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [extractLoading, setExtractLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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
  async function onSubmit (data: any) {
    setFormLoading(true)
    alert("Employee record saved successfully!"); // TODO: change this to toast
    console.log("Form submitted:", data);
    await myMutation({variables:data})

    setFormLoading(false)
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
      setExtractLoading(true)
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      const res = await axios.post(`${BACKEND_URL}/extractText`, formData );
      const employeeRec:EmployeeType = res.data;
      console.log("response object from Extracting text \n",res.data);

      let dateOfBirth
      try {
        dateOfBirth = parse(employeeRec.dateOfBirth,"dd/MM/yyyy",new Date()) 
      } catch(e){
        console.error(e)
        dateOfBirth = new Date()
      }

      form.reset({
        fullName: `${employeeRec.firstName} ${employeeRec.lastName}`,
        email: employeeRec.email,
        phoneNumber: employeeRec.phoneNumber,
        dateOfBirth,
      });

    } catch (err) {
      console.error(err);
    }finally{
      setExtractLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-sm max-w-2xl  mx-auto p-6 bg-white rounded-xl shadow-lg"
      >
        {/* PHOTO UPLOAD */}
        <div className=" space-y-1  flex items-center justify-center flex-col">
          {!photoPreview ? (
            <label
              htmlFor="photo-upload"
              className="mb-5 flex flex-col items-center justify-center w-full h-40 border-4 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
            >
              <div className="flex flex-col items-center justify-center  pt-10 pb-2">
                <Upload className="w-10 h-10 mb-6 text-gray-400" />
                <p className="text-lg font-medium text-gray-700 px-2 text-center">
                  Click to upload old Employee record
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
            <FormItem className="mt-10 mb-5">
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Abebe Kebede" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-5" >
              <FormLabel>Email (optional)</FormLabel>
              <FormControl>
                <Input
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
            <FormItem className="mb-5" >
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
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
                <DatePicker  value={field.value ?? null} onChange={field.onChange}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full gap-3 items-center mt-3">
            <Button type="submit" size="lg" className={`flex-1 ${formLoading ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed disabled":"cursor-pointer"}`}>
            {
                !formLoading ? "Save Employee Record" : (
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_0.4s_0.2s_infinite]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_0.4s_0.4s_infinite]"></span>
                    </div>
                  )

            }
            </Button>

          {
            photoFile?(
              <Button className={`flex-1 ${extractLoading ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed disabled":"cursor-pointer"}`} variant="secondary" onClick={()=>{processWithAI()}}>
                {
                  !extractLoading ? "extract Text" : (

                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_0.4s_0.2s_infinite]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_0.4s_0.4s_infinite]"></span>
                    </div>
                  )
                }
              </Button>
            ):null
          }
        </div>
      </form>
    </Form>
  );
}
