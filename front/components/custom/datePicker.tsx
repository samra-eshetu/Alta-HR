"use client"

 import * as React from "react"
 import { ChevronDownIcon } from "lucide-react"
 import {format, parse} from "date-fns"

 import { Button } from "@/components/ui/button"
 import { Calendar } from "@/components/ui/calendar"
 import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from "@/components/ui/popover"

 interface DatePickerProps {
   value: Date | null;
   onChange: (date: Date) => void;
 }

 export function DatePicker({ value, onChange }: DatePickerProps) {
  console.log(
    "kenat date: ",
    value ? format(value, "dd/MM/yyyy") : "no date"
  );

   const [open, setOpen] = React.useState(false);
   const [date, setDate] = React.useState<Date | null>(value)

  React.useEffect(() => {
      setDate(value);
  }, [value]);

   return (
     <Popover open={open} onOpenChange={setOpen}>
       <PopoverTrigger asChild>
         <Button
           variant="outline"
           className="font-normal w-full justify-between"
         >
           {date ? (format(date,"dd/MM/yyyy")): "Select date"}
           <ChevronDownIcon />
         </Button>
       </PopoverTrigger>
       <PopoverContent className="w-full overflow-hidden p-0" align="start">
         <Calendar
           mode="single"
           selected={date ?? undefined}
           captionLayout="dropdown"
           onSelect={(date) => {
             if (!date) return;
             onChange(date);
             setDate(date)
             setOpen(false);
           }}
         />
       </PopoverContent>
     </Popover>
   );
 }
