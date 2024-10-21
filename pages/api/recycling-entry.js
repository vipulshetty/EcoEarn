import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db("eco_earn");

      const { weight, imageCount, classifications } = req.body;

      // Calculate environmental impact
      const co2Saved = weight * 2 + imageCount * 0.1;
      const treesSaved = co2Saved / 22;
      const waterSaved = weight * 17;

      const recyclingEntry = {
        weight,
        imageCount,
        classifications,
        co2Saved,
        treesSaved,
        waterSaved,
        createdAt: new Date()
      };

      const result = await db.collection("recycling_entries").insertOne(recyclingEntry);

      console.log('Data stored in MongoDB:', recyclingEntry);
      console.log('MongoDB insertion result:', result);

      await client.close();

      res.status(201).json({ success: true, id: result.insertedId, data: recyclingEntry });
    } catch (e) {
      console.error('Error saving recycling entry:', e);
      res.status(500).json({ error: 'Error saving recycling entry' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}