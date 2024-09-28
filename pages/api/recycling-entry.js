// pages/api/recycling-entry.js
import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise
      const db = client.db("eco_earn")

      const { userId, weight, imageCount, classifications } = req.body

      // Calculate environmental impact
      const co2Saved = weight * 2 + imageCount * 0.1
      const treesSaved = co2Saved / 22
      const waterSaved = weight * 17

      const result = await db.collection("recycling_entries").insertOne({
        userId,
        weight,
        imageCount,
        classifications,
        co2Saved,
        treesSaved,
        waterSaved,
        createdAt: new Date()
      })

      res.status(201).json({ success: true, id: result.insertedId })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Error saving recycling entry' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}