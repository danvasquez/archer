var express = require('express');
var AWS = require('aws-sdk');
var app = express();

//hack for QL on prem
var https = require('https');
AWS.config.update({
    httpOptions: {
        agent: new https.Agent({
            rejectUnauthorized: false
        })
    }
});
var dynamo = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

app.get('/', function (request, response) {
    response.send('Welcome To Archer!');
});

app.get('/items', function (request, response) {
    var params = {
        TableName: 'archer-items'
    };

    dynamo.scan(params, function (error, data) {
        if (error) {
            var errorString = JSON.stringify(error, null, 2);
            console.error("Unable to scan the table. Error JSON:", errorString);
            response.status(500).send(errorString);
        } else {
            response.json(data.Items);
        }
    });
});

app.listen(3000, function() {
    console.log('Services App running!');
});