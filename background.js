// Background script để xử lý phím tắt mở sidebar
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "_execute_action") {
    // Lấy tab hiện tại
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // Mở sidebar cho tab hiện tại
    await chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Xử lý khi nhấn vào icon extension
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ tabId: tab.id });
});
