import { FaHeart } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white py-3 mt-8">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <p className="text-sm flex items-center">
          &copy; {new Date().getFullYear()} SustainAI. Made with 
          <FaHeart className="mx-1 text-red-500" aria-hidden="true" />
          for a greener planet
        </p>
      </div>
    </footer>
  )
}