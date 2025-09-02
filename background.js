let data = {}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // listen to copy customer data from icare
  if (message.type === "copyData") {
    data = message.payload;
    sendResponse("dataCopied");
  }

  // listen to read customer data from asl
  if (message.type === "readData") {
    sendResponse(data);
  }

  return true;
});