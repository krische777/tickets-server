const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET || 'e77^%$$#^&^*&@9sejg)DSU**##99465639fn,m'

function toJWT(data) {
    return jwt.sign(data, secret,
        { expiresIn: '1h' })
}

function toData(token) {
    return jwt.verify(token, secret)
}

module.exports = { toJWT, toData }