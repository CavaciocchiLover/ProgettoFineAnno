import { Navbar } from "@/components/navbar";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-emerald-400 via-rose-400 to-amber-400">
      <Navbar path="login"/>
      <div className="flex h-full w-full items-start overflow-x-auto overflow-y-auto transition-colors duration-200 justify-center dark">
        <div className="flex min-h-[100vh] w-full items-center justify-center  p-2 sm:p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
