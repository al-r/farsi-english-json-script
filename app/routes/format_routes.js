const formatActions = require("../actions/formatActions");

module.exports = function(app, db) {
    app.post("/format", formatActions.formatToJson);
};