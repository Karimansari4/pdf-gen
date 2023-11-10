const express = require('express')
const { getAllPDFfile, addPDFfile, getSinglePDF } = require('../controllers/pdfData')
const pdfDataRouter = express.Router()

// Get API
pdfDataRouter.get('/getAllPDF/:id', getAllPDFfile)

pdfDataRouter.get('/getSinglePDF/:userId/:pdfId', getSinglePDF)

// POST API
pdfDataRouter.post('/addPDF/:id', addPDFfile)


module.exports = pdfDataRouter