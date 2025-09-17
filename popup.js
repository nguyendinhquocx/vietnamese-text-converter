document.addEventListener('DOMContentLoaded', function () {
    const inputText = document.getElementById('inputText');
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

    // Load saved text content from localStorage
    const savedText = localStorage.getItem('textContent');
    if (savedText) {
        inputText.value = savedText;
        updateTextStats();
        displayDownloadOptions(); // Show download options if there's saved text
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
            'XML': 'xml',
            'PHP': 'php',
            'CSV': 'csv'
        };

        const extension = fileExtensions[format] || 'txt';
        const fileName = `document.${extension}`;
        
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
        
        const downloadFormats = ['JSON', 'TXT', 'JS', 'HTML', 'CSS', 'MD', 'TS', 'TSX', 'PY', 'SQL', 'XML', 'PHP', 'CSV'];

        // Create CSV → JSON converter button first
        const csvToJsonButton = `<button class="download-btn csv-to-json-btn" data-action="csvToJson">CSV → JSON</button>`;

        // Create Copy button
        const copyButton = `<button class="download-btn copy-all-btn" data-action="copyAll">COPY</button>`;

        // Create Github button
        const githubButton = `<button class="download-btn github-btn" data-action="github">Github</button>`;

        const downloadButtons = downloadFormats.map(format =>
            `<button class="download-btn" data-format="${format}">${format}</button>`
        ).join('');

        suggestionsContainer.innerHTML = `
            <div class="suggestions-list">${csvToJsonButton}${copyButton}${githubButton}${downloadButtons}</div>
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

});