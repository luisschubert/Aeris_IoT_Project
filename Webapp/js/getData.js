/**
 * Created by luisschubert on 3/31/16.
 */
var xmlhttp = new XMLHttpRequest();
var url = "https://api.aercloud.aeris.com/v1/16075/scls/rfid-pn532/containers/LuggageTable/contentInstances?apiKey=290420fb-eafd-11e5-a218-a92e98313440&dataFormat=jsonRaw";

xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        myFunction(xmlhttp.responseText);
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();

function myFunction(response) {
    var arr = JSON.parse(response).contentInstances;
    var i;
    var out = "<table>";

    for(i = 0; i < arr.length; i++) {
        out += "<tr><td>" +
            arr[i].content.contentTypeBinary.UUID+
            "</td><td>"+
            arr[i].content.contentTypeBinary.Name +
            "</td><td>"+
            arr[i].content.contentTypeBinary.Destination +
            "</td><td>"+
            arr[i].content.contentTypeBinary.PhoneNumber +
            "</td></tr>";
            // +new Date(arr[i].creationTime)+
            // "</td></tr>";
    }
    
    out += "</table>";
    document.getElementById("content").innerHTML = out;
}