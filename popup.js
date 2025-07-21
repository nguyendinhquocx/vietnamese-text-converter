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

    
    // Removed variables for deleted features

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

    updateTextStats(); // Initial update

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

    // Removed prefix/suffix functions

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

    // Removed search and highlight functions
    
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

    // Removed prefix/suffix event listeners

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

    // Removed search and replace event listeners

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