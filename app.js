require('dotenv').config()
const { MongoClient } = require('mongodb')
const Fastify = require('fastify')

;(async () => {
  connectDB()

  const app = Fastify({ logger: true })

  app.get('/', (req, res) => {
    res.send({ message: 'Hello World' })
  })

  app.listen({ port: 3000 }, (e, address) => {
    if (e) console.log(e?.message)
    console.log(address)
  })
})()

async function connectDB() {
  const { client } = await databaseConnect()
  await client.connect()

  let data = client.db('tg-spy').collection('groups')
  data = await data.find({}).toArray()
  console.log(data[0])

  await client.close()
}

async function databaseConnect() {
  try {
    const client = new MongoClient(process.env.DATABASE_URI)
    return { client }
  } catch (e) {
    console.log(e?.message)
    await sleep(30)
    process.exit(1)
  }
}

function sleep(s) {
  return new Promise(r => setTimeout(r, s * 1_000))
}
