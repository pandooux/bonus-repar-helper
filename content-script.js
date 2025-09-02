// check if user is on icare client page
function isOnIcare() {
    return window.location.href.startsWith(ICARE_URL);
}

// check if user is on asl new application
function isOnAsl() {
    return window.location.href === ASL_URL;
}

function initExtension() {

  if(isOnIcare()) {
    // maingoal: create a button to copy data to the background worker and open asl create customer page
    initIcarePage();
  }

  else if(isOnAsl()) {
    // maingoal: get data from the background worker and fill the form
    initAslPage();
  }
}

initExtension();