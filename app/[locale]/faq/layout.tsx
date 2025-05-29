import { Navbar } from "@/components/navbar";

export default function CarrelloLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-gradient-to-br from-green-200 via-teal-400 to-cyan-600">
            <Navbar path={"carrello"} />
            <div className="flex h-full w-full">
                <div className="flex min-h-[100vh] w-full p-2 sm:p-4 lg:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}