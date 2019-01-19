(function(){
    "use strict";
    var previousSessions;
    var sessions = null;
    
    var init = function() {

        getSessions(function() {
            var sessionListingsElements = document.querySelectorAll('.timeslot__sessions');
            if(sessionListingsElements.length === 0) {
                return;
            }
            if(previousSessions !== sessions && previousSessions !== null) {
                console.log('Updating sessions');
                var scrollPositions = getScrollPositions();
                updateSessions(function() {
                    setScrollPositions(scrollPositions);
                })
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

var updateSessions = function(callback) {
    document.querySelector('.container').innerHTML = sessions;
    callback();
}

var getScrollPositions = function() {
    var sessionListingsElements = document.querySelectorAll('.timeslot__sessions');
    var scrollPositions = [];
    sessionListingsElements.forEach(function(currentValue, currentIndex, listObj) {
        scrollPositions.push(element.listObj);
    });
    // for(var element of sessionListingsElements) {
    //     scrollPositions.push(element.scrollLeft);
    // };
    return scrollPositions;
}

var setScrollPositions = function(scrollPositions) {
    var sessionListingsElements = document.querySelectorAll('.timeslot__sessions');
    scrollPositions.forEach(function(position, index) {
        var element = sessionListingsElements[index];
        element.scrollLeft = position;
    });
}

setInterval(init, 5000);
init();
})();