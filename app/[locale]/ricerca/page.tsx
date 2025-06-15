"use client"

import {useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {Card, CardBody, CardFooter} from "@heroui/card";
import {getDayOfWeek, getLocalTimeZone, now, parseZonedDateTime, ZonedDateTime} from "@internationalized/date";
import Cookies from "js-cookie";
import {Info, Train, Warning} from "@phosphor-icons/react";
import {Button} from "@heroui/button";
import {Modal, ModalContent, ModalBody, ModalHeader, useDisclosure} from "@heroui/modal";
import {Divider} from "@heroui/divider";
import {useTranslations} from "next-intl";
import Image from "next/image";
import ConfusedGuy from "../../../public/confused.png";

export default function RicercaPage() {
    const router = useRouter();
    const t = useTranslations('ricercaPage');
    const [nPersone, setNPersone] = useState(0);
    const [treni, setTreni] = useState([]);
    const [giorno, setGiorno] = useState<ZonedDateTime>(now(getLocalTimeZone()));
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [fermate, setFermate] = useState<string[]>([]);
    const [trenoSelezionato, setTrenoSelezionato] = useState({});
    const [giornoDopo, setGiornoDopo] = useState(-1);
    //0 -> mostra fermate, 1 -> errore per non aver fatto il login, 2 -> mostra fermate specifiche
    const [modalTipo, setModalTipo] = useState(0);
    const [fermateDaMostrare, setFermateDaMostrare] = useState<string[]>([]);

    const giorniPrima = useMemo(() => {
        let array = [];
        let temp = giorno;
        for (let i = 0; i < 3; i++) {
            temp = temp.cycle('day', -1);
            array.push(temp.toString());
        }
        return array.reverse();
    }, [giorno]);
    const giorniDopo = useMemo(() => {
        let array = [];
        let temp = giorno;
        for (let i = 0; i < 3; i++) {
            temp = temp.cycle('day', +1);
            array.push(temp.toString());
        }
        return array;
    }, [giorno]);

    const Mesi = t.raw('months');

    const Giorni = t.raw('days');

    useEffect(() => {
        const cookie = Cookies.get("ricerca");
        if (cookie === undefined) {
            router.push("/");
        } else {
            const json = JSON.parse(cookie);
            setGiorno(parseZonedDateTime(json["data"]));
            setNPersone(json["nPersone"]);
            cercoTreni(json);
        }

    }, [router])

    function cercoTreni(json: {}) {
        //@ts-ignore
        let tempo = parseZonedDateTime(json["data"]).toString();
        tempo = tempo.substring(0, tempo.indexOf("+"));

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            //@ts-ignore
            "departureLocationId": json["partenza"],
            //@ts-ignore
            "arrivalLocationId": json["arrivo"],
            "departureTime": tempo,
            "adults": 1,
            "children": 0,
            "criteria": {
                "frecceOnly": false,
                "regionalOnly": false,
                "noChanges": false,
                "order": "DEPARTURE_DATE",
                "limit": 8,
                "offset": 0
            },
            "advancedSearchRequest": {"bestFare": false}
        });

        fetch("http://141.144.245.5:8080/ricerca", {
            method: "POST", headers: myHeaders, body: raw, redirect: "follow"
        }).then(async (res) => {
            if (res.status == 200) {
                const treni = await res.text();
                if (treni.length === 0) {

                } else {
                    let treni_json = (JSON.parse(treni))["solutions"];

                    let index = 0;
                    let newTrains= treni_json.map((item: { [x: string]: any; }) => {
                        const viaggio = item["solution"];
                        let costo = 0;
                        let scalo = {
                            numero: 0,
                            tempo: "",
                            stazioneCambio: [],
                        };
                        let idTreni: string[] = [];
                        let sigla: string[] = [];

                        if (viaggio["price"] !== null) {
                            costo = viaggio["price"]["amount"];
                        }

                        if (viaggio["nodes"].length > 1) {
                            scalo.numero = viaggio["nodes"].length - 1;
                            let tempo = 0;
                            for (let i = 0; i < scalo.numero; i++) {
                                tempo = new Date(viaggio["nodes"][i + 1]["departureTime"]).getTime() - new Date(viaggio["nodes"][i]["arrivalTime"]).getTime();
                                idTreni.push(viaggio["nodes"][i]["train"]["name"])
                                sigla.push(viaggio["nodes"][i]["train"]["acronym"])
                                //@ts-ignore
                                scalo.stazioneCambio.push(viaggio["nodes"][i]["origin"].toUpperCase())
                                //@ts-ignore
                                scalo.stazioneCambio.push(viaggio["nodes"][i]["destination"].toUpperCase())
                            }
                            idTreni.push(viaggio["nodes"][scalo.numero]["train"]["name"])
                            sigla.push(viaggio["nodes"][scalo.numero]["train"]["acronym"])
                            //@ts-ignore
                            scalo.stazioneCambio.push(viaggio["destination"].toUpperCase())
                            //ms -> min
                            tempo = (tempo / 1000) / 60;

                            if (tempo % 60 == 0) {
                                scalo.tempo = (tempo / 60).toPrecision(1) + "h, " + tempo % 60 + "min";
                            } else {
                                scalo.tempo = tempo + " min"
                            }
                        } else {
                            idTreni.push(viaggio["trains"][0]["name"])
                            sigla.push(viaggio["trains"][0]["acronym"])
                        }

                        if (giornoDopo === -1 && item["nextDaySolution"]) {
                            setGiornoDopo(index);
                        } else {
                            index++;
                        }

                        return {
                            partenza: viaggio["origin"],
                            arrivo: viaggio["destination"],
                            oraPartenza: new Date(viaggio["departureTime"]),
                            oraArrivo: new Date(viaggio["arrivalTime"]),
                            costo: costo,
                            scalo: scalo,
                            durata: viaggio["duration"],
                            idTreni: idTreni,
                            sigla: sigla,
                        };
                    });
                    // @ts-ignore
                    setTreni(prevTreni => [...prevTreni, ...newTrains]);
                }
            }

        })
    }

    function formattoTempo(numero: number) {
        return numero < 10 ? `0${numero}` : `${numero}`;
    }

    async function dettagliTreno(json_treno: {}) {
        setTrenoSelezionato(json_treno);
        // @ts-ignore
        const cambi = json_treno["idTreni"];
        setFermate([]);

        setModalTipo(0);
        onOpen();
    }

    function acquista(treno: {
        arrivo: string,
        costo: number,
        durata: string,
        idTreni: [],
        oraArrivo: Date,
        oraPartenza: Date,
        partenza: string,
        scalo: {
            numero: number,
            tempo: string,
            stazioneCambio: [],
        },
        sigla: []
    }) {
        const cookie = Cookies.get("token");
        if (cookie === undefined) {
            setModalTipo(1);
            onOpen();
        } else {
            let idCompleto = [];
            for (let i = 0; i < treno.idTreni.length; i++) {
                idCompleto.push(treno.sigla[i] + " " + treno.idTreni[i])
            }

            let json = {
                partenza: treno.partenza,
                arrivo: treno.arrivo,
                costo: treno.costo * nPersone,
                nPersone: nPersone,
                idTreni: idCompleto,
                data_partenza: treno.oraPartenza.toString()

            };
            Cookies.set("carrello", JSON.stringify(json));
            router.push("/carrello");
        }
    }

    function cambioData(date: number) {
        setGiorno(giorno.cycle('day', date));
        const json = JSON.parse(Cookies.get("ricerca")!);
        json["data"] = giorno.toString();
        Cookies.set("ricerca", JSON.stringify(json));

        setTreni([])
        cercoTreni(json);
    }

    return (
        <div className="h-full w-full">
            {
                treni.length === 0 ? (
                    <div className="flex gap-3 justify-center items-center h-screen w-screen">
                        <Image src={ConfusedGuy} alt="that's just a confused guy" width={200} height={200}/>
                        <p className="text-xl font-bold">{t('noResults')}</p>
                    </div>
                ) : (
                    <div className="h-screen w-screen">
                        <div className="mb-2 flex flex-row justify-between gap-1">
                            {giorniPrima.map((x) => {
                                const data = parseZonedDateTime(x);
                                return (
                                    <button key={x} onClick={() => cambioData(data.day - giorno.day)}>
                                        <Card className="bg-foreground/30">
                                            <CardBody className="text-center">
                                                <p className="text-sm text-black">{Mesi[data.month - 1]}</p>
                                                <p className="font-bold text-3xl text-black">{data.day}</p>
                                                <p className="text-sm text-black">{Giorni[getDayOfWeek(data, 'it-IT')]}</p>
                                            </CardBody>
                                        </Card>
                                    </button>
                                )
                            })}
                            <Card className="bg-emerald-300">
                                <CardBody className="text-center">
                                    <p className="text-sm text-black">{Mesi[giorno.month - 1]}</p>
                                    <p className="font-bold text-3xl text-red-500">{giorno?.day}</p>
                                    <p className="text-sm text-black">{Giorni[getDayOfWeek(giorno, 'it-IT')]}</p>
                                </CardBody>
                            </Card>
                            {giorniDopo.map((x) => {
                                const data = parseZonedDateTime(x);
                                return (
                                    <button key={x} onClick={() => cambioData(data.day - giorno.day)}>
                                        <Card className="bg-foreground/30" >
                                            <CardBody className="text-center">
                                                <p className="text-sm text-black">{Mesi[data.month - 1]}</p>
                                                <p className="font-bold text-3xl text-black">{data.day}</p>
                                                <p className="text-sm text-black">{Giorni[getDayOfWeek(data, 'it-IT')]}</p>
                                            </CardBody>
                                        </Card>
                                    </button>
                                )
                            })}
                        </div>
                        <div className="mt-5 flex flex-col gap-2">
                            {treni.map((treno: {
                                    partenza: string,
                                    arrivo: string,
                                    oraPartenza: Date,
                                    oraArrivo: Date,
                                    costo: number,
                                    scalo: {
                                        numero: number,
                                        tempo: string,
                                        stazioneCambio: [],
                                    },
                                    durata: string,
                                    idTreni: [],
                                    sigla: []
                                }, i) => {
                                    if (giornoDopo === i) {
                                        return (
                                            <div key={i}>
                                                <div className="flex justify-center mb-4 mt-3">
                                                    <span className="light text-default-800 font-bold text-lg  bg-[#ffffef] border-8 border-[#ffffef] rounded-xl">{t('nextDaySolution')}</span>
                                                </div>
                                                <Card>
                                                    <CardBody className="flex flex-row gap-1 bg-[#ffffef]">
                                                        <div className="flex flex-col gap-2">
                                                            <div>
                                                                {treno.idTreni.map((id, index) => (
                                                                    <div key={index} className="flex flex-row gap-1 light mx-5 rounded-md text-sm text-default-800 font-medium">
                                                                        <p className="font-bold">
                                                                            {treno.sigla[index] === "UB" ? t('urbanTransport') : treno.sigla[index] + " " + id}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex flex-row gap-5">
                                                                <div className="flex flex-col gap-2 mx-5 flex-shrink-0">
                                                                    <p className="light font-bold text-default-800 text-lg">{treno['partenza']}</p>
                                                                    <p className="text-red-500 font-bold text-xl">{formattoTempo(treno["oraPartenza"].getHours()) + ":" + formattoTempo(treno["oraPartenza"].getMinutes())}</p>
                                                                </div>
                                                                <div className="flex flex-col gap-2 mx-[8%] flex-shrink-0">
                                                                    <p className="light font-bold text-default-800 text-lg">{treno['arrivo']}</p>
                                                                    <p className="text-red-500 text-xl font-bold">{formattoTempo(treno["oraArrivo"].getHours()) + ":" + formattoTempo(treno["oraArrivo"].getMinutes())}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid w-screen justify-items-end items-center mr-5">
                                                            <p className="light text-default-800 text-lg">{t('journeyDuration') + " " + treno["durata"]}</p>
                                                            <p className="light text-default-800 text-lg">{treno["costo"] === 0 ? t('notBookable') : t('cost') + " €" + treno["costo"] * nPersone}</p>
                                                        </div>
                                                    </CardBody>
                                                    <Divider/>
                                                    <CardFooter className={"bg-[#ffffef] flex justify-end bottom-0 border-t-1 p-2 gap-2 " + (treno["costo"] === 0 && treno["scalo"]["numero"] === 0 ? "hidden" : "")}>
                                                        <Button
                                                            className={treno["scalo"]["numero"] === 0 ? "hidden" : "light text-default-800 text-md"}
                                                            variant={"light"}
                                                            endContent={<Info size={25} color="#000000"/>}
                                                            onPress={() => dettagliTreno(treno)}
                                                        >
                                                            {treno["scalo"]["numero"]} {t('changes')} {treno["scalo"]["tempo"]}
                                                        </Button>
                                                        <Button
                                                            className={treno['costo'] === 0 ? "hidden" : "text-default-800 text-md"}
                                                            variant={"solid"}
                                                            color="danger"
                                                            onPress={() => acquista(treno)}
                                                        >
                                                            {t('buy')}
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={i}>
                                                <Card>
                                                    <CardBody className="flex flex-row gap-1 bg-[#ffffef]">
                                                        <div className="flex flex-col gap-2">
                                                            <div>
                                                                {treno.idTreni.map((id, index) => (
                                                                    <div key={index} className="flex flex-row gap-1 light mx-5 rounded-md text-sm text-default-800 font-medium">
                                                                        <p className="font-bold">
                                                                            {treno.sigla[index] === "UB" ? t('urbanTransport') : treno.sigla[index] + " " + id}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex flex-row gap-5">
                                                                <div className="flex flex-col gap-2 mx-5 flex-shrink-0">
                                                                    <p className="light font-bold text-default-800 text-lg">{treno['partenza']}</p>
                                                                    <p className="text-red-500 font-bold text-xl">{formattoTempo(treno["oraPartenza"].getHours()) + ":" + formattoTempo(treno["oraPartenza"].getMinutes())}</p>
                                                                </div>
                                                                <div className="flex flex-col gap-2 mx-[8%] flex-shrink-0">
                                                                    <p className="light font-bold text-default-800 text-lg">{treno['arrivo']}</p>
                                                                    <p className="text-red-500 text-xl font-bold">{formattoTempo(treno["oraArrivo"].getHours()) + ":" + formattoTempo(treno["oraArrivo"].getMinutes())}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid w-screen justify-items-end items-center mr-5">
                                                            <p className="light text-default-800 text-lg">{t('journeyDuration') + " " + treno["durata"]}</p>
                                                            <p className="light text-default-800 text-lg">{treno["costo"] === 0 ? t('notBookable') : t('cost') + " €" + treno["costo"] * nPersone}</p>
                                                        </div>
                                                    </CardBody>
                                                    <Divider/>
                                                    <CardFooter className={"bg-[#ffffef] flex justify-end bottom-0 border-t-1 p-2 gap-2 " + (treno["costo"] === 0 && treno["scalo"]["numero"] === 0 ? "hidden" : "")}>
                                                        <Button
                                                            className={treno["scalo"]["numero"] === 0 ? "hidden" : "light text-default-800 text-md"}
                                                            variant={"light"}
                                                            endContent={<Info size={25} color="#000000"/>}
                                                            onPress={() => dettagliTreno(treno)}
                                                        >
                                                            {treno["scalo"]["numero"]} {t('changes')} {treno["scalo"]["tempo"]}
                                                        </Button>
                                                        <Button
                                                            className={treno['costo'] === 0 ? "hidden" : "text-default-800 text-md"}
                                                            variant={"solid"}
                                                            color="danger"
                                                            onPress={() => acquista(treno)}
                                                        >
                                                            {t('buy')}
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </div>
                                        )
                                    }

                                }
                            )}
                        </div>
                        <Modal backdrop="opaque" isDismissable  isOpen={isOpen} onClose={onOpenChange}>
                            <ModalContent>
                                {() => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">Fermate del treno</ModalHeader>
                                        <ModalBody>
                                            {
                                                modalTipo === 0 ? (
                                                    <div className="flex flex-col justify-center items-center p-6  rounded-lg max-w-xs mx-auto">
                                                        {
                                                            //@ts-ignore
                                                            trenoSelezionato["scalo"]["stazioneCambio"].map((stazione, i) => {
                                                                if (i == 0) {
                                                                    return (<div className="flex flex-row gap-1" key={stazione + "_" + i}>
                                                                        <Train size={25} color="#000000" className="self-center"/>
                                                                        <div className="text-lg font-medium py-2">{stazione}</div>
                                                                    </div>)
                                                                    //@ts-ignore
                                                                } else if (i != trenoSelezionato["scalo"]["stazioneCambio"].length - 1) {
                                                                    return (
                                                                        <div className="flex flex-col justify-center items-center" key={stazione + "_" + i}>
                                                                            <div className="flex justify-center items-center">
                                                                                <div className="h-10 w-0.5 bg-black"/>
                                                                            </div>

                                                                            <div className="text-lg font-medium py-2">{stazione}</div>
                                                                            <div className="flex flex-row gap-1">
                                                                                <div className="text-lg font-medium py-2">{stazione}</div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <div className="flex flex-col justify-center items-center" key={stazione + "_" + i}>
                                                                            <div className="flex justify-center items-center">
                                                                                <div className="h-10 w-0.5 bg-black"/>
                                                                            </div>
                                                                            <div className="text-lg font-medium py-2">{stazione}</div>
                                                                        </div>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                ) : (
                                                    modalTipo === 1 ? (
                                                        <div className="flex flex-col justify-center items-center p-3 text-center rounded-lg max-w-xs mx-auto">
                                                            <Warning size={50} color="#f9a804"/>
                                                            <p>Devi essere loggatə per poter acquistare un biglietto</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col justify-center items-center p-6  rounded-lg max-w-xs mx-auto">
                                                            {
                                                                fermateDaMostrare.map((stazione, i) => {
                                                                    if (i === 0) {
                                                                        return (
                                                                            <div className="flex flex-row gap-1" key={stazione + "_" + i}>
                                                                                <Train size={25} color="#000000" className="self-center"/>
                                                                                <div className="text-lg font-medium py-2">{stazione}</div>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <div className="flex flex-col justify-center items-center" key={stazione + "_" + i}>
                                                                                <div className="h-10 w-0.5 bg-black"/>
                                                                                <div className="text-lg font-medium py-2">{stazione}</div>
                                                                            </div>
                                                                        )
                                                                    }

                                                                })
                                                            }
                                                        </div>
                                                    )
                                                )
                                            }

                                        </ModalBody>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </div>
                )
            }
        </div>)
}