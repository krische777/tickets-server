const { Router } = require('express')
const Event = require('./model')
const Ticket=require('../tickets/model')
//import auth to make some functions available only for registered users
const auth=require('../auth/middleware')
const {getFraudRisk} = require('../util/serverutility')
const router = new Router()

router.get('/event', (req, res, next) => {
    const limit=req.query.limit||9
    const offset=req.query.offset||0
    Event
        .findAll({
            limit, offset
        })
        .then(events =>{
            res.status(200).send(events)
        })
        .catch(next)
})

router.get('/event/:id/tickets', (req, res, next)=>{
       Ticket.findAll({where: {
           eventId: req.params.id
       }})
       .then((tickets)=>{
        //get an array of promises
        const remappedTickets = tickets.map(async (ticket) => {
                var fraudRisk = await getFraudRisk(ticket.id, req.params.id)
                let remapped={id: ticket.id,
                    author: ticket.author,
                    price: ticket.price,
                    description: ticket.description,
                    picture: ticket.picture, 
                    fraudRate: fraudRisk
                }
                return remapped
          })
          //wait for all promises to finish and then send the resulting array
          Promise.all(remappedTickets).then(function(results) {
            res.json(results)
        })
       })
       .catch(next)
})


router.post('/event', (req, res, next) => {
    if (req.body.eventName) {
        Event
            .create(req.body)
            .then(events => {
                res.status(200).send(events)
            })
            .catch(next)
    }
    else {
        res.status(400).end()
    }
    })

module.exports = router