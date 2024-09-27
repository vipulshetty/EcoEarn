'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaLeaf, FaBars, FaTimes, FaHome, FaTachometerAlt, FaStore, FaGift } from 'react-icons/fa'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/', icon: FaHome },
    { name: 'Dashboard', href: '/dashboard', icon: FaTachometerAlt },
    { name: 'Recycle Store', href: '/store', icon: FaStore },
    { name: 'Rewards', href: '/rewards', icon: FaGift },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-green-500'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <FaLeaf className={`h-8 w-8 mr-2 ${scrolled ? 'text-green-600' : 'text-white'}`} />
              <span className={`font-bold text-xl ${scrolled ? 'text-green-600' : 'text-white'}`}>EcoEarn</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    scrolled
                      ? 'text-gray-700 hover:text-green-600'
                      : 'text-white hover:bg-green-600'
                  } transition duration-300`}
                >
                  <item.icon className="mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:bg-green-600'
              } focus:outline-none`}
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:bg-green-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="mr-2" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}