"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { Train } from "@phosphor-icons/react/dist/ssr";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
import {IBM_Plex_Sans} from "next/font/google";
import {IT, GB, ES} from "country-flag-icons/react/3x2";
import {cloneElement} from "react";
import {Link} from "@heroui/link";

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
  console.log(selectedItem);
}

export const Navbar = () => {
  return (
    <HeroUINavbar className={"relative z-10" + plex.className} isBordered
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Train />
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
          <Button href="/login" as={Link} color="warning" variant="shadow">Login</Button>
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
