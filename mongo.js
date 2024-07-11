const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Password as argument is needed')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstacker:${password}@cluster0.zlvuwz8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

switch(process.argv.length) {
    case 5:
      const person = new Person ({
        name: process.argv[3],
        number: process.argv[4],
      })

      person.save().then(() => {
        console.log(`${process.argv[3]} ${process.argv[4]} was added to phonebook`)
        mongoose.connection.close()
      })
      break

    case 3:
        console.log('Phonebook:')
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
      break
  }