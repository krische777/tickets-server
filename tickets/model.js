const Sequelize=require('sequelize')

const sequelize=require('../db')

const Ticket=sequelize.define('ticket', {
    author: {
        type: Sequelize.STRING,
        allowNull:false
    },
    picture: {
        type: Sequelize.STRING,
        allowNull: true
    },
    price: {
        type:Sequelize.INTEGER,
        allowNull:false
    },
    description: {
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=Ticket