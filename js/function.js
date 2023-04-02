const [HIGH_SCORES, HOVERED, HIDDEN_CARD, MAX_TOP_SCORES, MAX, MILLISECOND, LOSER] = ["highScores", 'opacity-75', "card", 3, 16, 1000,
"You'r such a loser ,your brain is not sharp enough for this game"];
let highScores = [];
//store item in local storage
const saveItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
// Retrieve the object from storage by its key
const getItem = (key) => {
    return JSON.parse(localStorage.getItem(key));
};
const isSameName = (nameA, nameB) => { return nameA === nameB }
/***
 * this function checks if the player is already exist and update its score,if not :insert it to leaderBoard
 * then sort the highscores array then will slice and take the highest 3 players (by scores) then will save it to local storage
 * @param player: {name: (String), score: (int)}
 * @returns {number}: index of player in leaderboard(top 3) array
 */
const updateData = (player) => {
    const existPlayer = highScores.find((data) => isSameName(data.name,  player.name));
    if(existPlayer) {
        if (existPlayer.score < player.score)
            existPlayer.score = player.score
    }
    else {highScores.push({name: player.name, score: player.score})}
    highScores.sort((a,b) => b.score - a.score);
    highScores = highScores.slice(0, MAX_TOP_SCORES)
    // save all players data in local storage
    saveItem(HIGH_SCORES, highScores);
    displayHighScoreList(buildTable(highScores));
}
function buildTable(leaderboard) {
    let table = "";
    for (const [index, row] of leaderboard.entries()){
        table += `<tr class="col"><td>${index + 1}</td>`;
        for (const value of Object.values(row)){
            table += `<td>${value}</td>`
        }
        table += "</tr>";
    }
    return table;
}
/***
 * Shuffle the array by the Fisher–Yates algorithm
 * @param arr: array we want to run the algorithm
 */
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        //swap elements array[i] and array[j]
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
const imgName2src = (imgName) => {return `images/${imgName}.jpg`}
const randPairsOfNumbers = (numOfPairs) => {
    let randArr = []
    let num = 0;
    //we randomly choose the pics for the pairs of cards
    for(let i=0; i < numOfPairs; i++) {
        do {
            num = Math.floor(Math.random() * MAX);
        }while(randArr.indexOf(num) >= 0);//rand new number while already exist
        randArr.push(num);
    }
    randArr.push(...randArr)
    return (randArr);// duplicate the array for creating pairs for same pics
}
//==========================================================================
//calculating the scores of player
const calculateScore = (numOfCards, steps, delay) => {return ((5 * numOfCards) + (100/ steps) + (500 / delay)).toFixed(2);}
//returning the message of the player in the winning list
const getStatus = (rank, score) => {return `<p>Score: ${score}. ${(1 < rank < 3) ? `You are ranked ${rank} out of ${highScores.length}` : `${LOSER}`};</p>`}
// Show an element
const show = (elem)  => {  elem.classList.remove( 'd-none');};
// Hide an element
const hide = (elem) => { elem.classList.add('d-none');};
// Display the play button
const displayBtn = (button) => button.setAttribute("disabled", "");
// Show the play button
const visibiledBtn = (button) => button.removeAttribute("disabled");
const isEven = (col, row) => { return ((col*row) % 2) === 0;};
const displayHighScoreList = (html) => { document.getElementById("high-scores-data").innerHTML = html; }

document.addEventListener("DOMContentLoaded", () => {
    highScores = getItem(HIGH_SCORES) ?? [];

    const [cardsGrid, playBtn, nameElem, colsElem, colsErrMsg, rowsElem, rowsErrMsg, leaderboardTable, modalTable,
        formPage, gameWindow, gameOverWindow, stepsElem] =
        [   document.getElementById("cards-grid"),
            document.getElementById("playBtn"),
            document.getElementById("fname"),
            document.getElementById("numOfCols"),
            document.getElementById("colsErrorMessage"),
            document.getElementById("numOfRows"),
            document.getElementById("rowsErrorMessage"),
            document.getElementById("high-scores-table"),
            document.getElementById("high-scores-modal-table"),
            document.getElementById('forms-page'),
            document.getElementById('game'),
            document.getElementById('game-over'),
            document.getElementById("steps")
        ];
    const displaySteps = (html) => { stepsElem.innerHTML = html; }
    class game{
        constructor(name, board, delay) {
            this.cards = [];
            this.pairs = []
            this.steps = 0;
            this.name = name;
            this.numOfCards = board.cols * board.rows;
            this.delay = delay * MILLISECOND;// seconds in milliseconds
        }
        newCard(id) {
            const imgElem = document.createElement("img");
            imgElem.src = imgName2src(HIDDEN_CARD);
            imgElem.classList.add("img-thumbnail");
            imgElem.id = id;
            imgElem.addEventListener('click', () => { this.clickHandler(imgElem) });
            //set mouse hover event to image
            imgElem.addEventListener("mouseover", (event) => {imgElem.classList.add(HOVERED)});
            imgElem.addEventListener("mouseout", (event) => {imgElem.classList.remove(HOVERED)});
            return imgElem;
        }
        isSameCard = (cardA, card_B) => {return cardA.src === card_B.src};
        clickHandler(image) {
            if(!image.classList.contains('flipped') && this.pairs.length < 2) {
                displaySteps((++this.steps).toString());
                this.flip(image);//flip image
                this.pairs.push(image);
                if(this.pairs.length === 2) {
                    setTimeout(() => {
                        this.isSameCard(this.pairs[0], this.pairs[1]) ?
                            (this.countPairs++) : (this.pairs.forEach((img) => this.unFlip(img)));// unflip the pairs
                        this.pairs = []
                        this.checkIfGameOver();
                    } ,this.delay);
                }
            }
        }
        initCards(board) {
            this.cards = randPairsOfNumbers(this.numOfCards / 2);
            shuffle(this.cards);
            let index = 0;
            for(let row = 0; row < board.rows; ++row){
                let newRow = document.createElement("tr");
                for(let col = 0; col < board.cols; ++col) {
                    let card = this.newCard(index++);
                    let colElem = document.createElement("td");
                    colElem.appendChild(card);
                    newRow.appendChild(colElem);
                }
                cardsGrid.appendChild(newRow);
            }
        }
        unFlip = (img) => {
            img.classList.remove('flipped')
            img.src = imgName2src(HIDDEN_CARD);
        }
        flip = (img) => {
            img.classList.add('flipped');
            img.src = imgName2src(this.cards[img.id]);
        }
        start(board) {
            cardsGrid.innerHTML = "";
            this.countPairs = this.steps = 0;
            displaySteps(this.steps);
            this.initCards(board); // cards initialization for game board
            show(gameWindow);
        }
        checkIfGameOver() {
            if(this.countPairs < this.numOfCards / 2)
                return
            hide(gameWindow);
            const player = {name: this.name, score: calculateScore(this.numOfCards, this.steps, this.delay)}
            updateData(player);
            const rank = highScores.findIndex((data) => isSameName(data.name, player.name)) + 1;
            const htmlScoreMsg = getStatus(rank, player.score);
            document.getElementById('status').innerHTML = htmlScoreMsg;
            show(document.getElementById('game-over'));
            document.getElementById("num-of-cards").innerHTML = (this.numOfCards).toString();
        }
    }

    // selected values of rows and cols for cards grid
    let board = {
        cols: parseInt(rowsElem.options[rowsElem.selectedIndex].value),
        rows: parseInt(colsElem.options[colsElem.selectedIndex].value),
    };
    // each row and col field with its error message element
    const mySelections = [
        { selectElem: rowsElem, errorMsgElem:  rowsErrMsg},
        { selectElem: colsElem, errorMsgElem:  colsErrMsg}
    ];
    mySelections.forEach((select) => {
        select.selectElem.addEventListener('change', () => {
            [board.rows, board.cols] = [parseInt(rowsElem.options[rowsElem.selectedIndex].value),
                                        parseInt(colsElem.options[colsElem.selectedIndex].value)]
            let myErrMsg = select.errorMsgElem;
            if(isEven(board.cols, board.rows)) {
                visibiledBtn(playBtn);
                hide(mySelections[0].errorMsgElem);
                hide(mySelections[1].errorMsgElem);
            }
            else {
                displayBtn(playBtn);
                show(myErrMsg);
            }
        })
    })
    document.getElementById("highScoreBtn").addEventListener('click', (event) => {
        if(highScores) { //show the table if not empty
            hide(document.getElementById('high-scores-modal-empty-msg'))
            displayHighScoreList(buildTable(highScores));
            //link leaderboard table to game over table
            modalTable.appendChild(leaderboardTable);
            show(modalTable);
        }
    })
    playBtn.addEventListener("click", (event) => {
        event.preventDefault();
        // we validate the player name by html validation(pattern)
        if (nameElem.checkValidity()) {
            const [name, delay] = [nameElem.value.trim().toLowerCase(), parseFloat(document.getElementById("delay").value).toFixed(2)];
            hide(formPage);
            show(cardsGrid);
            // start the game
            new game(name, board, delay).start(board);
        }
        else
            nameElem.reportValidity();// show the invalid message
    })
    document.getElementById("abandonBtn").addEventListener('click', (event) => {
        hide(gameWindow);
        show(formPage);
    })
    document.getElementById('ok').addEventListener('click', (event) => {
        hide(gameOverWindow);
        show(formPage);
    })
})