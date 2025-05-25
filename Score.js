const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    pontuacao: {
        type: Number,
        required: true,
    },
    data: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Score', scoreSchema);
