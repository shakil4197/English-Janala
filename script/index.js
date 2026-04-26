const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then((response) => response.json())
        .then((datas) => displayArray(datas.data))
}

const displayArray = (data) => {
    const buttonContainer = document.getElementById('level-container');
    buttonContainer.innerHTML = "";

    data.forEach(element => {
        const button = document.createElement('div');
        button.innerHTML = `
        <button id="lesson-${element['level_no']}" onclick="loadLevelWords(${element['level_no']})" class="lesson-btn btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i> Lesson - ${element['level_no']}</button>
        `
        buttonContainer.appendChild(button)
    });
}

const loadLevelWords = (id) => {


    manageSpinner(true);

    const url = `https://openapi.programming-hero.com/api/level/${id}`;

    fetch(url)
        .then((res) => res.json())
        .then((datas) => {

            const buttons = document.querySelectorAll('.lesson-btn');
            buttons.forEach(button=>{
                button.classList.remove('active');
            })

            const getButtonId = document.getElementById(`lesson-${id}`);
            getButtonId.classList.add('active');

            setTimeout(() => {
                displayLevelWords(datas.data);
            }, 300);
        });
}

const displayLevelWords = (data) => {
    
    const wordContainer = document.getElementById('wordContainer')
    wordContainer.innerHTML = "";

    if (data.length == 0) {
        wordContainer.innerHTML = `
            <div class="text-center col-span-full space-y-3 font-bangla">
                <img src="assets/alert-error.png" placeholder="Alert Icon" class="mx-auto"/>
                <p class="text-sm font-medium text-gray-300">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <p class="text-3xl font-bold">নেক্সট Lesson এ যান</p>
            </div>
        `
        manageSpinner(false);
        return;
    }

    data.forEach(element => {
        const card = document.createElement('div');
        card.innerHTML = `
            <div class="bg-white text-center py-10 px-5 rounded-xl">
                <h2 class="text-3xl font-bold">${element.word ? element.word : "শব্দ পাওয়া যায় নি"}</h2>
                <p class="text-lg font-semibold my-4">Meaning / Pronounciation</p>
                <div class="text-3xl font-semibold">${element.meaning ? element.meaning : "শব্দ পাওয়া যায় নি"} / ${element.pronunciation ? element.pronunciation : "শব্দ পাওয়া যায় নি"}</div>
                <div class="mx-12 mt-10 flex justify-between">
                    <button onclick="loadWordsDetails(${element.id})" class="btn bg-[rgba(26,145,255,0.1)] hover:bg-[rgba(26,145,255,0.2)]"><i class="fa-solid fa-circle-info text-xl"></i></button>
                    <button onclick="pronounceWord(${element['word']})" class="btn bg-[rgba(26,145,255,0.1)] hover:bg-[rgba(26,145,255,0.2)]"><i class="fa-solid fa-volume-high text-xl"></i></button>
                </div>
            </div>
        `
        wordContainer.appendChild(card)
    });

    manageSpinner(false);
}

const loadWordsDetails = async (id)=>{
    // my_modal_5.showModal()
    const url = `https://openapi.programming-hero.com/api/word/${id}`;

    const res = await fetch(url);
    const details = await res.json();

    displayWordDetails(details.data);
}

const displayWordDetails = (word)=>{
    const detailsBox = document.getElementById('detailsContainer');
    detailsBox.innerHTML=`
        <div>
                    <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})</h2>
                </div>
                <div>
                    <h2 class="font-bold">Meaning</h2>
                    <p>${word.meaning}</p>
                </div>
                <div>
                    <h2 class="font-bold">Example</h2>
                    <p>${word.sentence}</p>
                </div>
                <div>
                    <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
                    <div>${createSynonymsData(word.synonyms)}</div>
                </div>
    `;

    document.getElementById('my_modal_5').showModal();

}

const createSynonymsData = (arr)=>{
    const data = arr.map((el)=>`<span class="btn bg-[#EEEDFF]">${el}</span>`);
    return data.join(" ");
}

const manageSpinner = (status)=>{
    if(status==true){
        document.getElementById('spinnerBar').classList.remove('hidden');
        document.getElementById('wordContainer').classList.add('hidden');
    }else{
        document.getElementById('spinnerBar').classList.add('hidden');
        document.getElementById('wordContainer').classList.remove('hidden');
    }
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);

  utterance.lang = "en-US";
  


  utterance.rate = 1;  
  utterance.pitch = 1; 

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}


loadLessons()

document.getElementById('btnSearch').addEventListener('click',()=>{
    manageSpinner(true);
    const input = document.getElementById('inputSearch');
    const searchValue = input.value.trim().toLowerCase();

    fetch('https://openapi.programming-hero.com/api/words/all')
    .then((response) => response.json())
    .then((datas) => {
        const allWords = datas.data;
        const filterWords = allWords.filter(word=>word.word.toLowerCase().includes(searchValue));
        setTimeout(()=>{
            displayLevelWords(filterWords);
        },300)
        
    })
})