'use client'

import { useState } from 'react'
import { FaGift } from 'react-icons/fa'

export default function RewardsSection() {
  const [selectedReward, setSelectedReward] = useState(null)

  const rewards = [
    { id: 1, name: 'Eco-friendly Water Bottle', points: 500, image: '/images/water-bottle.jpg' },
    { id: 2, name: 'Reusable Shopping Bag', points: 300, image: '/images/shopping-bag.jpg' },
    { id: 3, name: '10% Discount Coupon', points: 1000, image: '/images/discount-coupon.jpg' },
  ]

  const handleRewardSelect = (reward) => {
    setSelectedReward(reward)
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
      <h2 className="text-3xl font-semibold mb-6 text-green-700">Available Rewards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
              selectedReward?.id === reward.id ? 'border-green-500 shadow-lg' : 'border-gray-200 hover:border-green-300 hover:shadow-md'
            }`}
            onClick={() => handleRewardSelect(reward)}
          >
            <div className="bg-gray-100 rounded-md mb-4 p-4 flex items-center justify-center">
              <FaGift className="text-5xl text-green-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">{reward.name}</h3>
            <p className="text-green-600 font-bold">{reward.points} points</p>
          </div>
        ))}
      </div>
      {selectedReward && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <p className="font-semibold text-lg mb-2 text-gray-800">Selected Reward: {selectedReward.name}</p>
          <p className="mb-4 text-gray-600">Points required: {selectedReward.points}</p>
          <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-300 shadow-md">
            Redeem Reward
          </button>
        </div>
      )}
    </div>
  )
}