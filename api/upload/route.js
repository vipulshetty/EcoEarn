import { NextResponse } from 'next/server'

export async function POST(request) {
  const formData = await request.formData()
  const image = formData.get('image')

  if (!image) {
    return NextResponse.json({ error: 'No image uploaded' }, { status: 400 })
  }

  // Here you would typically send the image to your AI model for classification
  // For now, we'll return a mock classification
  const mockClassification = Math.random() > 0.5 ? 'Biodegradable' : 'Non-biodegradable'

  return NextResponse.json({ classification: mockClassification })
}