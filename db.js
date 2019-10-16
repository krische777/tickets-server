const Sequelize = require('sequelize')

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:tickets-app@localhost:5000/postgres'

const db = new Sequelize(databaseUrl)

db.sync({force: false})
    .then(()=> {
        const User=require('./user/model')
        const Comment=require('./comments/model')
        const Ticket=require('./tickets/model')
        const Event=require('./events/model')
        console.log('database was synced')
        Event.create({
            eventName: 'House Party',
            description:"House Party in South park",
            picture: 'https://www.billboard.com/files/styles/768x433/public/media/ibiza-elrow-2019-billboard-1500.jpg',
            startDate: 2019-10-25,
            endDate: 2019-10-25
        });
        Event.create({
            eventName: 'Rock Party',
            description:"Rock Party in Rooftop Bar",
            picture: 'http://romarestudio.com/wp-content/uploads/2018/10/artists-audience-band-1763075.jpg',
            startDate: 2019-10-26,
            endDate: 2019-10-26
        });
        Event.create({
            eventName: 'Cooking ',
            description:"Cooking with Mimi",
            picture: 'some photo',
            startDate: 2019-10-24,
            endDate: 2019-10-24
        });
        Ticket.create({
            author: 'test',
            picture: 'https://www.billboard.com/files/styles/768x433/public/media/ibiza-elrow-2019-billboard-1500.jpg',
            price:14,
            description:'The best house party ever',
            eventId:1
        });
        Ticket.create({
            author: 'viky',
            picture: 'https://www.billboard.com/files/styles/768x433/public/media/ibiza-elrow-2019-billboard-1500.jpg',
            price:11,
            description:'The best offer for the house party ',
            eventId:1
        });
        Ticket.create({
            author: 'krisi',
            picture: 'http://romarestudio.com/wp-content/uploads/2018/10/artists-audience-band-1763075.jpg',
            price:10,
            description:'The best rock party ever',
            eventId:2
        });
        Ticket.create({
            author: 'teddy',
            picture: 'http://romarestudio.com/wp-content/uploads/2018/10/artists-audience-band-1763075.jpg',
            price:11,
            description:'The best offer for the rock party ',
            eventId:2
        });
        Ticket.create({
            author: 'viky',
            picture: 'https://www.yesmagazine.org/issues/affordable-housing/cooking-stirs-the-pot-for-social-change-20180627/sioux-chef-cooking.jpg/image',
            price:10,
            description:'The best cooking event ever',
            eventId:3
        });
        Ticket.create({
            author: 'test',
            picture: 'https://www.yesmagazine.org/issues/affordable-housing/cooking-stirs-the-pot-for-social-change-20180627/sioux-chef-cooking.jpg/image',
            price:4,
            description:'The best offer for the cooking event',
            eventId:3
        });
        Comment.create({
            text: 'this event will be the best this year',
            author:'lilly',
            ticketId:1
        });
        Comment.create({
            text: 'i look forward to this event',
            author:'rrrrrrrr',
            ticketId:2
        });
        Comment.create({
            text: 'That will be awesome',
            author:'rrrrrrrr',
            ticketId:2
        });
        Comment.create({
            text: 'So great',
            author:'jumbo',
            ticketId:2
        });

    })
    .catch(console.error)

module.exports = db