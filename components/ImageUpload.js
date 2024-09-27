'use client'

import { useState } from 'react'

export default function ImageUpload() {
  const [image, setImage] = useState(null)
  const [classification, setClassification] = useState(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    setImage(file)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setClassification(data.classification)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload Waste Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded waste"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        {classification && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p className="font-bold">Classification Result:</p>
            <p>{classification}</p>
          </div>
        )}
      </div>
    </div>
  )
}