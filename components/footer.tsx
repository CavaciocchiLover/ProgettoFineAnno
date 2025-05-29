import {Link} from "@heroui/link";
import {useTranslations} from "next-intl";

export const Footer = () => {
    const locale = useTranslations('footer');
    return (
        <div className="flex w-full flex-col"
             style={{fontFamily: "IBM Plex Sans"}}>
            <div className="mx-auto pt-2 flex w-full max-w-7xl flex-col items-center justify-center">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                    <Link href="/page" color="foreground" size="sm">{locale("home")}</Link>
                    <Link href="/profilo" color="foreground" size="sm">{locale("profile")}</Link>
                    <Link href="/privacy" color="foreground" size="sm">{locale("privacyPolicy")}</Link>
                </div>
                <span className="w-px h-px block" aria-hidden style={{marginLeft: "0.25", marginTop: "1.5"}}></span>
                <p className="mt-1 text-center text-small">
                    {locale("allRightsReserved")}
                </p>
            </div>
        </div>
    )
}