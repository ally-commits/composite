const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamName = new Schema({
    title: {
        type: String
    },
    names: {
        type: Array,
        required: true
    }
});

module.exports = Name = mongoose.model('names',TeamName);