'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import EnvironmentalImpact from '../components/EnvironmentalImpact';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [weight, setWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

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
    if (files.length === 0 || !weight || parseFloat(weight) <= 5) {
      setMessage('Please upload images and enter a weight greater than 5kg');
      return;
    }

    setIsLoading(true);
    setMessage('');
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });
    formData.append('weight', weight);

    try {
      const classificationResponse = await fetch('http://localhost:5000/classify', {
        method: 'POST',
        body: formData,
      });
      const classificationData = await classificationResponse.json();
      setClassifications(classificationData.results);

      // Save data to MongoDB
      const saveResponse = await fetch('/api/recycling-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight: parseFloat(weight),
          imageCount: files.length,
          classifications: classificationData.results,
        }),
      });

      if (saveResponse.ok) {
        const savedData = await saveResponse.json();
        console.log('Data saved successfully:', savedData);
        setMessage('Data saved successfully!');
      } else {
        setMessage('Failed to save data');
      }
    } catch (error) {
      console.error('Error processing images:', error);
      setMessage('Error processing images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetTrader = () => {
    router.push('/trader');
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-700">Welcome to EcoEarn</h1>
      <p className="text-xl text-center mb-12 text-gray-600">
        Upload your waste images and earn rewards for recycling!
      </p>
      <div className="bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-green-600">Upload Waste Images</h2>
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
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter weight in kg (must be greater than 5kg)"
              min="1"
              step="0.1"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 text-lg font-semibold"
            disabled={isLoading || parseFloat(weight) <= 5}
          >
            {isLoading ? 'Processing...' : 'Classify Waste'}
          </button>
        </form>
        {message && (
          <div className={`mt-4 p-4 ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-lg`}>
            {message}
          </div>
        )}
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
      </div>
      
      <div className="mt-8">
        <Button 
          onClick={handleGetTrader}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold"
        >
          Get a Trader
        </Button>
      </div>
    </div>
  );
}