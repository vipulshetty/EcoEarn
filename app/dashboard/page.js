import PointsDisplay from '../../components/PointsDisplay'
import TraderMap from '../../components/TraderMap'
import WasteHistory from '../../components/WasteHistory'
import EnvironmentalImpact from '../../components/EnvironmentalImpact'
import RewardsSection from '../../components/RewardsSection'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <h1 className="text-5xl font-bold mb-12 text-center text-green-800 drop-shadow-lg">
        Your SustainAI Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PointsDisplay />
        <EnvironmentalImpact />
      </div>
      <TraderMap />
      <RewardsSection />
      <WasteHistory />
    </div>
  )
}