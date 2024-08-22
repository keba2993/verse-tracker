import bookAbbreviations from './abbreviations.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import {
	getDatabase,
	ref,
	push,
	onValue,
	remove,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';

// Your web app's Firebase configuration
const firebaseConfig = {
	databaseURL: 'https://verse-tracker-app-default-rtdb.firebaseio.com/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, 'verses');

const inputEl = document.getElementById('input-el');
const inputBtn = document.getElementById('input-btn');
const ulEl = document.getElementById('ul-el');
const deleteBtn = document.getElementById('delete-btn');

const deleteVerse = (verseKey) => {
	const verseRef = ref(db, `verses/${verseKey}`);
	remove(verseRef)
		.then(() => {
			console.log(`Verse with key ${verseKey} deleted successfully.`);
		})
		.catch((error) => {
			console.error(`Failed to delete verse with key ${verseKey}:`, error);
		});
};

const getVerseLink = (v) => {
	const [rest, verses] = v.split(':');

	const restArr = rest.split(' ');
	const chapter = restArr[restArr.length - 1];
	const book = restArr.slice(0, -1).join('');

	let shortBook = Object.keys(bookAbbreviations).find(
		(key) => bookAbbreviations[key] === book.toLowerCase()
	);

	if (!shortBook) {
		shortBook = book.substr(0, 3);
	}

	const blbUrl = `https://www.blueletterbible.org/niv/${shortBook}/${chapter}/${verses}/`;

	return blbUrl;
};

function render(verses) {
	let listItems = '';
	for (let key in verses) {
		listItems += `
      <li>
        <a target='_blank' href='${getVerseLink(verses[key])}'>
          ${verses[key]}
        </a>
        <button class='rmv-btn' id='${key}'>&#10006;</button>
      </li>
    `;
	}
	ulEl.innerHTML = listItems;
}

onValue(dbRef, (snapshot) => {
	if (snapshot.exists()) {
		render(snapshot.val());
	} else {
		ulEl.innerHTML = '';
	}
});

document.addEventListener('click', (e) => {
	const target = e.target.closest('.rmv-btn');

	if (target) {
		deleteVerse(target.getAttribute('id'));
	}
});

deleteBtn.addEventListener('dblclick', function () {
	remove(dbRef);
});

inputBtn.addEventListener('click', function () {
	push(dbRef, inputEl.value);
	inputEl.value = '';
});
