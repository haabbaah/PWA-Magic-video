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






const menu = document.querySelector('.menu');
const btn = menu.querySelector('.nav-tgl');

const video = document.querySelector('.main-video'); //Видео
const firstScreen = document.querySelector('.first-screen'); //Первое окно после загрузки
const videoScreen = document.querySelector('.video-screen'); //Окно с видео
const startBtn = document.querySelector('.start-btn'); //Кнопка запуска видео

let addSceneBtn = document.querySelector('.add-scene'); //Кнопка добавления сцены
let optionMenu = document.querySelector('.option'); //Окно главного меню
let sceneCounter = 0; //Итератор добавляется в дата- для сцены
let videoCounter = 0; //Для какой сцены нужно запустить видео
let sceneArr = []; //Массив с экземплярами класса Scene
let inputs = null; //Все импуты с файлами

const playBtn = document.querySelector('.play-btn'); //Кнопка плей на видео





/* menu */
btn.addEventListener('click', event => {
	if (menu.className.indexOf('active') === -1) {
		menu.classList.add('active');
		optionMenu.classList.remove('d-n');
	} else {
		menu.classList.remove('active');
		optionMenu.classList.add('d-n');
	}
});
/* menu END*/


/* firstScreen */

startBtn.addEventListener('click', event => {
	firstScreen.classList.toggle('d-n');
	videoScreen.classList.toggle('d-n');
	if (sceneCounter === 0) { //Ни одной сцены нет
		startDefaultVideo();
	} else { //Добавлены сцены
		startSelfVideo();
	}
});

/* firstScreen END*/


function startDefaultVideo() {
	video.src = 'video/start1.mp4';
	playVideo();
}

function startSelfVideo() {
	video.src = sceneArr[0].startUrl;
	playVideo();
}






/* video */

/*
const topLeft = document.querySelector('.top-left');
const topRight = document.querySelector('.top-right');
const bottomLeft = document.querySelector('.bottom-left');
const bottomRight = document.querySelector('.bottom-right');
const center = document.querySelector('.center');
 */

{
	let coords = {};

	videoScreen.addEventListener('pointerdown', (event) => {
		coords.x = event.pageX;
		coords.y = event.pageY;
	}, false);

	videoScreen.addEventListener('pointerup', (event) => {
		if (coords.x === event.pageX || coords.y === event.pageY) {
			let hiddenBtn = event.target.closest('.hidden-btn');
			if (!hiddenBtn) return;
			if (hiddenBtn.classList.contains('top-left')) {
				video.src = 'video/01.mp4';
				playVideo();
			} else if (hiddenBtn.classList.contains('top-right')) {
				video.src = 'video/02.mp4';
				playVideo();
			} else if (hiddenBtn.classList.contains('bottom-left')) {
				video.src = 'video/03.mp4';
				playVideo();
			} else if (hiddenBtn.classList.contains('bottom-right')) {
				video.src = 'video/04.mp4';
				playVideo();
			} else if (hiddenBtn.classList.contains('center')) {
				video.src = 'video/05.mp4';
				playVideo();
			}

		}
	}, false);
}

function playVideo() {
	playBtn.classList.add('d-n');
	video.play();
	video.addEventListener('ended', endedVideo);
}

function endedVideo() {
	playBtn.classList.remove('d-n');
}

/* video END*/





/* Scene */

class Scene {
	constructor({
		number = 0,
		startUrl = 'video/start1.mp4',
		topLeftUrl = 'video/01.mp4',
		topRighttUrl = 'video/02.mp4',
		bottomLeftUrl = 'video/03.mp4',
		bottomRightUrl = 'video/04.mp4',
		centerUrl = 'video/05.mp4',
	}) {
		this.number = number;
		this.startUrl = startUrl;
		this.topLeftUrl = topLeftUrl;
		this.topRighttUrl = topRighttUrl;
		this.bottomLeftUrl = bottomLeftUrl;
		this.bottomRightUrl = bottomRightUrl;
		this.centerUrl = centerUrl;
	}
}

/* Scene END*/




/* Create scene */
{
	let coords = {};

	addSceneBtn.addEventListener('pointerdown', (event) => { //Кнопка добавить сцену
		coords.x = event.pageX;
		coords.y = event.pageY;
	}, false);

	addSceneBtn.addEventListener('pointerup', (event) => {
		if (coords.x === event.pageX || coords.y === event.pageY) {
			createScene();
		}
	}, false);
}


function createScene() { //Создание сцены
	let counter = sceneCounter++;
	let code = `
	<div class="scene" data-scene-counter="${counter}">
				<div class="scene-option">
					<div class="scene-move">
						<div class="btn up-scene">
							ПОДНЯТЬ
						</div>
						<div class="btn down-scene">
							ОПУСТИТЬ
						</div>
					</div>
					<div class="btn del-scene">
						УДАЛИТЬ
					</div>
				</div>
				<div class="item" data-item="0">
					<img src="images/menu/00.png">
					<input type="file" name="file" id="file-1" class="inputfile" accept="video/*" />
					<label for="file-1">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="1">
					<img src="images/menu/01.png">
					<input type="file" name="file" id="file-2" class="inputfile" accept="video/*"/>
					<label for="file-2">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="2">
					<img src="images/menu/02.png">
					<input type="file" name="file" id="file-3" class="inputfile" accept="video/*"/>
					<label for="file-3">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="3">
					<img src="images/menu/03.png">
					<input type="file" name="file" id="file-4" class="inputfile" accept="video/*"/>
					<label for="file-4">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="4">
					<img src="images/menu/04.png">
					<input type="file" name="file" id="file-5" class="inputfile" accept="video/*"/>
					<label for="file-5">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="5">
					<img src="images/menu/05.png">
					<input type="file" name="file" id="file-6" class="inputfile" accept="video/*"/>
					<label for="file-6">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
			</div>
			</div>
		`;

	optionMenu.insertAdjacentHTML('beforeend', code);
	sceneArr.push(new Scene({
		number: counter,
		startUrl: '',
		topLeftUrl: '',
		topRighttUrl: '',
		bottomLeftUrl: '',
		bottomRightUrl: '',
		centerUrl: '',
	}));

	inputs = document.querySelectorAll('.inputfile');
	startFileReader(inputs);
}


{ //Удаление сцены
	let coords = {};

	optionMenu.addEventListener('pointerdown', (event) => {
		coords.x = event.pageX;
		coords.y = event.pageY;
	}, false);

	optionMenu.addEventListener('pointerup', (event) => {
		if (coords.x === event.pageX || coords.y === event.pageY) {
			let delScene = event.target.closest('.del-scene');
			if (!delScene) return;
			//код
			let scene = delScene.closest('.scene');
			scene.remove();
		}
	}, false);
}

/* Create scene END*/



/* FileReader */

function startFileReader(inputs) {
	for (const input of inputs) {
		input.addEventListener('change', (event) => {
			let label = input.nextElementSibling;
			let parent = input.closest('.scene');
			let i = +parent.dataset.sceneCounter;
			let scene = sceneArr[i];

			let item = input.closest('.item');
			let itemData = item.dataset.item;
			let src = '';

			let file = input.files[0];
			label.innerHTML = file.name;

			let reader = new FileReader();

			reader.onloadend = () => {
				src = reader.result;

				switch (itemData) {
					case '0':
						scene.startUrl = src;
						break;
					case '1':
						scene.topLeftUrl = src;
						break;
					case '2':
						scene.topRighttUrl = src;
						break;
					case '3':
						scene.bottomLeftUrl = src;
						break;
					case '4':
						scene.bottomRightUrl = src;
						break;
					case '5':
						scene.centerUrl = src;
						break;
					default:
						break;
				}
			};

			if (file) {
				reader.readAsDataURL(file);
			} else {
				throw new Error("Src не установлен");
			}
		});
	}
}
/* FileReader END*/