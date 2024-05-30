const canvas = document.querySelector("#canvas")
const button = document.querySelector(".Button")
const context = canvas.getContext("2d")

const flyAudion = new Audio()
const scoreAudio = new Audio()
const gameOverAudio = new Audio()

flyAudion.src = "audio/fly.mp3"
scoreAudio.src = "audio/score.mp3"
gameOverAudio.src = "audio/game-over.mp3"

const bird = new Image()
const background = new Image()
const barrierTop = new Image()
const barrierBottom = new Image()
const land = new Image()

bird.src = "images/bird.png"
background.src = "images/background.png"
barrierTop.src = "images/barrierTop.png"
barrierBottom.src = "images/barrierBottom.png"
land.src = "images/land.png"

const gap = 90
const gravity = 1
let birdXPosition = 10
let birdYPosition =  200
let score = 0
const record = localStorage.getItem("Record")


function moveUp() {
    birdYPosition -= 35
    flyAudion.play()
}

function reloadPage() {
    location.reload()
}

document.addEventListener("keydown", moveUp)
document.addEventListener("click", reloadPage)

function gameOver() {
    if (!record) {
        localStorage.setItem("Record", `${score}`)
    }
    if (record < score) {
        localStorage.setItem("Record", `${score}`)
    }
    button.style.visibility="visible"
    gameOverAudio.play()
    clearInterval(timerId)
    document.removeEventListener("keydown", moveUp)
}

const barriers = []

const timerId = setInterval(() => {
    barriers.push({
        xBarrier: canvas.width,
        yBarrier: Math.floor(Math.random() * barrierTop.height) - barrierTop.height
    })
}, 1750)

function play() {
    let animationId =  requestAnimationFrame(play)
    context.drawImage(background, 0, 0)
    barriers.forEach((barrier) => {
        const {xBarrier, yBarrier} = barrier
        context.drawImage(barrierTop, xBarrier, yBarrier)
        context.drawImage(barrierBottom, xBarrier, barrierTop.height + yBarrier + gap)
        barrier.xBarrier--
        const gameOverCondition =
            birdXPosition + bird.width >= xBarrier &&
            birdXPosition <= xBarrier + barrierTop.width &&
            (birdYPosition <= yBarrier + barrierTop.height || birdYPosition + bird.height >= yBarrier + barrierTop.height + gap) ||
            birdYPosition + bird.height >= canvas.height - land.height

        if(gameOverCondition) {
            cancelAnimationFrame(animationId)
            gameOver(animationId)
        }

        if (xBarrier === 5) {
            score++
            scoreAudio.play()
        }
    })
    context.drawImage(land, 0, canvas.height - land.height)
    context.drawImage(bird, birdXPosition, birdYPosition)
    birdYPosition += gravity
    context.fillStyle = "black"
    context.font = "24px Verdana"
    context.fillText("Score: " + score, 10, canvas.height - 60)
    context.fillText("Record: " + record || 0, 10, canvas.height - 20)
}

window.onload = play
