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

### Focus Timer System (NEW v2.0)
- **Simplified Pomodoro Timer**: Focus sessions only, no break timers
- **7 Preset Values**: [15, 30, 45, 60, 75, 90, 120] minutes via inline slider
- **Background Persistence**: Timer continues running when side panel is closed
- **Visual Progress**: SVG circle animation with real-time countdown
- **Silent Notifications**: Timer completion alerts without sound
- **Chrome Storage**: Cross-browser session persistence using chrome.storage.local
- **Fallback Support**: localStorage backup if chrome.storage unavailable

### Data Persistence
- Uses localStorage for text content and pinned notes with 1MB size limit check
- chrome.storage.local for timer state with background service sync
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

- `manifest.json`: Extension configuration (v2.0 with timer permissions)
- `popup.html`: Side panel UI structure with integrated timer section
- `popup.js`: Main application logic (~1200+ lines with timer integration)
- `background.js`: Service worker with background timer service (~300 lines)
- `content.js`: Content script for download functionality
- `style.css`: Monospace-themed styling with timer CSS
- `images/icon.png`: Extension icon
- `TODO.md`: Implementation tracking (all phases completed)
- `test.txt`, `test2.txt`: Test files (can be ignored)

## Key Technical Details

- Uses Chrome Side Panel API (not traditional popup)
- **Background Service Worker**: Persistent timer functionality with chrome.storage.local
- **Message Passing**: Popup ↔ Background communication for timer state sync
- **Dual Storage**: chrome.storage.local + localStorage fallback for maximum reliability
- Keyboard shortcuts: Ctrl+Shift+Comma (open), Ctrl+Shift+C (copy), Ctrl+Shift+V (paste)
- Character/word count stats updated in real-time
- Clipboard API for copy/paste functionality
- All text processing is client-side with no external dependencies
- **Timer Features**: SVG progress animation, preset values, background persistence