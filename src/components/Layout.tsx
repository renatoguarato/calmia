import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function Layout() {
  return (
    <main className="flex flex-col min-h-screen bg-background font-sans antialiased">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}
