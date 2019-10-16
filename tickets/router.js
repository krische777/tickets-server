const { Router } = require('express')
const Ticket = require('./model')
const Comment = require('../comments/model')
const auth = require('../auth/middleware')
const { toData } = require('../auth/jwt')
const User = require('../user/model')

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
        },
        include: [
            { model: Comment }
        ]
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
    
    const userId=getUserIdFromJWT(req.headers.authorization)
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

module.exports = router