'use client'

import { useState, useEffect } from 'react'
import { FaTrash, FaRecycle } from 'react-icons/fa'

export default function WasteHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setHistory([
        { date: '2023-09-15', type: 'Plastic', points: 50 },
        { date: '2023-09-14', type: 'Paper', points: 30 },
        { date: '2023-09-13', type: 'Glass', points: 40 },
        { date: '2023-09-12', type: 'Plastic', points: 50 },
        { date: '2023-09-11', type: 'Metal', points: 60 },
      ])
    }, 1000)
  }, [])

  return (
    <div className="bg-white shadow-xl rounded-lg p-6">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-700">Waste Submission History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-indigo-100">
            <tr>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Points Earned</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-3 px-4">{item.date}</td>
                <td className="py-3 px-4">{item.type}</td>
                <td className="py-3 px-4">{item.points}</td>
                <td className="py-3 px-4">
                  {item.type === 'Plastic' ? (
                    <FaRecycle className="text-green-500" />
                  ) : (
                    <FaTrash className="text-gray-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}