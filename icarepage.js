let getCustomerHeaderCount = 0;

function initIcarePage() {
    
    const customerHeader = document.querySelector("[data-testid='customer-header']");
    // try to get the customer header using recursive function until 20 attempts has been done
    if(!customerHeader) {

        if(getCustomerHeaderCount < 20) {
            getCustomerHeaderCount++;
            setTimeout(function (){
            initIcarePage();
            }, 500);
        }
        else{
            console.log("Could not retrieve customer header after 10s.");
        }

        return;
    }

    const target = customerHeader.firstChild;
    if(!target) {
        console.log('Could not find icare target button');
        return;
    }

    const button = createIcareButton();
    target.insertAdjacentElement("afterend", button);
}


function createIcareButton() {

    const btn = document.createElement("button");
    btn.className = "vp-button";
    btn.type = "button";
    btn.innerHTML = `
        <span>${ICARE_BUTTON_TEXT}</span>
    `;

    btn.addEventListener("click", async () => {

        const data = getData();
        if(data) {
            // copy data to the background worker
            const response = await chrome.runtime.sendMessage({ type: "copyData", payload: data });
            if(response !== "dataCopied") {
                console.log('Could not copy data to the background worker');
                return;
            }
            
            window.open(ASL_URL, "_blank");
        }
        else{
            console.log('Could not copy data');
        }
    });

    return btn;
}


/** ===== HTML STRUCTURE =====
* <data-testid="customer-header">
*   <div>
*       <h1> FULL NAME </h1>
*       <address>
*            <span>
*                STREET
*                ZIPCODE
*                CITY
*            </span>
*            <span> PHONE NUMBER </span>
*            <span> EMAIL </span>
*/

function getData() {

    const data = {};

    // get customer-header div
    const customerHeader = document.querySelector("[data-testid='customer-header']");

    // get parent div of data element
    const parentDiv = customerHeader.firstChild;
    if(parentDiv.tagName !== "DIV") {
        console.log("Could not find parent div.");
        return false;
    }


    // get customer fullname
    const fullnameElement = parentDiv.children[0];
    if(fullnameElement.tagName !== "H1") {
        console.log("Could not find fullname div.");
        return false;
    }
    // get fullname
    let fullname = fullnameElement.textContent;

    /**
    * find index of first space only
    * some composite firstname may have a space instead of a dash 
    * ex : jean-pierre -> jean pierre, etc...
    */
    const index = fullname.indexOf(" ");

    // splits to get firstname and lastname
    const splits = [fullname.slice(0, index), fullname.slice(index + 1)];
    data.firstname = splits[0];
    data.lastname = splits[1];


    // get address div
    const personalDataElement = parentDiv.children[1];
    if(personalDataElement.tagName !== "ADDRESS") {
        console.log("Could not find personal data div.");
        return false;
    }
    

    // get span address div
    const address = personalDataElement.children[0];
    if(address.tagName !== "SPAN") {
        console.log("Could not find address div.");
        return false;
    }
    // get zipcode and city using regex
    const match = address.textContent.match(ZIPCODE_REGEX);
    if (match) {
        data.zipcode = match[1];
        data.city = match[2].trim();
    }

    
    // get phone number div
    const phoneNumber = personalDataElement.children[1];
    if(phoneNumber.tagName !== "SPAN") {
        console.log("Could not find phone number div.");
        return false;
    }
    data.phoneNumber = phoneNumber.textContent;

    // get mail div
    const mail = personalDataElement.children[2]
    if(mail.tagName !== "SPAN") {
        console.log("Could not find mail div.");
        return false;
    }
    data.mail = mail.textContent;

    return data;
}