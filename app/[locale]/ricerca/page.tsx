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

export default function RicercaPage() {
    const router = useRouter();
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

    const Mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    const Giorni = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato",]

    useEffect(() => {
        const cookie = Cookies.get("ricerca");
        if (cookie === undefined) {
            router.push("/");
        } else {
            const json = JSON.parse(cookie);
            setGiorno(parseZonedDateTime(json["data"]));
            setNPersone(json["nPersone"]);

            let tempo = giorno.toString();
            tempo = tempo.substring(0, tempo.indexOf("+"));

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const raw = JSON.stringify({
                "departureLocationId": json["partenza"],
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

            fetch("http://localhost:8080/ricerca", {
                method: "POST", headers: myHeaders, body: raw, redirect: "follow"
            }).then(async (res) => {
                let treni_json = (await res.json())["solutions"];

                let index = 0;
                const newTrains = treni_json.map((item: { [x: string]: any; }) => {
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
                            scalo.stazioneCambio.push(viaggio["nodes"][i]["origin"].toUpperCase())
                            scalo.stazioneCambio.push(viaggio["nodes"][i]["destination"].toUpperCase())
                        }
                        idTreni.push(viaggio["nodes"][scalo.numero]["train"]["name"])
                        sigla.push(viaggio["nodes"][scalo.numero]["train"]["acronym"])
                        scalo.stazioneCambio.push(viaggio["destination"].toUpperCase())
                        //ms -> min
                        tempo = (tempo / 1000) / 60;

                        if (tempo % 60 == 0) {
                            scalo.tempo = (tempo/60).toPrecision(1) + "h, " + tempo % 60 + "min";
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
            })

        }

    }, [router])

    //http://www.viaggiatreno.it/infomobilitamobile/resteasy/viaggiatreno/andamentoTreno/S04501/635/1745618400000
    function formattoTempo(numero: number) {
        return numero < 10 ? `0${numero}` : `${numero}`;
    }

    async function dettagliTreno(json_treno: {}) {
        setTrenoSelezionato(json_treno);
        // @ts-ignore
        const cambi = json_treno["idTreni"];
        setFermate([]);
        
        let allStations: string[] = [];
        
        for (const i in cambi) {
            try {
                const prima_richiesta = await fetch("https://corsproxy.io/?url=https://www.viaggiatreno.it/infomobilitamobile/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/" + cambi[i])
                
                if (prima_richiesta.status === 200) {
                    const testo = await prima_richiesta.text();
                    const vec = testo.split("\n");
                    let dati: string[] = [];
                    console.log(vec);
                    if (vec.length === 2) {
                        dati = vec[0].split("|")[1].split("-");
                    } else {
                        dati = testo.split("|")[1].split("-");
                    }
                    
                    const seconda_richiesta = await fetch(`https://corsproxy.io/?url=https://www.viaggiatreno.it/infomobilitamobile/resteasy/viaggiatreno/andamentoTreno/${dati[1]}/${cambi[i]}/${dati[2]}`)

                    if (seconda_richiesta.status === 200) {
                        const json = await seconda_richiesta.json();
                        let segmentStations: string[] = [];
                        let index = 0;
                        let stazione_partenza = -1;
                        let fine = false;
                        
                        while (index < json["fermate"].length) {
                            const currentStation = json["fermate"][index]["stazione"];
                            
                            if (currentStation === json_treno["scalo"]["stazioneCambio"][parseInt(i)]) {
                                stazione_partenza = index;
                            }
                            
                            if (parseInt(i) + 1 < json_treno["scalo"]["stazioneCambio"].length &&
                                currentStation === json_treno["scalo"]["stazioneCambio"][parseInt(i) + 1]) {
                                fine = true;
                            }
                            
                            if (stazione_partenza !== -1 && (index >= stazione_partenza)) {
                                segmentStations.push(currentStation);
                                
                                if (fine) {
                                    break;
                                }
                            }
                            
                            index++;
                        }
                        
                        if (allStations.length > 0 && segmentStations.length > 0 &&
                            allStations[allStations.length - 1] === segmentStations[0]) {
                            segmentStations.shift();
                        }
                        
                        allStations = [...allStations, ...segmentStations];
                    } else {
                        console.error("Error fetching train stations:", seconda_richiesta.statusText);
                    }
                } else {
                    console.error("Error fetching train details:", prima_richiesta.statusText);
                }
            } catch (error) {
                console.error("Error processing train segment:", error);
            }
        }
        setFermate(allStations);
        setModalTipo(0);
        onOpen();
    }

    function mostroFermate(index_fermata: number, fine: boolean) {
        let fermateFiltrate: string[] = [];
        setFermateDaMostrare([]);

        let startIndex = 0;
        let endIndex = fermate.length - 1;
        let currentSegmentStart = 0;
        
        // @ts-ignore
        const connectionPoints = trenoSelezionato["scalo"]["stazioneCambio"];

        for (let i = 0; i < connectionPoints.length; i++) {
            const pointIndex = fermate.findIndex(station => station === connectionPoints[i]);
            
            if (pointIndex !== -1) {
                if (i === index_fermata) {
                    startIndex = pointIndex;
                    currentSegmentStart = i;
                }
                
                if (i === index_fermata + 1) {
                    endIndex = pointIndex;
                }
            }
        }

        if (index_fermata === connectionPoints.length - 1) {
            endIndex = fermate.length - 1;
        }
        
        // Extract the stations for this segment
        fermateFiltrate = fermate.slice(startIndex, endIndex + 1);
        
        // Set the modal to show these stations
        setModalTipo(2);
        setFermateDaMostrare(fermateFiltrate);
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

    function cambioData(date: ZonedDateTime) {
        setGiorno(giorno.cycle('day', date.day - giorno.day))
        const json = JSON.parse(Cookies.get("ricerca")!);
        json["data"] = giorno.toString();
        Cookies.set("ricerca", JSON.stringify(json));
    }

    return (<div className="w-full h-full">
            <div className="mb-2 flex flex-row justify-between gap-1">
                {giorniPrima.map((x) => {
                    const data = parseZonedDateTime(x);
                    return (
                        <button key={x} onClick={() => cambioData(data)}>
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
                        <button key={x} onClick={() => cambioData(data)}>
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
                                        <span className="light text-default-800 font-bold text-lg  bg-[#ffffef] border-8 border-[#ffffef] rounded-xl">I viaggi successivi sono previsti per il giorno dopo</span>
                                    </div>
                                    <Card>
                                        <CardBody className="flex-row gap-5 bg-[#ffffef]">
                                            <div className="flex flex-col gap-2 mx-5 flex-shrink-0">
                                                <p className="light font-bold text-default-800 text-lg">{treno['partenza']}</p>
                                                <p className="text-red-500 font-bold text-xl">{formattoTempo(treno["oraPartenza"].getHours()) + ":" + formattoTempo(treno["oraPartenza"].getMinutes())}</p>
                                            </div>
                                            <div className="flex flex-col gap-2 mx-[8%] flex-shrink-0">
                                                <p className="light font-bold text-default-800 text-lg">{treno['arrivo']}</p>
                                                <p className="text-red-500 text-xl font-bold">{formattoTempo(treno["oraArrivo"].getHours()) + ":" + formattoTempo(treno["oraArrivo"].getMinutes())}</p>
                                            </div>
                                            <div className="grid gap-2 w-screen justify-items-end mr-5">
                                                <p className="light text-default-800 text-lg">{"Durata viaggio: " + treno["durata"]}</p>
                                                <p className="light text-default-800 text-lg">{treno['costo'] === 0 ? "Non prenotabile" : "Costo: " + (treno['costo'] * nPersone) + "€"}</p>
                                            </div>
                                        </CardBody>
                                        <Divider/>
                                        <CardFooter className={"bg-[#ffffef] flex justify-end bottom-0 border-t-1 p-2 gap-2"}>
                                            <Button
                                                className={treno["scalo"]["numero"] === 0 ? "hidden" : "light text-default-800 text-md"}
                                                variant={"light"}
                                                endContent={<Info size={25} color="#000000"/>}
                                                onPress={() => dettagliTreno(treno)}
                                            >
                                                {treno["scalo"]["numero"] + " cambi/o, " + treno["scalo"]["tempo"]}
                                            </Button>
                                            <Button
                                                className={treno['costo'] === 0 ? "hidden" : "text-default-800 text-md"}
                                                variant={"solid"}
                                                color="danger"
                                                onPress={() => acquista(treni[i])}
                                            >
                                                Acquista
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            )
                        } else {
                            return (
                                <div key={i}>
                                    <Card>
                                        <CardBody className="flex-row gap-5 bg-[#ffffef]">
                                            <div className="flex flex-col gap-2 mx-5 flex-shrink-0">
                                                <p className="light font-bold text-default-800 text-lg">{treno['partenza']}</p>
                                                <p className="text-red-500 font-bold text-xl">{formattoTempo(treno["oraPartenza"].getHours()) + ":" + formattoTempo(treno["oraPartenza"].getMinutes())}</p>
                                            </div>
                                            <div className="flex flex-col gap-2 mx-[8%] flex-shrink-0">
                                                <p className="light font-bold text-default-800 text-lg">{treno['arrivo']}</p>
                                                <p className="text-red-500 text-xl font-bold">{formattoTempo(treno["oraArrivo"].getHours()) + ":" + formattoTempo(treno["oraArrivo"].getMinutes())}</p>
                                            </div>
                                            <div className="grid gap-2 w-screen justify-items-end mr-5">
                                                <p className="light text-default-800 text-lg">{"Durata viaggio: " + treno["durata"]}</p>
                                                <p className="light text-default-800 text-lg">{treno['costo'] === 0 ? "Non prenotabile" : "Costo: " + (treno['costo'] * nPersone) + "€"}</p>
                                            </div>
                                        </CardBody>
                                        <Divider/>
                                        <CardFooter className={"bg-[#ffffef] flex justify-end bottom-0 border-t-1 p-2 gap-2"}>
                                            <Button
                                                className={treno["scalo"]["numero"] === 0 ? "hidden" : "light text-default-800 text-md"}
                                                variant={"light"}
                                                endContent={<Info size={25} color="#000000"/>}
                                                onPress={() => dettagliTreno(treno)}
                                            >
                                                {treno["scalo"]["numero"] + " cambi/o, " + treno["scalo"]["tempo"]}
                                            </Button>
                                            <Button
                                                className={treno['costo'] === 0 ? "hidden" : "text-default-800 text-md"}
                                                variant={"solid"}
                                                color="danger"
                                                onPress={() => acquista(treno)}
                                            >
                                                Acquista
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
                                                             <div className="flex flex-row gap-1 pl-32">
                                                                 <div className="h-10 w-0.5 bg-black"/>
                                                                 <Button
                                                                     className={"light text-default-800 text-md"}
                                                                     variant={"light"}
                                                                     onPress={() => mostroFermate(i, false)}
                                                                 >
                                                                     Vedi fermate
                                                                 </Button>
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
                                                             <div className="flex flex-row gap-1 pl-32">
                                                                 <div className="h-10 w-0.5 bg-black"/>
                                                                 <Button
                                                                     className={"light text-default-800 text-md"}
                                                                     variant={"light"}
                                                                     onPress={() => mostroFermate(i, true)}
                                                                 >
                                                                     Vedi fermate
                                                                 </Button>
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
        </div>)
}