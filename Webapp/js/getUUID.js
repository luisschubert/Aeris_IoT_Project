/**
 * Created by luisschubert on 4/1/16.
 */

    console.log('started process');
    var xmlhttp = new XMLHttpRequest();
    var url = "https://api.aercloud.aeris.com/v1/16075/scls/rfid-pn532/containers/ScanStorage/contentInstances?apiKey=290420fb-eafd-11e5-a218-a92e98313440&dataFormat=jsonRaw";

    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            printData(xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();



var uuidData = '';
function printData(response) {
    var arr = JSON.parse(response).contentInstances;
    var i;
    

           for(i = 0; i < arr.length; i++) {

               var boolVal = arr[i].content.contentTypeBinary.Registered;
               console.log(boolVal);
               if (boolVal = 'false'){
                   uuidData = arr[i].content.contentTypeBinary.UUID;
               }
               console.log(uuidData);
           }
    
}

function printUUID(){
    document.getElementById("UUID").value = uuidData;
}
function postToAercloud() {
    var Name = document.getElementById("Name").value;
    var PhoneNumber = document.getElementById("PhoneNumber").value;
    var Destination = document.getElementById("Destination").value;
    var UUID = document.getElementById("UUID").value;
    console.log(Name + " " + PhoneNumber+ " " + Destination + " "+ UUID);

    var http = new XMLHttpRequest();
    var url = "https://api.aercloud.aeris.com/v1/16075/scls/rfid-pn532/containers/LuggageTable/contentInstances?apiKey=290420fb-eafd-11e5-a218-a92e98313440&dataFormat=jsonRaw";
    var params = '{"Name":'+'"'+Name+'"'+',"PhoneNumber":'+'"'+PhoneNumber+'"'+',"Destination":'+'"'+Destination+'"'+',"UUID":'+'"'+ UUID +'"}';
    http.open("POST", url, true);

//Send the proper header information along with the request

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    };
    http.open("POST", url, true);
    http.send(params);

}