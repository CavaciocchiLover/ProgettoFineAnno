import { Navbar } from "@/components/navbar";

export default function PrivacyLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-gradient-to-r from-cyan-100 via-blue-300 to-indigo-400">
            <Navbar path={"profilo"}/>
            <div
                className="flex h-full w-full items-start overflow-x-auto overflow-y-auto transition-colors duration-200 justify-center dark">
                <div className="flex min-h-[100vh] w-full p-2 sm:p-4 lg:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}