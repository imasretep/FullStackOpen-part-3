const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('info', (req, res) => { 
    return JSON.stringify(req.body)
})
const morganCustom = morgan(':method :url :status :res[content-length] - :response-time ms :info')
app.use(express.json())
app.use(morganCustom)
app.use(cors())

let persons = [
    {
      name: "Testi 1",
      number: "050-123123",
      id: "1"
    },
    {
      name: "Testi 2",
      number: "050-3121321",
      id: "2"
    },
    {
      name: "Testi 3",
      number: "050-12",
      id: "3"
    },
    {
      name: "Testi 4",
      number: "040-123123",
      id: "4"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const time = new Date()
    response.send(`<div>Phonebook has info for ${persons.length} people. </br>${time}</div>`) 
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if(person){
        response.send(person)
    }else{
        response.status(404).end()
    }
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    if(!request.body.name && !request.body.number){
        return response.status(400).json({ error: 'name or number is missing' })
    }
    const nameExists = persons.some(p => p.name === request.body.name)
    if(nameExists){
        return response.status(400).json({ error: 'name already exists' })
    }

    const id = rNG(1000)
    const person = {
        name: request.body.name,
        number: request.body.number,
        id: id
    }

    persons = persons.concat(person)
    response.json(person)
})

const rNG = (max) => {
    return Math.floor(Math.random() * max);
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})