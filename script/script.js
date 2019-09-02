let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
	// Prevent Chrome 67 and earlier from automatically showing the prompt
	e.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = e;
});

async function install() {
	if (deferredPrompt) {
		deferredPrompt.prompt();
		console.log(deferredPrompt)
		deferredPrompt.userChoice.then(function (choiceResult) {
			if (choiceResult.outcome === 'accepted') {
				console.log('Your PWA has been installed');
			} else {
				console.log('User chose to not install your PWA');
			}
			deferredPrompt = null;
		});
	}
}


if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('./sw.js').then(function (registration) {
				// Registration was successful
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			},
			function (err) {
				// registration failed :(
				console.log('ServiceWorker registration failed: ', err);
			});
	});
}



/* menu */
const menu = document.querySelector('.menu');
const btn = menu.querySelector('.nav-tgl');
const option = document.querySelector('.option');
btn.addEventListener('click', event => {
	if (menu.className.indexOf('active') === -1) {
		menu.classList.add('active');
		option.classList.remove('d-n');
	} else {
		menu.classList.remove('active');
		option.classList.add('d-n');
	}
});
/* menu END*/


/* firstScreen */

const video = document.querySelector('.main-video');

const firstScreen = document.querySelector('.first-screen');
const videoScreen = document.querySelector('.video-screen');
const startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', event => {
	firstScreen.classList.toggle('d-n');
	videoScreen.classList.toggle('d-n');
	playVideo();
});

/* firstScreen END*/





/* video */

const playBtn = document.querySelector('.play-btn');
const topLeft = document.querySelector('.top-left');
const topRight = document.querySelector('.top-right');
const bottomLeft = document.querySelector('.bottom-left');
const bottomRight = document.querySelector('.bottom-right');
const center = document.querySelector('.center');

topLeft.addEventListener('click', event => {
	video.src = 'video/01.mp4';
	playVideo();
});

topRight.addEventListener('click', event => {
	video.src = 'video/02.mp4';
	playVideo();
});

bottomLeft.addEventListener('click', event => {
	video.src = 'video/03.mp4';
	playVideo();
});

bottomRight.addEventListener('click', event => {
	video.src = 'video/04.mp4';
	playVideo();
});

center.addEventListener('click', event => {
	video.src = 'video/05.mp4';
	playVideo();
});

function playVideo() {
	playBtn.classList.add('d-n');
	video.play();
	video.addEventListener('ended', endedVideo);
}

function endedVideo() {
	playBtn.classList.remove('d-n');
}

/* video END*/