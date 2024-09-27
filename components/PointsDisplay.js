'use client'

import { useState, useEffect } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export default function PointsDisplay() {
  const [points, setPoints] = useState(0)
  const [nextRewardPoints, setNextRewardPoints] = useState(1000)

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setPoints(450)
      setNextRewardPoints(1000)
    }, 1000)
  }, [])

  const percentage = (points / nextRewardPoints) * 100

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-3xl font-semibold mb-6 text-green-700">Your Eco Points</h2>
      <div className="flex items-center justify-between">
        <div className="w-40 h-40">
          <CircularProgressbar
            value={percentage}
            text={`${points}`}
            styles={buildStyles({
              textSize: '22px',
              pathColor: `rgba(34, 197, 94, ${percentage / 100})`,
              textColor: '#16a34a',
              trailColor: '#e2e8f0',
            })}
          />
        </div>
        <div className="ml-6 flex-grow">
          <p className="text-2xl font-bold text-gray-800 mb-2">
            {points} / {nextRewardPoints}
          </p>
          <p className="text-lg text-gray-600 mb-4">
            {nextRewardPoints - points} points until your next reward!
          </p>
          <button className="w-full bg-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors duration-300 shadow-md">
            View Rewards
          </button>
        </div>
      </div>
    </div>
  )
}