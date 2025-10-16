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
