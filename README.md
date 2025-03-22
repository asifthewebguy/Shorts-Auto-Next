# YouTube Shorts Auto Next

A Chrome extension that automatically advances to the next YouTube Short after the current one ends (or is nearly finished). It also provides a pause/resume toggle button in the element with id="center", displays a counter of how many times you've advanced, and keeps a running total of how much time you’ve spent on Shorts. Hover on the counter to see a tooltip conveying how many minutes or hours you’ve “lost from your life.”

## Current Version

v0.1.0

## Features

1. Automatically navigates to the next Short when the current one is almost done.  
2. Pause/Resume button:  
   - By default, the extension is in “active” mode (showing a “⏸️” icon).  
   - Clicking toggles to “paused” mode (showing a “▶️” icon).  
3. Counter displaying how many times you’ve advanced to the next Short.  
4. A running total of all Shorts durations encountered. Hover over the counter to see “You have lost X minutes/hours from your life!”  
5. The toggle button and counter are inserted into the element with id="center" on the page (if found).  
6. Clean and consistent styling on both the toggle button and the counter.

## Installation

1. Clone or download this repository.  
2. In Chrome, open the Extensions page:  
   - Go to chrome://extensions in your address bar  
   - Enable “Developer mode” in the top-right corner  
3. Click “Load unpacked” and select the folder where this repository’s manifest.json and content.js live.  
4. Navigate to any YouTube Short (e.g., https://www.youtube.com/shorts/VIDEO_ID). If the page includes an element with id="center", you’ll see:  
   - A button labeled “⏸️” to pause/resume auto-advance.  
   - A red counter next to it showing how many times you’ve advanced.  
  
5. Let the Short play to the end. As it approaches the final 0.5 seconds, the extension triggers a keyboard event (ArrowDown) to move to the next Short.  

## Usage

• When the extension is active, each time you near the end of a Short, the extension dispatches “ArrowDown” to move on.  
• The numeric counter increments by 1 each time the extension triggers a next-short event.  
• As metadata is loaded for each new Short, its total duration (in seconds) is added to a cumulative total.  
• Hovering over the counter displays a title/tooltip with either:  
  - “You have lost X minutes from your life!” (if < 1 hour total)  
  - “You have lost H:MM hours from your life!” (if ≥ 1 hour total).

### Pause/Resume
• Click the button to pause or resume auto-advance.  
• When paused, the button shows “▶️”. The extension won’t navigate to the next Short automatically.  
• Clicking again resumes auto-advance, displaying “⏸️”.

## How It Works

1. A content script (content.js) is injected into YouTube Shorts pages (https://www.youtube.com/shorts/*).  
2. It polls every 1 second to check if a new Short (video element) has been loaded (since YouTube dynamically replaces the video element when moving to the next Short).  
3. When a new video is detected, the script attaches a timeupdate event listener that checks if the user is near the end (< 0.5s).  
4. If so, and if not paused, it dispatches ArrowDown to advance to the next Short.  
5. Each new Short’s full duration is captured on “loadedmetadata” (triggered once per video), incrementing the total Shorts duration.  
6. The UI: A “Pause/Resume” button and a numeric counter (with tooltip) are appended to the DOM.

## Contributing

Feel free to open issues or pull requests if you’d like to improve this extension. Suggestions for new features are welcome.

## License

This project is licensed under the [GPL-3.0 License](LICENSE).  
You’re free to use, modify, and distribute this extension as long as you include the license.

## Author
[@asifthewebguy](https://www.github.com/asifthewebguy)