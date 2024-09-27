'use client'

import { useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [classification, setClassification] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(selectedFile)
    }
  }

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
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">Upload Waste Image</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaCloudUploadAlt className="w-10 h-10 mb-3 text-green-500" />
              <p className="mb-2 text-sm text-green-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-green-500">PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
        </div>
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg" />
          </div>
        )}
        <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300">
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
  )
}