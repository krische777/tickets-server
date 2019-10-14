const { Router } = require('express')
const Event = require('./model')

const router = new Router()

router.get('/event', (req, res, next) => {
    Event
        .findAll()
        .then(events =>{
            res.status(200).send(events)
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