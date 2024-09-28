// pages/index.js
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import EnvironmentalImpact from '@/components/EnvironmentalImpact';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [weight, setWeight] = useState('');
  const [userId, setUserId] = useState('user123'); // Replace with actual user authentication
  const [dashboardData, setDashboardData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/dashboard/${userId}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);

    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: 'image/*', 
    multiple: true 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });
    formData.append('weight', weight);

    try {
      const classifyResponse = await fetch('http://localhost:5000/classify', {
        method: 'POST',
        body: formData,
      });
      const classifyData = await classifyResponse.json();
      setClassifications(classifyData.results);

      // Save to MongoDB
      const recyclingEntry = {
        userId,
        weight: parseFloat(weight),
        imageCount: files.length,
        classifications: classifyData.results
      };

      const saveResponse = await fetch('http://localhost:5000/api/recycling-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recyclingEntry),
      });

      if (saveResponse.ok) {
        console.log('Entry saved successfully');
        fetchDashboardData(); // Refresh dashboard data
      } else {
        console.error('Failed to save entry');
      }
    } catch (error) {
      console.error('Error processing request:', error);
    }
  };

  const handleFindTrader = () => {
    router.push('/trader');
  };

  return (
    <div className="max-w-4xl mx-auto py-32">
      <h1 className="text-5xl font-bold text-center mb-8 text-green-700">Welcome to EcoEarn</h1>
      <p className="text-2xl text-center mb-12 text-gray-600">
        Upload your waste images and earn rewards for recycling!
      </p>
      {dashboardData && (
        <div className="bg-green-100 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Your Recycling Dashboard</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-medium">Total Weight Recycled:</p>
              <p className="text-xl font-bold">{dashboardData.totalWeight.toFixed(2)} kg</p>
            </div>
            <div>
              <p className="text-lg font-medium">Total CO2 Saved:</p>
              <p className="text-xl font-bold">{dashboardData.totalCO2Saved.toFixed(2)} kg</p>
            </div>
            <div>
              <p className="text-lg font-medium">Total Trees Saved:</p>
              <p className="text-xl font-bold">{dashboardData.totalTreesSaved.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-lg font-medium">Total Water Saved:</p>
              <p className="text-xl font-bold">{dashboardData.totalWaterSaved.toFixed(2)} L</p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white shadow-2xl rounded-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 text-green-600">Upload Waste Images</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div {...getRootProps()} className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition duration-300 ease-in-out">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaCloudUploadAlt className="w-10 h-10 mb-3 text-green-500" />
                <p className="mb-2 text-sm text-green-600">
                  <span className="font-semibold">
                    {isDragActive ? 'Drop the files here' : 'Drag and drop your images here'}
                  </span>
                </p>
                <p className="text-xs text-green-500">PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input {...getInputProps()} />
            </label>
          </div>
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {previews.map((preview, index) => (
                <img key={index} src={preview} alt={`Preview ${index + 1}`} className="w-full h-auto rounded-lg" />
              ))}
            </div>
          )}
          <div>
            <Label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </Label>
            <Input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter weight in kg"
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 text-lg font-semibold">
            Classify Waste
          </Button>
        </form>
        {classifications.length > 0 && (
          <div className="mt-6 p-4 bg-blue-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">Classification Results:</h2>
            {classifications.map((result, index) => (
              <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow">
                <p className="text-blue-700 font-semibold">
                  Image: {result.filename}
                </p>
                <p className="text-blue-600">
                  Classification: {result.label}
                </p>
                <p className="text-blue-600">
                  Confidence: {(result.confidence * 100).toFixed(2)}%
                </p>
                <p className="text-green-700">
                  Size Quality: {result.size_quality}
                </p>
                <p className="text-yellow-700">
                  Intensity Quality: {result.intensity_quality}
                </p>
              </div>
            ))}
          </div>
        )}
        <Button onClick={handleFindTrader} className="w-full mt-6 bg-blue-700 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold">
          Find Trader
        </Button>
      </div>
      <EnvironmentalImpact weight={parseFloat(weight) || 0} imageCount={files.length} />
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-green-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Reduce</h3>
          <p className="text-gray-700">Learn how to minimize your plastic consumption and make a positive impact.</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Recycle</h3>
          <p className="text-gray-700">Discover proper recycling techniques and contribute to a cleaner environment.</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Earn</h3>
          <p className="text-gray-700">Get rewarded for your eco-friendly actions and inspire others to join the cause.</p>
        </div>
      </div>
    </div>
  );
}