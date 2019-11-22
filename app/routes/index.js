const conversionRoutes = require('./conversion_routes');
const formatRoutes = require('./format_routes');

module.exports = function(app, db) {
    conversionRoutes(app, db); 
    formatRoutes(app, db); 
};