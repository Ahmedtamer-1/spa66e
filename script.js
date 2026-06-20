document.addEventListener("DOMContentLoaded", () => {
    let currentFilter = "All";
    const filterNav = document.getElementById("filter-nav");
    const videoGallery = document.getElementById("video-gallery");
    
    // Modal Elements
    const modal = document.getElementById("video-modal");
    const modalVideo = document.getElementById("modal-video");
    const modalTitle = document.getElementById("modal-title");
    const closeModalBtn = document.getElementById("close-modal");
    const modalBackdrop = document.querySelector(".modal-backdrop");

    // Custom Player Elements
    const playerContainer = document.querySelector(".video-container");
    const playPauseBtn = document.getElementById("player-play-pause");
    const progressBar = document.getElementById("player-progress");
    const timeDisplay = document.getElementById("player-time");
    const muteBtn = document.getElementById("player-mute");
    const volumeBar = document.getElementById("player-volume");
    const fullscreenBtn = document.getElementById("player-fullscreen");
    let controlsTimeout;

    // Splash screen logic
    const enterBtn = document.getElementById("enter-archive");
    const splash = document.getElementById("splash-screen");
    const mainContent = document.getElementById("main-content");

    if (enterBtn) {
        enterBtn.addEventListener("click", () => {
            splash.classList.add("hidden");
            mainContent.classList.add("visible");
        });
    }

    // Initialize the portfolio
    function init() {
        renderFilters();
        renderGallery(videoData);
        setupModalListeners();
        setupCustomPlayer();
        setupNavigation();
    }

    // Setup Main Navigation (Edits, Lookbook, Music)
    function setupNavigation() {
        const navBtns = document.querySelectorAll(".main-nav-btn");
        const sections = document.querySelectorAll(".content-section");

        navBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const target = btn.getAttribute("data-target");

                // Toggle active buttons
                navBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                // Toggle active sections
                sections.forEach(sec => {
                    if (sec.id === target) {
                        sec.classList.remove("hidden-section");
                    } else {
                        sec.classList.add("hidden-section");
                    }
                });
            });
        });
    }

    // Render category filters
    function renderFilters() {
        filterNav.innerHTML = '';
        categories.forEach(category => {
            const btn = document.createElement("button");
            btn.className = `filter-btn ${category === currentFilter ? 'active' : ''}`;
            btn.innerText = category;
            btn.addEventListener("click", () => {
                // Update active state
                document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                currentFilter = category;
                filterGallery();
            });
            filterNav.appendChild(btn);
        });
    }

    // Filter gallery based on selected category
    function filterGallery() {
        const filteredData = currentFilter === "All" 
            ? videoData 
            : videoData.filter(v => v.category === currentFilter);
        
        renderGallery(filteredData);
    }

    // Render video cards
    function renderGallery(data) {
        videoGallery.innerHTML = '';
        
        if (data.length === 0) {
            videoGallery.innerHTML = '<p style="text-align:center; width:100%; color:#666; font-size: 0.7rem;">[ empty archive ]</p>';
            return;
        }

        data.forEach((video, index) => {
            const card = document.createElement("div");
            card.className = "video-card fade-in";
            
            // Format number as 001, 002, etc.
            const displayNum = (index + 1).toString().padStart(3, '0');
            
            // Generate poster URL from Cloudinary video URL
            const posterUrl = video.path.replace('.mp4', '.jpg');
            
            card.innerHTML = `
                <div class="video-thumbnail-container">
                    <div class="loading-icon">✦</div>
                    <img class="poster-img" src="${posterUrl}" alt="${video.title} poster">
                    <video class="preview-video" preload="none" muted playsinline loop></video>
                </div>
                <div class="video-info">
                    <h3 class="video-title" title="${video.title}"><span style="color:var(--text-secondary);">[${displayNum}]</span> ${video.title}</h3>
                    <span class="video-category">[ ${video.category} ]</span>
                </div>
            `;

            const preview = card.querySelector(".preview-video");
            const img = card.querySelector(".poster-img");
            const loader = card.querySelector(".loading-icon");

            // Image load tracking
            img.addEventListener("load", () => {
                img.classList.add("loaded");
                loader.style.display = "none";
            });

            // Image load failure fallback
            img.addEventListener("error", () => {
                loader.innerText = `[ ${displayNum} ]`;
                loader.style.fontFamily = "'Space Mono', monospace";
                loader.style.fontSize = "0.75rem";
                loader.style.animation = "none";
            });
            
            // Hover to load and play preview on-demand
            card.addEventListener("mouseenter", () => {
                if (!preview.src) {
                    preview.src = `${video.path}#t=0.1`;
                }
                preview.play().catch(e => console.log("Preview autoplay blocked", e));
            });

            card.addEventListener("mouseleave", () => {
                preview.pause();
                // Reset source to close connection and save bandwidth
                preview.removeAttribute("src");
                preview.load();
            });

            // Open modal on click
            card.addEventListener("click", () => openModal(video));

            videoGallery.appendChild(card);
        });
    }

    // Modal Logic
    function openModal(video) {
        modalVideo.src = video.path;
        modalTitle.innerText = video.title;
        modal.classList.remove("hidden");
        
        // Reset player UI controls to defaults
        progressBar.value = 0;
        updateRangeValue(progressBar);
        volumeBar.value = modalVideo.muted ? 0 : modalVideo.volume;
        updateRangeValue(volumeBar);
        updateMuteBtnText();
        playerContainer.classList.add("controls-visible");

        modalVideo.play().catch(e => {
            console.log("Auto-play prevented by browser policy", e);
        });
    }

    function closeModal() {
        modal.classList.add("hidden");
        modalVideo.pause();
        modalVideo.src = ""; // Reset src
        clearTimeout(controlsTimeout);
        playerContainer.classList.remove("controls-visible");
        
        // Exit fullscreen if closed while active
        if (document.fullscreenElement === playerContainer) {
            document.exitFullscreen().catch(err => console.log(err));
        }
    }

    function setupModalListeners() {
        closeModalBtn.addEventListener("click", closeModal);
        modalBackdrop.addEventListener("click", closeModal);
        
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modal.classList.contains("hidden")) {
                closeModal();
            }
        });
    }

    // Custom Video Player controls binding
    function setupCustomPlayer() {
        // Toggle play/pause by clicking button or clicking video viewport
        playPauseBtn.addEventListener("click", togglePlay);
        modalVideo.addEventListener("click", togglePlay);

        // Update button states on actual video element play/pause events
        modalVideo.addEventListener("play", () => {
            playPauseBtn.innerText = "[ PAUSE ]";
            resetControlsTimer();
        });

        modalVideo.addEventListener("pause", () => {
            playPauseBtn.innerText = "[ PLAY ]";
            clearTimeout(controlsTimeout);
            playerContainer.classList.add("controls-visible");
        });

        // Time updates: updates progress slider and timecode text
        modalVideo.addEventListener("timeupdate", () => {
            if (!modalVideo.duration) return;
            const percentage = (modalVideo.currentTime / modalVideo.duration) * 100;
            progressBar.value = percentage;
            updateRangeValue(progressBar);
            timeDisplay.innerText = `${formatTime(modalVideo.currentTime)} / ${formatTime(modalVideo.duration)}`;
        });

        // Scrubbing functionality
        progressBar.addEventListener("input", () => {
            if (!modalVideo.duration) return;
            const newTime = (progressBar.value / 100) * modalVideo.duration;
            modalVideo.currentTime = newTime;
            updateRangeValue(progressBar);
            resetControlsTimer();
        });

        // Volume control
        volumeBar.addEventListener("input", () => {
            modalVideo.volume = volumeBar.value;
            modalVideo.muted = (volumeBar.value == 0);
            updateMuteBtnText();
            updateRangeValue(volumeBar);
            resetControlsTimer();
        });

        // Mute / Unmute toggle
        muteBtn.addEventListener("click", () => {
            modalVideo.muted = !modalVideo.muted;
            volumeBar.value = modalVideo.muted ? 0 : modalVideo.volume;
            updateMuteBtnText();
            updateRangeValue(volumeBar);
            resetControlsTimer();
        });

        // Fullscreen toggle button
        fullscreenBtn.addEventListener("click", toggleFullscreen);

        // Show controls on hover / mouse move, fade out when idle
        playerContainer.addEventListener("mousemove", resetControlsTimer);
        playerContainer.addEventListener("mouseleave", () => {
            if (!modalVideo.paused) {
                playerContainer.classList.remove("controls-visible");
            }
        });

        // Keyboard hotkeys
        document.addEventListener("keydown", handleKeyboardControls);
    }

    function togglePlay() {
        if (modalVideo.paused) {
            modalVideo.play().catch(e => console.log("Play error:", e));
        } else {
            modalVideo.pause();
        }
    }

    function resetControlsTimer() {
        playerContainer.classList.add("controls-visible");
        clearTimeout(controlsTimeout);
        if (!modalVideo.paused) {
            controlsTimeout = setTimeout(() => {
                playerContainer.classList.remove("controls-visible");
            }, 2000);
        }
    }

    // Helper to calculate progress range slider backgrounds dynamically
    function updateRangeValue(el) {
        const percentage = ((el.value - el.min) / (el.max - el.min)) * 100;
        el.style.setProperty('--value', percentage + '%');
    }

    function updateMuteBtnText() {
        if (modalVideo.muted || modalVideo.volume === 0) {
            muteBtn.innerText = "[ UNMUTE ]";
        } else {
            muteBtn.innerText = "[ MUTE ]";
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            playerContainer.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Watch fullscreen change to update fullscreen button label
    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement === playerContainer) {
            fullscreenBtn.innerText = "[ EXIT ]";
        } else {
            fullscreenBtn.innerText = "[ FULL ]";
        }
    });

    // Helper: format video elapsed/total seconds into MM:SS format
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Hotkey handlers (Space to play/pause, arrows to seek, M to mute, F to fullscreen)
    function handleKeyboardControls(e) {
        if (modal.classList.contains("hidden")) return;

        switch(e.key.toLowerCase()) {
            case " ":
                e.preventDefault();
                togglePlay();
                break;
            case "arrowleft":
                e.preventDefault();
                modalVideo.currentTime = Math.max(0, modalVideo.currentTime - 5);
                resetControlsTimer();
                break;
            case "arrowright":
                e.preventDefault();
                modalVideo.currentTime = Math.min(modalVideo.duration || 0, modalVideo.currentTime + 5);
                resetControlsTimer();
                break;
            case "m":
                e.preventDefault();
                muteBtn.click();
                break;
            case "f":
                e.preventDefault();
                toggleFullscreen();
                break;
        }
    }

    // Run init
    init();
});
