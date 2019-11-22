const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const app = express();
app.use(fileUpload({
    createParentPath: true
}));
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('./app/routes')(app, {});

app.listen(port, () => {  console.log('We are live on ' + port);});