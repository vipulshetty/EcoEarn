'use client';

import React from 'react';
import { FaRecycle, FaLeaf, FaTree, FaTint, FaImage } from 'react-icons/fa';

export default function EnvironmentalImpact({ weight = 0, imageCount = 0 }) {
  // Ensure weight is a number
  const numWeight = Number(weight) || 0;

  // Convert recycled waste to CO2 saved
  // Assuming 1 kg of recycled plastic saves 2 kg of CO2 (this is a simplified estimate)
  const co2Saved = numWeight * 2;

  // Calculate trees saved
  // Assuming 1 tree absorbs about 22 kg of CO2 per year
  const treesSaved = co2Saved / 22;

  // Calculate water saved
  // Assuming recycling 1 kg of plastic saves about 17 liters of water
  const waterSaved = numWeight * 17;

  // Calculate additional impact based on number of images uploaded
  // This is a hypothetical calculation for demonstration purposes
  const additionalImpact = imageCount * 0.1; // 0.1 kg of CO2 saved per image uploaded

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-blue-700">Your Environmental Impact</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-green-100 rounded-lg p-4 flex items-center">
          <FaRecycle className="text-4xl text-green-600 mr-4" />
          <div>
            <p className="text-3xl font-bold text-green-700">{numWeight.toFixed(2)} kg</p>
            <p className="text-lg text-green-600">Plastic Recycled</p>
          </div>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 flex items-center">
          <FaLeaf className="text-4xl text-blue-600 mr-4" />
          <div>
            <p className="text-3xl font-bold text-blue-700">{(co2Saved + additionalImpact).toFixed(2)} kg</p>
            <p className="text-lg text-blue-600">Total CO2 Saved</p>
            <p className="text-sm text-blue-500">({numWeight.toFixed(2)} kg × 2) + ({imageCount} images × 0.1)</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-yellow-100 rounded-lg p-4 flex items-center">
          <FaTree className="text-4xl text-yellow-600 mr-4" />
          <div>
            <p className="text-3xl font-bold text-yellow-700">{((co2Saved + additionalImpact) / 22).toFixed(2)}</p>
            <p className="text-lg text-yellow-600">Trees Equivalent</p>
            <p className="text-sm text-yellow-500">({(co2Saved + additionalImpact).toFixed(2)} kg ÷ 22)</p>
          </div>
        </div>
        <div className="bg-cyan-100 rounded-lg p-4 flex items-center">
          <FaTint className="text-4xl text-cyan-600 mr-4" />
          <div>
            <p className="text-3xl font-bold text-cyan-700">{waterSaved.toFixed(2)} L</p>
            <p className="text-lg text-cyan-600">Water Saved</p>
            <p className="text-sm text-cyan-500">({numWeight.toFixed(2)} kg × 17)</p>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-purple-100 rounded-lg p-4 flex items-center">
        <FaImage className="text-4xl text-purple-600 mr-4" />
        <div>
          <p className="text-3xl font-bold text-purple-700">{imageCount}</p>
          <p className="text-lg text-purple-600">Images Uploaded</p>
          <p className="text-sm text-purple-500">Additional Impact: {additionalImpact.toFixed(2)} kg CO2</p>
        </div>
      </div>
      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Calculations Explained:</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>CO2 Saved: 1 kg of recycled plastic saves 2 kg of CO2</li>
          <li>Trees Equivalent: 1 tree absorbs about 22 kg of CO2 per year</li>
          <li>Water Saved: Recycling 1 kg of plastic saves about 17 liters of water</li>
          <li>Additional Impact: Each uploaded image is assumed to save 0.1 kg of CO2 (for demonstration purposes)</li>
        </ul>
      </div>
    </div>
  );
}