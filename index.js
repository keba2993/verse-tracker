import bookAbbreviations from './abbreviations.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import {
	getDatabase,
	ref,
	push,
	onValue,
	remove,
	child,
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

const deleteVerse = (verse) => {
	console.log(dbRef);
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
	for (let i = 0; i < verses.length; i++) {
		listItems += `
      <li>
        <a target='_blank' href='${getVerseLink(verses[i])}'>
          ${verses[i]}
        </a>
        <button class='rmv-btn' id='${verses[i]}'>&#10006;</button>
      </li>
    `;
	}
	ulEl.innerHTML = listItems;
}

onValue(dbRef, (snapshot) => {
	if (snapshot.exists()) {
		const verses = Object.values(snapshot.val());
		render(verses);
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
	ulEl.innerHTML = '';
});

inputBtn.addEventListener('click', function () {
	push(dbRef, inputEl.value);
	inputEl.value = '';
});
