exports.formatData = (dataJson) => {
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