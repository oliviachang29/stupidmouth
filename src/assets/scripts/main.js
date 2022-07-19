// Focus Visible Polyfill
import 'focus-visible'

// Internal Modules
import './modules/nav'

const letters = require('./letters.json')
const NO_DEFINITION_FOUND = 'No definition found for this word.'

window.onload = () => {
    const firstLetters = letters.firstLetters
    const lastLetters = letters.lastLetters

    let players = []

    const getRandomLetter = (letterArray) => {
        return letterArray[Math.floor(Math.random() * letterArray.length)]
    }

    const updatePlayerList = () => {
        $('#player-list').empty()
        players.forEach((player, index) => {
            const playerId = index + 1
            $('#player-list').append(
                `<div class="col-md-4 player-container"><p>${player.points}</p><span>player ${playerId}</span></div>`
            )
        })
    }

    const addPlayer = () => {
        const playerId = players.length + 1
        players.push({ name: `Player ${playerId}`, points: 0, letters: [] })

        updatePlayerList()

        $('#player-buttons').append(
            `<div class="col-md-4"><button type="button" class="btn btn-primary" id="player${playerId}-button">player ${playerId}</button></div>`
        )

        $(`#player${playerId}-button`).click(() => {
            players[playerId - 1].points += 1
            updatePlayerList()
            getLetters()
        })
    }

    const getLetters = () => {
        const currentFirstLetter = getRandomLetter(firstLetters)
        const currentLastLetter = getRandomLetter(lastLetters)
        $('.letter').fadeOut(500, () => {
            $('#first-letter').text(currentFirstLetter)
            $('#last-letter').text(currentLastLetter)
            $('.letter').fadeIn(500)
        })
    }

    $('#reset').click(() => {
        players = []
        $('#player-list').empty()
        $('#player-buttons').empty()
    })

    $('#add-player').click(addPlayer)
    $('#reload').click(getLetters)
    $('#check-word-submit').submit((event) => {
        event.preventDefault()
        const checkWord = $('#check-word').val()
        $('#word-definition').fadeOut(500, () => {
            $.ajax({
                type: 'GET',
                url: `https://api.dictionaryapi.dev/api/v2/entries/en/${checkWord}`,
                cache: false,
                beforeSend: () => {
                    $('#word-definition').text('')
                },
                success: (res) => {
                    console.log(JSON.stringify(res))
                    res.forEach((etymology) => {
                        etymology.meanings.forEach((meaning) => {
                            let htmlToAppend = `<p class="part-of-speech">${meaning.partOfSpeech}</p>`
                            htmlToAppend += `<ol class="definition-list">`
                            meaning.definitions.forEach((def) => {
                                htmlToAppend += `<li><p>${def.definition}</p></li>`
                            })
                            htmlToAppend += `</ol>`
                            $('#word-definition').append(htmlToAppend)
                        })
                    })
                },
                error: (err) => {
                    $('#word-definition').append(
                        `<p class="no-definition-found">${NO_DEFINITION_FOUND}</p>`
                    )
                },
                complete: () => {
                    $('#word-definition').fadeIn()
                }
            })
        })
    })

    getLetters()
}
