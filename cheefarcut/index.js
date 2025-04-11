$(document).ready(function () {
    //time down 
    const endDate = new Date(2025, 8, 5, 12, 0, 0);


    function updateCountdown() {
        const now = new Date();
        const distance = endDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $("#days").text(days.toString().padStart(2, '0'));
        $("#hours").text(hours.toString().padStart(2, '0'));
        $("#minutes").text(minutes.toString().padStart(2, '0'));
        $("#seconds").text(seconds.toString().padStart(2, '0'));

        if (distance < 0) {
            clearInterval(countdownTimer);
        }
    }

    updateCountdown();

    const countdownTimer = setInterval(updateCountdown, 1000);

    // video play 
    const videoList = [
        "https://cdn.shopify.com/videos/c/o/v/336156171833440c97daca1a5273eac8.mp4",
        "https://cdn.shopify.com/videos/c/o/v/8d85ec3d2fe646b78defbd70ae93233b.mp4",
        "https://cdn.shopify.com/videos/c/o/v/a0fb626826e340d9825174358b24ff35.mp4",
        "https://cdn.shopify.com/videos/c/o/v/1f50d1b1f51c4a14a4cce494ad01722a.mp4"
    ];

    let currentVideoIndex = 0;
    let isSwitching = false;
    let fadeTimeout;

    const $videos = [$('#videoPlayer1'), $('#videoPlayer2')];
    let activeIndex = 0;

    // 初始化时隐藏第二个 video
    $videos[1].hide().removeClass('fade-out');

    function initVideoCover() {
        $videos[0].addClass('show-cover');

        setTimeout(() => {
            $videos[0].removeClass('show-cover');
            startVideoPlayback();
        }, 1000);
    }

    function startVideoPlayback() {
        $videos[0][0].play().catch(() => {
            $('body').one('click', () => {
                $videos[0][0].play();
            });
        });
    }

    function clearFadeTimeout() {
        if (fadeTimeout) {
            clearTimeout(fadeTimeout);
            fadeTimeout = null;
        }
    }

    async function switchVideo() {
        if (isSwitching) return;
        isSwitching = true;

        const nextVideoIndex = (currentVideoIndex + 1) % videoList.length;
        const $currentVideo = $videos[activeIndex];
        const $nextVideo = $videos[1 - activeIndex];

        $nextVideo[0].src = videoList[nextVideoIndex];

        try {
            await new Promise((resolve, reject) => {
                $nextVideo[0].onloadedmetadata = resolve;
                $nextVideo[0].onerror = reject;
                $nextVideo[0].load();
            });

            await new Promise(resolve => {
                if ($nextVideo[0].readyState > 3) resolve();
                else $nextVideo[0].oncanplaythrough = resolve;
            });

            // 清理状态，防止旧的残留
            $nextVideo.removeClass('fade-out');

            // 当前视频加上淡出动画
            $currentVideo.addClass('fade-out');

            // 播放下一段视频
            $nextVideo.show()[0].play().catch(console.error);

            currentVideoIndex = nextVideoIndex;
            activeIndex = 1 - activeIndex;
            updateEventListeners();

            // 淡出完成后，暂停并隐藏旧视频
            clearFadeTimeout();
            fadeTimeout = setTimeout(() => {
                $currentVideo[0].pause();
                $currentVideo.hide().removeClass('fade-out');
                isSwitching = false;
            }, 1500);

        } catch (error) {
            console.error('切换视频出错：', error);
            isSwitching = false;
        }
    }

    function updateEventListeners() {
        $videos.forEach(($video, index) => {
            $video.off('ended');
            if (index === activeIndex) {
                $video.on('ended', switchVideo);
            }
        });
    }

    initVideoCover();
    updateEventListeners();

});