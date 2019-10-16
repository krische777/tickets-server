const { Router } = require('express')
const Comment = require('./model')
const auth = require('../auth/middleware')
const { toData } = require('../auth/jwt')
const User = require('../user/model')

const router = new Router()

router.get('/comment', (req, res, next) => {
    Comment
         .findAll()
         .then(comments=>{
             res.send(comments)
         })
         .catch(next)

})
router.get('/event/:id/tickets/:ticketId/comment', (req, res, next) => {
    Comment
    .findAll( {
        where: {
            ticketId: req.params.ticketId,
        },
    })
    .then(comments=>{
        res.send(comments)
    })
    .catch(next)
})
const getUserIdFromJWT = (authorization) => {
    const auth = authorization && authorization.split(' ')
    if (auth && auth[0] === 'Bearer' && auth[1]) {
        try {
            console.log('take user id from jwt', toData(auth[1]).userId )
            return toData(auth[1]).userId
        }
        catch (error) {
            console.log('error while geting user info from token', error)
            return null;
        }
    }
}

router.post('/comment', auth, (req, res, next) => {
    
    const userId=getUserIdFromJWT(req.headers.authorization)
    console.log('user id in backend endpoint', userId)
    console.log('text in backend endpoint', req.body.text)
    console.log('ticket id in  backend endpoint', req.body.ticketId)

    User
        .findByPk(userId)
        .then(user => {
            let newComment = {
                author: user.fullName,
                text: req.body.text,
                ticketId: req.body.ticketId
            }
            if (req.body.text) {
                Comment
                    .create(newComment)
                    .then(comments => {
                        res.status(200).send(comments)
                    })
                    .catch(next)
            }
            else {
                res.status(400).end()
            }
        }).catch(console.error)
   
})


module.exports=router