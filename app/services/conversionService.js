const parseRTF = require("rtf-parser");

exports.convertRtfToJsonArray = (rtf) => {
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