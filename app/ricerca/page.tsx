"use client"

import {useSearchParams, useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {Card, CardBody} from "@heroui/card";
import {getDayOfWeek, getLocalTimeZone, parseDate, today} from "@internationalized/date";
import {Button} from "@heroui/button";

export default function RicercaPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const partenza = searchParams.get("p");
    const arrivo = searchParams.get("a");
    const ora = searchParams.get("o");
    const nPersone = searchParams.get("n");
    const [treni, setTreni] = useState([{
        partenza: "savigliano",
        arrivo: "porta nuova",
        oraPartenza: "12:52",
        oraArrivo: "13:52",
        costo: "25"
    }]);
    const [giorno, setGiorno] = useState(today(getLocalTimeZone()));
    const giorniPrima = useMemo(() => {
        let array = [];
        let temp = giorno;
        for (let i = 0; i < 4; i++) {
            temp = temp.cycle('day', -1);
            array.push(temp.toString());
        }
        return array;
    }, [giorno]);
    const giorniDopo = useMemo(() => {
        let array = [];
        let temp = giorno;
        for (let i = 0; i < 4; i++) {
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
        if (partenza === null || arrivo === null || ora === null || nPersone === null) {
            router.push("/");
        } else {

        }
    })

    return (
        <div className="w-full h-full">
            <div className="mb-2 flex flex-row justify-between gap-1">
                        <Button className="flex justify-center">
                            &lt;
                        </Button>
                {giorniPrima.map((x) => {
                    const data = parseDate(x);
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
                <Card className="bg-orange-300">
                    <CardBody className="text-center">
                        <p className="text-sm text-black">{Mesi[giorno.month - 1]}</p>
                        <p className="font-bold text-3xl text-red-500">{giorno.day}</p>
                        <p className="text-sm text-black">{Giorni[getDayOfWeek(giorno, 'it-IT')]}</p>
                    </CardBody>
                </Card>
                {giorniDopo.map((x) => {
                    const data = parseDate(x);
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
            {treni.map((treno, i) => {
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
            })}
        </div>
    )
}