import ImageUpload from '../components/ImageUpload'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to SustainAI</h1>
      <p className="text-xl mb-8">
        Empower yourself to reduce plastic waste and earn rewards!
      </p>
      <ImageUpload />
    </div>
  )
}