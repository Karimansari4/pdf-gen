const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PdfDataSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {timestamps: true})

const PdfData = mongoose.model('pdfData', PdfDataSchema)
module.exports = PdfData