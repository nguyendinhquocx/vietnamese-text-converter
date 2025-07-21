document.addEventListener('DOMContentLoaded', function () {
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const pasteButton = document.getElementById('paste');
    const removeAccentsButton = document.getElementById('removeAccents');
    const removeSpecialCharsButton = document.getElementById('removeSpecialChars');
    const removeWhitespaceButton = document.getElementById('removeWhitespace');
    const removeSpacesInLinesButton = document.getElementById('removeSpacesInLines');
    const toLowercaseButton = document.getElementById('toLowercase');
    const resetButton = document.getElementById('reset');
    const copyButton = document.getElementById('copy');
    const trimWhitespaceButton = document.getElementById('trimWhitespace');
    const convertCharsButton = document.getElementById('convertChars');
    const processCombinedButton = document.getElementById('processCombined');

    
    // Thêm nút mới
    const addPrefixButton = document.getElementById('addPrefix');
    const addSuffixButton = document.getElementById('addSuffix');
    const prefixInput = document.getElementById('prefixInput');
    const suffixInput = document.getElementById('suffixInput');
    
    // Phần tìm kiếm và thay thế
    const searchInput = document.getElementById('searchInput');
    const replaceInput = document.getElementById('replaceInput');
    const searchBtn = document.getElementById('searchBtn');
    const replaceBtn = document.getElementById('replaceBtn');
    const replaceAllBtn = document.getElementById('replaceAllBtn');
    
    // Biến lưu trữ kết quả tìm kiếm và vị trí hiện tại
    let searchResults = [];
    let currentHighlightIndex = -1;
    let debounceTimeout = null;

    // Auto-focus on textarea when popup opens
    inputText.focus();

    // Load saved text content from Chrome storage
    chrome.storage.local.get(['textContent'], function(result) {
        if (result.textContent) {
            inputText.value = result.textContent;
            updateTextStats();
        }
    });
    
    // Save text content to Chrome storage when it changes
    inputText.addEventListener('input', () => {
        updateTextStats();
        clearSearchHighlights();
        
        // Save current text to Chrome storage
        chrome.storage.local.set({textContent: inputText.value});
    });
    


    // Function to update character and word count
    function updateTextStats() {
        const text = inputText.value;
        const charLength = text.length; // Đếm số ký tự (bao gồm khoảng trắng)
        const words = text.trim().split(/\s+/).filter(word => word.length > 0); // Đếm số từ
        const wordLength = text.trim() === '' ? 0 : words.length;

        charCount.textContent = charLength;
        wordCount.textContent = wordLength;
    }

    // Update stats when text changes
    inputText.addEventListener('input', () => {
        updateTextStats();
        clearSearchHighlights();
    });
    updateTextStats(); // Initial update

    // Hàm tiện ích để xóa highlight
    function clearSearchHighlights() {
        const oldMarked = document.querySelector('.marked-text');
        if (oldMarked) {
            oldMarked.remove();
            inputText.removeEventListener('scroll', syncScroll);
        }
        searchResults = [];
        currentHighlightIndex = -1;
    }

    // Function to remove Vietnamese accents
    function removeVietnameseAccents(text) {
        const accentsMap = {
            'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
            'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
            'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
            'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
            'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
            'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
            'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
            'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
            'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
            'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
            'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
            'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
            'đ': 'd',
            'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
            'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
            'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
            'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
            'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
            'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
            'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
            'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
            'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
            'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
            'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
            'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
            'Đ': 'D'
        };

        let result = text;
        for (const [accented, unaccented] of Object.entries(accentsMap)) {
            result = result.replace(new RegExp(accented, 'g'), unaccented);
        }
        return result;
    }

    // Function to remove special characters
    function removeSpecialCharacters(text) {
        return text.replace(/[^a-zA-Z0-9\s]/g, ''); // Chỉ giữ chữ cái, số, và khoảng trắng
    }

    // Function to remove all whitespace
    function removeWhitespace(text) {
        // Split by newlines, replace multiple spaces with single space in each line, then rejoin with newlines
        return text.split('\n').map(line => line.replace(/\s+/g, ' ').trim()).join('\n');
    }
    
    // Function to remove all whitespace within each line but keep lines separate
    function removeSpacesInLines(text) {
        // Split by newlines, remove all whitespace in each line, then rejoin with newlines
        return text.split('\n').map(line => line.replace(/\s+/g, '')).join('\n');
    }

    // Function to capitalize the first letter of each word
    function capitalizeWords(text) {
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Hàm chèn kí tự vào trước mỗi dòng
    function addPrefixToLines(text, prefix) {
        if (!text) return '';
        return text.split('\n').map(line => prefix + line).join('\n');
    }

    // Hàm chèn kí tự vào sau mỗi dòng
    function addSuffixToLines(text, suffix) {
        if (!text) return '';
        return text.split('\n').map(line => line + suffix).join('\n');
    }

    // Function to convert specific characters to spaces (fixed to include commas)
    function convertCharsToSpaces(text) {
        return text.replace(/[-.,_+()|\u2013\u2014\u2015]/g, ' ');
    }

    // Function to apply combined processing
    function processCombined(text) {
        // 1. Remove accents
        let result = removeVietnameseAccents(text);
        // 2. Convert to lowercase
        result = result.toLowerCase();
        // 3. Trim whitespace
        result = result.trim();
        // 4. Convert special characters to spaces
        result = convertCharsToSpaces(result);
        // 5. Remove double whitespace
        result = removeWhitespace(result);
        
        return result;
    }

    // Hàm tìm kiếm và highlight kết quả
    function searchAndHighlight() {
        const searchTerm = searchInput.value.trim();
        const text = inputText.value;
        
        // Xóa các highlight cũ
        clearSearchHighlights();
        
        if (!searchTerm) return;
        
        // Tìm tất cả các kết quả phù hợp
        let position = 0;
        let index = text.indexOf(searchTerm, position);
        
        while (index !== -1) {
            searchResults.push({
                start: index,
                end: index + searchTerm.length
            });
            position = index + 1;
            index = text.indexOf(searchTerm, position);
        }
        
        if (searchResults.length > 0) {
            highlightResults();
        }
    }
    
    // Hàm để highlight kết quả trong textarea
    function highlightResults() {
        // Xóa highlight cũ nếu có
        const oldMarked = document.querySelector('.marked-text');
        if (oldMarked) {
            oldMarked.remove();
        }
        
        const originalText = inputText.value;
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm || searchResults.length === 0) return;
        
        // Tạo overlay để highlight text
        const markedText = document.createElement('div');
        markedText.className = 'marked-text';
        
        // Lấy thông tin vị trí chính xác của textarea
        const textareaRect = inputText.getBoundingClientRect();
        const containerRect = inputText.parentElement.getBoundingClientRect();
        const textareaStyle = window.getComputedStyle(inputText);
        
        // Tạo container để chứa overlay nếu chưa có
        let overlayContainer = document.querySelector('.overlay-container');
        if (!overlayContainer) {
            overlayContainer = document.createElement('div');
            overlayContainer.className = 'overlay-container';
            inputText.parentNode.insertBefore(overlayContainer, inputText);
            overlayContainer.appendChild(inputText);
        }
        
        // Thiết lập style cho overlay để đảm bảo khớp chính xác với textarea
        markedText.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            padding: ${textareaStyle.padding};
            font-family: ${textareaStyle.fontFamily};
            font-size: ${textareaStyle.fontSize};
            line-height: ${textareaStyle.lineHeight};
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow: auto;
            pointer-events: none;
            z-index: 2;
            background: transparent;
            box-sizing: border-box;
        `;
        
        // Tạo HTML với các highlight
        let html = '';
        let lastIndex = 0;
        
        searchResults.forEach((result, idx) => {
            html += escapeHTML(originalText.substring(lastIndex, result.start));
            const matchedText = escapeHTML(originalText.substring(result.start, result.end));
            html += `<span class="highlight ${currentHighlightIndex === idx ? 'current' : ''}" id="highlight-${idx}">${matchedText}</span>`;
            lastIndex = result.end;
        });
        
        html += escapeHTML(originalText.substring(lastIndex));
        markedText.innerHTML = html.replace(/\n/g, '<br>');
        
        // Thêm vào container và đảm bảo nó nằm chính xác trên textarea
        overlayContainer.insertBefore(markedText, inputText.nextSibling);
        
        // Đồng bộ vị trí cuộn
        markedText.scrollTop = inputText.scrollTop;
        
        // Thêm sự kiện đồng bộ scroll khi người dùng cuộn textarea
        inputText.addEventListener('scroll', syncScroll);
        
        // Tự động cuộn đến kết quả đầu tiên
        if (searchResults.length > 0) {
            currentHighlightIndex = 0;
            scrollToHighlight(currentHighlightIndex);
        }
    }
    
    // Hàm để đồng bộ việc cuộn giữa textarea và overlay highlight
    function syncScroll() {
        const markedText = document.querySelector('.marked-text');
        if (markedText) {
            markedText.scrollTop = inputText.scrollTop;
            markedText.scrollLeft = inputText.scrollLeft;
        }
    }
    
    // Hàm escape HTML để tránh lỗi khi hiển thị đặc biệt
    function escapeHTML(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Hàm cuộn đến vị trí highlight
    function scrollToHighlight(index) {
        const result = searchResults[index];
        if (result) {
            // Tính toán vị trí cuộn dựa trên vị trí của kết quả
            const textBeforeMatch = inputText.value.substring(0, result.start);
            const lines = textBeforeMatch.split('\n');
            const lineHeight = parseInt(window.getComputedStyle(inputText).lineHeight);
            
            // Ước tính vị trí dựa trên số dòng và chiều cao dòng
            const scrollPosition = (lines.length - 1) * lineHeight;
            
            // Cuộn textarea
            inputText.scrollTop = scrollPosition - lineHeight * 2;
            
            // Đồng bộ overlay
            syncScroll();
        }
    }
    
    // Hàm thay thế một kết quả cụ thể
    function replaceCurrentMatch() {
        if (searchResults.length === 0 || currentHighlightIndex === -1) return;
        
        const replaceWith = replaceInput.value;
        const text = inputText.value;
        const result = searchResults[currentHighlightIndex];
        
        const newText = text.substring(0, result.start) + replaceWith + text.substring(result.end);
        inputText.value = newText;
        
        // Lưu lại vị trí con trỏ sau khi thay thế
        const cursorPosition = result.start + replaceWith.length;
        
        // Sau khi thay thế, cập nhật lại tìm kiếm
        updateTextStats();
        
        // Cập nhật kết quả tìm kiếm cho các lần thay thế tiếp theo
        setTimeout(() => {
            searchAndHighlight();
            
            // Đặt lại con trỏ vào vị trí sau phần văn bản đã thay thế
            inputText.selectionStart = cursorPosition;
            inputText.selectionEnd = cursorPosition;
            
            // Focus lại vào ô thay thế để tiếp tục thay thế
            replaceInput.focus();
        }, 50);
    }
    
    // Hàm thay thế tất cả kết quả tìm thấy
    function replaceAllMatches() {
        if (searchResults.length === 0) return;
        
        const searchTerm = searchInput.value.trim();
        const replaceWith = replaceInput.value;
        
        if (!searchTerm) return;
        
        const text = inputText.value;
        const newText = text.split(searchTerm).join(replaceWith);
        inputText.value = newText;
        
        // Xóa highlight và reset kết quả
        clearSearchHighlights();
        updateTextStats();
    }
    
    // Event listeners for buttons
    removeAccentsButton.addEventListener('click', () => {
        const text = inputText.value;
        inputText.value = removeVietnameseAccents(text);
        updateTextStats();
    });

    removeSpecialCharsButton.addEventListener('click', () => {
        const text = inputText.value;
        inputText.value = removeSpecialCharacters(text);
        updateTextStats();
    });

    removeWhitespaceButton.addEventListener('click', () => {
        const text = inputText.value;
        inputText.value = removeWhitespace(text);
        updateTextStats();
    });

    // Thêm event listener cho chèn kí tự vào trước mỗi dòng
    addPrefixButton.addEventListener('click', () => {
        const text = inputText.value;
        const prefix = prefixInput.value;
        if (prefix) {
            inputText.value = addPrefixToLines(text, prefix);
            updateTextStats();
        }
    });

    // Thêm event listener cho chèn kí tự vào sau mỗi dòng
    addSuffixButton.addEventListener('click', () => {
        const text = inputText.value;
        const suffix = suffixInput.value;
        if (suffix) {
            inputText.value = addSuffixToLines(text, suffix);
            updateTextStats();
        }
    });

    toLowercaseButton.addEventListener('click', () => {
        const text = inputText.value;
        inputText.value = text.toLowerCase();
        updateTextStats();
    });

    document.getElementById('toUppercase').addEventListener('click', () => {
        const text = inputText.value;
        inputText.value = text.toUpperCase();
        updateTextStats();
    });

    document.getElementById('toCapitalize').addEventListener('click', () => {
        const text = inputText.value;
        inputText.value = text.replace(/\b\w/g, char => char.toUpperCase());
        updateTextStats();
    });

    document.getElementById('toSentenceCase').addEventListener('click', () => {
        const text = inputText.value;
        inputText.value = text.replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, char) => prefix + char.toUpperCase());
        updateTextStats();
    });

    trimWhitespaceButton.addEventListener('click', () => {
        const text = inputText.value;
        inputText.value = text.trim();
        updateTextStats();
    });

    // Add event listener for the new convert characters button (fixed)
    convertCharsButton.addEventListener('click', () => {
        const text = inputText.value;
        inputText.value = convertCharsToSpaces(text);
        updateTextStats();
    });

    // Add event listener for the combined processing button
    processCombinedButton.addEventListener('click', () => {
        const text = inputText.value;
        inputText.value = processCombined(text);
        updateTextStats();
    });
    
    // Thêm event listener cho nút xóa khoảng trắng trong mỗi dòng
    removeSpacesInLinesButton.addEventListener('click', () => {
        const text = inputText.value;
        inputText.value = removeSpacesInLines(text);
        updateTextStats();
    });

    // Thêm event listeners cho phần tìm kiếm và thay thế
    if (searchBtn) searchBtn.addEventListener('click', searchAndHighlight);
    if (replaceBtn) replaceBtn.addEventListener('click', replaceCurrentMatch);
    if (replaceAllBtn) replaceAllBtn.addEventListener('click', replaceAllMatches);
    
    // Thêm sự kiện tìm kiếm khi nhập vào ô search
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Xóa timeout cũ nếu có
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
            
            // Đặt timeout mới để đợi người dùng ngừng gõ
            debounceTimeout = setTimeout(function() {
                searchAndHighlight();
            }, 300); // Đợi 300ms sau khi người dùng ngừng gõ
        });
        
        // Thêm sự kiện khi người dùng focus vào ô tìm kiếm
        searchInput.addEventListener('focus', function() {
            // Thực hiện tìm kiếm khi focus vào ô tìm kiếm
            setTimeout(searchAndHighlight, 100);
        });
    }
    
    // Thêm sự kiện khi người dùng focus vào ô thay thế
    if (replaceInput) {
        replaceInput.addEventListener('focus', function() {
            // Đảm bảo highlight vẫn hiển thị khi chuyển sang ô thay thế
            setTimeout(searchAndHighlight, 100);
        });
    }

    // Xử lý phím tắt Ctrl+F cho văn bản được chọn
    inputText.addEventListener('keydown', function(e) {
        // Kiểm tra xem người dùng đã nhấn Ctrl+F chưa
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault(); // Ngăn browser mở hộp thoại tìm kiếm mặc định

            // Lấy văn bản đã chọn
            const selectedText = inputText.value.substring(
                inputText.selectionStart, 
                inputText.selectionEnd
            );

            // Nếu có văn bản được chọn, đưa vào ô tìm kiếm
            if (selectedText) {
                searchInput.value = selectedText;
                searchInput.focus();

                // Thực hiện tìm kiếm ngay lập tức
                searchAndHighlight();
            } else {
                // Nếu không có văn bản nào được chọn, chỉ focus vào ô tìm kiếm
                searchInput.focus();
            }
        }
    });

    // Thêm phím tắt Ctrl+Shift+, để dán văn bản
    inputText.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === ',') {
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
                inputText.value = text;
                updateTextStats();
            }).catch(err => {
                console.error('Lỗi khi đọc từ bộ nhớ tạm: ', err);
            });
        }
    });
});