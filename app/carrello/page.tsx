"use client"

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {Divider} from "@heroui/divider";
import {Button} from "@heroui/button";
import {CreditCard, Ticket, X} from "@phosphor-icons/react";
import {Input} from "@heroui/input";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {Pagination} from "@heroui/pagination";
import {RadioGroup} from "@heroui/radio";
import {CustomRadio} from "@/components/CustomRadio";
import paypal from "../../public/pagamento/PayPal.png";
import Image from "next/image";
import {NumberInput} from "@heroui/number-input";
import {PaymentIcon} from "react-svg-credit-card-payment-icons";


export default function CarrelloPage() {
    const router = useRouter();
    const [datiTreno, setDatiTreno] = useState({});
    const [nPersone, setNPersone] = useState(0);
    const [indexPasseggero, setIndexPasseggero] = useState(0);
    const [nomi, setNomi] = useState<string[]>([]);
    const [cognomi, setCognomi] = useState<string[]>([]);
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [confermaVisibile, setConfermaVisibile] = useState(0);
    const [codiceSconto, setCodiceSconto] = useState("");
    const [sconto, setSconto] = useState(0.0);
    const [nomeFattura, setNomeFattura] = useState("");
    const [cognomeFattura, setCognomeFattura] = useState("");
    const [indirizzoFattura, setIndirizzoFattura] = useState("");
    const [paese, setPaese] = useState("");
    const [citta, setCitta] = useState("");
    const [cap, setCap] = useState("");
    const [telefono, setTelefono] = useState("");
    const [carta, setCarta] = useState("");
    const [CVV, setCVV] = useState("");
    const [nominativoCarta, setNominativoCarta] = useState("");
    const [dataScadenza, setDataScadenza] = useState("");
    const [metodo, setMetodo] = useState("");
    const [tipo, setTipo] = useState("");

    useEffect(() => {
        const carrelloCookie = Cookies.get("carrello");
        const tokenCookie = Cookies.get("token");
        if (carrelloCookie === undefined || tokenCookie === undefined) {
            router.push("/");
        } else {
            const json = JSON.parse(carrelloCookie);
            setDatiTreno(json);
            setNPersone(json.nPersone);
        }
    }, [router]);

    function ControlloAnagrafico() {
        const regex = /^[a-zA-Zà-ùÀ-Ù]{3,}$/gm;


        if (nome.search(regex) !== -1 && cognome.search(regex) !== -1) {
            if (nomi[indexPasseggero] !== undefined && nomi[indexPasseggero] !== "") {
                setNomi(nomi.map((item, i) => {
                    if (i === indexPasseggero) {
                        return nome;
                    }
                    return item;
                }));

                setCognomi(cognomi.map((item, i) => {
                    if (i === indexPasseggero) {
                        return cognome;
                    }
                    return item;
                }));
            } else {
                setNomi(prevState => [...prevState, nome]);
                setCognomi(prevCognomi => [...prevCognomi, cognome]);
                setNome("");
                setCognome("");
                setIndexPasseggero(indexPasseggero + 1);
                setConfermaVisibile(confermaVisibile + 1);
            }
        }
    }

    function cambioPasseggero(numero: number) {
        if (nomi.length >= numero) {
            setNome(nomi[numero]);
            setCognome(cognome[numero]);
            setIndexPasseggero(numero);
        }
    }

    function Compra() {
        
    }

    function CercoSconto() {
        if (codiceSconto.search(codiceSconto) !== -1) {
            fetch("http://localhost:8080/sconto", {
                method: "POST",
                body: JSON.stringify({ codiceSconto: codiceSconto })
            }).then(res => {
                if (res.status === 200) {
                    res.json()
                        .then((data) => {
                            setSconto(data["sconto"]);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    return (<div className="light h-full w-full flex flex-col">
        <div className="flex items-center justify-center p-4">
            <div className="flex w-full max-w-5xl flex-col lg:flex-row lg:gap-8">
                <div className="w-full">
                    <form className="flex flex-col gap-4 py-8">
                        <div>
                            <Card className={confermaVisibile !== nPersone ? "bg-content1" : "hidden"}>
                                <CardHeader className="text-foreground-800">
                                    Dati passeggeri
                                </CardHeader>
                                <CardBody>
                                    <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                                        <Input
                                            label={"Nome"}
                                            labelPlacement="outside"
                                            placeholder="Inserisci il nome"
                                            variant="bordered"
                                            type="text"
                                            className="bg-content1"
                                            value={nome}
                                            onValueChange={setNome}
                                            isRequired={true}
                                        />
                                        <Input
                                            label={"Cognome"}
                                            labelPlacement="outside"
                                            placeholder="Inserisci il cognome"
                                            variant="bordered"
                                            type="text"
                                            className="bg-content1"
                                            value={cognome}
                                            onValueChange={setCognome}
                                            isRequired={true}
                                        />
                                    </div>
                                </CardBody>
                                <CardFooter className={nPersone > 1 ? "flex justify-between" : "flex justify-end bottom-0 border-t-1 p-2"}>
                                    <Pagination className={nPersone < 2 ? "hidden" : ""} loop showControls color="warning" page={indexPasseggero} onChange={(numero) => cambioPasseggero(numero)} initialPage={1} total={nPersone}/>
                                    <div className="flex gap-2">
                                        <Button
                                            className={"text-default-800 text-md"}
                                            variant={"solid"}
                                            color="success"
                                            onPress={() => ControlloAnagrafico()}
                                        >
                                            {nPersone === 1 ? "Conferma" : "Avanti"}
                                        </Button>
                                        <Button
                                            className={confermaVisibile === nPersone && nPersone !== 1  ? "text-default-800 text-md" : "hidden"}
                                            variant={"solid"}
                                            color="danger"
                                        >
                                            Conferma
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                            <div className={confermaVisibile === nPersone ? "flex flex-col gap-4" : "hidden"}>
                                <span className="relative text-foreground-800">Informazioni per la fatturazione</span>
                                <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                                    <Input
                                        label="Nome"
                                        labelPlacement="outside"
                                        placeholder="  "
                                        variant="bordered"
                                        type="text"
                                        className="bg-content1"
                                        value={nomeFattura}
                                        onValueChange={setNomeFattura}
                                        isRequired={true}
                                    />
                                    <Input
                                        label="Cognome"
                                        labelPlacement="outside"
                                        placeholder="   "
                                        variant="bordered"
                                        type="text"
                                        className="bg-content1"
                                        value={cognomeFattura}
                                        onValueChange={setCognomeFattura}
                                        isRequired={true}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                                    <Input
                                        label="Indirizzo di domicilio"
                                        labelPlacement="outside"
                                        placeholder="  "
                                        variant="bordered"
                                        type="text"
                                        className="bg-content1"
                                        value={indirizzoFattura}
                                        onValueChange={setIndirizzoFattura}
                                        isRequired={true}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                                    <Input
                                        label="Città"
                                        labelPlacement="outside"
                                        placeholder="  "
                                        variant="bordered"
                                        type="text"
                                        className="bg-content1"
                                        value={citta}
                                        onValueChange={setCitta}
                                        isRequired={true}
                                    />
                                    <Input
                                        label="CAP"
                                        labelPlacement="outside"
                                        placeholder="   "
                                        variant="bordered"
                                        type="text"
                                        className="bg-content1"
                                        value={cap}
                                        onValueChange={setCap}
                                        isRequired={true}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                                    <Input
                                        label="Paese"
                                        labelPlacement="outside"
                                        placeholder="  "
                                        variant="bordered"
                                        type="text"
                                        className="bg-content1"
                                        value={paese}
                                        onValueChange={setPaese}
                                        isRequired={true}
                                    />
                                    <Input
                                        label="Numero di telefono"
                                        labelPlacement="outside"
                                        placeholder="   "
                                        variant="bordered"
                                        type="text"
                                        className="bg-content1"
                                        value={telefono}
                                        onValueChange={setTelefono}
                                        isRequired={true}
                                    />
                                </div>
                                <span className="text-foreground-800 mt-4">Metodo di pagamento</span>
                                <div className="flex flex-col flex-wrap gap-4">
                                    <RadioGroup value={metodo} onValueChange={setMetodo}>
                                        <CustomRadio description="" value="carta">
                                            <div className="flex flex-row gap-2 mx-2.5">
                                                <CreditCard size={25} className="self-center"/>
                                                <span>Carta di credito</span>
                                            </div>
                                        </CustomRadio>
                                        <CustomRadio description="" value="paypal">
                                            <div className="flex flex-row gap-2 mx-2.5">
                                                <Image src={paypal} className="self-center" style={{width: "1.4rem", height: "auto"}} alt="paypal"/>
                                                <span>Paypal</span>
                                            </div>
                                        </CustomRadio>
                                        <CustomRadio description="" value="gpay">
                                            <div className="flex flex-row gap-2">
                                                <span>Google Pay</span>
                                            </div>
                                        </CustomRadio>
                                    </RadioGroup>
                                    <div className={metodo === "carta" ? "gap-4 flex flex-col flex-wrap" : "hidden"}>
                                        <Input
                                            label="Numero di carta"
                                            labelPlacement="outside"
                                            placeholder="  "
                                            type="number"
                                            variant="bordered"
                                            startContent={
                                                <PaymentIcon className={tipo === "" ? "hidden" : ""} type={tipo} format="flatRounded" width={25} />
                                            }
                                            maxLength={16}
                                            className="bg-content1"
                                            value={carta}
                                            onValueChange={setCarta}
                                        />
                                        <Input
                                            label="Titolare della carta"
                                            labelPlacement="outside"
                                            placeholder="  "
                                            variant="bordered"
                                            type="text"
                                            className="bg-content1"
                                            value={nominativoCarta}
                                            onValueChange={setNominativoCarta}
                                        />
                                        <Input
                                            label="Scadenza"
                                            labelPlacement="outside"
                                            placeholder="  "
                                            variant="bordered"
                                            type="date"
                                            className="bg-content1"
                                            value={dataScadenza}
                                            onValueChange={setDataScadenza}
                                        />
                                        <Input
                                            label="CVV"
                                            labelPlacement="outside"
                                            placeholder="  "
                                            variant="bordered"
                                            type="text"
                                            className="bg-content1"
                                            value={CVV}
                                            onValueChange={setCVV}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div
                    className="light w-full rounded-medium bg-content2 px-2 py-4 md:px-6 md:py-8 lg:w-[340px] lg:flex-none">
                    <div>
                        <h2 className="font-medium text-default-800 mb-1">
                            I tuoi biglietti
                        </h2>
                        <Divider/>
                        <ul>
                            <li className="flex items-center gap-x-4 border-b-small border-divider py-4">
                                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center">
                                    <div className="relative shadow-black/5 shadow-none rounded-large max-w-fit">
                                        <Ticket size={40}/>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col">
                                    <h4 className="text-small">
                                        <a
                                            className="relative inline-flex items-center tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium hover:underline hover:opacity-80 active:opacity-disabled transition-opacity underline-offset-4 font-medium text-foreground"
                                            href="#" tabIndex={0} role="link">
                                            {datiTreno["partenza"] + " - " + datiTreno["arrivo"]}
                                        </a>
                                    </h4>
                                    <div className="mt-2 flex items-center gap-2">
                                                <span
                                                    className="text-small font-semibold text-default-700">
                                                    {datiTreno["costo"]/nPersone + "€"}
                                                </span>
                                        <span
                                            className="text-small text-default-500">
                                            {"x " + datiTreno["nPersone"]}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    radius="full">
                                        <X size={16} />
                                </Button>
                            </li>
                        </ul>
                            <div>
                                <div className="mb-4 mt-6 flex items-end gap-2">
                                    <Input
                                        label={"Codice sconto"}
                                        labelPlacement="outside"
                                        placeholder="  "
                                        variant="bordered"
                                        type="text"
                                        className="bg-content1"
                                        >
                                    </Input>
                                    <Button
                                        onPress={() => CercoSconto()}>
                                        Applica
                                    </Button>
                                </div>
                                <div className="flex flex-col gap-4 py-4">
                                    <div className="flex justify-between">
                                        <span className="text-small text-default-500">Biglietti</span>
                                        <span className="text-small font-semibold text-default-700">{datiTreno["costo"] + "€"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-small text-default-500">Iva</span>
                                        <span className="text-small font-semibold text-default-700">{(datiTreno["costo"] * 0.1).toFixed(2) + "€"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-small text-default-500">Sconto</span>
                                        <span className={sconto > 0 ? "text-small font-semibold text-success" : "text-small text-default-700 font-semibold"}>{sconto > 0 ? `-${sconto}€` : "0€"}</span>
                                    </div>
                                    <Divider/>
                                    <div className="flex justify-between">
                                        <span className="text-small text-default-500">Totale</span>
                                        <span className="text-small font-semibold text-default-700">{`${datiTreno["costo"] - sconto}€`}</span>
                                    </div>

                                </div>
                            </div>
                    </div>
                    <div className="mt-4">
                        <Button
                        size="lg"
                        color="primary"
                        className="w-full"
                        onPress={() => Compra()}>
                            Compra
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}