import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let client;
    try {
      client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db("eco_earn");

      const wasteHistory = await db.collection("recycling_entries")
        .find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();

      const formattedHistory = wasteHistory.map(entry => ({
        date: entry.createdAt.toISOString().split('T')[0],
        type: entry.classifications[0]?.label || 'Unknown',
        points: Math.round(entry.co2Saved * 10), // Assuming 1 point per 0.1 kg of CO2 saved
        weight: entry.weight
      }));

      res.status(200).json(formattedHistory);
    } catch (e) {
      console.error('Error fetching waste history:', e);
      res.status(500).json({ error: 'Error fetching waste history' });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}