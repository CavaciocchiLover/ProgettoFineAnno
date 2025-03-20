import {Link} from "@heroui/link";

export const Footer = () => (
    <div className="flex w-full flex-col"
            style={{fontFamily: "IBM Plex Sans"}}>
        <div className="mx-auto pt-2 flex w-full max-w-7xl flex-col items-center justify-center">
            <div className="flex flex-wrap items-center justify-center">
                <span>Trainsoup</span>
            </div>
            <span className="w-px h-px block" aria-hidden style={{marginLeft: "0.25", marginTop: "1.5"}}></span>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                <Link href="/page.tsx" color="foreground" size="sm">Home</Link>
                <Link href="/page.tsx" color="foreground" size="sm">Login</Link>
                <Link href="/page.tsx" color="foreground" size="sm">Supporto</Link>
                <Link href="/page.tsx" color="foreground" size="sm">Area riservata</Link>
            </div>
            <span className="w-px h-px block" aria-hidden style={{marginLeft: "0.25", marginTop: "1.5"}}></span>
            <p className="mt-1 text-center text-small">
                © 2025 Trainsoup. Tutti i diritti riservati.
            </p>
        </div>
    </div>
)