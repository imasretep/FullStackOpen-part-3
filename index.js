require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
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
app.use(express.static('dist'))

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(person => 
        {response.json(person)})
        .catch(error => next(error)) 
})

app.get('/api/info', (request, response, next) => {
    const time = new Date()
    Person.find({})
    .then(persons => {
      const count = persons.length
      response.send(`<div>Phonebook has info for ${count} people </br>${time}</div>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        response.json(person)
    })
    .catch(error => next(error))  
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
    const person = new Person ({
        name: request.body.name,
        number: request.body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const person = {
        name: request.body.name,
        number: request.body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const rNG = (max) => {
    return Math.floor(Math.random() * max);
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }else if(error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})