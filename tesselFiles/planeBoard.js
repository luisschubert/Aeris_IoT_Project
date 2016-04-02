//this file will run on the tessel board simulating the plane boarding process
var tessel = require('tessel');
var rfidlib = require('rfid-pn532'); //

var rfid = rfidlib.use(tessel.port['A']);

var https = require('https');
var planeDestination = 'Los Angeles';// THIS CAN CHANGE AND NEEDS TO

rfid.on('ready', function (version) {
    console.log('Ready to read RFID card');
    rfid.on('data', function(card) {
        console.log('UID:', card.uid.toString('hex'));
        var scannedID = card.uid.toString('hex');
        getUUIDInformation(scannedID);
    });
});

rfid.on('error', function (err) {
    console.error(err);
});



function getUUIDInformation(cardUUID){
    console.log('Getting Information for '+ cardUUID +'!');
    var req = https.request({
        port: 443,
        method: 'GET',
        hostname: 'api.aercloud.aeris.com',
        path: '/v1/16075/scls/rfid-pn532/containers/LuggageTable/contentInstances?apiKey='+ '290420fb-eafd-11e5-a218-a92e98313440',
        headers: {
            Host: 'api.aercloud.aeris.com',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'User-Agent': 'tessel'
        }
    }, function(res) {
        console.log('statusCode for GET UUID: ', res.statusCode);
        //console.log(res);
        // var arr = JSON.parse(res).contentInstances;
        // console.log(arr[0]);
        res.on('data', function (d){

            //process.stdout.write(d);

            //console.log(info.UUID);
            //console.log(arr[0].content.contentTypeBinary.Name);

            var arr = JSON.parse(d).contentInstances;
            //checks all entries in LuggageStorage
            for(var i = 0;i<arr.length;i++){
                var jsonInfo = arr[i].content.contentTypeBinary;
                var info = JSON.parse(jsonInfo);
                //console.log('i = '+i+' info.UUID= '+ info.UUID + ' cardUUID= ' +cardUUID);
                if(info.UUID == cardUUID){
                    var destination = info.Destination;
                    console.log('destination= ' + destination);
                    console.log('planeDestination= '+ planeDestination);
                    if(destination != planeDestination){
                        tessel.led[2].toggle();
                        destinationError(cardUUID);
                        tessel.led[2].toggle();
                    }else if(destination == planeDestination){
                        boardingPlane(cardUUID);
                    }

                }
            }
        })
    });
    req.end();

}

function destinationError(uuid){
    var req = https.request({
        port: 443,
        method: 'POST',
        hostname: 'api.aercloud.aeris.com',
        path: '/v1/16075/scls/rfid-pn532/containers/LuggageEventTable/contentInstances?apiKey='+ '290420fb-eafd-11e5-a218-a92e98313440',
        headers: {
            Host: 'api.aercloud.aeris.com',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'User-Agent': 'tessel'
        }
    }, function(res) {
        console.log('statusCode for POST error event: ', res.statusCode);
    });
    //console.log('{"UUID": ' +'"' +uuid +'"' + ', "EventType": ' + '"error"'+ '}');
    var date = new Date();
    var dateLong = date.getTime();
    req.write('{"UUID": ' +'"' +uuid +'"' + ', "EventType": ' + '"error"'+ ', "Timestamp": ' + '"'+datelong+'"'+ '}');
    req.end();
    req.on('error', function(e) {
        console.error("error posting data to your container",e);
    });
}

function boardingPlane(uuid){
    var req = https.request({
        port: 443,
        method: 'POST',
        hostname: 'api.aercloud.aeris.com',
        path: '/v1/16075/scls/rfid-pn532/containers/LuggageEventTable/contentInstances?apiKey='+ '290420fb-eafd-11e5-a218-a92e98313440',
        headers: {
            Host: 'api.aercloud.aeris.com',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'User-Agent': 'tessel'
        }
    }, function(res) {
        console.log('statusCode for POST board event: ', res.statusCode);
    });
    //console.log('{"UUID": ' +'"' +uuid +'"' + ', "EventType": ' + '"error"'+ '}');
    var date = new Date();
    var dateLong = date.getTime();
    req.write('{"UUID": ' +'"' +uuid +'"' + ', "EventType": ' + '"board"'+ ', "Timestamp": ' + '"'+datelong+'"'+ '}');
    req.end();
    req.on('error', function(e) {
        console.error("error posting data to your container",e);
    });
}
