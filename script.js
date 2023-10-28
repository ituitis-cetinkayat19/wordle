import { words } from "./words.js";

let curX = -1, curY = 0;
const words_arr = words.split(/[\s\t]+/).map(word => word.toUpperCase());
const randomWord = words_arr[Math.floor(Math.random() * words_arr.length)];
const rows = [...document.querySelectorAll(".row")];
const result = document.querySelector("#result");
const keys = document.querySelectorAll(".key");
let allowInput = true;
let cur_row = Array.from(rows[curY].querySelectorAll(".block"));

function setColor(e, color) {
    e.style.backgroundColor = color;
    e.style.borderColor = color;
    e.style.color = "white";
    keys.forEach(key => {
        if(key.textContent == e.textContent) {
            key.style.backgroundColor = color;
            key.style.color = "white";
        }

    });
    e.classList.remove("flip");
}

function fillBlock(e, value) {
    e.textContent = value.toUpperCase();
    e.classList.add("filled");
    setTimeout(() => e.classList.remove("filled"), 150);
}

function clearBlock(e) {
    e.textContent = "";
    e.classList.remove("filled");
}

function pressEnter() {
    if(curX == 4) {
        const container = {};

        for(let i = 0; i < randomWord.length; i++) {
            if(randomWord[i] in container)
                container[randomWord[i]]++;
            else
                container[randomWord[i]] = 1;
        }

        let guess = "";

        cur_row.forEach((block, i) => {
            guess += block.textContent;
            block.classList.add("flip");
            if(block.textContent == randomWord[i])
                setTimeout(() => setColor(block, "green"), 300 * (i+1));
            else if(block.textContent in container)
                setTimeout(() => setColor(block, "goldenrod"), 300 * (i+1));
            else
                setTimeout(() => setColor(block, "grey"), 300 * (i+1));
        });

        if(guess == randomWord) {
            result.textContent = "You did it! The answer was " + randomWord;
            allowInput = false;
        } else {
            curX = -1;
            curY++;
            if(curY < 6)
                cur_row = Array.from(rows[curY].querySelectorAll(".block"));
            else {
                result.textContent = "The answer was " + randomWord;
                allowInput = false;
            }
        }
    }
}

function pressBackSpace() {
    if(curX > -1) {
        clearBlock(cur_row[curX]);
        curX--;
    }
}

window.addEventListener("keydown", e => {
    if(allowInput) {
        if(e.key == "Backspace" && curX > -1)
            pressBackSpace();
        else if(e.key == "Enter")
            pressEnter();
        else if(e.keyCode >= 65 && e.keyCode <= 90 && curX < cur_row.length - 1) {
            curX++;
            fillBlock(cur_row[curX], e.key);
        }
    }
});

keys.forEach(key => {
    key.addEventListener("click", () => {
        if(!key.id) {
            if(allowInput && curX < cur_row.length - 1) {
                curX++;
                fillBlock(cur_row[curX], key.textContent);
            }
        } else if(key.id == "enter")
            pressEnter();
        else if(key.id == "backspace") 
            pressBackSpace();
    });
})