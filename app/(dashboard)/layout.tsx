import { MainNav } from "./components/main-nav";
import { UserNav } from "./components/user-nav";

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center pr-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
