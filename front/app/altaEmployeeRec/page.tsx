"use client";
import { useState } from "react";
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

// Creating a validating schema using zod
const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long"),
  age: z.coerce.number().min(18, "You must be at least 18 years old"),
});

export default function ProfileForm() {
  // ...
  const [submittedData, setSubmittedData] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      age: 18,
    },
  });
  function onSubmit(data) {
    alert("Form submitted!");
    console.log("Form submitted:", data);
    setSubmittedData(data);
  }
  if (submittedData) {
    return (
      <div className="p-8 max-w-0xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Submitted Data</h2>
        <p>
          <strong>Name: {submittedData.fullName}</strong>
        </p>
        <p>
          <strong>Email: {submittedData.email}</strong>
        </p>
        <p>
          <strong>Phone Number: {submittedData.phoneNumber}</strong>
        </p>
        <p>
          <strong>Age:{submittedData.age}</strong>
        </p>
        <button className="mt-4" onClick={() => setSubmittedData(null)}>
          Edit
        </button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Full name field*/}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
  );
}
