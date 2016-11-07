var AWS = require('aws-sdk');
var fs = require('fs');
var csvParse = require('csv-parse/lib/sync');

//hack for QL on prem
var https = require('https');
AWS.config.update({
    httpOptions: {
        agent: new https.Agent({
            rejectUnauthorized: false
        })
    }
});

var testItemsText = fs.readFileSync('data/items.csv');
var items = csvParse(testItemsText, {columns: true}).splice(0);
var requestItems = items.map(function(item) {
    return {
        PutRequest: {
            Item: item
        }
    }
});

var requestObject = {
    RequestItems: {
        "archer-items": requestItems
    }
};

console.log(requestObject);

var dynamo = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

dynamo.batchWrite(requestObject, function (err, data) {
    if (err) {
        console.log(err, err.stack);
    } else {
        console.log(data);
    }
});
