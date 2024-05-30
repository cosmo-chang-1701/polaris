import { MainNav } from './components/main-nav'
import { UserNav } from './components/user-nav'

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b">
        <div className="container flex h-14 max-w-screen-2xl items-center bg-gray-100">
          <MainNav />
          <div className="flex flex-1 items-center justify-end space-x-2">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="container py-4">{children}</main>
    </>
  )
}
