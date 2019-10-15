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

router.get('/event/:id/tickets/:ticketId', (req, res, next)=>{
    Ticket.findOne({where: {
        id: req.params.ticketId
    } })
    .then(tickets=>{
        res.json(tickets)
    })
    .catch(next)
})

router.post('/ticket', (req, res, next)=>{
    const newTicket={
        author: req.body.author,
        picture: req.body.picture,
        price: req.body.price,
        description: req.body.description,
        eventId: req.body.eventId
    }
    if(req.body.price) {
        Ticket
             .create(newTicket)
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