const Ticket = require('../tickets/model')
const Comment = require('../comments/model')
const sequelize = require('../db')

function getFraudRisk(ticket_id, event_id){
    return Ticket.findOne({
        where: {
            id: ticket_id,
        }
    })
        .then(currentTicket => {
            let fraudRisk = 0
            return Ticket.count({
                where: [{ author: currentTicket.author }]
            })
                .then(authorTickets => {
                    //console.log('authorTickets', authorTickets)
                    if (authorTickets < 2) {
                        fraudRisk += 10
                    }
                    //console.log('fraudRisk 1', fraudRisk)

                    return Ticket.findAll({
                        where: {
                            eventId: event_id,
                        },
                        attributes: [[sequelize.fn('AVG', sequelize.col('price')), 'average']]
                    })
                        .then(avgPriceCurrentEvent => {
                            //console.log('avgPriceCurrentEvent', avgPriceCurrentEvent.average)
                            //console.log('avgPriceCurrentEvent', avgPriceCurrentEvent[0].dataValues.average)
                            //console.log('currentTicket.price', currentTicket.price)
                            let avgAll = Math.round(avgPriceCurrentEvent[0].dataValues.average)
                            if (currentTicket.price < avgAll) {
                                let x = (100 * (avgAll - currentTicket.price)) / avgAll
                                //avgPriceCurrentEvent-x/100*avgPriceCurrentEvent==currentTicket.price
                                fraudRisk += x
                                //console.log('fraudRisk 2', fraudRisk)
                            }
                            else if (currentTicket.price > avgAll) {
                                //    avgAll+x/100*avgAll==currentTicket
                                //    x/100
                                let x = (100 * (currentTicket.price - avgAll)) / avgAll
                                if (x > 10) x = 10
                                fraudRisk -= x
                            }
                            //console.log('time added', currentTicket.createdAt)

                            let date1 = currentTicket.createdAt

                            if (date1.getUTCHours() >= 9 && date1.getUTCHours() <= 17) {
                                fraudRisk -= 10
                            }
                            else fraudRisk += 10

                            return Comment.count({
                                where: [{ ticketId: currentTicket.id }]
                            })
                                .then(ticketCount => {
                                    if (ticketCount > 3) fraudRisk += 5

                                    if (fraudRisk < 5) fraudRisk = 5

                                    if (fraudRisk > 95) fraudRisk = 95

                                    return (Math.round(fraudRisk))
                                })


                            //res.send(fraudRisk)-does not work

                        })
                        .catch(console.error)
                })
                .catch(console.error)
            //res.json(tickets)
        }).catch(console.error)
    }

module.exports = { getFraudRisk }