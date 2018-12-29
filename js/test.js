// Initialize your app
var myApp = new Framework7({ material:true });

// Export selectors engine
var $$ = Dom7;



//Global Variables 
var map;
var my_marker;
var watchID;


// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});




setTimeout(function(){
     if(getItem('LOGIN') == null || getItem('LOGIN') == 'false'|| getItem('LOGIN')==''){
        mainView.router.loadPage('login.html');
    }else{
        mainView.router.loadPage('dashboard.html');
    }
  
}, 3000);


var STATUS = {
    SUCCESS: "SUCCESS",
    FAIL: "FAIL",
    ERROR: "ERROR",
    NOTFOUND: "NOTFOUND" 
}


/*

    PAGE INIT CALLS

*/

myApp.onPageInit('index', function (page) {

});

myApp.onPageInit('login', function (page) {
    
});

myApp.onPageInit('signup', function (page) {
    
});

myApp.onPageInit('reset-password', function (page) {
    
});

myApp.onPageInit('view-profile', function (page) {
    
});

myApp.onPageInit('add-contacts', function (page) {
    loadContactsPage();
});

myApp.onPageInit('home', function (page) {
   

});
myApp.onPageInit('dashboard', function (page) {
    
});

myApp.onPageInit('request-blood', function (page) {
    
});

myApp.onPageInit('request-update', function (page) {
    
});


/*

Functions to load pages

*/

function loadContactsPage(){
    getUserContacts();
    var strContactsList = '';
    for(var i=0; i < my_contacts.length; i++){
        strContactsList += '<li>';
        strContactsList += '<label class="label-checkbox item-content">';
        strContactsList += '<input type="checkbox" id="selected-contacts" name="selected-contacts" value="'+i+'">';
        strContactsList += '<div class="item-media"><i class="icon icon-form-checkbox"></i></div>';
        strContactsList += '<div class="item-inner">';
        strContactsList += '<div class="item-title">'+ my_contact_titles[i] +'</div>';
        strContactsList += '<div class="item-after">'+ my_contacts[i] +'</div>';
        strContactsList += '</div>';
        strContactsList += '</label>';
        strContactsList += '</li>';
    }
    $$('#contacts-list').html(strContactsList);
}




/*

    AJAX Request Function

*/

function serverRequest(requestDATA, successCallback, errorCallback, hideIndicator, showAlert){
    var METHOD = "GET";
    var SERVER_URL = "http://localhost/BugDev/BloodDonate/server.php";
    var DATA_TYPE = 'json';
    var TIMEOUT = 20000;
    console.log(requestDATA);
    $$.ajax({
        url: SERVER_URL,
        data: requestDATA,
        dataType: DATA_TYPE,
        type: METHOD,
        timeout: TIMEOUT,
        success: function(data){
            successCallback(data, hideIndicator, showAlert);
        },
        error: function(a, b, c){
            errorCallback(a, b, c, hideIndicator, showAlert);
        }
    }); 
}

/*

    Function to handle request error

*/

function responseError(xhr, textStatus, errorThrown, hideIndicator, showAlert){
       console.log(xhr);
       console.log(textStatus);
       console.log(errorThrown);
    var error_message = "";
    switch(textStatus){
        case 'error':
            error_message = "Please check your internet connection and try again.";
        break;
        case 'parsererror':
            error_message = "Internal error occureed. Report application administrator about this error.";
        break;
        case 'timeout':
            error_message = "Slow internet may be. Pull down to refresh page.";
        break;
        case 'abort':
            error_message = "The request was aborted.";
        break;
        default:
            error_message = "Cannot reach server at this time. You can report this error.";
        break;
    }
    if(hideIndicator){
        myApp.hideIndicator();
    }

    if(showAlert){
        myApp.alert(error_message, "Oh Snap! :(", null);
    }
}

/*

    Request With Server Fail or Error or Others

*/

function requestFailure(status, message, showAlert){
    if(showAlert){
        if(status == STATUS.NOTFOUND){
            myApp.alert(message, 'No Data Available!', null);
        }else if(status == STATUS.FAIL){
            myApp.alert(message, 'Request Failure!', null);
        }else if(status == STATUS.ERROR){
            myApp.alert(message, 'Server Error!', null);
        }else{
            if(showAlert){
                myApp.alert("Application was not ready to serve this request at this time.", 'Unknown Response', null);
            }
        }
    }
}





/*

    Request Functions

*/


//Request 1
function loginRequest(){
    var requestDATA = {'REQUEST':'LOGIN', 'EMAIL':$$('#login-email').val(), 'PASSWORD':$$('#login-password').val()};
    myApp.showIndicator();
    serverRequest(requestDATA, loginSuccess, responseError, true, true);
}

//Request 2
function signUpRequest(){
    var requestDATA = {'REQUEST':'SIGNUP', 'NAME':$$('#signup-name').val(),  'EMAIL':$$('#signup-email').val(), 'PASSWORD':$$('#signup-password').val(), 'CONTACT':$$('#signup-contact').val(), 'GENDER':$$('#signup-gender').val(), 'BLOOD_GROUP':$$('#signup-blood-group').val(), 'LATITUDE':$$('#signup-latitude').val(), 'LONGITUDE':$$('#signup-longitude').val(), 'CITY':$$('#signup-city').val()};
    myApp.showIndicator();
    serverRequest(requestDATA, signUpSuccess, responseError, true, true);
}


//Request 3
function resetPasswordRequest(){
    var requestDATA = {'REQUEST':'RESET_PASSWORD', 'EMAIL':$$('#reset-email').val()};
    myApp.showIndicator();
    serverRequest(requestDATA, resetPasswordSuccess, responseError, true, true);
}


//Request 4
function deleteUserRequest(){
    var requestDATA = {'REQUEST':'ACCOUNT_DELETE', 'USER_ID': getItem('USER_ID')};
    myApp.showIndicator();
    serverRequest(requestDATA, deleteUserSuccess, responseError, true, true);
}


//Request 5
function getUserRequest(){
    var requestDATA = {'REQUEST':'ACCOUNT_VIEW', 'USER_ID': getItem('USER_ID')};
    myApp.showIndicator();
    serverRequest(requestDATA, getUserSuccess, responseError, true, true);
}


//Request 6
function updateUserRequest(){
    var requestDATA = {'REQUEST':'ACCOUNT_UPDATE', 'USER_ID': getItem('USER_ID'), 'NAME':$$('#view-profile-name').val(),  'EMAIL':$$('#view-profile-email').val(), 'PASSWORD':$$('#view-profile-password').val(), 'CONTACT':$$('#view-profile-contact').val(), 'GENDER':$$('#view-profile-gender').val(), 'BLOOD_GROUP':$$('#view-profile-blood-group').val(), 'LATITUDE':$$('#view-profile-latitude').val(), 'LONGITUDE':$$('#view-profile-longitude').val(), 'CITY':$$('#view-profile-city').val()};
    myApp.showIndicator();
    serverRequest(requestDATA, updateUserSuccess, responseError, true, true);
}


//Request 7
function bloodRequest(){
    var requestDATA = {'REQUEST':'BLOOD_REQUEST', 'USER_ID': getItem('USER_ID'), 'LATITUDE':$$('#blood-request-latitude').val(), 'LONGITUDE':$$('#blood-request-longitude').val(), 'BLOOD_GROUP':$$('#blood-request-bloodgroup').val()};
    myApp.showIndicator();
    serverRequest(requestDATA, bloodRequestSuccess, responseError, true, true);
}


//Request 8
function bloodRequestUpdate(){
    var requestDATA = {'REQUEST':'BLOOD_REQUEST_UPDATE', 'USER_ID': getItem('USER_ID'), 'REQUEST_ID': getItem('REQUEST_ID'), 'LATITUDE':$$('#update-request-latitude').val(), 'LONGITUDE':$$('#update-request-longitude').val(), 'BLOOD_GROUP':$$('#update-request-bloodgroup').val()};
    myApp.showIndicator();
    serverRequest(requestDATA, bloodRequestUpdateSuccess, responseError, true, true);
}


//Request 9
function bloodRequestDelete(){
    var requestDATA = {'REQUEST':'BLOOD_REQUEST_DELETE', 'REQUEST_ID': getItem('REQUEST_ID')};
    myApp.showIndicator();
    serverRequest(requestDATA, bloodRequestDeleteSuccess, responseError, true, true);
}


//Request 10
function getMyBloodRequest(){
    var requestDATA = {'REQUEST':'GET_MY_BLOOD_REQUESTS', 'USER_ID': getItem('USER_ID')};
    myApp.showIndicator();
    serverRequest(requestDATA, getMyBloodRequestSuccess, responseError, true, true);
}

//Request 11
function bloodRequestAccept(){
    var requestDATA = {'REQUEST':'BLOOD_REQUEST_ACCEPT', 'USER_ID': getItem('USER_ID'), 'REQUEST_ID': getItem('REQUEST_ID')};
    myApp.showIndicator();
    serverRequest(requestDATA, bloodRequestAcceptSuccess, responseError, true, true);
}



//Request 12
function getAllBloodRequest(){
    var requestDATA = {'REQUEST':'GET_ALL_BLOOD_REQUESTS'};
    myApp.showIndicator();
    serverRequest(requestDATA, getAllBloodRequestSuccess, responseError, true, true);
}
/*

    Success Callback Functions

*/


//Callback 1
function loginSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);
    if(data.STATUS == STATUS.SUCCESS){
        setItem('USER_ID', data.DATA[0].user_id);
        setItem('NAME', data.DATA[0].name);
        setItem('EMAIL', data.DATA[0].email);
        setItem('BLOOD_GROUP', data.DATA[0].blood_group);
        // setItem('LONGITUDE', data.DATA[0].longitude);
        // setItem('LATITUDE', data.DATA[0].latitude);
        setItem('LOGIN', 'true');
       mainView.router.loadPage('dashboard.html');
    }else{

       requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}

//Callback 2
function signUpSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);

    if(data.STATUS == STATUS.SUCCESS){
        
    }else{
        requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}


//Callback 3
function resetPasswordSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);

    if(data.STATUS == STATUS.SUCCESS){
        
    }else{
        requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}


//Callback 4
function getUserSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);

    if(data.STATUS == STATUS.SUCCESS){
        
    }else{
        requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}


//Callback 5
function updateUserSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);

    if(data.STATUS == STATUS.SUCCESS){
        
    }else{
        requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}


//Callback 6
function deleteUserSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);

    if(data.STATUS == STATUS.SUCCESS){
        
    }else{
        requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}


//Callback 6
function bloodRequestSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);

    if(data.STATUS == STATUS.SUCCESS){
        
    }else{
        requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}



//Callback 7
function bloodRequestUpdateSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);

    if(data.STATUS == STATUS.SUCCESS){
        
    }else{
        requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}


//Callback 8
function bloodRequestDeleteSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);

    if(data.STATUS == STATUS.SUCCESS){
        
    }else{
        requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}


//Callback 9
function getMyBloodRequestSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);

    if(data.STATUS == STATUS.SUCCESS){
        
    }else{
        requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}


//Callback 10
function bloodRequestAcceptSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);

    if(data.STATUS == STATUS.SUCCESS){
        
    }else{
        requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}


//Callback 11
function getAllBloodRequestSuccess(data, hideIndicator, showAlert){
    if(hideIndicator){
        myApp.hideIndicator();
    }
    console.log(data);

    if(data.STATUS == STATUS.SUCCESS){
        
    }else{
        requestFailure(data.STATUS, data.MESSAGE, showAlert);
    }
}

/*

Extra Logic Functions


*/
function logout(){
    setItem("LOGIN", "false");
    setItem("USER_ID", "");
    setItem("EMAIL", "");
    setItem("NAME", "");
    mainView.router.loadPage("login.html");
}