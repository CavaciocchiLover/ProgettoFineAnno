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
import {ShoppingCart, User, SignOut, CaretDown} from "@phosphor-icons/react";
import {Divider} from "@heroui/divider";
import {useTranslations} from "next-intl";
import {usePathname} from "next/navigation";

const plex = IBM_Plex_Sans({
    weight: '400',
    subsets: ['latin']
})

let items = [
    {
        key: "en",
        label: "English",
        endContent: <GB/>,
    },
    {
        key: "es",
        label: "Español",
        endContent: <ES/>,
    },
]

let selectedItem = {
    key: "it",
    label: "Italiano",
    endContent: <IT/>,
}

const changeItem = (key: string, path: string) => {
    window.location.href = `/${key}/${path}`;
}

interface NavbarProps {
    path?: string
}

export const Navbar = ({path}: NavbarProps) => {
    const [token, setToken] = useState<string | undefined>("");
    const [pagina, setPagina] = useState("");
    const locale = useTranslations('navbar');
    const localeCookie = Cookies.get("NEXT_LOCALE");

    useEffect(() => {
        setToken(Cookies.get("token"));

        if (path !== undefined) {
          setPagina(path);
        }

        if(localeCookie !== undefined || localeCookie !== "it") {
            let trovato = false;
            let i = 0;
            while (!trovato && i < items.length) {
                if (items[i]["key"] === localeCookie) {
                    selectedItem = items[i];
                    items = items.filter((item) => item.key !== localeCookie);
                    items.push({
                        key: "it",
                        label: "Italiano",
                        endContent: <IT/>,
                    })
                    trovato = true;
                } else {
                    i++;
                }
            }
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
                    <Link href="/" color="foreground">{locale("home")}</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/faq" color="foreground">{locale("faq")}</Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-full"
                justify="end"
            >
                <NavbarItem>
                    <div className="flex flex-row self-center gap-3">
                        {token !== undefined ? (
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button 
                                        color="warning" 
                                        variant="shadow" 
                                        className={pagina === "login" ? "hidden" : ""}
                                        endContent={<CaretDown size={18} />}
                                    >
                                        {locale("account")}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Account Actions">
                                    <DropdownItem key="profilo" startContent={<User size={18} />}>
                                        <Link color="foreground" href="/profilo">
                                            {locale("profile")}
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem showDivider key="carrello" startContent={<ShoppingCart size={18} />}>
                                        <Link href="/carrello" color="foreground">
                                            {locale("Cart")}
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem key="logout" startContent={<SignOut size={18} />} className="text-danger" color="danger">
                                        <Link color="foreground" href="/login">
                                            {locale("logout")}
                                        </Link>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <Button 
                                href="/login" 
                                as={Link} 
                                color="warning" 
                                className={pagina === "login" ? "hidden" : ""}
                                variant="shadow"
                            >
                                {locale("login")}
                            </Button>
                        )}
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
                    <DropdownMenu items={items} onAction={(key) => {
                        changeItem(key.toString(), pagina)
                    }}>
                        {(item) => (
                            <DropdownItem
                                key={item.key}
                                startContent={item.label}
                            >
                                {cloneElement(item.endContent, {style: {width: "2.2rem"}})}
                            </DropdownItem>

                        )}
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </HeroUINavbar>
    );
};
