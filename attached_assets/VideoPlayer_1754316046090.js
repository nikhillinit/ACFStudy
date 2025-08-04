class VideoPlayer {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            width: options.width || '100%',
            height: options.height || '400px',
            showTranscript: options.showTranscript || true,
            showNotes: options.showNotes || true,
            autoplay: options.autoplay || false,
            ...options
        };
        this.currentVideo = null;
        this.watchProgress = new Map();
        this.init();
    }

    init() {
        this.createPlayerStructure();
        this.bindEvents();
        this.loadVideoLibrary();
    }

    createPlayerStructure() {
        this.container.innerHTML = `
            <div class="video-player-wrapper">
                <div class="video-header">
                    <h2 class="video-title">Select a video to begin</h2>
                    <div class="video-meta">
                        <span class="duration"></span>
                        <span class="difficulty"></span>
                        <span class="progress"></span>
                    </div>
                </div>
                
                <div class="video-main">
                    <div class="video-container">
                        <div class="video-placeholder">
                            <i class="play-icon">▶</i>
                            <p>Choose a lecture from the playlist</p>
                        </div>
                        <iframe class="video-iframe" style="display:none;" 
                                width="100%" height="400" frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen></iframe>
                    </div>
                    
                    ${this.options.showTranscript ? this.createTranscriptPanel() : ''}
                    ${this.options.showNotes ? this.createNotesPanel() : ''}
                </div>
                
                <div class="video-controls">
                    <button class="btn-prev" disabled>Previous</button>
                    <button class="btn-playlist">Show Playlist</button>
                    <button class="btn-next" disabled>Next</button>
                    <button class="btn-fullscreen">Fullscreen</button>
                </div>
                
                <div class="playlist-sidebar" style="display:none;">
                    <div class="playlist-header">
                        <h3>Video Library</h3>
                        <button class="close-playlist">×</button>
                    </div>
                    <div class="playlist-content">
                        <div class="loading">Loading videos...</div>
                    </div>
                </div>
            </div>
        `;
    }

    createTranscriptPanel() {
        return `
            <div class="transcript-panel">
                <div class="panel-header">
                    <h3>Transcript</h3>
                    <button class="toggle-transcript">Hide</button>
                </div>
                <div class="transcript-content">
                    <p>Transcript will appear here when video starts...</p>
                </div>
            </div>
        `;
    }

    createNotesPanel() {
        return `
            <div class="notes-panel">
                <div class="panel-header">
                    <h3>Your Notes</h3>
                    <button class="save-notes">Save</button>
                </div>
                <textarea class="notes-textarea" placeholder="Take notes during the lecture..."></textarea>
            </div>
        `;
    }

    bindEvents() {
        // Playlist controls
        this.container.querySelector('.btn-playlist').addEventListener('click', () => {
            this.togglePlaylist();
        });

        this.container.querySelector('.close-playlist').addEventListener('click', () => {
            this.togglePlaylist();
        });

        // Navigation controls
        this.container.querySelector('.btn-prev').addEventListener('click', () => {
            this.playPrevious();
        });

        this.container.querySelector('.btn-next').addEventListener('click', () => {
            this.playNext();
        });

        // Fullscreen
        this.container.querySelector('.btn-fullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Notes saving
        if (this.options.showNotes) {
            this.container.querySelector('.save-notes').addEventListener('click', () => {
                this.saveNotes();
            });
        }

        // Transcript toggle
        if (this.options.showTranscript) {
            this.container.querySelector('.toggle-transcript').addEventListener('click', () => {
                this.toggleTranscript();
            });
        }
    }

    async loadVideoLibrary() {
        try {
            const response = await fetch('/learning-modules/content/videos/mit-finance-library.json');
            this.videoLibrary = await response.json();
            this.renderPlaylist();
        } catch (error) {
            console.error('Failed to load video library:', error);
            this.container.querySelector('.playlist-content').innerHTML = `
                <div class="error">Failed to load video library</div>
            `;
        }
    }

    renderPlaylist() {
        const playlistContent = this.container.querySelector('.playlist-content');
        const lectures = this.videoLibrary.library.lectures;
        
        let html = `
            <div class="playlist-section">
                <h4>🎯 ACF Exam Prep Sequence</h4>
                <div class="playlist-description">Recommended order for exam preparation</div>
            </div>
        `;

        // Render ACF exam prep playlist first
        const acfPlaylist = this.videoLibrary.playlists['acf-exam-prep'];
        acfPlaylist.lectures.forEach((lectureId, index) => {
            const lecture = lectures.find(l => l.id === lectureId);
            if (lecture) {
                html += this.renderPlaylistItem(lecture, index === 0);
            }
        });

        html += `
            <div class="playlist-section">
                <h4>📚 Complete Library</h4>
                <div class="playlist-description">All available lectures</div>
            </div>
        `;

        // Render all lectures
        lectures.forEach(lecture => {
            html += this.renderPlaylistItem(lecture);
        });

        playlistContent.innerHTML = html;
        this.bindPlaylistEvents();
    }

    renderPlaylistItem(lecture, isRecommended = false) {
        const watched = this.watchProgress.get(lecture.id) || 0;
        const watchedPercent = Math.round(watched * 100);
        
        return `
            <div class="playlist-item ${isRecommended ? 'recommended' : ''}" data-lecture-id="${lecture.id}">
                <div class="item-thumbnail">
                    <img src="${lecture.thumbnailUrl}" alt="${lecture.title}" loading="lazy">
                    <div class="duration-badge">${lecture.duration}</div>
                    ${isRecommended ? '<div class="recommended-badge">Recommended</div>' : ''}
                </div>
                <div class="item-content">
                    <h4 class="item-title">${lecture.title}</h4>
                    <div class="item-topics">
                        ${lecture.topics.slice(0, 3).map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                    </div>
                    <div class="item-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${watchedPercent}%"></div>
                        </div>
                        <span class="progress-text">${watchedPercent}% watched</span>
                    </div>
                    <div class="difficulty-indicator">
                        ${'★'.repeat(lecture.difficulty + 1)}${'☆'.repeat(3 - lecture.difficulty)}
                    </div>
                </div>
            </div>
        `;
    }

    bindPlaylistEvents() {
        this.container.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const lectureId = item.dataset.lectureId;
                this.loadVideo(lectureId);
                this.togglePlaylist(); // Close playlist after selection
            });
        });
    }

    loadVideo(lectureId) {
        const lecture = this.videoLibrary.library.lectures.find(l => l.id === lectureId);
        if (!lecture) return;

        this.currentVideo = lecture;
        
        // Update video title and meta
        this.container.querySelector('.video-title').textContent = lecture.title;
        this.container.querySelector('.duration').textContent = lecture.duration;
        this.container.querySelector('.difficulty').textContent = `Difficulty: ${'★'.repeat(lecture.difficulty + 1)}`;
        
        // Load video
        const iframe = this.container.querySelector('.video-iframe');
        const placeholder = this.container.querySelector('.video-placeholder');
        
        iframe.src = `${this.videoLibrary.library.baseUrl}${lecture.youtube}?enablejsapi=1&origin=${window.location.origin}`;
        iframe.style.display = 'block';
        placeholder.style.display = 'none';

        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Load transcript if available
        if (this.options.showTranscript && lecture.transcriptUrl) {
            this.loadTranscript(lecture.transcriptUrl);
        }
        
        // Load saved notes
        if (this.options.showNotes) {
            this.loadNotes(lectureId);
        }

        // Update progress
        this.updateProgress(lectureId);
    }

    updateNavigationButtons() {
        const lectures = this.videoLibrary.library.lectures;
        const currentIndex = lectures.findIndex(l => l.id === this.currentVideo.id);
        
        const prevBtn = this.container.querySelector('.btn-prev');
        const nextBtn = this.container.querySelector('.btn-next');
        
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === lectures.length - 1;
    }

    playPrevious() {
        const lectures = this.videoLibrary.library.lectures;
        const currentIndex = lectures.findIndex(l => l.id === this.currentVideo.id);
        
        if (currentIndex > 0) {
            this.loadVideo(lectures[currentIndex - 1].id);
        }
    }

    playNext() {
        const lectures = this.videoLibrary.library.lectures;
        const currentIndex = lectures.findIndex(l => l.id === this.currentVideo.id);
        
        if (currentIndex < lectures.length - 1) {
            this.loadVideo(lectures[currentIndex + 1].id);
        }
    }

    togglePlaylist() {
        const sidebar = this.container.querySelector('.playlist-sidebar');
        const isVisible = sidebar.style.display !== 'none';
        sidebar.style.display = isVisible ? 'none' : 'block';
    }

    toggleFullscreen() {
        const videoContainer = this.container.querySelector('.video-container');
        
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    async loadTranscript(transcriptUrl) {
        try {
            // Since we don't have actual transcript files, show a placeholder
            const transcriptContent = this.container.querySelector('.transcript-content');
            transcriptContent.innerHTML = `
                <div class="transcript-placeholder">
                    <p><strong>Transcript Available</strong></p>
                    <p>MIT lecture transcripts and captions are available for this video.</p>
                    <p>In a production environment, this would load the actual transcript content with timestamp navigation.</p>
                    <button onclick="window.open('${transcriptUrl}', '_blank')" class="btn-download">
                        Download PDF Transcript
                    </button>
                </div>
            `;
        } catch (error) {
            console.error('Failed to load transcript:', error);
        }
    }

    loadNotes(lectureId) {
        const saved = localStorage.getItem(`notes-${lectureId}`);
        const textarea = this.container.querySelector('.notes-textarea');
        textarea.value = saved || '';
    }

    saveNotes() {
        if (!this.currentVideo) return;
        
        const textarea = this.container.querySelector('.notes-textarea');
        localStorage.setItem(`notes-${this.currentVideo.id}`, textarea.value);
        
        // Show save confirmation
        const saveBtn = this.container.querySelector('.save-notes');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
        saveBtn.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.backgroundColor = '';
        }, 2000);
    }

    toggleTranscript() {
        const panel = this.container.querySelector('.transcript-panel');
        const toggle = this.container.querySelector('.toggle-transcript');
        const content = this.container.querySelector('.transcript-content');
        
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        toggle.textContent = isHidden ? 'Hide' : 'Show';
    }

    updateProgress(lectureId) {
        // In a real app, this would track actual video progress
        // For now, just mark as started
        if (!this.watchProgress.has(lectureId)) {
            this.watchProgress.set(lectureId, 0.1); // 10% watched
            
            // Update progress in playlist
            const playlistItem = this.container.querySelector(`[data-lecture-id="${lectureId}"]`);
            if (playlistItem) {
                const progressFill = playlistItem.querySelector('.progress-fill');
                const progressText = playlistItem.querySelector('.progress-text');
                progressFill.style.width = '10%';
                progressText.textContent = '10% watched';
            }
        }
    }

    // Public API methods
    loadPlaylist(playlistName) {
        const playlist = this.videoLibrary.playlists[playlistName];
        if (playlist && playlist.lectures.length > 0) {
            this.loadVideo(playlist.lectures[0]);
        }
    }

    getCurrentVideo() {
        return this.currentVideo;
    }

    getWatchProgress() {
        return Array.from(this.watchProgress.entries()).map(([id, progress]) => ({
            lectureId: id,
            progress: progress
        }));
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoPlayer;
}
