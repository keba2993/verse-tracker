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

const getVerseLink = (v) => {
	const [book, parts] = v.split(' ');
	const [chapter, verse] = parts.split(':');

	const shortBook = Object.keys(bookAbbreviations).find(
		(key) => bookAbbreviations[key] === book
	);

	const blbUrl = `https://www.blueletterbible.org/niv/${shortBook}/${chapter}/${verse}/`;

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

deleteBtn.addEventListener('dblclick', function () {
	remove(dbRef);
	ulEl.innerHTML = '';
});

inputBtn.addEventListener('click', function () {
	push(dbRef, inputEl.value);
	inputEl.value = '';
});
