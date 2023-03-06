import { WORDS } from "./word.js";

const NUMBER_OF_GUESSES = 6
let guessesLeft = NUMBER_OF_GUESSES
let nextLetter = 0
let roundAnswer = WORDS[Math.floor(Math.random() * 5757)]
let currentGuess = []


console.log(roundAnswer)

function makeBoard(){
    let board = document.getElementById('gameBoard')

    for(let i=0; i< NUMBER_OF_GUESSES; i++){
        let row = document.createElement('section')
        row.className = 'answerRow'

        for(let j = 0 ; j < 5; j++){
            let box = document.createElement('section')
            box.className = 'answerBox'
            row.appendChild(box)


        }
        board.appendChild(row)
    }
}

makeBoard()

//Adding eventlistener to keyboard press for the DOM
document.addEventListener('keyup', (e) => {

    if(guessesLeft === 0){
        return
    }

    let pressedKey = String(e.key)

    if(pressedKey === 'Backspace' && nextLetter !== 0){
        deleteLetter()
        return
    }

    if(pressedKey === 'Enter'){
        checkGuess()
        return
    }

    let validInput = pressedKey.match(/[a-z]/gi)

    // this checks if the pressed key is an alphabet

    if(!validInput || validInput.length> 1){
        return
    } else{
        insertLetter(pressedKey)
    }
})

function insertLetter (pressedKey){
    if(nextLetter === 5){
        return
    }

    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName('answerRow')[6 - guessesLeft]
    let box = row.children[nextLetter]
    box.textContent = pressedKey
    box.classList.add('filledBox')
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function deleteLetter(){
    let row = document.getElementsByClassName('answerRow')[6 - guessesLeft]
    let box = row.children[nextLetter - 1]
    box.textContent = ''
    box.classList.remove('filledBox')
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess(){
    let row = document.getElementsByClassName('answerRow')[6 - guessesLeft]
    let userAnswer = ''
    let rightAnswer = Array.from(roundAnswer)

    for(const val of currentGuess){
        userAnswer += val   
    }

    if(userAnswer.length != 5){
        console.log('not enough')
        return
    }

    if(!WORDS.includes(userAnswer)){
        alert('THIS WORD IS NOT FOUND ON OUR DATABASE')
        return
    }

    for(let i = 0; i < 5; i++){

        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]


        //to check the position of the letter in the guess and add some style
        let letterPosition = rightAnswer.indexOf(currentGuess[i])

        if(letterPosition === -1){
            letterColor = 'grey'
        }else{
            if(currentGuess[i]=== rightAnswer[i]){
                //if they are in same position shade green
                letterColor = 'green'
            } else{
                //not in same positionnsahde yellow
                letterColor = 'yellow'
            }


            
        }

        //setting a timer for box shading
        let delay = 250 * i
        setTimeout( ()=> {
            box.style.backgroundColor = letterColor
            shadeKeyboard(letter, letterColor)
        }, delay)
    }

    if(userAnswer === roundAnswer){
    alert("YOU WON!!! LET'S GO")
    alert("WILL YOU BE TWICE LUCKY?")
     guessesLeft = 0
        return
    }else{
        guessesLeft -=1
        currentGuess = []
        nextLetter = 0

        if(guessesLeft === 0){
            alert("YOU GOT GOT!!! GAME OVER")
            alert(`The right word was: "${roundAnswer}"`)
            alert('YOU MIGHT DO IT IN ONE TRY NEXT TIME')
        }

    }
}

//To shade the onscreen keyboard for user to know letters in the word

function shadeKeyboard(letter, color){
    for(const btn of document.getElementsByClassName('keyboard-button')){
        if(btn.textContent === letter){
            let oldColor = btn.style.backgroundColor
            if(oldColor === 'green'){
                return
            }
            if(oldColor === 'yellow' && color !== 'green'){
                return
            }

            btn.style.backgroundColor = color
            break
        }
    }
}

//To make Onscreen keyboard generate input

document.getElementById('onScreenKeyboard').addEventListener('click', (e)=> {
const target = e.target

if(!target.classList.contains('keyboard-button')){
    return
}
let key = target.textContent

if(key === 'Del'){
    key = 'Backspace'
}

document.dispatchEvent(new KeyboardEvent('keyup', {'key': key}))
})