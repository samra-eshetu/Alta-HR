"use client"

// This is really anying libery
import { useEffect, useRef, useState } from "react"
import Kenat, { MonthGrid } from "kenat"
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi"

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
}
type Grid = ReturnType<MonthGrid["generate"]>
export  function EthiopianDatePicker({value, onChange}:DatePickerProps) {
    const [instance, setInstance] = useState<MonthGrid | null>(null)
    const [grid, setGrid] = useState<Grid|null>(null)
    const [selectedDate, setSelectedDate] = useState(() => Kenat.now().getEthiopian())
    const [open, setOpen] = useState(false)

    const inputRef = useRef(null)

     // on mount
    useEffect(() => {
        const { year, month } = Kenat.now().getEthiopian()
        const m = new MonthGrid({ year, month, weekdayLang: "amharic" })
        setInstance(m)
        setGrid(m.generate())
    }, [])

    const updateGrid = () => {
        if (instance) setGrid(instance.generate())
    }

    const nextMonth = () => {
        if(!instance) return
        instance.up()
        updateGrid()
    }

    const prevMonth = () => {
        if(!instance) return
        instance.down()
        updateGrid()
    }

    const nextYear = () => {
        if(!instance) return
        instance.year++
        updateGrid()
    }

    const prevYear = () => {
        if(!instance) return
        instance.year--
        updateGrid()
    }

    const selectDate = (day) => {
        setSelectedDate(day.ethiopian)
        onChange(day)
        setOpen(false)
    }

    const formatDate = (date) => {
        if (!date) return ""
        return `${date.year}/${String(date.month).padStart(2, "0")}/${String(
            date.day
        ).padStart(2, "0")}`
    }

    return (
        <div className="relative w-full max-w-md mx-auto text-lg">
            {/* Input */}
            <div className="flex items-center w-full max-w-lg border rounded-xl bg-white/30 dark:bg-zinc-800/60 backdrop-blur px-5 py-4">
                <input
                    type="text"
                    readOnly
                    ref={inputRef}
                    value={formatDate(selectedDate)}
                    placeholder="የትውልድ ቀን (DOB)"
                    onClick={() => setOpen(!open)}
                    className="flex-1 bg-transparent focus:outline-none text-zinc-900 dark:text-white placeholder-zinc-500 text-lg"
                />
                <FiCalendar
                    className="text-xl text-zinc-500 cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
            </div>

            {/* Dropdown calendar */}
            {open && grid && (
                <div className="absolute z-50 mt-2 w-[420px] p-6 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-700 shadow-lg text-lg">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 font-semibold">
                        <button
                            onClick={prevYear}
                            className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        >
                            <FiChevronLeft className="text-xl rotate-90" />
                        </button>
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        >
                            <FiChevronLeft className="text-xl" />
                        </button>
                        <div className="text-center flex-1">
                            {grid.monthName} {grid.year}
                        </div>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        >
                            <FiChevronRight className="text-xl" />
                        </button>
                        <button
                            onClick={nextYear}
                            className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        >
                            <FiChevronRight className="text-xl rotate-90" />
                        </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 text-center text-base text-zinc-500 dark:text-zinc-400 mb-2">
                        {grid.headers.map((h, i) => (
                            <div key={i}>{h}</div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-2 text-center text-lg">
                        {grid.days.map((day, i) => {
                            if (!day) return <div key={i} className="p-4" />
                            const isSelected =
                                selectedDate &&
                                day.ethiopian.year === selectedDate.year &&
                                day.ethiopian.month === selectedDate.month &&
                                day.ethiopian.day === selectedDate.day
                            return (
                                <button
                                    key={i}
                                    onClick={() => selectDate(day)}
                                    className={`py-3 min-w-[48px] rounded-lg border transition
                                   ${isSelected ? "bg-blue-600 text-white" : "hover:bg-blue-100 dark:hover:bg-blue-800"}`}
                                >
                                    {day.ethiopian.day}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
