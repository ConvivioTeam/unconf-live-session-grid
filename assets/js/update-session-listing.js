(function(){
    
    var previousSessions;
    var sessions = null;
    
    var init = function() {
        getSessions(function() {
        if(previousSessions !== sessions && previousSessions !== null) {
            console.log('Updating sessions');
            updateSessions()
        }
        else {
            console.log('Sessions are the same');
        }
    });
};

var getSessions = function(callback) {
    var request = new XMLHttpRequest();
    request.open('GET', '/partials/sessions', true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
        previousSessions = sessions;
        sessions = request.responseText;
        callback();
    } else {
        // We reached our target server, but it returned an error
    }
    };

    request.onerror = function() {
        // There was a connection error of some sort
    };
    
    request.send();
}

var updateSessions = function() {
    document.querySelectorAll('.container')[0].innerHTML = sessions;
}

var htmlDecode = function(input){
    var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

setInterval(init, 5000);
})();