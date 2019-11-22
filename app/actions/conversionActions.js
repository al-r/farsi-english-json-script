const conversionService = require("../services/conversionService");
const formatService = require("../services/formatService");

exports.convertToArray = (req, res) => {
    let preProcessedData = req.files.file.data;
    if(Buffer.isBuffer(preProcessedData)){
        preProcessedData = req.files.file.data.toString('ascii');
    }

    conversionService.convertRtfToJsonArray(preProcessedData).then((data) => {
        res.send(data);
    }).catch((error) => {
        throw error;
    });
};

exports.convertToObject = (req, res) => {
    let preProcessedData = req.files.file.data;
    if(Buffer.isBuffer(preProcessedData)){
        preProcessedData = req.files.file.data.toString('ascii');
    }

    conversionService.convertRtfToJsonArray(preProcessedData).then((data) => {
        res.send(formatService.formatData(data));
    }).catch((error) => {
        throw error;
    });
};