import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SustainAI',
  description: 'AI-Powered Plastic Waste Management Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-green-50 to-blue-50 min-h-screen`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Chatbot />
        <Footer />
      </body>
    </html>
  )
}