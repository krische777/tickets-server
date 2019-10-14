const { Router } = require('express')
const Event = require('./model')
const Ticket=require('../tickets/model')

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
       } })
       .then(tickets=>{
           res.json(tickets)
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