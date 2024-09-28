// pages/api/dashboard/[userId].js
import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise
      const db = client.db("eco_earn")

      const { userId } = req.query

      const result = await db.collection("recycling_entries").aggregate([
        { $match: { userId: userId } },
        { $group: {
          _id: null,
          totalWeight: { $sum: '$weight' },
          totalCO2Saved: { $sum: '$co2Saved' },
          totalTreesSaved: { $sum: '$treesSaved' },
          totalWaterSaved: { $sum: '$waterSaved' },
          totalEntries: { $sum: 1 }
        }}
      ]).toArray()

      const dashboardData = result[0] || { 
        totalWeight: 0, 
        totalCO2Saved: 0, 
        totalTreesSaved: 0, 
        totalWaterSaved: 0, 
        totalEntries: 0 
      }

      res.status(200).json(dashboardData)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Error fetching dashboard data' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}