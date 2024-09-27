'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt } from 'react-icons/fa'

export default function Home() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [classification, setClassification] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    setFile(selectedFile)

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(selectedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setClassification(data.classification)
    } catch (error) {
      console.error('Error classifying image:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-center mb-8 text-green-700">Welcome to EcoEarn</h1>
      <p className="text-2xl text-center mb-12 text-gray-600">
        Upload your waste images and earn rewards for recycling!
      </p>
      <div className="bg-white shadow-2xl rounded-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 text-green-600">Upload Waste Image</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div {...getRootProps()} className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition duration-300 ease-in-out">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaCloudUploadAlt className="w-10 h-10 mb-3 text-green-500" />
                <p className="mb-2 text-sm text-green-600">
                  <span className="font-semibold">
                    {isDragActive ? 'Drop the file here' : 'Drag and drop your image here'}
                  </span>
                </p>
                <p className="text-xs text-green-500">PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input {...getInputProps()} />
            </label>
          </div>
          {preview && (
            <div className="mt-4">
              <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg mx-auto" />
            </div>
          )}
          <button type="submit" className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 text-lg font-semibold">
            Classify Waste
          </button>
        </form>
        {classification && (
          <div className="mt-6 p-4 bg-blue-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">Classification Result:</h2>
            <p className="text-blue-700">{classification}</p>
          </div>
        )}
      </div>
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
  )
}