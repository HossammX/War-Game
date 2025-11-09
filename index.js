let deckId
let computerScore = 0
let playerScore = 0

const newDeckBtn = document.getElementById("new-deck")
const drawCardsBtn = document.getElementById("draw-cards")
const computerCardSlot = document.getElementById("computer-card-slot")
const playerCardSlot = document.getElementById("player-card-slot")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScoreEl = document.getElementById("computer-score")
const playerScoreEl = document.getElementById("player-score")

// Get new deck
newDeckBtn.addEventListener("click", async () => {
    const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
    const data = await res.json()
    deckId = data.deck_id
    remainingText.textContent = data.remaining
    header.textContent = "Game of War"
    drawCardsBtn.disabled = false
    drawCardsBtn.classList.remove("disabled")
    computerScore = 0
    playerScore = 0
    computerScoreEl.textContent = 0
    playerScoreEl.textContent = 0
})

// Draw cards
drawCardsBtn.addEventListener("click", async () => {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    const data = await res.json()
    const cards = data.cards

    computerCardSlot.innerHTML = `<img src="${cards[0].image}" class="card" alt="computer card">`
    playerCardSlot.innerHTML = `<img src="${cards[1].image}" class="card" alt="player card">`

    const winnerText = determineCardWinner(cards[0], cards[1])
    header.textContent = winnerText

    remainingText.textContent = data.remaining

    if (data.remaining === 0) {
        drawCardsBtn.disabled = true
        drawCardsBtn.classList.add("disabled")

        if (computerScore > playerScore) {
            header.textContent = "Computer Wins the Game!"
        } else if (playerScore > computerScore) {
            header.textContent = "You Win the Game!"
        } else {
            header.textContent = "It's a Draw!"
        }
    }
})

// Determine winner per hand
function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)

    const card1Img = computerCardSlot.querySelector("img")
    const card2Img = playerCardSlot.querySelector("img")
    card1Img.classList.remove("winner")
    card2Img.classList.remove("winner")

    if (card1ValueIndex > card2ValueIndex) {
        computerScore++
        computerScoreEl.textContent = computerScore
        card1Img.classList.add("winner")
        return "Computer wins this round!"
    } else if (card1ValueIndex < card2ValueIndex) {
        playerScore++
        playerScoreEl.textContent = playerScore
        card2Img.classList.add("winner")
        return "You win this round!"
    } else {
        return "War! It's a tie!"
    }
}
