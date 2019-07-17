const choice = document.querySelector('.app__choice');
const optList = document.querySelector('.app__options');
const optItem = document.querySelectorAll('.options-item');
const value = document.querySelector('.app__value');
const btn = document.querySelector('.app__btn');
choice.addEventListener('click', () => {
	optList.classList.toggle('app__options-active');
})

for (let i = 0; i < optItem.length; i++) {
	const element = optItem[i];
	element.addEventListener('click', () => {
		let gettedValue = element.getAttribute('data-choice-value');
		value.setAttribute('data-value', gettedValue);
		value.innerHTML = gettedValue;
	})
}

let filteredArray = [];

btn.addEventListener('click', () => {
	var myResult = document.querySelector('.result');
	while (myResult.firstChild) {
			myResult.removeChild(myResult.firstChild);
	}
	let filter = value.getAttribute('data-value');
	if (filter === ' ') return;	
	console.log(filter);
	filteredArray = [];
	let languages = null;
	fetch('https://frontend-test-api.alex93.now.sh/api/languages') 
		.then(function(response) { 
			response.json().then(function(data) {	
				languages = data.data;
				for (let i = 0; i < languages.length; i++) {
					const element = languages[i];
					// console.log(element.groups);				
					for (let k = 0; k < element.groups.length; k++) {
						const currElem = element.groups[k];
						if(currElem == filter && languages[i].logo != undefined) filteredArray.push(languages[i])						
					}	
				}
				console.log(filteredArray);
				console.log(filteredArray[0]);
				
				for (let i = 0; i < filteredArray.length; i++) {
					const sorted = filteredArray[i];
					console.log(sorted);
					let result = document.querySelector('.result');

					let resultItem = document.createElement('div');
					let resultLogo = document.createElement('div');
					let resultImg = document.createElement('img');
					let resultInf = document.createElement('div');
					let resultTitle = document.createElement('h2');
					let resultDesc = document.createElement('p');
					let resultProjects = document.createElement('p');
					let resultLink = document.createElement('a');

					resultItem.classList.add('result__item');
					resultLogo.classList.add('result__logo');
					resultInf.classList.add('result__information');
					resultTitle.classList.add('result__title');
					resultDesc.classList.add('result__description');
					resultProjects.classList.add('result__projects');
					resultLink.classList.add('result__link');

					result.appendChild(resultItem);
					document.querySelectorAll('.result__item')[i].appendChild(resultLogo);
					document.querySelectorAll('.result__logo')[i].appendChild(resultImg);
					document.querySelectorAll('.result__logo > img')[i].setAttribute('src', filteredArray[i].logo);		
					
					resultItem.appendChild(resultInf);
					
					document.querySelectorAll('.result__information')[i].appendChild(resultTitle);
					document.querySelectorAll('.result__information > .result__title')[i].innerHTML = filteredArray[i].name;
					console.log(filteredArray[i].name);
					document.querySelectorAll('.result__information')[i].appendChild(resultDesc);
					document.querySelectorAll('.result__description')[i].innerHTML = filteredArray[i].year;
					document.querySelectorAll('.result__information')[i].appendChild(resultProjects);
					document.querySelectorAll('.result__projects')[i].innerHTML = filteredArray[i].projectsCount;
					document.querySelectorAll('.result__information')[i].appendChild(resultLink);
					document.querySelectorAll('.result__information > .result__link')[i].setAttribute('href', filteredArray[i].docs);	
					document.querySelectorAll('.result__link')[i].innerHTML = 'Документация';
				}
			}); 
		})	
})

