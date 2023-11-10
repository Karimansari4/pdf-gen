const PdfData = require('../models/PdfData')
const path = require('path')
const User = require('../models/User')

exports.addPDFfile = async(req, res) => {
    
    const id = req.params.id
    const pdf = req.files.pdf
    const date = new Date()
    const pdfName = pdf.name.split('.')[0]+date.getTime()+"."+pdf.name.split('.')[1]

    try {
        if(!id){
            return res.status(400).json({msg: 'Access Denied!', success: false})
        }else{
            if(!pdf){
                return res.status(400).json({msg: 'No file selected?', success: false})
            }else if(pdf.mimetype.split('/')[1] === 'pdf'){

                const filePath = path.join(__dirname, "..", "uploads", pdfName)
                // console.log("file name: ", pdfName);
                pdf.mv(filePath, async(err) => {
                    if(err){
                        // console.log("image upload error: ", err);
                        return res.status(400).json({success: false, msg: "Failed to upload PDF?"})
                    }else{
                        // console.log("data: ", data);
                        const result = await PdfData.create({fileName: pdfName, filePath: filePath, userId: id})
                        if(result){
                            return res.status(200).json({msg: `PDF ${pdf.name} uploaded successfully.`, success: true})
                        }else{
                            return res.status(400).json({msg: `Failed to upload PDF ${pdf.name}`, success: false})
                        }
                    }
                })
            }
        }
    } catch (error) {
        console.log("error on addPDFfile: ", error);
        return res.status(500).json({msg: error.message, error, success: false})
    }
}

exports.getAllPDFfile = async(req, res) => {
    const id = req.params.id
    // console.log("id: ", id);
    try {
        if(!id){
            return res.status(400).json({msg: 'Access Denied!', success: false})
        }else{
            const result = await PdfData.find({userId: id})
            // console.log("result: ", result);
            if(result){
                return res.status(200).json({msg: 'Ok', result, success: true})
            }else{
                return res.status(404).json({msg: 'No PDF data found?', success: false})
            }
        }
    } catch (error) {
        console.log("error on getAllPDFfile: ", error);
        return res.status(500).json({msg: error.message, error, success: false})
    }
}

exports.getSinglePDF = async(req, res) => {
    const {userId, pdfId} = req.params
    // console.log("userId: ", userId, "pdfId: ", pdfId);
    // console.log("req.params: ", req.params);

    try {
        if(!userId){
            return res.status(400).json({msg: 'Access Denied!', success: false})
        }else{
            if(!pdfId){
                return res.status(400).json({msg: 'Please select a PDF?', success: false})
            }else{
                const checkUser = await User.findById(userId)
                if(checkUser){
                    const checkPDF = await PdfData.findById(pdfId)
                    if(checkPDF){
                        if(checkPDF.userId == userId){
                            // console.log("checkPDF: ", checkPDF);
                            return res.status(200).json({msg: 'Ok', result: checkPDF, success: true})
                        }else{
                            return res.status(400).json({msg: 'PDF not found?', success: false})
                        }
                    }else{
                        return res.status(400).json({msg: 'PDF not found?', success: false})
                    }
                }else{
                    return res.status(404).json({msg: 'User not found?', success: false})
                }
            }
        }
    } catch (error) {
        console.log("error on getSinglePDF: ", error);
        return res.status(500).json({msg: error.message, error, success: false})
    }
}