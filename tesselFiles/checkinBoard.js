//This file will contain the code to be ran on the check-in Tessel Board


var tessel = require('tessel');
var rfidlib = require('rfid-pn532'); // 

var rfid = rfidlib.use(tessel.port['A']);
var https = require('https');

rfid.on('ready', function (version) {
    console.log('Ready to read RFID card');

    rfid.on('data', function(card) {
        console.log('UID:', card.uid.toString('hex'));
        console.log('Clearing Data in Container');
        clearDataInContainer();
        sendToAercloudONBOARDING(card.uid.toString('hex'));
    });
});

rfid.on('error', function (err) {
    console.error(err);
});

function clearDataInContainer(){
    //ADD DELETE CALL
    var req = https.request({
        port: 443,
        method: 'DELETE',
        hostname: 'api.aercloud.aeris.com',
        path: '/v1/16075/scls/rfid-pn532/containers/ScanStorage/contentInstances?apiKey=' + '290420fb-eafd-11e5-a218-a92e98313440',
        headers: {
            Host: 'api.aercloud.aeris.com',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'User-Agent': 'tessel'
        }
    },function (res) {
        console.log('statusCode of DELETE req: ', res.statusCode);
    });
    req.end();
}

function sendToAercloudONBOARDING(cardEntry) {
    console.log("Send RFID and user information to aercloud");


    var req = https.request({
        port: 443,
        method: 'POST',
        hostname: 'api.aercloud.aeris.com',
        path: '/v1/16075/scls/rfid-pn532/containers/ScanStorage/contentInstances?apiKey=' + '290420fb-eafd-11e5-a218-a92e98313440',
        headers: {
            Host: 'api.aercloud.aeris.com',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'User-Agent': 'tessel'
        }
    }, function (res) {
        console.log('statusCode: ', res.statusCode);
        
    });
    console.log('{"UUID": ' + '"' + cardEntry.toString() + '"' + ', "Registered": ' + '"false"' + '}');
    req.write('{"UUID": ' + '"' + cardEntry.toString() + '"' + ', "Registered": ' + '"false"' + '}');
    req.end();
    req.on('error', function (e) {
        console.error("error posting data to your container", e);
    });
}