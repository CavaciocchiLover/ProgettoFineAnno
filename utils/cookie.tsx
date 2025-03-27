"use server"
import { cookies } from 'next/headers'

export async function GetCookie(name: string) {
    const cookieStore = await cookies()
    return cookieStore.get(name);
}

export async function setCookie(key: string, value: string, age: number) {
    const cookieStore = await cookies()
    return cookieStore.set(key, value, {maxAge: age});
}

export async function deleteCookie(name: string) {
    (await cookies()).delete(name);
}

export async function checkCookie(name: string) {
    return (await cookies()).has(name);
}