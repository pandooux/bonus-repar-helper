async function initAslPage(){

    const data = await getDataFromBackgroundWorker()
    if(data)
        fillAslForm(data);
}

async function getDataFromBackgroundWorker(){
    
    // read data from the background worker
    const response = await chrome.runtime.sendMessage({ type: "readData"});
    if(!response) {
        console.log('Could not read data from the background worker');
        return false;
    }

    return response;
}

function fillAslForm(data) {
    
    const firstnameInput = document.getElementById("new-first-name-input");
    firstnameInput.value = data.firstname;
    const lastnameInput = document.getElementById("new-last-name-input");
    lastnameInput.value = data.lastname;

    const zipcodeInput = document.getElementById("address-postcode-input");
    zipcodeInput.value = data.zipcode;
    const cityInput = document.getElementById("address-city-input");
    cityInput.value = data.city;

    const mailInputs = document.querySelectorAll('[id=email-input]');
    mailInputs[0].value = data.mail;
    mailInputs[1].value = data.mail;

    const phoneInput = document.getElementById("telephone-input");
    phoneInput.value = data.phoneNumber;
}
