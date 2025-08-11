# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension (Manifest V3) for Vietnamese text processing called "Chuyển đổi văn bản tiếng Việt". The extension provides text transformation utilities specifically designed for Vietnamese text, including accent removal, case conversion, whitespace handling, and note-taking functionality.

## Architecture

The extension uses a simple client-side architecture:

- **manifest.json**: Chrome extension configuration with side panel setup, keyboard shortcut (Ctrl+Shift+Comma), and required permissions
- **popup.html**: Main UI interface that opens as a side panel
- **popup.js**: Core JavaScript functionality containing all text processing logic
- **background.js**: Service worker handling keyboard shortcuts and extension icon clicks
- **style.css**: Styling with monospace font theme

## Core Features

### Text Processing Functions (popup.js)
- `removeVietnameseAccents()`: Comprehensive Vietnamese accent removal using character mapping (lines 65-100)
- `removeSpecialCharacters()`: Strip non-alphanumeric characters except spaces
- `removeWhitespace()`: Normalize multiple spaces to single spaces per line
- `removeSpacesInLines()`: Remove all spaces within lines while preserving line breaks
- `convertCharsToSpaces()`: Convert punctuation and special chars to spaces
- `processCombined()`: Chain multiple transformations (remove accents → lowercase → trim → convert chars → normalize spaces)

### Data Persistence
- Uses localStorage for text content and pinned notes with 1MB size limit check
- Automatic migration of old note format to new title/content structure
- Real-time saving on text input with error handling

### Note Management
- Add, edit, delete, and copy pinned notes with optional titles
- XSS prevention through HTML escaping
- Keyboard shortcuts (Ctrl+Enter for save/add)

## Development Commands

This is a pure JavaScript Chrome extension with no build process. To develop:

1. **Load Extension**: Use Chrome's "Load unpacked" in chrome://extensions/ pointing to this directory
2. **Reload**: Use the reload button in chrome://extensions/ after making changes
3. **Debug**: Use Chrome DevTools on the side panel or inspect the background script

## File Structure

- `manifest.json`: Extension configuration
- `popup.html`: Side panel UI structure  
- `popup.js`: Main application logic (~450 lines)
- `background.js`: Service worker for shortcuts/clicks (~15 lines)
- `style.css`: Monospace-themed styling
- `images/icon.png`: Extension icon
- `test.txt`, `test2.txt`: Test files (can be ignored)

## Key Technical Details

- Uses Chrome Side Panel API (not traditional popup)
- Keyboard shortcuts: Ctrl+Shift+Comma (open), Ctrl+Shift+C (copy), Ctrl+Shift+V (paste)
- Character/word count stats updated in real-time
- Clipboard API for copy/paste functionality
- All text processing is client-side with no external dependencies