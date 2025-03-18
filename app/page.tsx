"use client"

import {Input} from "@heroui/input";
import {DatePicker} from "@heroui/date-picker";
import {getLocalTimeZone, now, today} from "@internationalized/date";
import {Navbar} from "@/components/navbar";
import {NumberInput} from "@heroui/number-input";
import Image from "next/image";
import {Button} from "@heroui/button";
import {MagnifyingGlass} from "@phosphor-icons/react";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";

export default function Home() {
    return (<div suppressHydrationWarning>
            <div className="relative">
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
                                        input: ["placeholder:text-white placeholder:text-lg", "text-black/90 dark:text-white/90", "text-base",],
                                        inputWrapper: ["shadow-xl bg-zinc-950/30", "group-data-[focus=true]:bg-default-200/50", "dark:group-data-[focus=true]:bg-zinc-900/60", "!cursor-text", "border-b-0 border-t-0 border-l-0 border-r-0 group-data-[focus=true]:border-sky-500 group-data-[hover=true]:border-sky-500 focus-within:rounded-lg",],
                                    }}
                                    placeholder="Da dove vuoi partire?"
                                    type="search"
                                    variant="bordered"
                                />
                                <Input
                                    isRequired
                                    classNames={{
                                        input: ["placeholder:text-white placeholder:text-lg", "text-black/90 dark:text-white/90", "text-base",],
                                        inputWrapper: ["shadow-xl bg-zinc-950/30", "group-data-[focus=true]:bg-default-200/50", "dark:group-data-[focus=true]:bg-zinc-900/60", "!cursor-text", "border-b-2 border-t-0 border-l-0 border-r-0 group-data-[hover=true]:border-sky-500 group-data-[hover=true]:border-sky-500 focus-within:rounded-lg",],
                                    }}
                                    placeholder="Dove vuoi arrivare?"
                                    type="search"
                                    variant="bordered"
                                />
                                <DatePicker
                                    hideTimeZone
                                    showMonthAndYearPickers
                                    classNames={{
                                        inputWrapper: "hover:bg-transparent focus:bg-transparent hover:rounded-lg rounded-none focus-within:bg-transparent bg-transparent border-b-2 border-red-500",
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
                                        input: ["placeholder:text-white placeholder:text-lg", "text-black/90 dark:text-white/90", "text-base",],
                                        inputWrapper: ["shadow-xl bg-zinc-950/30", "group-data-[focus=true]:bg-default-200/50", "dark:group-data-[focus=true]:bg-zinc-900/60", "!cursor-text", "border-b-2 border-t-0 border-l-0 border-r-0 group-data-[hover=true]:border-sky-500 group-data-[hover=true]:border-sky-500 focus-within:rounded-lg",],
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
            <div className="mt-5 mx-5">
                <span className="font-bold text-2xl">I nostri servizi</span>
                <div className="flex items-center justify-evenly mt-3">
                    <Card className="max-w-[340px]">
                        <CardHeader className="pb-0 pt-2 px-4">
                            <p className="font-bold text-large">MINOR PREZZO ASSICURATO</p>
                        </CardHeader>
                        <CardBody>
                            <svg viewBox="-6.4 -6.4 76.80 76.80" xmlns="http://www.w3.org/2000/svg" strokeWidth="3"
                                 stroke="#000000" fill="none">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                    <rect x="-6.4" y="-6.4" width="76.80" height="76.80" rx="38.4" fill="#57e389"
                                          strokeWidth="0"></rect>
                                </g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M58.13,37.74,16.62,54.46,14.69,49s4.08-2.13,2.74-5.84-6.19-2.9-6.19-2.9L9.35,34.64,51,18.21l2.06,4.87S48.62,25.79,50,29.63s6.25,2.94,6.25,2.94Z"></path>
                                    <line x1="18.5" y1="31.04" x2="20.77" y2="36.18" strokeDasharray="9 4"></line>
                                    <line x1="21.83" y1="38.65" x2="23.75" y2="42.99" strokeDasharray="9 4"></line>
                                    <line x1="24.47" y1="45.04" x2="26.75" y2="50.18" strokeDasharray="9 4"></line>
                                    <path d="M9.4,34.54,41.52,10.71l3.38,4.06s-3.47,3.89-1,7.15"></path>
                                </g>
                            </svg>
                            <p className="mt-2 font-medium">Offriamo a nostri clienti il miglior prezzo possibile, dandogli
                                possibilità di pagare il meno
                                possibile.</p>
                        </CardBody>
                    </Card>
                    <Card className="max-w-[340px]">
                        <CardHeader className="pb-0 pt-2 px-4">
                            <p className="font-bold text-large">MINOR PREZZO ASSICURATO</p>
                        </CardHeader>
                        <CardBody>
                            <svg viewBox="-6.4 -6.4 76.80 76.80" xmlns="http://www.w3.org/2000/svg" strokeWidth="3"
                                 stroke="#000000" fill="none">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                    <rect x="-6.4" y="-6.4" width="76.80" height="76.80" rx="38.4" fill="#57e389"
                                          strokeWidth="0"></rect>
                                </g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M58.13,37.74,16.62,54.46,14.69,49s4.08-2.13,2.74-5.84-6.19-2.9-6.19-2.9L9.35,34.64,51,18.21l2.06,4.87S48.62,25.79,50,29.63s6.25,2.94,6.25,2.94Z"></path>
                                    <line x1="18.5" y1="31.04" x2="20.77" y2="36.18" strokeDasharray="9 4"></line>
                                    <line x1="21.83" y1="38.65" x2="23.75" y2="42.99" strokeDasharray="9 4"></line>
                                    <line x1="24.47" y1="45.04" x2="26.75" y2="50.18" strokeDasharray="9 4"></line>
                                    <path d="M9.4,34.54,41.52,10.71l3.38,4.06s-3.47,3.89-1,7.15"></path>
                                </g>
                            </svg>
                            <p className="mt-2 font-medium">Offriamo a nostri clienti il miglior prezzo possibile, dandogli
                                possibilità di pagare il meno
                                possibile.</p>
                        </CardBody>
                    </Card>
                    <Card className="max-w-[340px]">
                        <CardHeader className="pb-0 pt-2 px-4">
                            <p className="font-bold text-large">Assistenza immediata</p>
                        </CardHeader>
                        <CardBody>
                            <svg viewBox="-51.2 -51.2 614.40 614.40" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                 xmlnsXlink="http://www.w3.org/1999/xlink"  fill="#000000" stroke="#000000">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                    <rect x="-51.2" y="-51.2" width="614.40" height="614.40" rx="307.2" fill="#7ed0ec"
                                          strokeWidth="0"></rect>
                                </g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier"><title>support</title>
                                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                        <g id="support" fill="#000000" transform="translate(42.666667, 42.666667)">
                                            <path
                                                d="M379.734355,174.506667 C373.121022,106.666667 333.014355,-2.13162821e-14 209.067688,-2.13162821e-14 C85.1210217,-2.13162821e-14 45.014355,106.666667 38.4010217,174.506667 C15.2012632,183.311569 -0.101643453,205.585799 0.000508304259,230.4 L0.000508304259,260.266667 C0.000508304259,293.256475 26.7445463,320 59.734355,320 C92.7241638,320 119.467688,293.256475 119.467688,260.266667 L119.467688,230.4 C119.360431,206.121456 104.619564,184.304973 82.134355,175.146667 C86.4010217,135.893333 107.307688,42.6666667 209.067688,42.6666667 C310.827688,42.6666667 331.521022,135.893333 335.787688,175.146667 C313.347976,184.324806 298.68156,206.155851 298.667688,230.4 L298.667688,260.266667 C298.760356,283.199651 311.928618,304.070103 332.587688,314.026667 C323.627688,330.88 300.801022,353.706667 244.694355,360.533333 C233.478863,343.50282 211.780225,336.789048 192.906491,344.509658 C174.032757,352.230268 163.260418,372.226826 167.196286,392.235189 C171.132153,412.243552 188.675885,426.666667 209.067688,426.666667 C225.181549,426.577424 239.870491,417.417465 247.041022,402.986667 C338.561022,392.533333 367.787688,345.386667 376.961022,317.653333 C401.778455,309.61433 418.468885,286.351502 418.134355,260.266667 L418.134355,230.4 C418.23702,205.585799 402.934114,183.311569 379.734355,174.506667 Z M76.8010217,260.266667 C76.8010217,269.692326 69.1600148,277.333333 59.734355,277.333333 C50.3086953,277.333333 42.6676884,269.692326 42.6676884,260.266667 L42.6676884,230.4 C42.6676884,224.302667 45.9205765,218.668499 51.2010216,215.619833 C56.4814667,212.571166 62.9872434,212.571166 68.2676885,215.619833 C73.5481336,218.668499 76.8010217,224.302667 76.8010217,230.4 L76.8010217,260.266667 Z M341.334355,230.4 C341.334355,220.97434 348.975362,213.333333 358.401022,213.333333 C367.826681,213.333333 375.467688,220.97434 375.467688,230.4 L375.467688,260.266667 C375.467688,269.692326 367.826681,277.333333 358.401022,277.333333 C348.975362,277.333333 341.334355,269.692326 341.334355,260.266667 L341.334355,230.4 Z"></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>

                            <p className="mt-2 font-medium">Per qualsiasi problema, il nostro team dedicato al supporto clienti è disponibile per risolverlo sia tramite chat e che per telefono.</p>
                        </CardBody>
                    </Card>
                </div>
            </div>
    </div>);
}

