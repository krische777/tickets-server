const { Router } = require('express')
const Ticket = require('./model')

const router = new Router()

router.get('/ticket', (req, res, next) => {
    Ticket
         .findAll()
         .then(tickets=>{
             res.send(tickets)
         })
         .catch(next)

})

router.post('/ticket', (req, res, next)=>{
    if(req.body.price) {
        Ticket
             .create(req.body)
             .then(tickets=>{
                 res.status(200).send(tickets)
             })
             .catch(next)
    }
    else {
        res.status(400).end()
    }
})

module.exports=router