const Sequelize = require('sequelize')

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:tickets-app@localhost:5000/postgres'

const db = new Sequelize(databaseUrl)

db.sync({force: false})
    .then(()=> console.log('database was synced'))
    .catch(console.error)

module.exports = db