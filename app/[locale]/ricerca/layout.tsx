import { Navbar } from "@/components/navbar";

export default function RicercaLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-gradient-to-br from-teal-400 via-indigo-400 to-rose-500">
            <Navbar />
            <div className="flex h-full w-full items-start overflow-x-auto overflow-y-auto transition-colors duration-200 justify-center dark">
                <div className="flex min-h-[100vh] w-full p-2 sm:p-4 lg:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}