(function () {
    console.log("YouTube Shorts Auto Next (Counter + Duration + Toggle) - Loaded.");

    let currentVideo = null;
    let currentSrc = "";

    // Whether auto-advance is paused
    let isPaused = false;

    // Prevent multiple triggers for the same video end
    let isAdvancing = false;

    // Count how many times we've advanced to the next Short
    let nextCount = 0;

    // Sum of durations (in seconds) of all encountered Shorts
    let totalShortsDuration = 0;

    // UI elements
    let btnToggle = null;
    let spanCounter = null;

    // Create the pause/resume button + counter in #center
    createToggleButton();

    // Poll every second for a new or changed <video>
    setInterval(checkForNewVideo, 1000);

    function checkForNewVideo() {
        const newVideo = document.querySelector("video");
        if (!newVideo) return;

        const newSrc = newVideo.currentSrc || "";
        // If the video element or its src changed, it's a new Short
        if (newVideo !== currentVideo || newSrc !== currentSrc) {
            console.log("New Short detected. Setting up new video...");

            // If we had an old video, remove its timeupdate listener
            if (currentVideo) {
                currentVideo.removeEventListener("timeupdate", handleTimeUpdate);
            }

            currentVideo = newVideo;
            currentSrc = newSrc;
            isAdvancing = false;

            // Disable looping so we can detect near the end
            newVideo.loop = false;

            // Listen to timeupdate
            newVideo.addEventListener("timeupdate", handleTimeUpdate);

            // Add this video’s duration to the total once metadata is loaded
            newVideo.addEventListener("loadedmetadata", function onMeta() {
                totalShortsDuration += newVideo.duration;
                updateCounterUI();
                newVideo.removeEventListener("loadedmetadata", onMeta);
                console.log(
                    "Added duration:",
                    newVideo.duration,
                    "seconds. Total so far:",
                    totalShortsDuration,
                    "seconds."
                );
            });
        }
    }

    function handleTimeUpdate(e) {
        if (isPaused) return;

        const video = e.target;
        const remainingTime = video.duration - video.currentTime;
        // If we're within 0.5 seconds of the end, we advance
        if (!isAdvancing && remainingTime < 0.5) {
            isAdvancing = true;
            nextCount++;
            updateCounterUI();

            console.log(`Short #${nextCount}. Dispatching ArrowDown...`);
            const arrowDownEvent = new KeyboardEvent("keydown", {
                key: "ArrowDown",
                code: "ArrowDown",
                keyCode: 40,
                which: 40,
                bubbles: true
            });
            document.dispatchEvent(arrowDownEvent);
        }
    }

    function createToggleButton() {
        const container = document.getElementById("center");
        if (!container) {
            console.log("No element with id='center' found. Cannot insert toggle button.");
            return;
        }

        // Create the toggle button
        btnToggle = document.createElement("button");
        // Default: auto-advance is active → show the pause icon
        btnToggle.innerText = "⏸️";
        styleAsButton(btnToggle);

        // Create the span for the counter (styled the same as the button)
        spanCounter = document.createElement("span");
        styleAsButton(spanCounter);

        // We'll align them nicely
        spanCounter.style.marginLeft = "8px";

        // Initialize the display and tooltip
        updateCounterUI();

        // Append them to #center
        container.appendChild(btnToggle);
        container.appendChild(spanCounter);

        // Toggle logic on click
        btnToggle.addEventListener("click", () => {
            isPaused = !isPaused;
            // If paused, show ▶️; if active, show ⏸️
            btnToggle.innerText = isPaused ? "▶️" : "⏸️";
            console.log("Auto-advance is now " + (isPaused ? "PAUSED" : "ACTIVE"));
        });

        console.log("Toggle button + counter added to #center.");
    }

    /**
     * Updates the numeric count in the span and sets the tooltip 
     * to show the total watch time in either minutes (if < 60) or hours:minutes (if ≥ 60).
     */
    function updateCounterUI() {
        if (!spanCounter) return;

        // Just show the numeric count (no "Next pressed:")
        spanCounter.innerText = nextCount;

        // Calculate the watch time string
        const timeString = formatDuration(totalShortsDuration);
        spanCounter.title = `You have lost ${timeString} from your life!`;
    }

    /**
     * Formats the totalSeconds into either:
     * - "X minutes" if total < 3600 seconds (less than an hour),
     * - "H:MM hours" otherwise.
     */
    function formatDuration(totalSeconds) {
        const totalMinutes = Math.floor(totalSeconds / 60);

        if (totalMinutes < 60) {
            // e.g. "5 minutes"
            return `${totalMinutes} minute${totalMinutes === 1 ? "" : "s"}`;
        } else {
            // e.g. "1:07 hours"
            const hours = Math.floor(totalMinutes / 60);
            const mins = totalMinutes % 60;
            return `${hours}:${String(mins).padStart(2, "0")} hours`;
        }
    }

    /**
     * Applies the same style as our button to any element (button or span).
     */
    function styleAsButton(elem) {
        elem.style.backgroundColor = "#ff0000";
        elem.style.color = "#ffffff";
        elem.style.border = "none";
        elem.style.borderRadius = "4px";
        elem.style.cursor = "pointer";
        elem.style.fontSize = "14px";
        elem.style.padding = "8px";
    }
})();