'use client'

import { useState, useEffect } from 'react'
import { FaTrash, FaRecycle } from 'react-icons/fa'

export default function WasteHistory() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchWasteHistory() {
      try {
        const response = await fetch('/api/waste-history')
        if (!response.ok) {
          throw new Error('Failed to fetch waste history')
        }
        const data = await response.json()
        setHistory(data)
      } catch (err) {
        console.error('Error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWasteHistory()
  }, [])

  if (isLoading) {
    return <div className="text-center p-4">Loading waste history...</div>
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="text-xl font-bold mb-2">Error Loading Waste History</h2>
        <p>{error}</p>
        <p className="mt-2">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-6">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-700">Waste Submission History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-indigo-100">
            <tr>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Weight (kg)</th>
              <th className="py-3 px-4 text-left">Points Earned</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-3 px-4">{item.date}</td>
                <td className="py-3 px-4">{item.type}</td>
                <td className="py-3 px-4">{item.weight.toFixed(2)}</td>
                <td className="py-3 px-4">{item.points}</td>
                <td className="py-3 px-4">
                  {item.type.toLowerCase().includes('plastic') ? (
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