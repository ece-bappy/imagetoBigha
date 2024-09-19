document.getElementById('toggleButton').addEventListener('click', function() {
    chrome.storage.local.get('isOn', function(data) {
      const newState = !data.isOn;
      chrome.storage.local.set({isOn: newState}, function() {
        document.getElementById('toggleButton').textContent = newState ? 'Turn Off' : 'Turn On';
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: newState ? 'enable' : 'disable'});
        });
      });
    });
  });
  
  chrome.storage.local.get('isOn', function(data) {
    document.getElementById('toggleButton').textContent = data.isOn ? 'Turn Off' : 'Turn On';
  });