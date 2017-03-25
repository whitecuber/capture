document.getElementById('cap').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      mode: 'capture'
    }, function(msg) {
      // console.log("result message:", msg);
    })
  })
})