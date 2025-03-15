"use client"

import { Input } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { getLocalTimeZone, now, today } from "@internationalized/date";
import {Navbar} from "@/components/navbar";
import {NumberInput} from "@heroui/number-input";
import Image from "next/image";
import {Button} from "@heroui/button";
import {MagnifyingGlass} from "@phosphor-icons/react";

export default function Home() {
    return (
        <div suppressHydrationWarning className="relative">
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/treno.jpg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
            </div>
            <Navbar/>
            <div
                className="relative z-10 flex h-full w-full items-start overflow-x-auto overflow-y-auto transition-colors duration-200 justify-center dark text-foreground">
                <div
                    className="flex min-h-[48rem] w-full items-center justify-end overflow-hidden rounded-small p-2 sm:p-4 lg:p-8"

                >
                    <div
                        className="flex w-full max-w-lg flex-col gap-4 rounded-large px-8 pb-10 pt-6 shadow-small"
                        style={{
                            background: "rgba(222,201,201,0.25)",
                            borderRadius: "16px",
                            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                            backdropFilter: "blur(4.7px)",
                            border: "1px solid rgba(222,201,201,0.24)",
                            WebkitBackdropFilter: "blur(4.7px)",
                        }}
                    >
                        <form className="grid grid-cols-2 grid-flow-row gap-5">
                            <Input
                                isRequired
                                classNames={{
                                    input: [
                                        "placeholder:text-white placeholder:text-lg",
                                        "text-black/90 dark:text-white/90",
                                        "text-base",
                                    ],
                                    inputWrapper: [
                                        "shadow-xl bg-zinc-950/30",
                                        "group-data-[focus=true]:bg-default-200/50",
                                        "dark:group-data-[focus=true]:bg-zinc-900/60",
                                        "!cursor-text",
                                        "border-b-0 border-t-0 border-l-0 border-r-0 group-data-[focus=true]:border-sky-500 group-data-[hover=true]:border-sky-500 focus-within:rounded-lg",
                                    ],
                                }}
                                placeholder="Da dove vuoi partire?"
                                type="search"
                                variant="bordered"
                            />
                            <Input
                                isRequired
                                classNames={{
                                    input: [
                                        "placeholder:text-white placeholder:text-lg",
                                        "text-black/90 dark:text-white/90",
                                        "text-base",
                                    ],
                                    inputWrapper: [
                                        "shadow-xl bg-zinc-950/30",
                                        "group-data-[focus=true]:bg-default-200/50",
                                        "dark:group-data-[focus=true]:bg-zinc-900/60",
                                        "!cursor-text",
                                        "border-b-2 border-t-0 border-l-0 border-r-0 group-data-[hover=true]:border-sky-500 group-data-[hover=true]:border-sky-500 focus-within:rounded-lg",
                                    ],
                                }}
                                placeholder="Dove vuoi arrivare?"
                                type="search"
                                variant="bordered"
                            />
                            <DatePicker
                                hideTimeZone
                                showMonthAndYearPickers
                                classNames={{
                                    inputWrapper:
                                        "hover:bg-transparent focus:bg-transparent hover:rounded-lg rounded-none focus-within:bg-transparent bg-transparent border-b-2 border-red-500",
                                    base: "bg-transparent",
                                    input: "bg-transparent",
                                    innerWrapper: "bg-transparent",
                                }}
                                defaultValue={now(getLocalTimeZone())}
                                label="Quando vuoi partire?"
                                minValue={today(getLocalTimeZone())}
                            />
                            <NumberInput
                                isRequired
                                classNames={{
                                    input: [
                                        "placeholder:text-white placeholder:text-lg",
                                        "text-black/90 dark:text-white/90",
                                        "text-base",
                                    ],
                                    inputWrapper: [
                                        "shadow-xl bg-zinc-950/30",
                                        "group-data-[focus=true]:bg-default-200/50",
                                        "dark:group-data-[focus=true]:bg-zinc-900/60",
                                        "!cursor-text",
                                        "border-b-2 border-t-0 border-l-0 border-r-0 group-data-[hover=true]:border-sky-500 group-data-[hover=true]:border-sky-500 focus-within:rounded-lg",
                                    ],
                                }}
                                placeholder="Numero di persone"
                                variant="bordered"
                                hideStepper
                                minValue={0}
                                aria-label="Numero di persone"
                            />
                            <Button
                                className="bg-foreground/10 dark:bg-foreground/20 col-span-2"
                                radius="lg"
                                startContent={<MagnifyingGlass/>}
                                type="submit"
                            >
                                Cerca
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

