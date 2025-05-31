let input = document.getElementById("input");
const btn = document.getElementById("btn");
const charsList = document.getElementById("charsList");
const heartsList = document.getElementById("heartsList");
const resultDisplay = document.getElementById("result");
const warningDisplay = document.getElementById("warning");

let gameOver = false;
let generated = false;
let clicked = false;
let word = [];

document.addEventListener("DOMContentLoaded", () => {
  [btn, input].forEach((tag, index) => {
    if (index === 0) {
      tag.addEventListener("click", gameSource);
    } else if (index === 1) {
      tag.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          gameSource();
        }
      });
    }
  });
});

function gameSource() {
  if (gameOver) return;
  input = document.getElementById("input"); // get the latest input state
  // check if input is empty
  // while warning message is displayed, button have no effect
  if (input.value === "" && !clicked) {
    clicked = true;
    if (!generated) {
      warningDisplay.textContent = `Please set a valid word for the game!`;
    } else {
      warningDisplay.textContent = `Please guess a valid letter!`;
    }
    removeWarningDelay(warningDisplay);
    return;
  }
  if (!clicked) {
    if (!generated) {
      generateWord(input.value);
      generateHealth(6);
      generated = true;
      input.value = "";
      // use the same input for guessing letters, just update the aspect
      changeInputBehavior();
    } else {
      // check the letter after the word was setted
      evaluateGuessedLetter(input.value, word);
      input.value = "";
    }
  }
}

function generateWord(inputValue) {
  word = inputValue.split("");
  // i know the length of the input value so i can create unknown empty spaces
  for (let i = 0; i < inputValue.length; ++i) {
    const letter = document.createElement("li");
    letter.classList = "letter";
    letter.textContent = `_`;
    charsList.appendChild(letter);
  }
}

function generateHealth(health) {
  do {
    const heart = document.createElement("li");
    heart.classList = "heart";
    heart.textContent = `♥️`;
    heartsList.appendChild(heart);
    health--;
  } while (health > 0);
}

function changeInputBehavior() {
  input.setAttribute("maxlength", 1);
  input.setAttribute("placeholder", "Guess a letter");
  btn.textContent = "Guess";
}

function evaluateGuessedLetter(inputLetter, word) {
  if (word.includes(inputLetter)) {
    updateUnknownSpaces(inputLetter); // update interface
  } else {
    substractHeart(); // update interface
  }
}

function updateUnknownSpaces(guessedLetter) {
  const unknownLetters = document.querySelectorAll("#charsList .letter");
  word.forEach((letter, index) => {
    if (letter === guessedLetter) {
      unknownLetters[index].textContent = guessedLetter;
    }
  });
  checkGameStatus();
}

function substractHeart() {
  const heart = document.querySelector("#heartsList .heart:last-child");
  heart.classList.add("kill-anim");
  setTimeout(() => {
    heart.remove();
    checkGameStatus(); // check the game after removed the last heart (fixed bug)
  }, 900);
}

function checkGameStatus() {
  const unknownLetters = document.querySelectorAll("#charsList .letter");
  let availableHearts = document.querySelectorAll("#heartsList .heart");

  let emptyLetters = Array.from(unknownLetters).filter(
    (letter) => letter.textContent === "_"
  );

  if (emptyLetters.length === 0 && availableHearts.length !== 0) {
    gameOver = true;
    resultDisplay.innerHTML = `Good Job <big>🥳</big> The word was <mark>${word.join(
      ""
    )}</mark>`;
  } else if (emptyLetters.length !== 0 && availableHearts.length === 0) {
    gameOver = true;
    resultDisplay.innerHTML = `The word was <mark>${word.join(
      ""
    )}</mark> 😞 Better luck next time.`;
  }
  if (gameOver) {
    input.setAttribute("disabled", true);
    input.setAttribute("placeholder", "Refresh the page");
    btn.disabled = true;
  }
}

function removeWarningDelay(message) {
  setTimeout(() => {
    clicked = false;
    message.textContent = "";
  }, 2500);
}
