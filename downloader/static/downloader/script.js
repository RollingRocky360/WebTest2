let container = document.querySelector(".results-choices-container");
let searchInput = document.querySelector(".searchField");
let searchResults = document.querySelector(".search-list-container");
let choices = document.querySelector(".choice-container");
let dFormats = document.querySelector('.download-formats');
let dButton = document.querySelector('.download');

container.removeChild(searchResults);
container.removeChild(choices.parentElement);
container.removeChild(dButton);

function deleteChoice(event) {
    let target;
    if (event.target.classList.contains('box'))
        target = event.target;
    else if (event.target.tagName === 'IMG')
        target = event.target.parentElement.parentElement;
    else
        target = event.target.parentElement
    choices.removeChild(target.parentElement);
    if (choices.childNodes.length === 1) {
        container.removeChild(choices.parentElement);
        container.removeChild(dButton);
    }
}

function moveToChosen(event) {
    searchInput.value = "";
    searchInput.focus();
    console.log(event.target);
    let target;
    if (event.target.classList.contains('box'))
        target = event.target;
    else if (event.target.tagName === 'IMG')
        target = event.target.parentElement.parentElement;
    else
        target = event.target.parentElement;
    let newChoice = document.createElement('div');

    newChoice.innerHTML = target.innerHTML;
    newChoice.classList.add("choice");
    newChoice.addEventListener('click', deleteChoice);
    newChoice.dataset.videoid = target.dataset.videoid;

    let newChoiceBox = document.createElement("div");
    newChoiceBox.classList.add("choice-box");
    newChoiceBox.appendChild(newChoice);

    if (choices.childNodes.length === 1) {
        container.appendChild(choices.parentElement);
        container.appendChild(dButton);
    }

    choices.appendChild(newChoiceBox);
    choices.scrollLeft = choices.scrollWidth;
    choices.addEventListener('wheel', (event) => {
        console.log(choices.scrollLeft);
        choices.scrollLeft += (event.deltaY * 0.1);
    });
}

function newBox(id, snippet) {
    let box = document.createElement("div");
    box.innerHTML = `
            <div class='img-container'>
              <img src=${snippet.thumbnails.default.url}>
            </div>
            <div class='title'>${snippet.title}</div>
            <div class='title authorTitle'> ${snippet.channelTitle} </div>
            `;
    box.classList.add("box");
    box.addEventListener("click", moveToChosen);
    box.dataset.videoid = id

    searchResults.appendChild(box);
}

searchInput.addEventListener("keypress", async (event) => {
    console.log(event.keyCode);
    if (event.keyCode === 13) {
        console.log('key pressed');
        while (searchResults.firstChild)
            searchResults.removeChild(searchResults.lastChild);

        let res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=AIzaSyDYf1qOlYWciGbQcjbK9IPmkwpn0B3PwG4&maxResults=6&part=snippet&q=${event.target.value}`
        );
        let r = await res.json();
        if (container.childNodes.length <= 10) {
            container.appendChild(searchResults);
        }
        console.log(r.items);
        for (let i = 0; i < 6; i++) {
            newBox(r.items[i].id.videoId, r.items[i].snippet);
        }
    }
});

dButton.addEventListener('click', (event) => {
    container.removeChild(searchInput.parentElement);
    container.removeChild(searchResults);
    container.removeChild(dButton);
    
    choicesContainer = choices.parentElement;
    choicesContainer.style.height = '80vh';
    choicesContainer.style.width = 'unset';
    choicesContainer.style.aspectRatio = '1 / 2.2';
    choicesContainer.style.boxSizing = 'border-box';
    choicesContainer.classList.add('vertical-choices-container');

    choices.style.flexWrap = 'wrap';
    choices.style.justifyContent = 'flex-start';
    choices.style.alignItems = 'flex-start';
    choices.style.width = '90%';
    choices.style.height = '90%';
    choices.style.padding = '10% 0';

    let choiceBoxes = document.querySelectorAll('.choice-box');
    for (let i = 0; i < choiceBoxes.length; i++) {
        let box = choiceBoxes[i];
        box.style.width = '90%';
        box.style.height = 'unset';
        box.style.aspectRatio = '16 / 12';
        box.firstChild.removeEventListener('click', deleteChoice);
    }

    document.querySelector('.download-formats').style.display = 'flex';
    idList = [];
    for (let i=1; i<choices.childNodes.length; i++) {
        idList.push(choices.childNodes[i].firstChild.dataset.videoid);
    }
    href = '/getVideo?q=' + idList.join('%20');

    let mp3Download = document.querySelector('#mp3');
    mp3Download.href = href + '&fmt=mp3';
    let mp4Download = document.querySelector('#mp4');
    mp4Download.href = href + '&fmt=mp4';

    container.style.flexDirection = 'row';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
});