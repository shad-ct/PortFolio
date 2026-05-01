import { MongoClient } from 'mongodb'

import { buildPortfolioDocument, getDefaultSiteContent } from '../src/lib/siteData'

async function main() {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI is required to seed the portfolio document.')
  }

  const databaseName = process.env.MONGODB_DB ?? 'portfolio'
  const collectionName = process.env.MONGODB_COLLECTION ?? 'portfolio'
  const client = new MongoClient(mongoUri)

  await client.connect()

  try {
    const portfolioDocument = buildPortfolioDocument(getDefaultSiteContent())
    const collection = client.db(databaseName).collection(collectionName)

    await collection.replaceOne({ _id: portfolioDocument._id }, portfolioDocument, { upsert: true })

    console.log(`Saved portfolio document to ${databaseName}.${collectionName}`)
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})