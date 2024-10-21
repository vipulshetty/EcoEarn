'use client';

import React, { useState, useEffect } from 'react';
import { FaRecycle, FaLeaf, FaTree, FaTint, FaImage } from 'react-icons/fa';

export default function EnvironmentalImpact() {
  const [impact, setImpact] = useState({
    totalWeight: 0,
    totalImageCount: 0,
    totalCO2Saved: 0,
    totalTreesSaved: 0,
    totalWaterSaved: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImpact() {
      try {
        const response = await fetch('/api/environmental-impact');
        if (!response.ok) {
          throw new Error('Failed to fetch environmental impact data');
        }
        const data = await response.json();
        setImpact(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchImpact();
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading environmental impact data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-blue-700">Your Environmental Impact</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-green-100 rounded-lg p-4 flex items-center">
          <FaRecycle className="text-4xl text-green-600 mr-4" />
          <div>
            <p className="text-3xl font-bold text-green-700">{impact.totalWeight.toFixed(2)} kg</p>
            <p className="text-lg text-green-600">Plastic Recycled</p>
          </div>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 flex items-center">
          <FaLeaf className="text-4xl text-blue-600 mr-4" />
          <div>
            <p className="text-3xl font-bold text-blue-700">{impact.totalCO2Saved.toFixed(2)} kg</p>
            <p className="text-lg text-blue-600">Total CO2 Saved</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-yellow-100 rounded-lg p-4 flex items-center">
          <FaTree className="text-4xl text-yellow-600 mr-4" />
          <div>
            <p className="text-3xl font-bold text-yellow-700">{impact.totalTreesSaved.toFixed(2)}</p>
            <p className="text-lg text-yellow-600">Trees Equivalent</p>
          </div>
        </div>
        <div className="bg-cyan-100 rounded-lg p-4 flex items-center">
          <FaTint className="text-4xl text-cyan-600 mr-4" />
          <div>
            <p className="text-3xl font-bold text-cyan-700">{impact.totalWaterSaved.toFixed(2)} L</p>
            <p className="text-lg text-cyan-600">Water Saved</p>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-purple-100 rounded-lg p-4 flex items-center">
        <FaImage className="text-4xl text-purple-600 mr-4" />
        <div>
          <p className="text-3xl font-bold text-purple-700">{impact.totalImageCount}</p>
          <p className="text-lg text-purple-600">Images Uploaded</p>
        </div>
      </div>
      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Calculations Explained:</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>CO2 Saved: 1 kg of recycled plastic saves 2 kg of CO2</li>
          <li>Trees Equivalent: 1 tree absorbs about 22 kg of CO2 per year</li>
          <li>Water Saved: Recycling 1 kg of plastic saves about 17 liters of water</li>
          <li>Additional Impact: Each uploaded image is assumed to save 0.1 kg of CO2</li>
        </ul>
      </div>
    </div>
  );
}