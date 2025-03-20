(function () {
    console.log("YouTube Shorts Auto Next (Polling) - Content Script Loaded.");

    // Keep track of the current video element and its src
    let currentVideo = null;
    let currentSrc = "";
    let isAdvancing = false;

    // Check every 1 second whether the video element (or its src) has changed
    setInterval(() => {
        const newVideo = document.querySelector("video");
        if (!newVideo) {
            return; // Still no video on the page
        }

        const newSrc = newVideo.currentSrc; // The actual loaded video source

        // If the video element or its src changed, it's a "new Short"
        if (newVideo !== currentVideo || newSrc !== currentSrc) {
            console.log("New video detected. Attaching timeupdate listener...");

            // If there was an old video, remove the old listener to avoid stacking
            if (currentVideo) {
                currentVideo.removeEventListener("timeupdate", handleTimeUpdate);
            }

            // Disable loop (so Shorts can actually 'end' or approach end)
            newVideo.loop = false;

            // Attach our timeupdate event
            newVideo.addEventListener("timeupdate", handleTimeUpdate);

            // Update references
            currentVideo = newVideo;
            currentSrc = newSrc;
            isAdvancing = false;
        }
    }, 1000);

    function handleTimeUpdate(e) {
        const video = e.target;
        const remainingTime = video.duration - video.currentTime;

        // If near the end (e.g., within 0.5s) and we haven't advanced yet
        if (!isAdvancing && remainingTime < 0.1) {
            isAdvancing = true;
            console.log("Approaching end of Short. Dispatching ArrowDown...");

            // Dispatch ArrowDown to advance to the next Short
            const arrowDownEvent = new KeyboardEvent("keydown", {
                key: "ArrowDown",
                code: "ArrowDown",
                keyCode: 40,
                which: 40,
                bubbles: true
            });
            document.dispatchEvent(arrowDownEvent);

            console.log("ArrowDown dispatched.");
        }
    }
})();