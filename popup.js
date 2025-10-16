document.addEventListener('DOMContentLoaded', function () {
    const inputText = document.getElementById('inputText');
    const subText = document.getElementById('subText');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const pasteButton = document.getElementById('paste');
    const removeAccentsButton = document.getElementById('removeAccents');
    const removeWhitespaceButton = document.getElementById('removeWhitespace');
    const removeSpacesInLinesButton = document.getElementById('removeSpacesInLines');
    const toLowercaseButton = document.getElementById('toLowercase');
    const resetButton = document.getElementById('reset');
    const copyButton = document.getElementById('copy');
    const trimWhitespaceButton = document.getElementById('trimWhitespace');
    const processCombinedButton = document.getElementById('processCombined');
    const copyTextButton = document.getElementById('copyText');

    // Focus Timer Constants
    const FOCUS_PRESETS = [15, 30, 45, 60, 75, 90, 120]; // minutes
    const TIMER_STORAGE_KEY = 'focusTimerState';

    // Timer Elements
    const timerStatus = document.getElementById('timerStatus');
    const timerTime = document.getElementById('timerTime');
    const timerPlay = document.getElementById('timerPlay');
    const timerPause = document.getElementById('timerPause');
    const timerReset = document.getElementById('timerReset');
    const focusSlider = document.getElementById('focusSlider');
    const focusLabel = document.getElementById('focusLabel');
    const timerCircleProgress = document.querySelector('.timer-circle-progress');

    // Timer State
    let timerState = {
        isRunning: false,
        isPaused: false,
        currentTime: 30 * 60, // seconds (default 30 min - FOCUS_PRESETS[1])
        totalTime: 30 * 60,
        selectedPreset: 1, // index in FOCUS_PRESETS (default 30 min)
        intervalId: null
    };

    // Find and Replace elements
    const findInput = document.getElementById('findInput');
    const replaceInput = document.getElementById('replaceInput');

    
    // Removed variables for deleted features

    // Auto-focus on textarea when popup opens
    inputText.focus();

    // Helper function for button scale effect
    function addButtonEffect(button) {
        if (button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }
    }

    // Load saved text content from localStorage (main textarea)
    const savedText = localStorage.getItem('textContent');
    if (savedText) {
        inputText.value = savedText;
        updateTextStats();
        displayDownloadOptions(); // Show download options if there's saved text
    }

    // Load saved sub text content from localStorage
    const savedSubText = localStorage.getItem('subTextContent');
    if (savedSubText) {
        subText.value = savedSubText;
    }

    // Save text content to localStorage when it changes (with size limit check)
    inputText.addEventListener('input', () => {
        updateTextStats();

        // Display download options
        displayDownloadOptions();

        // Save current text to localStorage with size check
        const textToSave = inputText.value;
        try {
            // Check if text is too large for localStorage (usually 5-10MB limit)
            if (textToSave.length < 1000000) { // 1MB character limit
                localStorage.setItem('textContent', textToSave);
            } else {
                console.warn('Text too large for localStorage, skipping save');
            }
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    });

    // Save sub text content to localStorage when it changes
    subText.addEventListener('input', () => {
        const subTextToSave = subText.value;
        try {
            if (subTextToSave.length < 1000000) {
                localStorage.setItem('subTextContent', subTextToSave);
            } else {
                console.warn('Sub text too large for localStorage, skipping save');
            }
        } catch (e) {
            console.warn('Failed to save sub text to localStorage:', e);
        }
    });
    


    // Function to update character count
    function updateTextStats() {
        const text = inputText.value;
        const charLength = text.length; // Đếm số ký tự (bao gồm khoảng trắng)

        charCount.textContent = charLength;
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

    // Function to replace all occurrences of a string
    function replaceAllText(text, findText, replaceText) {
        if (!findText) return text;
        // Use global replace with escaped special regex characters
        const escapedFind = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedFind, 'g');
        return text.replace(regex, replaceText);
    }

    // Function to convert CSV to JSON
    function csvToJson(csvText) {
        if (!csvText.trim()) return '';

        try {
            // Split into lines and remove empty lines
            const lines = csvText.trim().split('\n').filter(line => line.trim());
            if (lines.length < 2) return '[]'; // Need at least header + 1 row

            // Parse header row - split by tabs or multiple spaces
            const headers = lines[0].split(/\t+|\s{2,}/).map(h => h.trim()).filter(h => h);

            // Parse data rows
            const jsonData = [];
            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(/\t+|\s{2,}/).map(cell => cell.trim());
                const rowObject = {};

                // Map each cell to corresponding header
                headers.forEach((header, index) => {
                    let value = row[index] || '';

                    // Try to convert numbers
                    if (value && !isNaN(value.replace(/,/g, ''))) {
                        const numValue = parseFloat(value.replace(/,/g, ''));
                        rowObject[header] = isNaN(numValue) ? value : numValue;
                    } else {
                        rowObject[header] = value;
                    }
                });

                jsonData.push(rowObject);
            }

            return JSON.stringify(jsonData, null, 2);
        } catch (error) {
            console.error('CSV parsing error:', error);
            return 'Lỗi: Không thể parse CSV. Vui lòng kiểm tra format dữ liệu.';
        }
    }

    // Function to convert local file path to GitHub Pages link
    function convertLocalToGithubPages(text) {
        const lines = text.split('\n');
        const convertedLines = lines.map(line => {
            let trimmedLine = line.trim();

            // Remove surrounding quotes if present
            if ((trimmedLine.startsWith('"') && trimmedLine.endsWith('"')) ||
                (trimmedLine.startsWith("'") && trimmedLine.endsWith("'"))) {
                trimmedLine = trimmedLine.slice(1, -1);
            }

            // Check if line contains a local Windows file path or file:/// URL
            const localPathRegex = /^[A-Z]:\\.*$/;
            const fileUrlRegex = /^file:\/\/\/[A-Z]:\/.*$/;

            let actualPath = '';
            let isFileUrl = false;

            if (localPathRegex.test(trimmedLine)) {
                actualPath = trimmedLine;
            } else if (fileUrlRegex.test(trimmedLine)) {
                // Convert file:/// URL to Windows path
                // file:///D:/path/file -> D:\path\file
                actualPath = trimmedLine
                    .replace(/^file:\/\/\//, '')  // Remove file:/// prefix
                    .replace(/\//g, '\\')         // Convert / to \
                    .replace(/%20/g, ' ')         // Decode %20 to spaces
                    .replace(/%([0-9A-F]{2})/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16))); // Decode other URL encoding
                isFileUrl = true;
            }

            if (actualPath) {
                // Map local paths to GitHub Pages URLs
                const pathMappings = {
                    'D:\\pcloud\\code\\ai\\experts\\': 'https://nguyendinhquocx.github.io/Prompt-AI/',
                    'D:\\pcloud\\code\\extension\\vietnamese text converter\\': 'https://nguyendinhquocx.github.io/vietnamese-text-converter/',
                    // Add more mappings as needed
                };

                // Find matching path mapping
                for (const [localPath, githubPagesUrl] of Object.entries(pathMappings)) {
                    if (actualPath.startsWith(localPath)) {
                        // Extract relative path after the mapped local path
                        const relativePath = actualPath.substring(localPath.length);

                        // URL encode the relative path to handle spaces and special characters
                        const encodedPath = relativePath.split('\\')
                            .map(segment => encodeURIComponent(segment))
                            .join('/');

                        return githubPagesUrl + encodedPath;
                    }
                }

                // If no mapping found, return original line with a note
                return `${line} // No mapping found for this path`;
            }

            return line; // Return original line if not a local path or file URL
        });

        return convertedLines.join('\n');
    }

    // Function to convert GitHub link to GitHub Pages link
    function convertGithubToPages(text) {
        const lines = text.split('\n');
        const convertedLines = lines.map(line => {
            const trimmedLine = line.trim();

            // Check if line contains a GitHub blob URL
            const githubRegex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/;
            const match = trimmedLine.match(githubRegex);

            if (match) {
                const [, username, repo, branch, path] = match;
                return `https://${username}.github.io/${repo}/${path}`;
            }

            return line; // Return original line if no match
        });

        return convertedLines.join('\n');
    }

    // Function to sanitize filename
    function sanitizeFilename(text) {
        if (!text || !text.trim()) return 'document';

        // Take first line or first 150 chars
        let filename = text.trim().split('\n')[0].substring(0, 150);

        // Vietnamese text processing
        // 1. Remove Vietnamese accents
        filename = removeVietnameseAccents(filename);

        // 2. Convert to lowercase
        filename = filename.toLowerCase();

        // 3. Trim whitespace
        filename = filename.trim();

        // 4. Remove double spaces (normalize to single space)
        filename = filename.replace(/\s+/g, ' ');

        // 5. Replace invalid filename chars with underscore
        filename = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');

        // 6. Remove leading/trailing spaces and dots
        filename = filename.trim().replace(/^\.+|\.+$/g, '');

        return filename || 'document';
    }

    // Function to download file with specified format
    function downloadFile(content, format) {
        if (!content.trim()) {
            alert('Không có nội dung để tải xuống!');
            return;
        }

        const fileExtensions = {
            'TXT': 'txt',
            'JS': 'js',
            'HTML': 'html',
            'CSS': 'css',
            'JSON': 'json',
            'MD': 'md',
            'TSX': 'tsx',
            'TS': 'ts',
            'PY': 'py',
            'SQL': 'sql',
            'PHP': 'php',
            'CSV': 'csv'
        };

        const extension = fileExtensions[format] || 'txt';

        // Use subText content as filename if available
        const customFilename = sanitizeFilename(subText.value);
        const fileName = `${customFilename}.${extension}`;

        // Create blob and download
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to display download options
    function displayDownloadOptions() {
        const suggestionsContainer = document.getElementById('languageSuggestions');
        const content = inputText.value.trim();

        if (!content) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        suggestionsContainer.style.display = 'block';

        // Button order: CLEAR → COPY → HTML → MD → Github → JSON → TXT → GithubX → others → CSV→JSON
        const buttons = [];

        // Priority buttons (in order)
        buttons.push(`<button class="download-btn clear-btn" data-action="clear">CLEAR</button>`);
        buttons.push(`<button class="download-btn copy-all-btn" data-action="copyAll">COPY</button>`);
        buttons.push(`<button class="download-btn" data-format="HTML">HTML</button>`);
        buttons.push(`<button class="download-btn" data-format="MD">MD</button>`);
        buttons.push(`<button class="download-btn github-btn" data-action="github">Github</button>`);
        buttons.push(`<button class="download-btn" data-format="JSON">JSON</button>`);
        buttons.push(`<button class="download-btn" data-format="TXT">TXT</button>`);
        buttons.push(`<button class="download-btn githubx-btn" data-action="githubx">GithubX</button>`);

        // Other formats (removed XML)
        const otherFormats = ['JS', 'CSS', 'TS', 'TSX', 'PY', 'SQL', 'PHP', 'CSV'];
        otherFormats.forEach(format => {
            buttons.push(`<button class="download-btn" data-format="${format}">${format}</button>`);
        });

        // CSV → JSON converter (last)
        buttons.push(`<button class="download-btn csv-to-json-btn" data-action="csvToJson">CSV → JSON</button>`);

        suggestionsContainer.innerHTML = `
            <div class="suggestions-list">${buttons.join('')}</div>
        `;

        // Add event listeners to download buttons
        suggestionsContainer.querySelectorAll('.download-btn[data-format]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                // Add button effect
                addButtonEffect(e.target);
                // Use current textarea content, not cached content
                const currentContent = inputText.value;
                downloadFile(currentContent, format);
            });
        });

        // Add event listener for CSV → JSON converter
        const csvConverterBtn = suggestionsContainer.querySelector('[data-action="csvToJson"]');
        if (csvConverterBtn) {
            csvConverterBtn.addEventListener('click', () => {
                if (!inputText.value.trim()) {
                    alert('Vui lòng nhập dữ liệu CSV để chuyển đổi!');
                    return;
                }

                // Add button effect
                addButtonEffect(csvConverterBtn);

                const jsonResult = csvToJson(inputText.value);
                inputText.value = jsonResult;
                updateTextStats();

                // Save to localStorage
                try {
                    if (jsonResult.length < 1000000) {
                        localStorage.setItem('textContent', jsonResult);
                    }
                } catch (e) {
                    console.warn('Failed to save to localStorage:', e);
                }
            });
        }

        // Add event listener for Copy All button
        const copyAllBtn = suggestionsContainer.querySelector('[data-action="copyAll"]');
        if (copyAllBtn) {
            copyAllBtn.addEventListener('click', () => {
                const textToCopy = inputText.value;
                if (textToCopy.trim()) {
                    // Add button effect
                    addButtonEffect(copyAllBtn);
                    navigator.clipboard.writeText(textToCopy).catch(err => {
                        console.error('Copy failed:', err);
                    });
                }
            });
        }

        // Add event listener for Github button
        const githubBtn = suggestionsContainer.querySelector('[data-action="github"]');
        if (githubBtn) {
            githubBtn.addEventListener('click', () => {
                const originalText = inputText.value;
                if (originalText.trim()) {
                    const convertedText = convertGithubToPages(originalText);
                    inputText.value = convertedText;
                    updateTextStats();

                    // Copy converted text to clipboard
                    navigator.clipboard.writeText(convertedText).catch(err => {
                        console.error('Copy failed:', err);
                    });

                    // Add button effect
                    addButtonEffect(githubBtn);

                    // Save to localStorage
                    try {
                        if (convertedText.length < 1000000) {
                            localStorage.setItem('textContent', convertedText);
                        }
                    } catch (e) {
                        console.warn('Failed to save to localStorage:', e);
                    }
                }
            });
        }

        // Add event listener for GithubX button
        const githubXBtn = suggestionsContainer.querySelector('[data-action="githubx"]');
        if (githubXBtn) {
            githubXBtn.addEventListener('click', () => {
                const originalText = inputText.value;
                if (originalText.trim()) {
                    const convertedText = convertLocalToGithubPages(originalText);

                    // Copy converted text to clipboard only
                    navigator.clipboard.writeText(convertedText).catch(err => {
                        console.error('Copy failed:', err);
                    });

                    // Add button effect
                    addButtonEffect(githubXBtn);
                }
            });
        }

        // Add event listener for CLEAR button
        const clearBtn = suggestionsContainer.querySelector('[data-action="clear"]');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                // Clear both textareas
                inputText.value = '';
                subText.value = '';

                // Update stats and hide download options
                updateTextStats();
                displayDownloadOptions();

                // Clear localStorage
                localStorage.removeItem('textContent');
                localStorage.removeItem('subTextContent');

                // Add button effect
                addButtonEffect(clearBtn);
            });
        }
    }

    // Removed search and highlight functions
    
    // Event listeners for buttons
    removeAccentsButton.addEventListener('click', () => {
        addButtonEffect(removeAccentsButton);
        const text = inputText.value;
        inputText.value = removeVietnameseAccents(text);
        updateTextStats();
    });

    removeWhitespaceButton.addEventListener('click', () => {
        addButtonEffect(removeWhitespaceButton);
        const text = inputText.value;
        inputText.value = removeWhitespace(text);
        updateTextStats();
    });

    // Removed prefix/suffix event listeners

    toLowercaseButton.addEventListener('click', () => {
        addButtonEffect(toLowercaseButton);
        const text = inputText.value;
        inputText.value = text.toLowerCase();
        updateTextStats();
    });

    document.getElementById('toUppercase').addEventListener('click', () => {
        addButtonEffect(document.getElementById('toUppercase'));
        const text = inputText.value;
        inputText.value = text.toUpperCase();
        updateTextStats();
    });

    document.getElementById('toCapitalize').addEventListener('click', () => {
        addButtonEffect(document.getElementById('toCapitalize'));
        const text = inputText.value;
        inputText.value = text.replace(/\b\w/g, char => char.toUpperCase());
        updateTextStats();
    });

    document.getElementById('toSentenceCase').addEventListener('click', () => {
        addButtonEffect(document.getElementById('toSentenceCase'));
        const text = inputText.value;
        inputText.value = text.replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, char) => prefix + char.toUpperCase());
        updateTextStats();
    });

    trimWhitespaceButton.addEventListener('click', () => {
        addButtonEffect(trimWhitespaceButton);
        const text = inputText.value;
        inputText.value = text.trim();
        updateTextStats();
    });

    // Add event listener for the combined processing button
    processCombinedButton.addEventListener('click', () => {
        addButtonEffect(processCombinedButton);
        const text = inputText.value;
        inputText.value = processCombined(text);
        updateTextStats();
    });
    
    // Thêm event listener cho nút xóa khoảng trắng trong mỗi dòng
    removeSpacesInLinesButton.addEventListener('click', () => {
        addButtonEffect(removeSpacesInLinesButton);
        const text = inputText.value;
        inputText.value = removeSpacesInLines(text);
        updateTextStats();
    });


    // Removed search and replace event listeners

    // Ghi chú ghim functionality
    const noteInput = document.getElementById('noteInput');
    const noteTitleInput = document.getElementById('noteTitleInput');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const notesList = document.getElementById('notesList');
    
    // Load notes from localStorage
    let notes = JSON.parse(localStorage.getItem('pinnedNotes') || '[]');
    
    // Migrate old notes format to new format if needed
    if (notes.length > 0 && typeof notes[0] === 'string') {
        notes = notes.map(note => ({ title: '', content: note }));
        localStorage.setItem('pinnedNotes', JSON.stringify(notes));
    }
    
    // Display notes
    function displayNotes() {
        if (notes.length === 0) {
            notesList.innerHTML = '<div class="empty-notes">Chưa có ghi chú nào được ghim</div>';
            return;
        }
        
        notesList.innerHTML = notes.map((note, index) => {
            const displayTitle = note.title ? escapeHtml(note.title) : '';
            const titleClass = note.title ? 'pinned-note-title' : 'pinned-note-title-placeholder';
            const titleText = note.title ? displayTitle : 'Ghi chú không có tiêu đề';
            return `
                <div class="pinned-note-item" data-index="${index}" title="${escapeHtml(note.content)}">
                    <div class="${titleClass}">${titleText}</div>
                    <div class="note-actions">
                        <button class="copy-note-btn" data-action="copy" data-index="${index}">Copy</button>
                        <button class="edit-btn" data-action="edit" data-index="${index}">Sửa</button>
                        <button class="delete-btn" data-action="delete" data-index="${index}">Xóa</button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners for copy, edit and delete buttons
        notesList.querySelectorAll('.copy-note-btn, .edit-btn, .delete-btn').forEach(button => {
            button.addEventListener('click', handleNoteAction);
        });
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Add note
    function addNote() {
        const noteText = noteInput.value.trim();
        const titleText = noteTitleInput.value.trim();
        if (noteText) {
            notes.push({ title: titleText, content: noteText });
            localStorage.setItem('pinnedNotes', JSON.stringify(notes));
            noteInput.value = '';
            noteTitleInput.value = '';
            displayNotes();
        }
    }
    
    // Handle note actions (copy/edit/delete)
    function handleNoteAction(e) {
        const action = e.target.dataset.action;
        const index = parseInt(e.target.dataset.index);

        // Add button effect for all note action buttons
        addButtonEffect(e.target);

        if (action === 'copy') {
            copyNote(index);
        } else if (action === 'edit') {
            editNote(index);
        } else if (action === 'delete') {
            deleteNote(index);
        } else if (action === 'save') {
            saveNote(index);
        } else if (action === 'cancel') {
            cancelEdit(index);
        }
    }
    
    // Copy note content to clipboard
    function copyNote(index) {
        const noteContent = notes[index].content;
        navigator.clipboard.writeText(noteContent).then(() => {
            // Visual feedback
            const copyBtn = document.querySelector(`[data-action="copy"][data-index="${index}"]`);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.backgroundColor = '#4CAF50';
            copyBtn.style.color = 'white';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
                copyBtn.style.color = '';
            }, 1000);
        }).catch(err => {
            console.error('Không thể copy ghi chú: ', err);
            alert('Không thể copy ghi chú!');
        });
    }
    
    // Edit note
    function editNote(index) {
        const noteItem = document.querySelector(`[data-index="${index}"]`);
        const currentNote = notes[index];
        
        noteItem.innerHTML = `
            <div style="flex-grow: 1; margin-right: 10px;">
                <input type="text" class="note-edit-title" placeholder="Tên ghi chú (tùy chọn)" value="${escapeHtml(currentNote.title)}" style="margin-bottom: 4px; width: 100%; box-sizing: border-box;">
                <textarea class="note-edit-input" style="width: 100%; height: 80px; resize: vertical; box-sizing: border-box;">${escapeHtml(currentNote.content)}</textarea>
            </div>
            <div class="note-actions">
                <button class="edit-btn" data-action="save" data-index="${index}">Lưu</button>
                <button class="delete-btn" data-action="cancel" data-index="${index}">Hủy</button>
            </div>
        `;
        const editTitleInput = noteItem.querySelector('.note-edit-title');
        const editInput = noteItem.querySelector('.note-edit-input');
        
        // Add event listeners for save and cancel buttons
        noteItem.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', handleNoteAction);
        });
        
        editInput.focus();
        editInput.select();
        
        // Save on Ctrl+Enter for textarea
        editInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                saveNote(index);
            }
        });
    }
    
    // Save edited note
    function saveNote(index) {
        const noteItem = document.querySelector(`[data-index="${index}"]`);
        const editTitleInput = noteItem.querySelector('.note-edit-title');
        const editInput = noteItem.querySelector('.note-edit-input');
        const newTitle = editTitleInput.value.trim();
        const newContent = editInput.value.trim();
        
        if (newContent) {
            notes[index] = { title: newTitle, content: newContent };
            localStorage.setItem('pinnedNotes', JSON.stringify(notes));
            displayNotes();
        } else {
            cancelEdit(index);
        }
    }
    
    // Cancel edit
    function cancelEdit(index) {
        displayNotes();
    }
    
    // Delete note
    function deleteNote(index) {
        if (confirm('Bạn có chắc muốn xóa ghi chú này?')) {
            notes.splice(index, 1);
            localStorage.setItem('pinnedNotes', JSON.stringify(notes));
            displayNotes();
        }
    }
    
    // Event listeners
    addNoteBtn.addEventListener('click', () => {
        addButtonEffect(addNoteBtn);
        addNote();
    });
    
    noteInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            addNote();
        }
    });
    
    // Initial display
    displayNotes();
    
    // Copy text function
    function copyTextToClipboard() {
        const text = inputText.value;
        if (text.trim() === '') {
            alert('Không có văn bản để copy!');
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            alert('Đã copy văn bản!');
        }).catch(err => {
            console.error('Không thể copy văn bản: ', err);
            alert('Không thể copy văn bản!');
        });
    }
    
    // Improved paste handling for long text
    function pasteTextFromClipboard() {
        navigator.clipboard.readText().then(text => {
            // Handle long text properly
            inputText.value = text;
            updateTextStats();
            
            // Display download options for pasted content
            displayDownloadOptions();
            
            // Save to localStorage if not too large
            try {
                if (text.length < 1000000) {
                    localStorage.setItem('textContent', text);
                }
            } catch (e) {
                console.warn('Failed to save pasted text to localStorage:', e);
            }
        }).catch(err => {
            console.error('Không thể đọc clipboard: ', err);
            alert('Không thể paste văn bản!');
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            copyTextToClipboard();
        }
        if (e.ctrlKey && e.shiftKey && e.key === 'V') {
            e.preventDefault();
            pasteTextFromClipboard();
        }
    });

    // Find and Replace functionality - improved logic
    function performFindReplace() {
        const findText = findInput.value;
        const replaceText = replaceInput.value;
        const currentText = inputText.value;

        if (!findText.trim()) {
            alert('Vui lòng nhập text cần tìm!');
            findInput.focus();
            return;
        }

        // Logic: If replaceText is empty, delete found text (replace with empty string)
        const actualReplaceText = replaceText || '';
        const newText = replaceAllText(currentText, findText, actualReplaceText);

        if (newText === currentText) {
            alert('Không tìm thấy text để thay thế!');
        } else {
            inputText.value = newText;
            updateTextStats();
            // Clear inputs after successful operation
            findInput.value = '';
            replaceInput.value = '';
            // Save to localStorage
            try {
                if (newText.length < 1000000) {
                    localStorage.setItem('textContent', newText);
                }
            } catch (e) {
                console.warn('Failed to save to localStorage:', e);
            }
        }
    }

    // Enter key support for find and replace
    findInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performFindReplace();
        }
    });

    replaceInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performFindReplace();
        }
    });

    // Random ID functionality
    const idLengthInput = document.getElementById('idLengthInput');
    const idCountInput = document.getElementById('idCountInput');

    // Function to generate random character from [A-Z][a-z][0-9] (Apps Script style)
    function randomCharAZaz09() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Function to generate unique ID with specified length
    function generateUniqueId(length = 10) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += randomCharAZaz09();
        }
        return result;
    }

    // Function to generate multiple IDs
    function generateMultipleIds() {
        const length = parseInt(idLengthInput.value) || 10;
        const count = parseInt(idCountInput.value) || 1;

        if (count <= 0 || length <= 0) {
            alert('Vui lòng nhập số dương!');
            return;
        }

        if (count > 1000) {
            alert('Số lượng ID tối đa là 1000!');
            return;
        }

        if (length > 50) {
            alert('Độ dài ID tối đa là 50 ký tự!');
            return;
        }

        const ids = [];
        for (let i = 0; i < count; i++) {
            ids.push(generateUniqueId(length));
        }

        // Insert IDs into textarea (replace current content)
        inputText.value = ids.join('\n');
        updateTextStats();
        displayDownloadOptions();

        // Save to localStorage
        try {
            const idsText = ids.join('\n');
            if (idsText.length < 1000000) {
                localStorage.setItem('textContent', idsText);
            }
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }

        // Clear the count input after generation
        idCountInput.value = '';
    }

    // Enter key support for Random ID
    idCountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateMultipleIds();
        }
    });

    // ============================================
    // FOCUS TIMER FUNCTIONALITY
    // ============================================

    // Load timer state from chrome.storage and sync with background
    async function loadTimerState() {
        try {
            // First try chrome.storage.local (priority)
            if (chrome && chrome.storage) {
                const result = await chrome.storage.local.get(TIMER_STORAGE_KEY);
                if (result[TIMER_STORAGE_KEY]) {
                    const savedState = result[TIMER_STORAGE_KEY];
                    timerState = { ...timerState, ...savedState };
                    timerState.intervalId = null;
                }
            } else {
                // Fallback to localStorage
                const saved = localStorage.getItem(TIMER_STORAGE_KEY);
                if (saved) {
                    const savedState = JSON.parse(saved);
                    timerState = { ...timerState, ...savedState };
                    timerState.intervalId = null;
                }
            }

            // Sync with background service
            syncWithBackgroundService();
        } catch (e) {
            console.warn('Failed to load timer state:', e);
        }
    }

    // Save timer state to storage (both chrome.storage and localStorage)
    async function saveTimerState() {
        try {
            const stateToSave = { ...timerState };
            delete stateToSave.intervalId; // Don't save interval ID

            // Save to chrome.storage.local (priority)
            if (chrome && chrome.storage) {
                await chrome.storage.local.set({ [TIMER_STORAGE_KEY]: stateToSave });
            }

            // Also save to localStorage as backup
            localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (e) {
            console.warn('Failed to save timer state:', e);
        }
    }

    // Sync with background service
    function syncWithBackgroundService() {
        if (!chrome || !chrome.runtime) return;

        chrome.runtime.sendMessage({
            action: 'getTimerState'
        }, (response) => {
            if (response && response.success && response.state) {
                // Update local state with background state
                const bgState = response.state;
                timerState.isRunning = bgState.isRunning;
                timerState.currentTime = bgState.currentTime;
                timerState.totalTime = bgState.totalTime;

                updateTimerDisplay();
                updateTimerButtons(); // Fix: Update button states when syncing with background
            }
        });
    }

    // Listen for background timer updates
    function setupBackgroundListener() {
        if (!chrome || !chrome.runtime) return;

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'timerStateUpdate' && message.state) {
                const bgState = message.state;
                timerState.isRunning = bgState.isRunning;
                timerState.currentTime = bgState.currentTime;
                timerState.totalTime = bgState.totalTime;

                updateTimerDisplay();
                updateTimerButtons(); // Fix: Update button states when receiving background updates
                saveTimerState();
            }
        });
    }

    // Get preset minutes from slider value
    function getPresetMinutes(sliderValue) {
        return FOCUS_PRESETS[sliderValue] || 30;
    }

    // Format time display (MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Update timer display
    function updateTimerDisplay() {
        timerTime.textContent = formatTime(timerState.currentTime);

        // Update status
        if (timerState.isRunning) {
            timerStatus.textContent = 'Đang tập trung';
        } else if (timerState.isPaused) {
            timerStatus.textContent = 'Tạm dừng';
        } else if (timerState.currentTime <= 0) {
            timerStatus.textContent = 'Hoàn thành';
        } else {
            timerStatus.textContent = 'Tập trung';
        }

        // Update circle progress
        updateCircleProgress();

        // Update UI buttons
        updateTimerButtons();
    }

    // Update circle progress
    function updateCircleProgress() {
        if (timerState.totalTime <= 0) return;

        const circumference = 2 * Math.PI * 120; // r = 120
        const progress = (timerState.totalTime - timerState.currentTime) / timerState.totalTime;
        const offset = circumference * (1 - progress);

        timerCircleProgress.style.strokeDashoffset = offset;
    }

    // Update timer button visibility
    function updateTimerButtons() {
        if (timerState.isRunning) {
            timerPlay.style.display = 'none';
            timerPause.style.display = 'flex';
        } else {
            timerPlay.style.display = 'flex';
            timerPause.style.display = 'none';
        }
    }

    // Update preset display
    function updatePresetDisplay() {
        const minutes = getPresetMinutes(timerState.selectedPreset);
        focusLabel.textContent = `${minutes} phút`;
        focusSlider.value = timerState.selectedPreset;
    }

    // Start timer (now delegates to background service)
    function startTimer() {
        if (timerState.currentTime <= 0) return;

        timerState.isRunning = true;
        timerState.isPaused = false;

        // Send message to background service
        chrome.runtime.sendMessage({
            action: 'startTimer',
            currentTime: timerState.currentTime,
            totalTime: timerState.totalTime
        }, (response) => {
            if (response && response.success) {
                console.log('Timer started in background');
            } else {
                console.error('Failed to start background timer');
                // Fallback to local timer
                startLocalTimer();
            }
        });

        updateTimerDisplay();
        saveTimerState();
        addButtonEffect(timerPlay);
    }

    // Pause timer (now delegates to background service)
    function pauseTimer() {
        timerState.isRunning = false;
        timerState.isPaused = true;

        // Send message to background service
        chrome.runtime.sendMessage({
            action: 'pauseTimer'
        }, (response) => {
            if (response && response.success) {
                console.log('Timer paused in background');
            } else {
                console.error('Failed to pause background timer');
            }
        });

        // Clear local interval if any
        if (timerState.intervalId) {
            clearInterval(timerState.intervalId);
            timerState.intervalId = null;
        }

        updateTimerDisplay();
        saveTimerState();
        addButtonEffect(timerPause);
    }

    // Fallback local timer (if background service fails)
    function startLocalTimer() {
        if (timerState.intervalId) {
            clearInterval(timerState.intervalId);
        }

        timerState.intervalId = setInterval(() => {
            timerState.currentTime--;
            updateTimerDisplay();
            saveTimerState();

            // Timer completed
            if (timerState.currentTime <= 0) {
                completeTimer();
            }
        }, 1000);
    }

    // Reset timer (now delegates to background service)
    function resetTimer() {
        timerState.isRunning = false;
        timerState.isPaused = false;

        // Clear local interval if any
        if (timerState.intervalId) {
            clearInterval(timerState.intervalId);
            timerState.intervalId = null;
        }

        const minutes = getPresetMinutes(timerState.selectedPreset);
        timerState.currentTime = minutes * 60;
        timerState.totalTime = minutes * 60;

        // Send reset message to background service
        chrome.runtime.sendMessage({
            action: 'resetTimer',
            totalTime: timerState.totalTime
        }, (response) => {
            if (response && response.success) {
                console.log('Timer reset in background');
            } else {
                console.error('Failed to reset background timer');
            }
        });

        updateTimerDisplay();
        updateTimerButtons(); // Fix: Update button states after reset
        saveTimerState();
        addButtonEffect(timerReset);
    }

    // Complete timer
    function completeTimer() {
        timerState.isRunning = false;
        timerState.isPaused = false;
        timerState.currentTime = 0;

        if (timerState.intervalId) {
            clearInterval(timerState.intervalId);
            timerState.intervalId = null;
        }

        updateTimerDisplay();
        updateTimerButtons(); // Fix: Update button states when timer completes
        saveTimerState();

        // Show completion notification (silent)
        if (chrome && chrome.notifications) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'images/icon.png',
                title: 'Focus Timer',
                message: 'Timer hoàn thành! Giờ nghỉ ngơi nhé.',
                silent: true
            });
        }
    }

    // Handle preset slider change
    function handlePresetChange() {
        const newPreset = parseInt(focusSlider.value);
        timerState.selectedPreset = newPreset;

        // Reset timer với preset mới nếu không đang chạy
        if (!timerState.isRunning) {
            const minutes = getPresetMinutes(newPreset);
            timerState.currentTime = minutes * 60;
            timerState.totalTime = minutes * 60;
        }

        updatePresetDisplay();
        updateTimerDisplay();
        saveTimerState();
    }

    // Timer Event Listeners
    timerPlay.addEventListener('click', startTimer);
    timerPause.addEventListener('click', pauseTimer);
    timerReset.addEventListener('click', resetTimer);
    focusSlider.addEventListener('input', handlePresetChange);

    // Initialize timer with background sync
    setupBackgroundListener();
    loadTimerState().then(() => {
        updatePresetDisplay();
        updateTimerDisplay();
    });

});