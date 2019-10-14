const Sequelize=require('sequelize')
const sequelize=require('../db')
const Ticket=require('../tickets/model')

const Event=sequelize.define('event', {
    eventName: {
        type: Sequelize.STRING,
        allowNull:false
    },
    description: {
        type:Sequelize.STRING,
        allowNull:false
    },
    picture: {
        type: Sequelize.STRING,
        allowNull:false
    },
    startDate: {
        type: Sequelize.DATE,
        allowNull:false
    },
    endDate: {
        type:Sequelize.DATE,
        allowNull:false
    }
    
})

Ticket.belongsTo(Event)
Event.hasMany(Ticket)

module.exports=Event