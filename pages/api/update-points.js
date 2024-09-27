import { getSession } from 'next-auth/react'
import clientPromise from '../../lib/mongodb'
import User from '../../models/User'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const { points, wasteType, weight } = req.body

    try {
      const client = await clientPromise
      const db = client.db()

      const updatedUser = await db.collection('users').findOneAndUpdate(
        { email: session.user.email },
        {
          $inc: { points: points },
          $push: {
            wasteHistory: {
              type: wasteType,
              weight: weight,
              points: points,
              createdAt: new Date()
            }
          }
        },
        { returnDocument: 'after' }
      )

      res.status(200).json({ success: true, points: updatedUser.value.points })
    } catch (error) {
      res.status(500).json({ error: 'Failed to update points' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}