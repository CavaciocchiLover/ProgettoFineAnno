"use client"

import {useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {Card, CardBody} from "@heroui/card";
import {
    getDayOfWeek,
    getLocalTimeZone,
    parseDate,
    now,
    ZonedDateTime, parseZonedDateTime
} from "@internationalized/date";
import {Button} from "@heroui/button";
import Cookies from "js-cookie";

export default function RicercaPage() {
    const router = useRouter();
    const [nPersone, setNPersone] = useState(0);
    const [treni, setTreni] = useState([{
        partenza: "Savigliano",
        arrivo: "Torino Porta Nuova",
        oraPartenza: "12:52",
        oraArrivo: "13:52",
        costo: "25"
    }]);
    const [giorno, setGiorno] = useState<ZonedDateTime>(now(getLocalTimeZone()));
    const giorniPrima = useMemo(() => {
        let array = [];
        let temp = giorno;
        for (let i = 0; i < 6; i++) {
            temp = temp.cycle('day', -1);
            array.push(temp.toString());
        }
        return array;
    }, [giorno]);
    const giorniDopo = useMemo(() => {
        let array = [];
        let temp = giorno;
        for (let i = 0; i < 6; i++) {
            temp = temp.cycle('day',+1);
            array.push(temp.toString());
        }
        return array;
    }, [giorno]);

    const Mesi = [
        'Gennaio',
        'Febbraio',
        'Marzo',
        'Aprile',
        'Maggio',
        'Giugno',
        'Luglio',
        'Agosto',
        'Settembre',
        'Ottobre',
        'Novembre',
        'Dicembre'
    ];

    const Giorni = [
        "Domenica",
        "Lunedì",
        "Martedì",
        "Mercoledì",
        "Giovedì",
        "Venerdì",
        "Sabato",
    ]

    useEffect(() => {
        const cookie = Cookies.get("ricerca");
        if (cookie === undefined) {
            router.push("/");
        } else {
            const json = JSON.parse(cookie);
            setGiorno(parseZonedDateTime(json["data"]));
            setNPersone(json["nPersone"]);

            const tempo = new Date();
            fetch("http://localhost:8080/ricerca", {
                method: "POST",
                body: JSON.stringify({
                    cod_stazione_partenza: json["partenza"],
                    cod_stazione_arrivo: json["arrivo"],
                    timestamp: encodeURIComponent(tempo.toDateString() + " " + tempo.toTimeString())
                })
            }).then(async (res) => {
                if (res.status === 200) {
                    const registro = await res.json();
                    for (const treno in registro) {
                        fetch("https://corsproxy.io/?url=http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/" + registro[treno]["NumeroTreno"])
                            .then(async (resp_dettagli) => {
                                if (resp_dettagli.status === 200) {
                                    const codici = (await resp_dettagli.text()).split("-");
                                    fetch("https://corsproxy.io/?url=http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/" + codici[1] + "/" + codici[2] + "/" + codici[3])
                                        .then(async (resp_fermate) => {
                                            if(resp_fermate.status === 200) {
                                                const fermate = (await resp_fermate.json())["fermate"];
                                                let trovato = false;
                                                let i = 0;
                                                while (!trovato && i < fermate.length) {
                                                    if (fermate[i].stazione === json["arrivo"]) {
                                                        trovato = true;
                                                        console.log(fermate[ireve])
                                                    } else {
                                                        i++;
                                                    }
                                                }
                                            }
                                        })
                                }
                            })
                    }
                }
            })
        }

    }, [router])

    return (
        <div className="w-full h-full">
            <div className="mb-2 flex flex-row justify-between gap-1">
                {giorniPrima.map((x) => {
                    const data = parseZonedDateTime(x);
                    return (
                        <Card className="bg-foreground/30" key={x}>
                            <CardBody className="text-center">
                                <p className="text-sm text-black">{Mesi[data.month - 1]}</p>
                                <p className="font-bold text-3xl text-red-500">{data.day}</p>
                                <p className="text-sm text-black">{Giorni[getDayOfWeek(data, 'it-IT')]}</p>
                            </CardBody>
                        </Card>
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
                        <Card className="bg-foreground/30" key={x}>
                            <CardBody className="text-center">
                                <p className="text-sm text-black">{Mesi[data.month - 1]}</p>
                                <p className="font-bold text-3xl text-red-500">{data.day}</p>
                                <p className="text-sm text-black">{Giorni[getDayOfWeek(data, 'it-IT')]}</p>
                            </CardBody>
                        </Card>
                    )
                })}
            </div>
            <div className="mt-5">
                {/*treni.map((treno, i) => {
                    return (
                        <Card key={i}>
                            <CardBody className="flex flex-row gap-5">
                                <p>{treno['partenza']}</p>
                                <p>{treno['arrivo']}</p>
                                <p>{treno['oraPartenza']}</p>
                                <p>{treno['oraArrivo']}</p>
                                <p>{treno['costo']}</p>
                            </CardBody>
                        </Card>
                    )
                })*/}
                <Card>
                    <CardBody className="flex-row gap-5 bg-purple-300">
                        <div className="flex flex-col gap-2 mx-5">
                            <p className="light font-bold text-default-800 text-xl">{treni[0]['partenza']}</p>
                            <p className="text-red-500 text-center text-lg">{treni[0]['oraPartenza']}</p>
                        </div>
                        <div className="flex flex-col gap-2 mx-[8%] flex-shrink-0">
                            <p className="light font-bold text-default-800 text-xl">{treni[0]['arrivo']}</p>
                            <p className="text-red-500 text-center text-lg">{treni[0]['oraArrivo']}</p>
                        </div>
                        <div className="grid gap-2 w-screen justify-items-end mr-5">
                            <p className="light text-default-800 text-lg">{"Durata viaggio: " + "1h"}</p>
                            <p className="light text-default-800 text-lg">{"Costo: " + (parseFloat(treni[0]['costo'])*nPersone) + "€"}</p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}