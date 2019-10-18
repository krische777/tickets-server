const { Router } = require('express')
const Event = require('./model')
const Ticket=require('../tickets/model')
//import auth to make some functions available only for registered users
const auth=require('../auth/middleware')
const {getFraudRisk} = require('../util/serverutility')
const router = new Router()
const sequelize = require('../db')

router.get('/event', (req, res, next) => {
    console.log('current date',new Date())
    console.log('current date seq',sequelize.fn('NOW'))
    // const limit=req.query.limit||9
    // const offset=req.query.offset||0
    Event
        .findAll({
            // limit, offset
        })
        .then(events =>{
            let recentEvents=[]
            events.forEach(event => {
                if(event.endDate >= new Date()){
                    recentEvents.push(event)
                }
            });
            res.status(200).send(recentEvents)
        })
        .catch(next)
})

router.get('/event/:id/tickets', (req, res, next)=>{

       Ticket.findAll({where: {
           eventId: req.params.id,
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


router.post('/event', auth, (req, res, next) => {
    let newEvent = {
        eventName: req.body.eventName,
        picture: req.body.picture,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        description: req.body.description,
    }
    if (req.body.eventName) {
        Event
            .create(newEvent)
            .then(event => {
                res.status(200).send(event)
            })
            .catch(next)
    }
    else {
        res.status(400).end()
    }
    })

module.exports = router