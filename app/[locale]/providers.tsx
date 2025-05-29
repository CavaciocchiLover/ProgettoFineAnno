"use client";

import type {ThemeProviderProps} from "next-themes";

import {HeroUIProvider} from "@heroui/system";
import {useRouter} from "next/navigation";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {GoogleOAuthProvider} from "@react-oauth/google";
import React from "react";

export interface ProvidersProps {
    children: React.ReactNode,
    themeProps?: ThemeProviderProps,
    locale?: "it" | "en" | "es"
}

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<
            Parameters<ReturnType<typeof useRouter>["push"]>[1]
        >;
    }
}

export function Providers({children, themeProps, locale}: ProvidersProps) {
    const router = useRouter();
    const localeProvider = locale === "it" ? "it-IT" : "en-US";

    return (
        <GoogleOAuthProvider clientId="597016529372-1bl9tga2eqtddci66v0lc8o7piaq34fv.apps.googleusercontent.com">
            <HeroUIProvider locale={localeProvider} navigate={router.push}>
                <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            </HeroUIProvider>
        </GoogleOAuthProvider>
    );
}
