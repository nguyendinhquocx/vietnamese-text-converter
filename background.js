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

// Tạo context menu khi extension được cài đặt
chrome.runtime.onInstalled.addListener(() => {
  // Tạo menu chính "Download as..."
  chrome.contextMenus.create({
    id: "downloadAs",
    title: "Download as...",
    contexts: ["selection"]
  });

  // Các định dạng file (thứ tự ưu tiên)
  const formats = [
    { id: "txt", title: "TXT" },
    { id: "md", title: "Markdown" },
    { id: "html", title: "HTML" },
    { id: "json", title: "JSON" },
    { id: "csv", title: "CSV" },
    { id: "js", title: "JavaScript" },
    { id: "css", title: "CSS" },
    { id: "ts", title: "TypeScript" },
    { id: "tsx", title: "TSX" },
    { id: "py", title: "Python" },
    { id: "sql", title: "SQL" },
    { id: "xml", title: "XML" },
    { id: "php", title: "PHP" }
  ];

  // Tạo submenu cho từng định dạng
  formats.forEach(format => {
    chrome.contextMenus.create({
      id: `download_${format.id}`,
      parentId: "downloadAs",
      title: format.title,
      contexts: ["selection"]
    });
  });
});

// Function để download file thông qua content script
async function downloadFile(content, format, filename = 'note') {
  try {
    const fileExtensions = {
      'json': 'json',
      'txt': 'txt',
      'js': 'js',
      'html': 'html',
      'css': 'css',
      'md': 'md',
      'ts': 'ts',
      'tsx': 'tsx',
      'py': 'py',
      'sql': 'sql',
      'xml': 'xml',
      'php': 'php',
      'csv': 'csv'
    };

    const extension = fileExtensions[format] || 'txt';
    const finalFilename = `${filename}.${extension}`;

    // Gửi message đến content script để download
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, {
      action: 'download',
      content: content,
      format: format,
      filename: finalFilename
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Message error:', chrome.runtime.lastError);
      } else if (response && response.success) {
        console.log('Download completed successfully');
      } else {
        console.error('Download failed:', response?.error);
      }
    });
  } catch (error) {
    console.error('Error in downloadFile:', error);
  }
}

// Xử lý khi click vào context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Context menu clicked:', info.menuItemId);
  console.log('Selected text:', info.selectionText);

  if (info.menuItemId.startsWith('download_')) {
    const format = info.menuItemId.replace('download_', '');
    const selectedText = info.selectionText;

    if (selectedText && selectedText.trim()) {
      console.log('Downloading as:', format);
      downloadFile(selectedText, format);
    } else {
      console.log('No text selected or text is empty');
    }
  }
});

// ============================================
// FOCUS TIMER BACKGROUND SERVICE
// ============================================

// Timer state management
let backgroundTimerState = {
  isRunning: false,
  currentTime: 0,
  totalTime: 0,
  intervalId: null,
  startTime: null
};

// Load timer state from storage
async function loadBackgroundTimerState() {
  try {
    const result = await chrome.storage.local.get('focusTimerState');
    if (result.focusTimerState) {
      const savedState = result.focusTimerState;
      backgroundTimerState = {
        ...backgroundTimerState,
        ...savedState,
        intervalId: null // Don't restore interval
      };

      // If timer was running, continue countdown
      if (savedState.isRunning && savedState.startTime) {
        const elapsed = Math.floor((Date.now() - savedState.startTime) / 1000);
        backgroundTimerState.currentTime = Math.max(0, savedState.currentTime - elapsed);

        if (backgroundTimerState.currentTime > 0) {
          startBackgroundTimer();
        } else {
          completeBackgroundTimer();
        }
      }
    }
  } catch (error) {
    console.error('Failed to load background timer state:', error);
  }
}

// Save timer state to storage
async function saveBackgroundTimerState() {
  try {
    const stateToSave = {
      ...backgroundTimerState,
      startTime: backgroundTimerState.isRunning ? Date.now() : null
    };
    delete stateToSave.intervalId;

    await chrome.storage.local.set({ focusTimerState: stateToSave });
  } catch (error) {
    console.error('Failed to save background timer state:', error);
  }
}

// Start background timer
function startBackgroundTimer() {
  if (backgroundTimerState.intervalId) {
    clearInterval(backgroundTimerState.intervalId);
  }

  backgroundTimerState.isRunning = true;
  backgroundTimerState.startTime = Date.now();

  backgroundTimerState.intervalId = setInterval(async () => {
    backgroundTimerState.currentTime--;

    // Broadcast state to popup
    broadcastTimerState();

    // Save state periodically
    await saveBackgroundTimerState();

    // Timer completed
    if (backgroundTimerState.currentTime <= 0) {
      completeBackgroundTimer();
    }
  }, 1000);

  saveBackgroundTimerState();
}

// Stop background timer
function stopBackgroundTimer() {
  backgroundTimerState.isRunning = false;

  if (backgroundTimerState.intervalId) {
    clearInterval(backgroundTimerState.intervalId);
    backgroundTimerState.intervalId = null;
  }

  saveBackgroundTimerState();
}

// Complete background timer
async function completeBackgroundTimer() {
  stopBackgroundTimer();
  backgroundTimerState.currentTime = 0;

  // Show completion notification
  try {
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/icon.png',
      title: 'Focus Timer',
      message: 'Timer hoàn thành! Giờ nghỉ ngơi nhé.',
      silent: true
    });
  } catch (error) {
    console.error('Failed to show notification:', error);
  }

  // Broadcast completion
  broadcastTimerState();
  await saveBackgroundTimerState();
}

// Broadcast timer state to popup
function broadcastTimerState() {
  // Send message to all tabs (popup will filter)
  chrome.runtime.sendMessage({
    action: 'timerStateUpdate',
    state: {
      isRunning: backgroundTimerState.isRunning,
      currentTime: backgroundTimerState.currentTime,
      totalTime: backgroundTimerState.totalTime
    }
  }).catch(() => {
    // Ignore errors (popup might not be open)
  });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'startTimer':
      backgroundTimerState.currentTime = message.currentTime;
      backgroundTimerState.totalTime = message.totalTime;
      startBackgroundTimer();
      sendResponse({ success: true });
      break;

    case 'pauseTimer':
      stopBackgroundTimer();
      sendResponse({ success: true });
      break;

    case 'resetTimer':
      stopBackgroundTimer();
      backgroundTimerState.currentTime = message.totalTime;
      backgroundTimerState.totalTime = message.totalTime;
      saveBackgroundTimerState();
      broadcastTimerState();
      sendResponse({ success: true });
      break;

    case 'getTimerState':
      sendResponse({
        success: true,
        state: {
          isRunning: backgroundTimerState.isRunning,
          currentTime: backgroundTimerState.currentTime,
          totalTime: backgroundTimerState.totalTime
        }
      });
      break;

    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }

  return true; // Keep message channel open for async response
});

// Initialize background timer on startup
chrome.runtime.onStartup.addListener(() => {
  loadBackgroundTimerState();
});

// Initialize when extension loads
loadBackgroundTimerState();
