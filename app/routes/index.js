const conversionRoutes = require('./conversion_routes');

module.exports = function(app, db) {
    conversionRoutes(app, db); 
};