const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
            title: {
                type: String,
                required: true
            },
            round: {
                type: Number,
                default: 1
            },
            desc: {
                type: String,
                default: 'ROUND 1'
            },
            people: [
                {
                    name: {
                        type: String 
                    },
                    status: {
                        type: Boolean,
                        default: true
                    },
                    round: {
                        type: Number,
                        default: 1
                    }
                } 
            ],
            date: {
                type: Date,
                default: Date.now
            }
});

    
module.exports = Event = mongoose.model('event',EventSchema);