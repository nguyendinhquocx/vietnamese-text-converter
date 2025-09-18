// Content script để handle download với DOM APIs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'download') {
    try {
      const { content, format, filename } = request;

      // Tạo blob và download trong content script (có DOM APIs)
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);

      sendResponse({ success: true });
    } catch (error) {
      console.error('Download error in content script:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
});