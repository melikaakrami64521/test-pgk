require('dotenv').config()
const { MongoClient } = require('mongodb')
const Fastify = require('fastify')

;(async () => {
  connectDB()

  const { args, options } = parseArgs()
  console.log(args)
  console.log(options)

  const app = Fastify({
    logger: {
      file: 'logs.log',
      transport: {
        target: ''
      },
    },
  })

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

function parseArgs() {
  const args = process.argv.slice(2)
  const res = {}

  let current = null
  for (let i of args) {
    // if (i.startsWith('-') || i.startsWith('--')) {
    if (/^[-]{1,2}\w+$/.test(i)) {
      res[i] = true
      current = i
      continue
    }

    if (current) {
      res[current] = i
    }

    current = null
  }

  const options = {
    user: res['-U'] ?? res['--user'] ?? null,
    password: res['-P'] ?? res['--pass'] ?? res['--password'] ?? null,
    logs: res['-L'] ?? res['--logs'] ?? false,
  }

  return { args: res, options }
}
