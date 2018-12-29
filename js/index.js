var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        isDeviceReady = true;

        FCMPlugin.getToken(
            function(token){
                console.log(token);
                if(token !== null){
                    if(token.length > 0){
                        setItem("REGISTERED", "true");
                        setItem("REGID", token);                        
                    }
                }
            },
            function(err){
                console.log('error retrieving token: ' + err);
            }
        );

        FCMPlugin.onNotification(
            function(data){
                console.log(data);
                if(data.wasTapped){
                    //Notification was received on device tray and tapped by the user.
                    myApp.alert(data.body, data.title, null);
                    console.log( "background" );
                }else{
                    //Notification was received in foreground. Maybe the user needs to be notified.
                    console.log( "foreground" ); 
                    myApp.alert(data.body, data.title, null);
                }
            },
            function(msg){
                console.log('onNotification callback successfully registered: ' + msg);
            },
            function(err){
                console.log('Error registering onNotification callback: ' + err);
            }
        );

        
        //getUserLocation();    
    },

    checkSMSPermission: function() {
        var success = function (hasPermission) { 
            if (hasPermission) {
                app.sendSms();
            }
            else {
                // show a helpful message to explain why you need to require the permission to send a SMS
                // read http://developer.android.com/training/permissions/requesting.html#explain for more best practices
                //alert("permissions not granted");
                sendMySMS();
            }
        };
        var error = function (e) { alert('Something went wrong:' + e); };
        sms.hasPermission(success, error);
    },

    sendSms: function() {
        if(getItem("SOS_CONTACTS") == null){
            var temp = [];
            setItem("SOS_CONTACTS", JSON.stringify(temp));
        }
        var mySosContacts = JSON.parse(getItem("SOS_CONTACTS"));
        var number = "";
        for(var i=0; i<mySosContacts.length; i++){
            if(i>0){
                number+= ',';
            }
            number += mySosContacts[i];
        }
        var message = "Please track my location using this link: http://bugdevstudios.com/safespaces/?REQUEST=TRACK_ME&EMAIL="+getItem("EMAIL");
        console.log("number=" + number + ", message= " + message);

        //CONFIGURATION
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                //intent: 'INTENT'  // send SMS with the native android SMS messaging
                intent: '' // send SMS without open any other app

            }
        };

        var success = function () { myApp.alert('Your safe circle has been notified. Your location is now being tracked.', "Success!", null); };
        var error = function (e) { myApp.alert('Your safe was not notified. Possible reason:' + e, "Error!", null); };
        if(number.length != 0){
            sms.send(number, message, options, success, error);
        }else{
            myApp.confirm("No contacts were found in your safe circle. Add Now?", "Alert", function(){ mainView.router.loadPage("add_contacts.html");});
        }
    },

    sendInviteSms: function() {
        if(getItem("INVITED_CONTACTS") == null){
            var temp = [];
            setItem("INVITED_CONTACTS", JSON.stringify(temp));
        }
        var myInvitedContacts = JSON.parse(getItem("INVITED_CONTACTS"));
        var number = "";
        for(var i=0; i<myInvitedContacts.length; i++){
            if(i>0){
                number+= ',';
            }
            number += myInvitedContacts[i];
        }
        var message = "I am using safespaces. download application here http://safespacespk.com/app/android";
        console.log("number=" + number + ", message= " + message);

        //CONFIGURATION
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                //intent: 'INTENT'  // send SMS with the native android SMS messaging
                intent: '' // send SMS without open any other app

            }
        };

        var success = function () { 
            startSosTrackingRequest();
            $$("#stop-tracking").show();
            $$("#start-tracking").hide();
            myApp.alert('Your selected contacts has been invited via SMS.', "Success!", null); 
        };
        var error = function (e) { myApp.alert('Invitation was not sent. Possible reason:' + e, "Error!", null); };
        if(number.length != 0){
            sms.send(number, message, options, success, error);
        }else{
            myApp.confirm("No contacts were selected. Add Now?", "Alert", null);
        }
    }


};

function sendMySMS(){
    var permissions = cordova.plugins.permissions;
    permissions.hasPermission(permissions.SEND_SMS, app.sendSms(), errorCallbackSmsPermission);
}

function errorCallbackSmsPermission(){
    permissions.requestPermission(permissions.SEND_SMS, sendMySMS, function(){ alert("Permission Not granted");});
}

function setItem(key, value){
    localStorage.setItem(key, value);
}

function getItem(key){
    return localStorage.getItem(key);
}


/*

Phone Contact Permission Callback functions

*/

function getUserContacts(){
    var permissions = cordova.plugins.permissions;
    permissions.hasPermission(permissions.READ_CONTACTS, successCallbackContactsPermission, errorCallbackContactsPermission);
}


function successCallbackContactsPermission(){
    var optionsContacts = new ContactFindOptions();
    //optionsContacts.filter   = "Bob";
    optionsContacts.multiple = true;
    //optionsContacts.desiredFields = [navigator.contacts.fieldType.id];
    optionsContacts.hasPhoneNumber = true;
    var fieldsContacts = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
    navigator.contacts.find(fieldsContacts, onSuccessContacts, onErrorContacts, optionsContacts);
}


function errorCallbackContactsPermission(){
    permissions.requestPermission(permissions.READ_CONTACTS, function(){myApp.alert("Contacts Access Granted", "Success!". null);}, errorCallbackDeniedContactsPermission);
}


function errorCallbackDeniedContactsPermission(){
    myApp.confirm('Let the application access your contacts so that you can add emergency contacts.', 'Contacts Permission', function(){ getUserContacts(); });
}


/*

Device Contacts Access Callbacks

*/


function onSuccessContacts(contacts) {
    console.log("Contacts Success");
    console.log(contacts);
    console.log('Found ' + contacts.length + ' contacts.');
    if(contacts.length > 0){
        var contact_titles = '';
        var contact_numbers = '';
        for(var i=0; i< contacts.length; i++){
            if(i>0){
                contact_titles += ',';
                contact_numbers += ',';
            }
            var temp = contacts[i];
            if(temp.displayName === null){
                contact_titles += temp.phoneNumbers[0].value;
                my_contact_titles[i] = temp.phoneNumbers[0].value;
            }else{
                contact_titles += temp.displayName;
                my_contact_titles[i] = temp.displayName;
            }
            contact_numbers += temp.phoneNumbers[0].value; 
            my_contacts[i] = temp.phoneNumbers[0].value;       
        }

        setItem('CONTACTS', contact_numbers);
        setItem('CONTACT_TITLES', contact_titles);
        setItem('JSON_CONTACTS', JSON.stringify(my_contacts));
        setItem('JSON_CONTACT_TITLES', JSON.stringify(my_contact_titles));
        addContactsRequest();
    }else{
        myApp.alert("No contacts were found. Please add some contacts first to your phone.", "Contacts Not Found!", null);
    }
};

function onErrorContacts(contactError) {
    console.log('Contacts Error!');
    console.log(contactError);
};

/*********************************************************/




/*

GPS Location Permission Callback functions

*/

function getUserLocation(){
    var permissions = cordova.plugins.permissions;
    permissions.hasPermission(permissions.ACCESS_COARSE_LOCATION, successCallbackLocationPermission, errorCallbackLocationPermission);
}


function successCallbackLocationPermission(){
    navigator.geolocation.getCurrentPosition(onSuccessLocation, onErrorLocation);
    getUserContacts();
}


function errorCallbackLocationPermission(){
    permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, function(){myApp.alert("Location Access Granted", "Success!". null);}, errorCallbackDeniedPermission);
}


function errorCallbackDeniedPermission(){
    myApp.confirm('In order to use this application you need to provide your location', 'Location Permission', function(){ getUserLocation(); });
}

/*

GPS Location Callback functions

*/


var onSuccessLocation = function(position) {
    console.log("Success Location");
    setItem("LATITUDE", position.coords.latitude);
    setItem("LONGITUDE", position.coords.longitude);
    setItem("ALTITUDE", position.coords.altitude);
    setItem("ACCURACY", position.coords.accuracy);
    setItem("ALTITUDE_ACCURACY", position.coords.altitudeAccuracy);
    setItem("HEADING", position.coords.heading);
    setItem("SPEED", position.coords.speed);
    setItem("TIMESTAMP", position.coords.timestamp);

    console.log(
        'Latitude: '          + position.coords.latitude          + '\n' +
        'Longitude: '         + position.coords.longitude         + '\n' +
        'Altitude: '          + position.coords.altitude          + '\n' +
        'Accuracy: '          + position.coords.accuracy          + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        'Heading: '           + position.coords.heading           + '\n' +
        'Speed: '             + position.coords.speed             + '\n' +
        'Timestamp: '         + position.timestamp                + '\n'
    );
};

function onErrorLocation(error) {
    console.log("Error Location:");
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

/*********************************************************/



/*

GPS Location Update Callback functions

*/


function onSuccessUpdateLocation(position) {
    console.log("Location Updated");
    setItem("LATITUDE",position.coords.latitude);
    setItem("LONGITUDE",position.coords.longitude);
    var latlng = new google.maps.LatLng(parseFloat(getItem('LATITUDE')), parseFloat(getItem('LONGITUDE')));
    my_marker.setPosition(latlng);
    //map.panTo(latlng);
}

function onErrorUpdateLocation(error) {
    console.log("Location Update Error");
    console.log('code: '+ error.code +'\n' + 'message: ' + error.message + '\n');
}


function sendInviteSms(arr, msg){
    var permissions = cordova.plugins.permissions;
    permissions.hasPermission(permissions.SEND_SMS, smsObj.sendSms(arr, msg), errorCallbackSmsPermission(arr, msg));
}

function errorCallbackSmsPermission(arr, msg){
    var permissions = cordova.plugins.permissions;
    permissions.requestPermission(
        permissions.SEND_SMS,
        smsObj.sendSms(arr, msg), 
        function(){ myApp.alert("You can't send SMS via SafeSpace till you grant this permissions.", "Permission Not Granted.", null); });
}



/*********************************************************/

function mapReady(){
    isMapReady = true;
}


var smsList = [];
var interceptEnabled = false;
var my_contacts = [];
var my_contact_titles = [];
var sos_contacts = [];
var sos_contact_titles = [];
var permissions;
var isDeviceReady = false;
var isMapReady = false;



app.initialize();


