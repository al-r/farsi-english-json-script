const parseRTF = require("rtf-parser");

module.exports = function(app, db) {
    function formatData(dataJson) {
        let formattedData = dataJson.filter((string) => {
            return string !== "";
        }).reduce((result, string, index) => {
            if(index===0){
                result = {
                    title: string,
                    scripts: [],
                }
            } else {
                let resultIndex = result.scripts.length - 1;
                if(string.match(/[\u0600-\u06FF]/g)) {
                    if(result.scripts[resultIndex] && result.scripts[resultIndex].hasOwnProperty("meta") && result.scripts[resultIndex].hasOwnProperty("farsi")){
                        result.scripts[resultIndex].farsi = result.scripts[resultIndex].farsi.concat(string);
                    } else if(result.scripts[resultIndex] && result.scripts[resultIndex].hasOwnProperty("meta")) {
                        result.scripts[resultIndex] = {
                            ...result.scripts[resultIndex],
                            farsi: string
                        }
                    }
                } else {
                    if(string.match(/^([A-Z]{3,}|[a-z]{3,}\:)|^(SOT|OOV|PTC|PIX)/)){
                        const stringArray = string.split(":")

                        if(stringArray.length>1){
                            result.scripts.push({
                                meta: stringArray[0],
                                english: stringArray[1]
                            });
                        } else {
                            result.scripts.push({
                                meta: stringArray[0]
                            });
                        }
                    } else  {
                        if(result.scripts[resultIndex] && result.scripts[resultIndex].hasOwnProperty("meta") && result.scripts[resultIndex].hasOwnProperty("english")){
                            result.scripts[resultIndex].english = result.scripts[resultIndex].english.concat(string);
                        } else if(result.scripts[resultIndex] && result.scripts[resultIndex].hasOwnProperty("meta")) {
                            result.scripts[resultIndex] = {
                                ...result.scripts[resultIndex],
                                english: string
                            }
                        }
                    }
                }
            }
            return result;
        }, {});

        return formattedData;
    };

    function convertRtfToJsonArray(rtf) {
        return new Promise((resolve, reject) => {
            return parseRTF.string(rtf, (err, data) => {
                if(Array.isArray(data.content)){
                    const formatRtf = data.content.reduce((result, item, index) => {
                        if(Array.isArray(item.content) && item.content.length===1){
                            result.push(item.content[0].value);
                        } else if(Array.isArray(item.content) && item.content.length>1){
                            const stringArray = item.content.map((itemValue, itemIndex) => {
                                return itemValue.value;
                            });

                            result.push(stringArray.join(""));
                        }

                        return result;
                    }, []);

                    resolve(formatRtf);
                }
            });
        });
    };
      
    app.post("/format", (req, res) => {
        let preProcessedData = req.files.file.data;
        if(Buffer.isBuffer(preProcessedData)){
            preProcessedData = req.files.file.data.toString('utf8');
            preProcessedData = JSON.parse(preProcessedData);
        }

        if(Array.isArray(preProcessedData)) {
            const formattedData = formatData(preProcessedData);
            res.send(formattedData);
        } else {
            throw "JSON data is not an array."
        }
    });

    app.post("/convert/array", (req, res) => {
        let preProcessedData = req.files.file.data;
        if(Buffer.isBuffer(preProcessedData)){
            preProcessedData = req.files.file.data.toString('ascii');
        }

        convertRtfToJsonArray(preProcessedData).then((data) => {
            res.send(data);
        }).catch((error) => {
            throw error;
        });
    });

    app.post("/convert/object", (req, res) => {
        let preProcessedData = req.files.file.data;
        if(Buffer.isBuffer(preProcessedData)){
            preProcessedData = req.files.file.data.toString('ascii');
        }

        convertRtfToJsonArray(preProcessedData).then((data) => {
            res.send(formatData(data));
        }).catch((error) => {
            throw error;
        });
    });
};