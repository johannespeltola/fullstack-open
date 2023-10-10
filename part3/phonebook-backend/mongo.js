const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

async function main() {
  const url =
    `mongodb+srv://fullstack:${password}@cluster0.r4lnpjl.mongodb.net/?retryWrites=true&w=majority`

  mongoose.set('strictQuery', false)
  await mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length === 3) {
    Person.find().then((res) => {
      console.log('phonebook:')
      res.forEach((e) => {
        console.log(`${e.name} ${e.number}`)
      })
      mongoose.connection.close()
    })
  } else if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
      name,
      number
    })

    person.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
  } else {
    console.log('Bad arguments')
    mongoose.connection.close()
  }
}
main()
