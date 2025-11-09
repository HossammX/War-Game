let deckId

// ✅ Global scores
let computerScore = 0
let playerScore = 0

document.getElementById("new-deck").addEventListener("click", handleClick)
document.getElementById("draw-cards").addEventListener("click", drawCards)

function handleClick() {
  fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    .then(res => res.json())
    .then(data => {
      console.log("New deck created:", data)
      deckId = data.deck_id

      document.getElementById("remaining").textContent = `Remaining cards: ${data.remaining}`

      // Reset game state
      document.getElementById("winner").textContent = ""
      document.getElementById("top-card").innerHTML = ""
      document.getElementById("bottom-card").innerHTML = ""
      document.getElementById("top-card").classList.remove("winner", "tie")
      document.getElementById("bottom-card").classList.remove("winner", "tie")

      // Reset scores
      computerScore = 0
      playerScore = 0
      updateScores()

      // Reset game title
      document.getElementById("game-title").textContent = "Game of War"

      // Re-enable draw button
      const drawBtn = document.getElementById("draw-cards")
      drawBtn.disabled = false
      drawBtn.classList.remove("disabled")
    })
}

function drawCards() {
  fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    .then(res => res.json())
    .then(data => {
      console.log("Cards drawn:", data.cards)
      console.log("Remaining in deck:", data.remaining)

      const card1 = data.cards[0]
      const card2 = data.cards[1]

      const topCard = document.getElementById("top-card")
      const bottomCard = document.getElementById("bottom-card")

      topCard.innerHTML = `<img src=${card1.image} alt="card">`
      bottomCard.innerHTML = `<img src=${card2.image} alt="card">`

      // Clear old effects
      topCard.classList.remove("winner", "tie")
      bottomCard.classList.remove("winner", "tie")

      // Update remaining
      document.getElementById("remaining").textContent = `Remaining cards: ${data.remaining}`

      // Winner logic
      const winnerText = determineWinner(card1, card2, topCard, bottomCard)
      console.log("Round result:", winnerText)
      document.getElementById("winner").textContent = winnerText

      // Disable button if no cards left & show final winner
      if (data.remaining === 0) {
        const drawBtn = document.getElementById("draw-cards")
        drawBtn.disabled = true
        drawBtn.classList.add("disabled")
        displayFinalWinner()
      }
    })
}

function determineWinner(card1, card2, topCard, bottomCard) {
  const valueOptions = ["2","3","4","5","6","7","8","9","10","JACK","QUEEN","KING","ACE"]

  const card1ValueIndex = valueOptions.indexOf(card1.value)
  const card2ValueIndex = valueOptions.indexOf(card2.value)

  if (card1ValueIndex > card2ValueIndex) {
    topCard.classList.add("winner")
    computerScore++
    updateScores()
    return "Computer Wins!"
  } else if (card1ValueIndex < card2ValueIndex) {
    bottomCard.classList.add("winner")
    playerScore++
    updateScores()
    return "You Win!"
  } else {
    topCard.classList.add("tie")
    bottomCard.classList.add("tie")
    return "War!"
  }
}

function updateScores() {
  document.getElementById("computer-score").textContent = `Computer Score: ${computerScore}`
  document.getElementById("player-score").textContent = `Your Score: ${playerScore}`
}

function displayFinalWinner() {
  let finalMessage = ""
  if (computerScore > playerScore) {
    finalMessage = "Final Winner: Computer 🖥️"
  } else if (playerScore > computerScore) {
    finalMessage = "Final Winner: You 🎉"
  } else {
    finalMessage = "Final Result: It's a Tie 🤝"
  }

  document.getElementById("game-title").textContent = finalMessage
}
