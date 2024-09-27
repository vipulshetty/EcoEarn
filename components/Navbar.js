import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SustainAI
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-green-200">
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:text-green-200">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/login" className="hover:text-green-200">
              Login
            </Link>
          </li>
          <li>
            <Link href="/signup" className="hover:text-green-200">
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}