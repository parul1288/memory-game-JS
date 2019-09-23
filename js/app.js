/*
 * Create a list that holds all of your cards
 */

const cardDeck = document.getElementsByClassName("deck")[0];
const allCards = document.querySelectorAll('.card');
const allCardsArray = Array.from(allCards);
const startingTime = performance.now();
set_timer();

displayCards(allCardsArray);
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCards(allCardsArray) {
    var newArray = shuffle(allCardsArray);
    cardDeck.innerHTML = "";
    for (var i=0; i < allCards.length; i++) {
        var listElem = document.createElement("LI");
        listElem.className = "card";
        listElem.innerHTML = newArray[i].innerHTML;
        cardDeck.appendChild(listElem);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Restart button
const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', restart);

function restart() {
    //Reset timer
    stop_timer();
    totalSeconds = 0;
    set_timer();

    //Reset move counter
    moveCtr = 0;
    document.querySelector('.moves').innerText = moveCtr + " Moves";
    displayCards(allCardsArray);

    //Reset star rating
    updateStarRating(3);
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//Add event listener to click of card
cardDeck.addEventListener('click', respondToClick);
function respondToClick(event) {
    const listItem = event.target;
    showSymbol(listItem);
    addToList(listItem);
}

// https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
function pad(val) {
  valString = val + "";
  if(valString.length < 2) {
     return "0" + valString;
     } else {
     return valString;
     }
}

totalSeconds = 0;
function setTime(minutesLabel, secondsLabel) {
    totalSeconds++;
    secondsLabel.innerHTML = pad(totalSeconds%60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
    }

function set_timer() {
    minutesLabel = document.getElementById("minutes");
    secondsLabel = document.getElementById("seconds");
    my_int = setInterval(function() { setTime(minutesLabel, secondsLabel)}, 1000);
}

function stop_timer() {
  clearInterval(my_int);
}

function showSymbol(listItem) {
    listItem.className += " show";
}

// Add card to list of open cards
function addToList(listItem) {
    var openCardItem = document.querySelector('.open');
    var itemClass = listItem.children[0].className;

    // If there is a card already opened
    if (openCardItem) {
        const openCardClass = openCardItem.children[0].className;
        if (openCardClass == itemClass) {
            lockCards(listItem, openCardItem);
        } else {
            removeCardFromList(listItem, openCardItem);
        }

        incrementMoveCtr();
        checkMatches();
    } else {
        // If there is no open card
        listItem.className += " open";
    }
}

//MArk cards as matched
function lockCards(card1, card2) {
    card1.className = card2.className = "card match";
}

//Remove Card if not matched
function removeCardFromList(card1, card2) {
    setTimeout(function() {
        card1.className = card2.className = "card";
    }, 750);
    card1.style.animation = card2.style.animation = "shake 0.5s 1";
}

//Move Counter
moveCtr = 0;
function incrementMoveCtr() {
    var moveSpan = document.querySelector('.moves');
    moveCtr++;
    moveSpan.innerText = moveCtr + " Moves";
    if (moveCtr > 10 && moveCtr < 20)  {
        updateStarRating(1);
    } else if (moveCtr >= 20) {
        updateStarRating(2);
    }
}

// Star Rating
function updateStarRating(num) {
    if (num != 3) {
        var elem = document.querySelector('#star' + num);
        elem.style.display = 'none';
    } else {
        var star1 = document.querySelector('#star1');
        var star2 = document.querySelector('#star2');
        star1.removeAttribute('style');
        star2.removeAttribute('style');
    }
}

// Congratulations PopUp
function checkMatches() {
    var noOfMatches = document.querySelectorAll('.match');
    var cancelButton = document.getElementById('cancel');
    var playButton = document.getElementById('play');
    var dialog = document.getElementById('finishDialog');
    var scoreLabel = document.getElementById('score');
    var timeLabel = document.getElementById('time');

    // If all cards are matched
    if (noOfMatches.length == 16) {
        const endingTime = performance.now();
        scoreLabel.innerText = "Score: " + moveCtr;
        stop_timer();
        timeLabel.innerText = "Time taken: " + Math.floor((endingTime - startingTime)/1000)  + " seconds";
        dialog.showModal();
    }

    // Form cancel button closes the dialog box
    cancelButton.addEventListener('click', function() {
        dialog.close();
    });

    // Form play again button resets the page a nd closes the dialog box
    playButton.addEventListener('click', function() {
        dialog.close();
        restart();
    });
}
