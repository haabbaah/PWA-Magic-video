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
let labelCounter = 0; //Итератор для инпута и лейбла
let sceneArr = []; //Массив с экземплярами класса Scene
let inputs = null; //Все импуты с файлами

const playBtn = document.querySelector('.play-btn'); //Кнопка плей на видео

//params = {}; // Параметры для сохранения в localStorage





/* localStorage */
/* getSaveParams();

function saveParams() {

	params.sceneArr = sceneArr;
	params.sceneCounter = sceneCounter;

	let serialParams = JSON.stringify(params);
	localStorage.setItem("params", serialParams);
}

function getSaveParams() {
	let paramsFromStorage = JSON.parse(localStorage.getItem("params"));
	if (!paramsFromStorage) {
		return;
	}
	sceneArr = [];
	sceneArr = paramsFromStorage.sceneArr;
	sceneCounter = paramsFromStorage.sceneCounter;
	autoCreateScene();
} */

/* localStorage END*/








/* IndexedDB */








/* let openRequest = indexedDB.open('store');

openRequest.onupgradeneeded = function () {
	let db = openRequest.result;
	if (!db.objectStoreNames.contains('params')) {
		db.createObjectStore('params', {
			keyPath: 'id'
		});
	}


	let transaction = db.transaction("params", "readwrite");
	let params = transaction.objectStore("params");

	let param = {
		id: 'js',
		price: 10,
		created: new Date()
	};
	let request = params.add(param);

	request.onsuccess = function () {
		console.log("Параметр добавлен в хранилище", request.result);
	};

	request.onerror = function () {
		console.log("Ошибка", request.error);
	};


};

openRequest.onerror = function () {
	console.error("Error", openRequest.error);
};

openRequest.onsuccess = function () {
	let db = openRequest.result;
	db.onversionchange = function () {
		db.close();
		alert("База данных устарела, пожалуста, перезагрузите страницу.");
	};


	db.createObjectStore('params', {
		keyPath: 'id'
	});

};
 */

/* IndexedDB END*/




/* menu */
btn.addEventListener('click', event => {
	if (menu.className.indexOf('active') === -1) {
		menu.classList.add('active');
		optionMenu.classList.remove('d-n');
	} else {
		menu.classList.remove('active');
		optionMenu.classList.add('d-n');
		saveParams();
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
				video.src = sceneArr[videoCounter].topLeftUrl;
				playVideo();
			} else if (hiddenBtn.classList.contains('top-right')) {
				video.src = sceneArr[videoCounter].topRightUrl;
				playVideo();
			} else if (hiddenBtn.classList.contains('bottom-left')) {
				video.src = sceneArr[videoCounter].bottomLeftUrl;
				playVideo();
			} else if (hiddenBtn.classList.contains('bottom-right')) {
				video.src = sceneArr[videoCounter].bottomRightUrl;
				playVideo();
			} else if (hiddenBtn.classList.contains('center')) {
				video.src = sceneArr[videoCounter].centerUrl;
				playVideo();
			}
			videoCounter++;
		}
	}, false);
}

function playVideo() {
	playBtn.classList.add('d-n');
	video.play();
	playNextScene();
}

function playNextScene() {
	video.src = sceneArr[videoCounter].startUrl;
	video.play();
	video.addEventListener('ended', endedVideo);
}

function endedVideo() {
	playBtn.classList.remove('d-n');
	video.removeEventListener('ended', endedVideo);
}

/* video END*/





/* Scene */

class Scene {
	constructor({
		number = 0,
		startUrl = 'video/start1.mp4',
		startName = '',
		topLeftUrl = 'video/01.mp4',
		topLeftName = '',
		topRightUrl = 'video/02.mp4',
		topRightName = '',
		bottomLeftUrl = 'video/03.mp4',
		bottomLeftName = '',
		bottomRightUrl = 'video/04.mp4',
		bottomRightName = '',
		centerUrl = 'video/05.mp4',
		centerName = '',
	}) {
		this.number = number;
		this.startUrl = startUrl;
		this.startName = startName;
		this.topLeftUrl = topLeftUrl;
		this.topLeftName = topLeftName;
		this.topRightUrl = topRightUrl;
		this.topRightName = topRightName;
		this.bottomLeftUrl = bottomLeftUrl;
		this.bottomLeftName = bottomLeftName;
		this.bottomRightUrl = bottomRightUrl;
		this.bottomRightName = bottomRightName;
		this.centerUrl = centerUrl;
		this.centerName = centerName;
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


function autoCreateScene() {
	for (const scene of sceneArr) {
		//let counter = sceneCounter++;
		let code = `
	<div class="scene" data-scene-counter="${scene.number}">
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
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*" />
					<label for="file-${labelCounter}">${scene.startName ? scene.startName : 'Загрузить видео'}</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="1">
					<img src="images/menu/01.png">
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*"/>
					<label for="file-${labelCounter}">${scene.topLeftName ? scene.topLeftName : 'Загрузить видео'}</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="2">
					<img src="images/menu/02.png">
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*"/>
					<label for="file-${labelCounter}">${scene.topRightName ? scene.topRightName : 'Загрузить видео'}</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="3">
					<img src="images/menu/03.png">
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*"/>
					<label for="file-${labelCounter}">${scene.bottomLeftName ? scene.bottomLeftName : 'Загрузить видео'}</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="4">
					<img src="images/menu/04.png">
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*"/>
					<label for="file-${labelCounter}">${scene.bottomRightName ? scene.bottomRightName : 'Загрузить видео'}</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="5">
					<img src="images/menu/05.png">
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*"/>
					<label for="file-${labelCounter}">${scene.centerName ? scene.centerName : 'Загрузить видео'}</label>
					<div class="del-url">×</div>
				</div>
			</div>
			</div>
		`;

		optionMenu.insertAdjacentHTML('beforeend', code);
		inputs = document.querySelectorAll('.inputfile');
		startFileReader(inputs);
	}
	//createScene();
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
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*" />
					<label for="file-${labelCounter}">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="1">
					<img src="images/menu/01.png">
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*"/>
					<label for="file-${labelCounter}">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="2">
					<img src="images/menu/02.png">
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*"/>
					<label for="file-${labelCounter}">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="3">
					<img src="images/menu/03.png">
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*"/>
					<label for="file-${labelCounter}">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="4">
					<img src="images/menu/04.png">
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*"/>
					<label for="file-${labelCounter}">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
				<div class="item"  data-item="5">
					<img src="images/menu/05.png">
					<input type="file" name="file" id="file-${++labelCounter}" class="inputfile" accept="video/*"/>
					<label for="file-${labelCounter}">Загрузить видео</label>
					<div class="del-url">×</div>
				</div>
			</div>
			</div>
		`;

	optionMenu.insertAdjacentHTML('beforeend', code);
	sceneArr.push(new Scene({
		number: counter,
		startUrl: '',
		startName: '',
		topLeftUrl: '',
		topLeftName: '',
		topRightUrl: '',
		topRightName: '',
		bottomLeftUrl: '',
		bottomLeftName: '',
		bottomRightUrl: '',
		bottomRightName: '',
		centerUrl: '',
		centerName: '',
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

			reader.onloadend = (event) => {
				//console.log(reader.result);
				//src = event.target.result;
				src = reader.result;
				//src = Base64.decode(src);
				switch (itemData) {
					case '0':
						scene.startUrl = src;
						scene.startName = file.name;
						break;
					case '1':
						scene.topLeftUrl = src;
						scene.topLeftName = file.name;
						break;
					case '2':
						scene.topRightUrl = src;
						scene.topRightName = file.name;
						break;
					case '3':
						scene.bottomLeftUrl = src;
						scene.bottomLeftName = file.name;
						break;
					case '4':
						scene.bottomRightUrl = src;
						scene.bottomRightName = file.name;
						break;
					case '5':
						scene.centerUrl = src;
						scene.centerName = file.name;
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