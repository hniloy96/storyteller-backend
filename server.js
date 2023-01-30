const express = require('express') //import express
const app = express() //create an express application
require('./config/connection') //require and run connection configuration 
const cors = require('cors') //import cors
const morgan = require('morgan') //import morgan
const { PORT } = process.env //get the port from environment variable

const userController = require('./controllers/user-controller')


// parse incoming request bodies in a middleware before handlers
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors()) //use cors
app.use(morgan('dev')) //use morgan in dev mode

app.use('/user', userController)


// redirect to user route
app.get('/', (req,res) => {
    res.redirect('/user')
})

// route for 500 error
app.get('/error', (req,res) => {
    res.status(500).send(`Something went wrong...`)
})

// error handling middleware
app.use((error, res,req,next) => {
    console.error("inside middleware")
    if(error){
        return res.status(404).send(error.message)
    }
    next()
})

// catch all route with error handling
app.get('*', (req,res,next) => {
    if (req.error){
        res.status(404).send(`Error: ${req.error.message}`)
    } else {
        res.redirect('/error/')
    }
})

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)})
