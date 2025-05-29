"use client"

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import Cookies from "js-cookie";
import {Divider} from "@heroui/divider";
import {Button} from "@heroui/button";
import {CreditCard, Ticket, X} from "@phosphor-icons/react";
import {Input} from "@heroui/input";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {Pagination} from "@heroui/pagination";
import {RadioGroup} from "@heroui/radio";
import {CustomRadio} from "@/components/CustomRadio";
import paypal from "../../../public/pagamento/PayPal.png";
import googlePay from "../../../public/pagamento/googlePay2.png";
import TiziaCarrello from "../../../public/carrello_vuoto.png";
import Image from "next/image";
import {PaymentIcon} from "react-svg-credit-card-payment-icons";
import luhn from "luhn";
import {Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@heroui/modal";
import QRCode from "react-qr-code";

export type trenoJSON = {
    partenza: string;
    arrivo: string;
    costo: number;
    nPersone: number;
    idTreni: string[];
    data_partenza: string;
}

export default function CarrelloPage() {
    const t = useTranslations('cartPage');
    const router = useRouter();
    const [datiTreno, setDatiTreno] = useState<trenoJSON>({});
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
    const [mese, setMese] = useState("");
    const [anno, setAnno] = useState("");
    const [metodo, setMetodo] = useState("");
    const [tipo, setTipo] = useState("Visa");
    const [errore, setErrore] = useState(false);
    const [carrelloVuoto, setCarrelloVuoto] = useState(false);
    const [valoreQRCode, setValoreQRCode] = useState("");
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    useEffect(() => {
        const carrelloCookie = Cookies.get("carrello");
        const tokenCookie = Cookies.get("token");
        if (carrelloCookie === undefined || tokenCookie === undefined) {
            router.push("/");
        } else {
            const json = JSON.parse(carrelloCookie);
            const data = new Date(json["data_partenza"]);

            if (data < new Date()) {
                Cookies.remove("carrello");
                router.push("/");
            }

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
        if (!(nomeFattura.trim().length < 3 && cognomeFattura.trim().length < 3
        && indirizzoFattura.trim().length < 3 && citta.trim().length < 3 &&
        cap.trim().length < 3 && paese.trim().length < 3 &&
        telefono.search(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm) === -1)) {
            const data = new Date();
            if (metodo === "paypal" || metodo === "gpay") {
                confermaAcquisto();
            } else if (metodo === "carta" && luhn.validate(carta) && nominativoCarta.trim().length > 2 &&
            CVV.length === 3 && (data.getFullYear().toString().substring(2) > anno || (data.getFullYear().toString().substring(2) === anno && data.getMonth() + 1 > parseInt(mese)))) {
                confermaAcquisto()
            }
        } else {
            console.log("non worky");
        }
    }

    function confermaAcquisto() {
        const nominativi = nomi.map((item, i) => {
            return item + " " + cognomi[i];
        })
        const token = Cookies.get("token");

        fetch("http://localhost:8080/compra",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                partenza: datiTreno["partenza"],
                arrivo: datiTreno["arrivo"],
                nominativo: nominativi,
                data_partenza: datiTreno["data_partenza"],
                metodo: metodo,
                costo: datiTreno["costo"] - sconto,
                data: new Date().toISOString(),
                token: token,
            })
        })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(data => {
                            if (data.length === 1) {
                                setValoreQRCode(data[0])
                                onOpen();
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                } else {
                    console.log(res.status)
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    function CercoSconto() {
        if (codiceSconto.search(codiceSconto) !== -1) {
            fetch("http://localhost:8080/sconto", {
                method: "POST",
                body: JSON.stringify({ codice: codiceSconto })
            }).then(res => {
                if (res.status === 200) {
                    res.json()
                        .then((data) => {
                            setSconto(parseFloat((datiTreno["costo"] * data["sconto"]).toFixed(2)));
                            setErrore(false);
                        })
                        .catch(() => {
                            setSconto(0)
                            setErrore(true);
                        })
                } else {
                    setSconto(0)
                    setErrore(true);
                }
            })
                .catch(() => {
                    setSconto(0)
                    setErrore(true);
                })
        }
    }

    function SvuotoCarrello() {
        setCarrelloVuoto(true);
        Cookies.remove("carrello");
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // Allow: backspace, delete, tab, escape, enter, decimal point
  if (
    [46, 8, 9, 27, 13, 110, 190].includes(e.keyCode)
      || (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) || (e.keyCode === 67 && (e.ctrlKey || e.metaKey))
      || (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) || (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
    // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39)
  ) {
    // Let it happen, don't do anything
    return;
  }
  
  // Ensure that it is a number and stop the keypress if not
  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
    e.preventDefault();
  }
};

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Get the pasted data
    const pastedData = e.clipboardData.getData('text');
    
    // Check if the pasted data contains only numbers
    if (!/^\d*$/.test(pastedData)) {
      e.preventDefault();
    }
  };

    return (
        <div className="light h-full w-full">
            {
                carrelloVuoto ? (
                    <div className="flex justify-center items-center h-screen w-screen">
                        <div>

                        </div>
                        <Image src={TiziaCarrello} alt="carrello vuoto"/>
                        <p>{t('emptyCart')}</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full w-full">
                    <div className="flex items-center justify-center p-4">
                        <div className="flex w-full max-w-5xl flex-col lg:flex-row lg:gap-8">
                            <div className="w-full">
                                <form className="flex flex-col gap-4 py-8">
                                    <div>
                                        <Card className={confermaVisibile !== nPersone ? "bg-content1" : "hidden"}>
                                            <CardHeader className="text-foreground-800">
                                                {t('passengerData')}
                                            </CardHeader>
                                            <CardBody>
                                                <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                                                    <Input
                                                        label={t('firstName')}
                                                        labelPlacement="outside"
                                                        placeholder={t('firstName')}
                                                        variant="bordered"
                                                        type="text"
                                                        className="bg-content1"
                                                        value={nome}
                                                        onValueChange={setNome}
                                                        isRequired={true}
                                                    />
                                                    <Input
                                                        label={t('lastName')}
                                                        labelPlacement="outside"
                                                        placeholder={t('lastName')}
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
                                                        {nPersone === 1 ? t('confirm') : t('next')}
                                                    </Button>
                                                    <Button
                                                        className={confermaVisibile === nPersone && nPersone !== 1  ? "text-default-800 text-md" : "hidden"}
                                                        variant={"solid"}
                                                        color="danger"
                                                    >
                                                        {t('confirm')}
                                                    </Button>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                        <div className={confermaVisibile === nPersone ? "flex flex-col gap-4" : "hidden"}>
                                            <span className="relative text-foreground-800">{t('billingInformation')}</span>
                                            <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                                                <Input
                                                    label={t('firstName')}
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
                                                    label={t('lastName')}
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
                                                    label={t('address')}
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
                                                    label={t('city')}
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
                                                    label={t('zipCode')}
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
                                                    label={t('country')}
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
                                                    label={t('phoneNumber')}
                                                    labelPlacement="outside"
                                                    placeholder="   "
                                                    variant="bordered"
                                                    type="text"
                                                    className="bg-content1"
                                                    value={telefono}
                                                    onValueChange={setTelefono}
                                                    onKeyDown={handleKeyDown}
                                                    onPaste={handlePaste}
                                                    isRequired={true}
                                                />
                                            </div>
                                            <span className="text-foreground-800 mt-4">{t('paymentMethod')}</span>
                                            <div className="flex flex-col flex-wrap gap-4">
                                                <RadioGroup value={metodo} onValueChange={setMetodo}>
                                                    <CustomRadio description="" value="carta">
                                                        <div className="flex flex-row gap-2 mx-2.5">
                                                            <CreditCard size={25} className="self-center"/>
                                                            <span>{t('creditCard')}</span>
                                                        </div>
                                                    </CustomRadio>
                                                    <CustomRadio description="" value="paypal">
                                                        <div className="flex flex-row gap-2 mx-2.5">
                                                            <Image src={paypal} className="self-center" style={{width: "1.4rem", height: "auto"}} alt="paypal"/>
                                                            <span>{t('paypal')}</span>
                                                        </div>
                                                    </CustomRadio>
                                                    <CustomRadio description="" value="gpay">
                                                        <div className="flex flex-row gap-2">
                                                            <Image src={googlePay} className="self-center" style={{width: "3rem", height: "auto"}} alt="googlePay"/>
                                                            <span>{t('googlePay')}</span>
                                                        </div>
                                                    </CustomRadio>
                                                </RadioGroup>
                                                <div className={metodo === "carta" ? "gap-4 flex flex-col flex-wrap" : "hidden"}>
                                                    <Input
                                                        label={t('cardNumber')}
                                                        labelPlacement="outside"
                                                        placeholder="  "
                                                        type="number"
                                                        variant="bordered"
                                                        startContent={
                                                            <PaymentIcon className={tipo === "" ? "hidden" : ""} type={tipo} format="flatRounded" width={25} />
                                                        }
                                                        endContent={
                                                            <div className="flex max-w-[140px] items-center">
                                                                <input
                                                                    className="w-11 rounded-sm bg-transparent text-small outline-none placeholder:text-default-400"
                                                                    min={0} minLength={0} max={12} maxLength={2} value={mese} onChange={e => setMese(e.target.value)}
                                                                    placeholder="MM" type="number" onKeyDown={handleKeyDown} onPaste={handlePaste}/>
                                                                <span className="light mx-1 text-default-300">/</span>
                                                                <input
                                                                    className="w-11 rounded-sm bg-transparent text-small outline-none placeholder:text-default-400"
                                                                    min={0} minLength={0} max={12} maxLength={2} value={anno} onChange={e => setAnno(e.target.value)}
                                                                    placeholder="YY" type="number" onKeyDown={handleKeyDown} onPaste={handlePaste}/>
                                                            </div>
                                                        }
                                                        maxLength={16}
                                                        className="bg-content1"
                                                        value={carta}
                                                        onKeyDown={handleKeyDown}
                                                        onPaste={handlePaste}
                                                        onValueChange={setCarta}
                                            
                                                    />
                                                    <Input
                                                        label={t('cardholderName')}
                                                        labelPlacement="outside"
                                                        placeholder="  "
                                                        variant="bordered"
                                                        type="text"
                                                        className="bg-content1"
                                                        value={nominativoCarta}
                                                        onValueChange={setNominativoCarta}
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
                                        {t('title')}
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
                                                radius="full"
                                                onPress={() => SvuotoCarrello()}>
                                                <X size={16} />
                                            </Button>
                                        </li>
                                    </ul>
                                    <div>
                                        <div className="mb-4 mt-6 flex items-end gap-2">
                                            <Input
                                                label={t('discountCode')}
                                                labelPlacement="outside"
                                                placeholder="  "
                                                variant="bordered"
                                                type="text"
                                                value={codiceSconto}
                                                onValueChange={setCodiceSconto}
                                                className="bg-content1"
                                            >
                                            </Input>
                                            <Button
                                                onPress={() => CercoSconto()}>
                                                {t('apply')}
                                            </Button>
                                        </div>
                                        <p className={!errore ? "hidden" : "text-center bg-red-300 text-red-700 rounded-xl p-2"}>
                                            {t('invalidCode')}
                                        </p>
                                        <div className="flex flex-col gap-4 py-4">
                                            <div className="flex justify-between">
                                                <span className="text-small text-default-500">{t('tickets')}</span>
                                                <span className="text-small font-semibold text-default-700">{datiTreno["costo"] + "€"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-small text-default-500">{t('vat')}</span>
                                                <span className="text-small font-semibold text-default-700">{(datiTreno["costo"] * 0.1).toFixed(2) + "€"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-small text-default-500">{t('discount')}</span>
                                                <span className={sconto > 0 ? "text-small font-semibold text-success" : "text-small text-default-700 font-semibold"}>{sconto > 0 ? `-${sconto}€` : "0€"}</span>
                                            </div>
                                            <Divider/>
                                            <div className="flex justify-between">
                                                <span className="text-small text-default-500">{t('total')}</span>
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
                                        {t('buy')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <>
                            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                                <ModalContent>
                                    <>
                                        <ModalHeader className="flex flex-col gap-2">{t('paymentSuccess')}</ModalHeader>
                                        <ModalBody>
                                            {
                                                nPersone === 1 ? (
                                                    <div className="grid justify-center justify-items-center">
                                                        <p className="mb-2">{t('yourTicket')} {datiTreno["partenza"]} - {datiTreno["arrivo"]}</p>
                                                        <QRCode
                                                            size={200}
                                                            value={valoreQRCode}
                                                            viewBox={`0 0 256 256`}/>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center">
                                                        {t('findTickets')}
                                                    </div>
                                                )
                                            }

                                        </ModalBody>
                                    </>
                                </ModalContent>
                            </Modal>
                        </>
                    </div>
                    </div>

                )
            }
        </div>)
}