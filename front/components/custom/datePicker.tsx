"use client"

 import * as React from "react"
 import { ChevronDownIcon } from "lucide-react"
 import Kenat, { toEC } from "kenat";

 import { Button } from "@/components/ui/button"
 import { Calendar } from "@/components/ui/calendar"
 import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from "@/components/ui/popover"

 interface DatePickerProps {
   value?: Date;
   onChange?: (date: Date) => void;
 }

 export function DatePicker({ value, onChange }: DatePickerProps) {
   const now = new Kenat(value);
   const [open, setOpen] = React.useState(false);
   const [date, setDate] = React.useState<Kenat>(now)

   return (
     <Popover open={open} onOpenChange={setOpen}>
       <PopoverTrigger asChild>
         <Button
           variant="outline"
           className="font-normal w-full justify-between"
         >
           {date ? (date.formatShort()): "Select date"}
           <ChevronDownIcon />
         </Button>
       </PopoverTrigger>
       <PopoverContent className="w-full overflow-hidden p-0" align="start">
         <Calendar
           mode="single"
           selected={new Date(date.toISOString())}
           captionLayout="dropdown"
           onSelect={(date) => {
             if (!date) return;
             onChange?.(date);
             setDate(new Kenat(date))
             value = date;
             setOpen(false);
           }}
         />
       </PopoverContent>
     </Popover>
   );
 }
