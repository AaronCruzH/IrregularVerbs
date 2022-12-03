let randomVerbIdx = 0, randomVerbTenseIdx = 0, rightAnswers = 0, attempts = 0, attempt = true;
let jVerbs;

const tenseCheckers = document.getElementsByClassName('tenseChecker');
console.log(tenseCheckers.length);
const answersInputs = document.querySelectorAll('#answersDiv input');
const answersLabels = document.querySelectorAll('#answersDiv label');

const generateInputs = () => {
    const randomVerbTenses = ['Present','Past','Past Participle'];
    randomVerbTenseIdx = Math.floor(Math.random() * 3); 
    document.getElementById('tense').textContent = `${randomVerbTenses[randomVerbTenseIdx]} Tense`;
    
    randomVerbIdx = Math.floor(Math.random() * jVerbs.length);
    document.getElementById('spanishMeaning').textContent = `(${jVerbs[randomVerbIdx].meaning})`;
    
    let i = 0;

    const answerOptions = ['a','b','c'];
    answersInputs.forEach(answerInput=>{
            answersLabels[i].setAttribute('for',`answer${answerOptions[i].toUpperCase()}`);
            answerInput.labels[0].removeAttribute('class');
            answerInput.labels[0].textContent = `${answerOptions[i]}: `;
            answerInput.checked = false;
            answerInput.parentElement.setAttribute('class','theDiv animateX');
            tenseCheckers[i].hidden = true;
            i++
        });i=0;


    let indexs = [0,1,2]
    const colors = ["tenseCheckerPresent", "tenseCheckerPast", "tenseCheckerPastParticiple"];
    const verbTenses = jVerbs[randomVerbIdx].verbTenses;
    console.log("---------asdf---------");
    verbTenses.forEach(verbTense=>{
        const randomInputIdx = Math.floor(Math.random() * indexs.length);
        const randomIdx = indexs[randomInputIdx]
        const randomInput = answersInputs[randomIdx];
        
        const randomTenseChecker = tenseCheckers[randomIdx];
        randomTenseChecker.textContent = randomVerbTenses[i];
        randomTenseChecker.setAttribute('class',`tenseChecker ${colors[i]}`);

        indexs.splice(randomInputIdx,1);
        if(verbTense.writing==verbTenses[randomVerbTenseIdx].writing)
        randomInput.setAttribute('value',randomVerbTenseIdx); else randomInput.setAttribute('value',i);

        randomInput.labels[0].setAttribute('value',`${verbTense.writing}`);
        randomInput.labels[0].textContent += `${verbTense.writing} ${verbTense.phonetics}`;
        randomInput.labels[0].removeAttribute('for');

        i++;
    }) 
    attempts++;
    attempt = true;
}

answerDivFunction = async (radioChecked, tenseChecker) => {
    answersInputs.forEach( (radio) => { radio.parentElement.className = 'theDiv animateX' })  
    radioChecked.parentElement.className = 'mydiv animate';
    radioChecked.checked = true
    
    const radioIdx = Array.from(answersInputs).indexOf(radioChecked)
    if(radioChecked.value==randomVerbTenseIdx) {
        answersLabels[radioIdx].setAttribute('class','rightAnswer');
        if(attempt==true){rightAnswers++;}
    } else answersLabels[radioIdx].setAttribute('class','wrongAnswer');
    attempt=false;

    function promiseZiraVoice() {
        return new Promise(
            function (resolve, reject) {
                let synth = window.speechSynthesis;
                setInterval(() => {
                    if (synth.getVoices().length !== 0) {
                        resolve(synth.getVoices()[2]);
                        clearInterval(this);
                    }
                }, 5);
            }
        )
    }
    const utterance = new SpeechSynthesisUtterance(answersLabels[radioIdx].getAttribute('value'));
    utterance.voice = await promiseZiraVoice();
    speechSynthesis.speak(utterance);

    tenseChecker.hidden = false;

    score();
}

const scoreViewer = document.getElementById('scoreButton');
const attemptsP = document.getElementById('attempts');
const hitsP = document.getElementById('hits');
const accuracyP = document.getElementById('accuracy');
score = function ()  {
    attemptsP.textContent = `Attemtps: ${attempts}`
    hitsP.textContent = `Right Answers: ${rightAnswers}`
    accuracyP.textContent = `Accuracy: ${((rightAnswers*100)/attempts).toFixed(2)}%`
    //alert(`Attemtps: ${attempts}\nRight Answers: ${rightAnswers}\nAccuracy: ${(rightAnswers*100)/attempts}%`)
}


function greeting (greetingDiv) {
    console.log(greetingDiv.parentElement);
    greetingDiv.parentElement.hidden = true;
    //greetingDiv.parentElement. = true;
    document.getElementById('mainDiv').hidden = false;
    generateInputs();
}

const xhttp = new XMLHttpRequest();
xhttp.open('GET','verbs.json');
xhttp.send();
xhttp.onreadystatechange = function() {
if (this.readyState==4 && this.status == 200) {
    jVerbs = JSON.parse(this.responseText);
    //generateInputs();
    //alert('•    Select the right verb tense.\n\n•    Press the "NEXT >>>" button to continue with other random tense and verb.\n\n•     Press the "SCORE" button to check your statistics.')
}}