"use client";

import {
    Navbar as HeroUINavbar,
    NavbarContent,
    NavbarBrand,
    NavbarItem,
} from "@heroui/navbar";
import {Button} from "@heroui/button";
import NextLink from "next/link";
import {Train} from "@phosphor-icons/react/dist/ssr";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
import {IBM_Plex_Sans} from "next/font/google";
import {IT, GB, ES} from "country-flag-icons/react/3x2";
import {cloneElement, useEffect, useState} from "react";
import {Link} from "@heroui/link";
import Cookies from "js-cookie";
import {Badge} from "@heroui/badge";
import {ShoppingCart} from "@phosphor-icons/react";
import {usePathname} from "next/navigation";

const plex = IBM_Plex_Sans({
    weight: '400',
    subsets: ['latin']
})

let items = [
    {
        key: "UK",
        label: "English",
        startContent: <GB/>,
    },
    {
        key: "ES",
        label: "Español",
        startContent: <ES/>,
    },
]

let selectedItem = {
    key: "IT",
    label: "Italiano",
    endContent: <IT/>,
}

const changeItem = (key: any) => {
    const oldItem = selectedItem;
    const index = items.findIndex(item => item.key === key);
    selectedItem.key = key;
    selectedItem.endContent = items[index].startContent;
    selectedItem.label = items[index].label;
    items[index].key = oldItem.key;
    items[index].startContent = oldItem.endContent;
    items[index].label = oldItem.label;
}

interface NavbarProps {
    path?: string
}

export const Navbar = ({path}: NavbarProps) => {
    const [token, setToken] = useState<string | undefined>("");
    const [carrello, setCarrello] = useState<string | undefined>("");
    const [pagina, setPagina] = useState("");

    useEffect(() => {
        setToken(Cookies.get("token"));
        setCarrello(Cookies.get("carrello"));

        if (path !== undefined) {
          setPagina(path);
        }
    }, []);

    return (
        <HeroUINavbar className={"relative z-10" + plex.className} isBordered
        >
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <NextLink className="flex justify-start items-center gap-1" href="/">
                        <Train/>
                        <p
                            className={"font-medium text-black "}
                        >
                            Trainsoup
                        </p>
                    </NextLink>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link href="/" color="foreground">Cerca biglietto</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="#" color="foreground">About</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="#" color="foreground">FAQ</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="#" color="foreground">Supporto</Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-full"
                justify="end"
            >
                <NavbarItem>
                    <div className="flex flex-row self-center gap-3">
                        <Badge color="danger" content="1" isInvisible={token === undefined || carrello === undefined || pagina === "carrello" || pagina === "login"}>
                            <Link href="/carrello" color="foreground" className={token === undefined || pagina === "carrello" ? "hidden" : ""}>
                                <ShoppingCart color="#000000" size={32}/>
                            </Link>
                        </Badge>
                        <Button href="/login" as={Link} color="warning" className={pagina === "login" ? "hidden" : ""}
                                variant="shadow">{token !== undefined ? "Logout" : "Login"}</Button>
                    </div>

                </NavbarItem>
                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="p-0"
                                radius="sm"
                                variant="light"
                                endContent={selectedItem.endContent}
                            >
                                {selectedItem.label}
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu items={items} onAction={changeItem}>
                        {(item) => (
                            <DropdownItem
                                key={item.key}
                                startContent={item.label}
                            >
                                {cloneElement(item.startContent, {style: {width: "2.2rem"}})}
                            </DropdownItem>

                        )}
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </HeroUINavbar>
    );
};
