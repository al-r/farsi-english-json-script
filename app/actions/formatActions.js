const formatService = require("../services/formatService");

exports.formatToJson = (req, res) => {
    let preProcessedData = req.files.file.data;
    if(Buffer.isBuffer(preProcessedData)){
        preProcessedData = req.files.file.data.toString("utf8");
        preProcessedData = JSON.parse(preProcessedData);
    }

    if(Array.isArray(preProcessedData)) {
        const formattedData = formatService.formatData(preProcessedData);
        res.send(formattedData);
    } else {
        throw "JSON data is not an array."
    }
};