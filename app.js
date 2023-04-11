require('dotenv').config()
const { MongoClient } = require('mongodb')
const Fastify = require('fastify')

;(async () => {
  connectDB()

  const args = process.argv.slice(2)
  console.log(args)
  const auth = {}
  args.forEach((i, idx, arr) => (idx % 2 ? null : (auth[i] = arr[idx + 1])))
  console.log(auth)

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
    const defaultURI = 'mongodb://Artur:AMHDvqhevfAEYGQf313vj@185.220.205.150:27017/'
    const client = new MongoClient(process.env.DATABASE_URI ?? defaultURI)
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
