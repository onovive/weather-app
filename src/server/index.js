//create database
var currentData = {};
var previousData = {};

var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}));

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(express.static('dist'))

app.get('/', (req, res) => {
  console.log(req.body);
  res.sendFile('dist/index.html')
})

// Setup Server
const server = app.listen(5000, () => {
  console.log('server is listening on port:', 5000)
})


//getting data posted in forecast and saving inside database
app.post('/forecast', addData);
app.get('/previous', getPrevious);

//moves current data into previous data and saves the new data
function addData (request, response){
  previousData.city = currentData.city;
  previousData.leavingDate = currentData.leavingDate;
  previousData.returningDate = currentData.returningDate;

  currentData.city = request.body.city;
  currentData.leavingDate = request.body.leavingDate;
  currentData.returningDate = request.body.returningDate;

  response.sendStatus(200);
}
//returns previous data
function getPrevious(request, response) {
  response.send(previousData);
}

module.exports = app;
