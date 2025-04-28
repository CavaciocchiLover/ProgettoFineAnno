"use client"

import {DatePicker} from "@heroui/date-picker";
import {getLocalTimeZone, now, today, ZonedDateTime} from "@internationalized/date";
import {Navbar} from "@/components/navbar";
import {NumberInput} from "@heroui/number-input";
import Image from "next/image";
import {Button} from "@heroui/button";
import {MagnifyingGlass} from "@phosphor-icons/react";
import {Card, CardBody, CardHeader} from "@heroui/card";
import {Footer} from "@/components/footer";
import {useRouter} from "next/navigation";

import satis from "../public/pagamento/satis.png";
import googlePay from "../public/pagamento/google-pay.svg";
import applePay from "../public/pagamento/Apple_Pay.svg";
import paypal from "../public/pagamento/PayPal.png";
import visa from "../public/pagamento/visa.svg";
import {Autocomplete, AutocompleteItem} from "@heroui/autocomplete";
import {FormEvent, useState} from "react";
import Cookies from "js-cookie";

export type Stazione = {
    nome: string; codice: string;
}

export default function Home() {
    const [partenza, setPartenza] = useState("");
    const [arrivo, setArrivo] = useState("");
    const [data, setData] = useState<ZonedDateTime | null>(now(getLocalTimeZone()));
    const [nPersone, setNPersone] = useState(0);
    const [caricando, setCaricando] = useState(false);
    const [stazioni, setStazioni] = useState<Stazione[]>([]);
    const [stazioniArrivo, setStazioniArrivo] = useState<Stazione[]>([]);

    const router = useRouter();

    async function CercoStazione(stazione: string) {
        setCaricando(true);

        const response = await fetch(`https://corsproxy.io/?url=https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=${stazione}&limit=5`);

        if (response.ok) {
            const stazioni = await response.json();
            let dati = []

            if (stazioni.length > 5) {
                for (let i = 0; i < 5; i++) {
                    dati.push({
                        nome: stazioni[i].name,
                        codice: stazioni[i].id,
                    })
                }
            } else {
                for (const i in stazioni) {
                    dati.push({
                        nome: stazioni[i].name,
                        codice: stazioni[i].id,
                    })
                }
            }

            // dati deve essere un array fatto di oggetti composti da nome e da codice
            setCaricando(false);
            return dati;
        } else {
            setCaricando(false);
            return [];
        }

    }

    async function Redirect(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const codPartenza = stazioni.find((stazione) => stazione.nome === partenza);
        const codArrivo = stazioniArrivo.find((stazione) => stazione.nome === arrivo);

        if (codPartenza !== undefined && codArrivo !== undefined) {
                Cookies.set("ricerca", JSON.stringify({
                    partenza: codPartenza.codice,
                    arrivo: codArrivo.codice,
                    data: data?.toString(),
                    nPersone: nPersone,
                }));
            router.push("/ricerca");

        }
    }

    return (<div suppressHydrationWarning className="bg-amber-50">
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
                        <form className="grid grid-cols-2 grid-flow-row gap-5" onSubmit={Redirect}>
                            <Autocomplete
                                inputProps={{
                                    classNames: {
                                        input: ["placeholder:text-white placeholder:text-base", "text-black/90 dark:text-white/90", "text-sm",],
                                        inputWrapper: ["shadow-xl bg-zinc-950/30", "group-data-[focus=true]:bg-default-200/50", "dark:group-data-[focus=true]:bg-zinc-900/60", "!cursor-text", "border-b-0 border-t-0 border-l-0 border-r-0 focus-within:rounded-lg"],
                                    }
                                }}
                                placeholder="Da dove vuoi partire?"
                                type="search"
                                variant="bordered"
                                items={stazioni}
                                isLoading={caricando}
                                classNames={{
                                    selectorButton: ["hidden"]
                                }}
                                onInputChange={(partenza: string) => {
                                    setPartenza(partenza);
                                    if (partenza.length > 1) {
                                        CercoStazione(partenza).then((dati) => setStazioni(dati));
                                    }
                                }}
                            >
                                {(stazione) => (<AutocompleteItem key={stazione.codice}>
                                        {stazione.nome}
                                    </AutocompleteItem>)}
                            </Autocomplete>
                            <Autocomplete
                                inputProps={{
                                    classNames: {
                                        input: ["placeholder:text-white placeholder:text-base", "text-black/90 dark:text-white/90", "text-sm",],
                                        inputWrapper: ["shadow-xl bg-zinc-950/30", "group-data-[focus=true]:bg-default-200/50", "dark:group-data-[focus=true]:bg-zinc-900/60", "!cursor-text", "border-b-0 border-t-0 border-l-0 border-r-0 focus-within:rounded-lg"],
                                    }
                                }}
                                placeholder="Dove vuoi arrivare?"
                                type="search"
                                variant="bordered"
                                items={stazioniArrivo}
                                isLoading={caricando}
                                classNames={{
                                    selectorButton: ["hidden"]
                                }}
                                onInputChange={(arrivo: string) => {
                                    setArrivo(arrivo);
                                    if (arrivo.length > 1) {
                                        CercoStazione(arrivo).then((dati) => setStazioniArrivo(dati));
                                    }
                                }}
                            >
                                {(stazione) => (<AutocompleteItem key={stazione.codice}>
                                        {stazione.nome}
                                    </AutocompleteItem>)}
                            </Autocomplete>
                            <DatePicker
                                hideTimeZone
                                hourCycle={24}
                                onChange={setData}
                                classNames={{
                                    base: "dark",
                                    input: ["placeholder:text-white placeholder:text-base", "text-black/90 dark:text-white/90", "text-sm"],
                                    inputWrapper: ["shadow-xl bg-zinc-950/30", "group-data-[focus=true]:bg-default-200/50", "!cursor-text", "border-b-0 border-t-0 border-l-0 border-r-0 focus-within:rounded-lg"],
                                    timeInputLabel: ["text-white"]
                                }}
                                calendarProps={{
                                    classNames: {
                                        base: "dark",
                                        title: "text-white font-bold",
                                    }
                                }}
                                value={data}
                                label="Quando vuoi partire?"
                                minValue={today(getLocalTimeZone())}
                                firstDayOfWeek="mon"
                            />
                            <NumberInput
                                isRequired
                                classNames={{
                                    input: ["placeholder:text-white placeholder:text-base", "text-black/90 dark:text-white/90", "text-base", ],
                                    inputWrapper: ["shadow-xl bg-zinc-950/30", "group-data-[focus=true]:bg-default-200/50", "dark:group-data-[focus=true]:bg-zinc-900/60", "!cursor-text", "border-b-0 border-t-0 border-l-0 border-r-0 focus-within:rounded-lg",],
                                }}
                                placeholder="Numero di persone"
                                variant="bordered"
                                hideStepper
                                minValue={0}
                                value={nPersone}
                                onValueChange={setNPersone}
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
        <div className="">
            <span className="w-px h-px block" aria-hidden style={{marginLeft: "0.25", marginTop: "20.5"}}></span>
            <span className="mx-5 font-bold text-2xl">I nostri servizi</span>
            <div className="flex gap-4 justify-evenly mt-3">
                <Card className="max-w-[340px]">
                    <CardHeader className="pb-0 pt-2 px-4">
                        <p className="font-bold text-large">Minor prezzo assicurato</p>
                    </CardHeader>
                    <CardBody>
                        <div className="flex justify-center items-center">
                            <svg width="9.375rem" height="9.375rem" viewBox="-6.4 -6.4 76.80 76.80"
                                 xmlns="http://www.w3.org/2000/svg" strokeWidth="3" stroke="#000000" fill="none"
                                 transform="rotate(0)">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                    <path transform="translate(-6.4, -6.4), scale(4.8)" fill="#57e389"
                                          d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                                          strokeWidth="0"></path>
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
                        </div>
                        <p className="mt-2 font-medium">Offriamo a nostri clienti il miglior prezzo possibile,
                            dandogli
                            possibilità di pagare il meno
                            possibile.</p>
                    </CardBody>
                </Card>
                <Card className="max-w-[340px]">
                    <CardHeader className="pb-0 pt-2 px-4">
                        <p className="font-bold text-large">Programma ad alta fedeltà</p>
                    </CardHeader>
                    <CardBody>
                        <div className="flex justify-center items-center">
                            <svg width="9.375rem" height="9.375rem" viewBox="-102.4 -102.4 1228.80 1228.80"
                                 fill="#000000" className="icon" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                    <path transform="translate(-102.4, -102.4), scale(76.8)" fill="#ff6060"
                                          d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                                          strokeWidth="0"></path>
                                </g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M254.4 289.6c-10.4-20.8-15.2-43.2-15.2-67.2 0-85.6 69.6-155.2 155.2-155.2s155.2 69.6 155.2 155.2v4h-44v-4c0-61.6-49.6-111.2-111.2-111.2s-111.2 49.6-111.2 111.2c0 16.8 4 32.8 11.2 48l1.6 3.2-39.2 19.2-2.4-3.2z"
                                        fill=""></path>
                                    <path
                                        d="M674.4 913.6c-23.2 0-44.8-14.4-53.6-36.8-1.6-3.2-8.8-20.8-15.2-39.2 0-0.8 0-0.8-0.8-1.6-4 0-9.6 0.8-16.8 1.6-16 1.6-40.8 4-77.6 4-40.8 0-65.6-5.6-82.4-8.8-4-0.8-7.2-1.6-9.6-1.6 0 0.8-0.8 1.6-1.6 3.2-7.2 19.2-16 41.6-16 42.4-8 21.6-29.6 36.8-53.6 36.8-7.2 0-13.6-1.6-20-4l-65.6-24.8c-14.4-5.6-25.6-16-32-30.4-6.4-13.6-6.4-29.6-1.6-44 0-0.8 12-28.8 18.4-48 1.6-4.8 1.6-4.8-4-8l-1.6-0.8C200 721.6 132 652.8 128 557.6c-1.6-35.2 1.6-68 8-99.2-9.6-3.2-21.6-8.8-34.4-17.6-32-21.6-48.8-52.8-48.8-88.8 0-38.4 20.8-72.8 53.6-86.4 2.4-0.8 5.6-1.6 8.8-1.6 8.8 0 16.8 4.8 20 13.6 4.8 11.2 0 24-11.2 28.8-16.8 7.2-27.2 24.8-27.2 46.4 0 21.6 9.6 39.2 28.8 52 8 5.6 16.8 9.6 23.2 12 1.6-3.2 2.4-6.4 4-9.6 17.6-42.4 44-76.8 79.2-104 79.2-61.6 170.4-91.2 278.4-91.2 37.6 0 74.4 4 110.4 11.2 31.2-58.4 80.8-95.2 150.4-112.8 1.6-0.8 3.2-0.8 5.6-0.8 6.4 0 12 2.4 16 7.2 5.6 6.4 7.2 14.4 4 22.4-20.8 56-30.4 88-32 127.2 40 16.8 72 41.6 96.8 74.4 26.4 36 37.6 72 41.6 97.6 0.8 0 3.2 0.8 5.6 0.8h33.6c30.4 0 55.2 24.8 55.2 55.2v100c0 30.4-24.8 55.2-55.2 55.2h-33.6c-7.2 0-8.8 1.6-13.6 11.2-24.8 52-64 92.8-112 119.2-1.6 0.8-2.4 1.6-3.2 2.4 0 0.8 0.8 1.6 0.8 1.6l10.4 28c5.6 14.4 4.8 29.6-1.6 43.2-6.4 13.6-17.6 24.8-32 30.4l-65.6 24.8c-3.2 2.4-10.4 3.2-17.6 3.2z m-67.2-120.8c27.2 0 36 16.8 40.8 31.2 6.4 18.4 13.6 36 13.6 36.8v0.8c1.6 4.8 7.2 8.8 12.8 8.8 1.6 0 3.2 0 4.8-0.8l65.6-24.8c3.2-1.6 5.6-4 7.2-7.2 1.6-3.2 1.6-7.2 0-10.4l-10.4-27.2c-2.4-4-6.4-16-2.4-30.4 2.4-8 8.8-20 24.8-28.8 40.8-22.4 72.8-56 93.6-100 4.8-9.6 17.6-36 52.8-36h33.6c6.4 0 11.2-4.8 11.2-11.2V493.6c0-6.4-4.8-11.2-11.2-11.2h-33.6c-32 0-45.6-18.4-48.8-33.6-5.6-32.8-28-112.8-124.8-146.4-8.8-3.2-14.4-11.2-14.4-20-0.8-43.2 7.2-77.6 19.2-114.4-40.8 18.4-68.8 47.2-88 90.4-3.2 8-11.2 12.8-20 12.8-1.6 0-3.2 0-5.6-0.8C592 260 552 255.2 512 255.2c-98.4 0-180 27.2-251.2 82.4-60 46.4-91.2 124-87.2 218.4 3.2 78.4 61.6 136 96.8 164l0.8 0.8c20 15.2 26.4 34.4 19.2 56.8-6.4 20-16.8 45.6-19.2 50.4-0.8 3.2-0.8 6.4 0.8 9.6 1.6 3.2 4 5.6 7.2 7.2l65.6 24.8c1.6 0.8 3.2 0.8 4.8 0.8 5.6 0 10.4-3.2 12.8-8.8 0-0.8 8.8-23.2 16-41.6 4-9.6 12-32 38.4-32 7.2 0 13.6 1.6 22.4 3.2 15.2 3.2 37.6 8 73.6 8 33.6 0 56-2.4 72.8-4 8-1.6 15.2-2.4 21.6-2.4z"
                                        fill=""></path>
                                    <path
                                        d="M762.4 523.2c-24 0-43.2-19.2-43.2-43.2 0-24 19.2-43.2 43.2-43.2 24 0 43.2 19.2 43.2 43.2 0 24-19.2 43.2-43.2 43.2z"
                                        fill=""></path>
                                </g>
                            </svg>
                        </div>
                        <p className="mt-2 font-medium">Ogni volta che compri un biglietto, hai l'opportunità di
                            accumulare punti per riscattare offerte vantaggiose e numerosi premi in futuro.</p>
                    </CardBody>
                </Card>
                <Card className="max-w-[340px]">
                    <CardHeader className="pb-0 pt-2 px-4">
                        <p className="font-bold text-large">Assistenza immediata</p>
                    </CardHeader>
                    <CardBody>
                        <div className="flex justify-center items-center">
                            <svg width="9.375rem" height="9.375rem" viewBox="-51.2 -51.2 614.40 614.40"
                                 version="1.1"
                                 xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                 fill="#000000">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                    <path transform="translate(-51.2, -51.2), scale(38.4)" fill="#ffa348"
                                          d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                                          strokeWidth="0"></path>
                                </g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier"><title>support</title>
                                    <g id="Page-1" strokeWidth="0.00512" fill="none" fillRule="evenodd">
                                        <g id="support" fill="#000000" transform="translate(42.666667, 42.666667)">
                                            <path
                                                d="M379.734355,174.506667 C373.121022,106.666667 333.014355,-2.13162821e-14 209.067688,-2.13162821e-14 C85.1210217,-2.13162821e-14 45.014355,106.666667 38.4010217,174.506667 C15.2012632,183.311569 -0.101643453,205.585799 0.000508304259,230.4 L0.000508304259,260.266667 C0.000508304259,293.256475 26.7445463,320 59.734355,320 C92.7241638,320 119.467688,293.256475 119.467688,260.266667 L119.467688,230.4 C119.360431,206.121456 104.619564,184.304973 82.134355,175.146667 C86.4010217,135.893333 107.307688,42.6666667 209.067688,42.6666667 C310.827688,42.6666667 331.521022,135.893333 335.787688,175.146667 C313.347976,184.324806 298.68156,206.155851 298.667688,230.4 L298.667688,260.266667 C298.760356,283.199651 311.928618,304.070103 332.587688,314.026667 C323.627688,330.88 300.801022,353.706667 244.694355,360.533333 C233.478863,343.50282 211.780225,336.789048 192.906491,344.509658 C174.032757,352.230268 163.260418,372.226826 167.196286,392.235189 C171.132153,412.243552 188.675885,426.666667 209.067688,426.666667 C225.181549,426.577424 239.870491,417.417465 247.041022,402.986667 C338.561022,392.533333 367.787688,345.386667 376.961022,317.653333 C401.778455,309.61433 418.468885,286.351502 418.134355,260.266667 L418.134355,230.4 C418.23702,205.585799 402.934114,183.311569 379.734355,174.506667 Z M76.8010217,260.266667 C76.8010217,269.692326 69.1600148,277.333333 59.734355,277.333333 C50.3086953,277.333333 42.6676884,269.692326 42.6676884,260.266667 L42.6676884,230.4 C42.6676884,224.302667 45.9205765,218.668499 51.2010216,215.619833 C56.4814667,212.571166 62.9872434,212.571166 68.2676885,215.619833 C73.5481336,218.668499 76.8010217,224.302667 76.8010217,230.4 L76.8010217,260.266667 Z M341.334355,230.4 C341.334355,220.97434 348.975362,213.333333 358.401022,213.333333 C367.826681,213.333333 375.467688,220.97434 375.467688,230.4 L375.467688,260.266667 C375.467688,269.692326 367.826681,277.333333 358.401022,277.333333 C348.975362,277.333333 341.334355,269.692326 341.334355,260.266667 L341.334355,230.4 Z"></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <p className="mt-2 font-medium">Per qualsiasi problema, il nostro team dedicato al supporto
                            clienti è disponibile per risolverlo sia tramite chat e che per telefono.</p>
                    </CardBody>
                </Card>
            </div>
            <div className="mt-5 mx-5">
                <span className="mx-5 font-bold text-2xl">Pagamenti accettati</span>
                <div className="flex justify-evenly">
                    <Image src={satis} style={{width: "4rem", height: "auto"}} alt="satispay"/>
                    <Image src={googlePay} style={{width: "5.5rem", height: "auto"}} alt="satispay"/>
                    <Image src={applePay} style={{width: "4rem", height: "auto"}} alt="satispay"/>
                    <Image src={paypal} style={{width: "3.5rem", height: "auto"}} alt="satispay"/>
                    <Image src={visa} style={{width: "5rem", height: "auto"}} alt="satispay"/>
                </div>
            </div>
        </div>

        <Footer/>
    </div>);
}

