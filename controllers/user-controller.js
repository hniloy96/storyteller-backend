const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../models')
const { createUserToken } = require('../middlewares/auth')

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// to get all user infos
router.get('/', async (req, res, next) => {
    try {
        const allUser = await db.User.find()
        return res.status(200).json(allUser)
    } catch (err) {
        console.error(err)
        return next(err)
    }
})

// to get an individual user info
router.get('/:id', async (req, res, next) => {
    try {
        const foundUser = await db.User.findById(req.params.id)
        console.log(foundUser)
        return res.status(200).json(foundUser)
    } catch (err) {
        console.error(err)
        return next(err)
    }
})

// to sign up for the site
router.post('/register', async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const passHash = await bcrypt.hash(req.body.password, salt)

        const rawPWStore = req.body.password
        req.body.password = passHash

        const newUser = await db.User.create(req.body)

        if(newUser){
            req.body.password=rawPWStore
            const authenticToken = createUserToken(req, newUser)
            console.log(authenticToken)
            res.status(201).json({
                user: newUser,
                isLpggedIn: true,
                token: authenticToken
            })
        }
       
 
    } catch (err) {
        console.error(err)
        return next(err)
    }
})

// to log in to the site
router.post("/login", async (req, res, next) => {
    try {
      const loggingUser = req.body.username;
      const foundUser = await db.User.findOne({ username: loggingUser });
      if (!foundUser) {
        return res.json({error: 'User not found!'})
      }
      const token = await createUserToken(req, foundUser);
      console.log(token)
      res.status(200).json({
        user: foundUser,
        isLoggedIn: true,
        token,
      });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  });
  
// will use these later to update user info and delete user
router.put('/:id', async (req, res) => {
    try {
        

        const updatedPerson = await db.User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(updatedPerson)
    } catch (err) {
        res.status(400).json({ error: err })
    }

})

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedUser = await db.User.findByIdAndDelete(req.params.id)
        console.log(deletedUser)
        res.redirect('/')
    } catch (err) {
        console.error(err)
        return next(err)
    }

})

module.exports = router