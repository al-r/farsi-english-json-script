const conversionActions = require('../actions/conversionActions');

module.exports = function(app, db) {
    app.post("/convert/array", conversionActions.convertToArray);
    app.post("/convert/object", conversionActions.convertToObject);
};