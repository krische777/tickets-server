const { Router } = require('express')
const Ticket = require('./model')
const Comment = require('../comments/model')
const auth = require('../auth/middleware')
const { toData } = require('../auth/jwt')
const User = require('../user/model')
const sequelize = require('../db')
const {getFraudRisk} = require('../util/serverutility')
const router = new Router()

router.get('/ticket', (req, res, next) => {
    Ticket
        .findAll()
        .then(tickets => {
            res.send(tickets)
        })
        .catch(next)

})

router.get('/event/:id/tickets/:ticketId', (req, res, next) => {
    Ticket.findOne({
        where: {
            id: req.params.ticketId,
        }
    })
        .then(tickets => {
            res.json(tickets)
        })
        .catch(next)
})


const getUserIdFromJWT = (authorization) => {
    const auth = authorization && authorization.split(' ')
    if (auth && auth[0] === 'Bearer' && auth[1]) {
        try {
            return toData(auth[1]).userId
        }
        catch (error) {
            console.log('error while geting user info from token', error)
            return null;
        }
    }
}

router.post('/ticket', auth, (req, res, next) => {

    const userId = getUserIdFromJWT(req.headers.authorization)
    User
        .findByPk(userId)
        .then(user => {
            let newTicket = {
                author: user.fullName,
                picture: req.body.picture,
                price: req.body.price,
                description: req.body.description,
                eventId: req.body.eventId
            }
            if (req.body.price) {
                Ticket
                    .create(newTicket)
                    .then(tickets => {
                        res.status(200).send(tickets)
                    })
                    .catch(next)
            }
            else {
                res.status(400).end()
            }
        }).catch(console.error)

})

router.put('/ticket/:ticketId', auth, (req, res, next) => {
    console.log('description', req.body.description)
    console.log('price', req.body.price)
    console.log('picture', req.body.picture)
    Ticket.findOne({
        where: {
            id: req.params.ticketId,
        }
    })
        .then(currentTicket => {
            const userId = getUserIdFromJWT(req.headers.authorization)
            User
                .findByPk(userId)
                .then(user => {
                    if (currentTicket.author == user.fullName) {
                        Ticket.update({        
                            description: req.body.description,
                            price: req.body.price,
                            picture: req.body.picture,
                        }, {where: {
                            id: req.params.ticketId,
                        }})
                        .then(() => {
                            Ticket.findByPk(req.params.ticketId)
                            .then(updatedTicket=>{
                                res.status(200).json(updatedTicket)
                            })
                            .catch(next)
                        })
                        .catch(next)
                    }
                    else { 
                        res.status(400).end()
                    }
                })
                .catch(next)
        })
        .catch(next)
    })




    router.get('/event/:id/tickets/:ticketId/fraudrisk', (req, res, next) => {
        getFraudRisk(req.params.ticketId, req.params.id)
        .then(fraudRisk=>res.status(200).json(Math.round(fraudRisk)))
        
        // Ticket.findOne({
        //     where: {
        //         id: req.params.ticketId,
        //     }
        // })
        //     .then(currentTicket => {
        //         console.log('currentTicket', currentTicket)
        //         let fraudRisk = 0
        //         Ticket.count({
        //             where: [{ author: currentTicket.author }]
        //         })
        //             .then(authorTickets => {
        //                 //console.log('authorTickets', authorTickets)
        //                 if (authorTickets < 2) {
        //                     fraudRisk += 10
        //                 }
        //                 //console.log('fraudRisk 1', fraudRisk)

        //                 Ticket.findAll({
        //                     where: {
        //                         eventId: req.params.id,
        //                     },
        //                     attributes: [[sequelize.fn('AVG', sequelize.col('price')), 'average']]
        //                 })
        //                     .then(avgPriceCurrentEvent => {
        //                         //console.log('avgPriceCurrentEvent', avgPriceCurrentEvent.average)
        //                         //console.log('avgPriceCurrentEvent', avgPriceCurrentEvent[0].dataValues.average)
        //                         //console.log('currentTicket.price', currentTicket.price)
        //                         let avgAll = Math.round(avgPriceCurrentEvent[0].dataValues.average)
        //                         if (currentTicket.price < avgAll) {
        //                             let x = (100 * (avgAll - currentTicket.price)) / avgAll
        //                             //avgPriceCurrentEvent-x/100*avgPriceCurrentEvent==currentTicket.price
        //                             fraudRisk += x
        //                             //console.log('fraudRisk 2', fraudRisk)
        //                         }
        //                         else if (currentTicket.price > avgAll) {
        //                             //    avgAll+x/100*avgAll==currentTicket
        //                             //    x/100
        //                             let x = (100 * (currentTicket.price - avgAll)) / avgAll
        //                             if (x > 10) x = 10
        //                             fraudRisk -= x
        //                         }
        //                         //console.log('time added', currentTicket.createdAt)

        //                         let date1 = currentTicket.createdAt
        //                         console.log('date 1', date1.getUTCHours())

        //                         if (date1.getUTCHours() >= 9 && date1.getUTCHours() <= 17) {
        //                             fraudRisk -= 10
        //                         }
        //                         else fraudRisk += 10

        //                         Comment.count({
        //                             where: [{ ticketId: currentTicket.id }]
        //                         })
        //                             .then(ticketCount => {
        //                                 if (ticketCount > 3) fraudRisk += 5

        //                                 if (fraudRisk < 5) fraudRisk = 5

        //                                 if (fraudRisk > 95) fraudRisk = 95

        //                                 res.status(200).json(Math.round(fraudRisk))
        //                             })


        //                         //res.send(fraudRisk)-does not work

        //                     })
        //                     .catch(next)
        //             })
        //             .catch(next)
        //         //res.json(tickets)
        //     })
        //     .catch(next)
    })

    module.exports = router