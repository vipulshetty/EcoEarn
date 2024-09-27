'use client'

import { useState, useEffect } from 'react'
import { FaRecycle, FaLeaf } from 'react-icons/fa'

export default function EnvironmentalImpact() {
  const [impact, setImpact] = useState({ plastic: 0, co2: 0 })

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setImpact({ plastic: 75, co2: 150 })
    }, 1000)
  }, [])

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-3xl font-semibold mb-6 text-blue-700">Your Environmental Impact</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-green-100 rounded-lg p-4 flex items-center">
          <FaRecycle className="text-4xl text-green-600 mr-4" />
          <div>
            <p className="text-3xl font-bold text-green-700">{impact.plastic} kg</p>
            <p className="text-lg text-green-600">Plastic Recycled</p>
          </div>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 flex items-center">
          <FaLeaf className="text-4xl text-blue-600 mr-4" />
          <div>
            <p className="text-3xl font-bold text-blue-700">{impact.co2} kg</p>
            <p className="text-lg text-blue-600">CO2 Saved</p>
          </div>
        </div>
      </div>
    </div>
  )
}