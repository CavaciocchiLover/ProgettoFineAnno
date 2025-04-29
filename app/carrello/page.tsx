"use client"

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import Cookies from "js-cookie";

export default function CarrelloPage() {
    const router = useRouter();
    useEffect(() => {
        const carrelloCookie = Cookies.get("carrello");
        const tokenCookie = Cookies.get("token");
        if (carrelloCookie === undefined || tokenCookie === undefined) {
            router.push("/");
        } else {
            const json = JSON.parse(carrelloCookie);
            console.log(json);
        }
    }, [router]);

    return (
        <div className="h-full w-full">
            <div className="">

            </div>
        </div>
    )
}