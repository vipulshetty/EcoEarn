import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db("eco_earn");

      const result = await db.collection("recycling_entries").aggregate([
        {
          $group: {
            _id: null,
            totalWeight: { $sum: "$weight" },
            totalImageCount: { $sum: "$imageCount" },
            totalCO2Saved: { $sum: "$co2Saved" },
            totalTreesSaved: { $sum: "$treesSaved" },
            totalWaterSaved: { $sum: "$waterSaved" }
          }
        }
      ]).toArray();

      await client.close();

      if (result.length > 0) {
        const impact = result[0];
        delete impact._id;
        res.status(200).json(impact);
      } else {
        res.status(200).json({
          totalWeight: 0,
          totalImageCount: 0,
          totalCO2Saved: 0,
          totalTreesSaved: 0,
          totalWaterSaved: 0
        });
      }
    } catch (e) {
      console.error('Error fetching environmental impact:', e);
      res.status(500).json({ error: 'Error fetching environmental impact' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}