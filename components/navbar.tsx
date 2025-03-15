import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Train } from "@phosphor-icons/react/dist/ssr";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";
import {IT} from "country-flag-icons/react/3x2";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";

export const Navbar = () => {
  return (
    <HeroUINavbar className="relative z-10"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Train />
            <p
              className="font-medium text-black"
              style={{ fontFamily: "IBM Plex Sans" }}
            >
              Trainsoup
            </p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  radius="sm"
                  variant="light"
              >
                Features
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
              aria-label="ACME features"
              itemClasses={{
                base: "gap-4",
              }}
          >
            <DropdownItem
                key="autoscaling"
                description="ACME scales apps based on demand and load"

            >
              Autoscaling
            </DropdownItem>
            <DropdownItem
                key="usage_metrics"
                description="Real-time metrics to debug issues"

            >
              Usage Metrics
            </DropdownItem>
            <DropdownItem
                key="production_ready"
                description="ACME runs on ACME, join us at web scale"

            >
              Production Ready
            </DropdownItem>
            <DropdownItem
                key="99_uptime"
                description="High availability and uptime guarantees"

            >
              +99% Uptime
            </DropdownItem>
            <DropdownItem
                key="supreme_support"
                description="Support team ready to respond"

            >
              +Supreme Support
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </HeroUINavbar>
  );
};
