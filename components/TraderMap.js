'use client'

import { useState, useEffect } from 'react'
import { FaTruck } from 'react-icons/fa'

export default function TraderMap() {
  const [traderLocation, setTraderLocation] = useState({ lat: 40.7128, lng: -74.0060 })

  useEffect(() => {
    // Simulating trader movement
    const interval = setInterval(() => {
      setTraderLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.01,
        lng: prev.lng + (Math.random() - 0.5) * 0.01
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
      <h2 className="text-3xl font-semibold mb-6 text-purple-700">Trader Location</h2>
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg text-gray-500">Map loading...</p>
        </div>
        <FaTruck className="text-5xl text-purple-600 absolute animate-bounce" style={{
          top: `${50 + (traderLocation.lat - 40.7128) * 1000}%`,
          left: `${50 + (traderLocation.lng + 74.0060) * 1000}%`,
          transform: 'translate(-50%, -50%)'
        }} />
      </div>
      <p className="mt-4 text-lg text-gray-600">
        Trader is on the way to collect your waste! ETA: 15 minutes
      </p>
    </div>
  )
}