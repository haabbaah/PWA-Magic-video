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
btn.addEventListener('click', evt => {
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

const firstScreen = document.querySelector('.first-screen');
const youtube = document.querySelector('.youtube');
const startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', evt => {
	firstScreen.classList.toggle('d-n');
	youtube.classList.toggle('d-n');
});

/* firstScreen END*/