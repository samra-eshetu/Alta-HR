"use client";
import { ChangeEvent, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios"
import {EmployeeType} from "@/types"
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

// Creating a validating schema using zod
const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long"),
  age: z.coerce.number().min(18, "You must be at least 18 years old"),
});

export default function ProfileForm() {
  // ...
  const [loading,setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File|null>(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName:"",
      email: "",
      phoneNumber: "",
      age: 18,
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
  function onSubmit(data) {
    alert("Form submitted!");
    console.log("Form submitted:", data);
    myMutation({variables:data})
  }
  function selectImage(e: ChangeEvent<HTMLInputElement>){
      const file = e.target.files?.[0];
      if (!file) return;
      setSelectedImage(file??null)
  }
  async function processWithAI(){
    if(!selectedImage) return;

    const formData  = new FormData()
    formData.append("file", selectedImage);
    try {
        setLoading(true)
      const res = await axios.post("http://127.0.0.1:8080/extractText", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const employeeRec:EmployeeType = res.data;
      form.reset({
        fullName: `${employeeRec.firstName} ${employeeRec.lastName}`,
        email: employeeRec.email,
        phoneNumber: employeeRec.phoneNumber,
        age: employeeRec.age,
      });


    } catch (err) {
      console.error(err);
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col gap-5  m-5">
      <div className="flex gap-5">
      <Input type="file" className="w-64" placeholder="get input from image" onChange={selectImage}/>
        {loading ? (
            <div className="flex gap-1 items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_0.4s_0.2s_infinite]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_0.4s_0.4s_infinite]"></span>
            </div>
          ):null
        }
      <Button onClick={processWithAI}> submit </Button>
      </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex items-center flex-col">
        {/* Full name field*/}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="mamo" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*email field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="abebe@gmail.com" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* phone number field*/}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+251 912345678" {...field} />
              </FormControl>
              <FormDescription>Your contact phone number.</FormDescription>
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
                <Input type="number" placeholder="18" {...field} />
              </FormControl>
              <FormDescription>Your age (must be 18+)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
      </Form>
    </div>
  );
}
