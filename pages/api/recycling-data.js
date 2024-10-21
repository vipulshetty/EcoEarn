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

      const recyclingEntries = await db.collection("recycling_entries").find({}).toArray();

      res.status(200).json(recyclingEntries);
    } catch (e) {
      console.error('Error fetching recycling data:', e);
      res.status(500).json({ error: 'Error fetching recycling data' });
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