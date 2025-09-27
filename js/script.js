const modalElement = document.querySelector('#modal')
const contentElement = document.querySelector('#content')
const backdropElement = document.querySelector('#backdrop')
const progress = document.querySelector('#progress')
const inputTitleElement = document.querySelector('#title')
const inputDescriptionElement = document.querySelector('#description')
const buttonElement = document.querySelector('.btn')

backdropElement.addEventListener('click', closeModal)
contentElement.addEventListener('click', openCard)

const technologies = [
    {title: 'HTML', description: 'HTML Text', type: 'html', done: true},
    {title: 'CSS', description: 'CSS Text', type: 'css', done: true},
    {title: 'JavaScript', description: 'JavaScript Text', type: 'js', done: false},
    {title: 'Git', description: 'Git Text', type: 'git', done: false},
    {title: 'React', description: 'React Text', type: 'react', done: false},
]


function openCard() {
    modalElement.classList.add('open')
}

function closeModal() {
    modalElement.classList.remove('open')
}

function init() {
    renderCards()
    renderProgress()
}

function renderCards() {
    if (technologies.length === 0) {
        contentElement.innerHTML = '<p>Технологий пока нет. Добавьте новую</p>'
    } else {
        let html = ''
        for (let i = 0; i < technologies.length; i++) {
            const tech = technologies[i]
            html += toCard(tech)
        contentElement.innerHTML = html
        }
        // contentElement.innerHTML = technologies.map(toCard).join('')
    }
}

function renderProgress() {
    const percent = computeProgressPercent()
    const progressTitle = progress.parentElement.previousElementSibling
    let progressText = progressTitle.querySelector('span')
    if (!progressText) {
        progressText = document.createElement('span')
        progressTitle.append(progressText)
    }
    progressText.textContent = ` ${percent}%`
    
    let background
    if (percent < 30) {
        background = '#E75A5A'
    } else if (percent > 30 && percent < 70) {
        background = '#F99415'
    } else {
        background = '#73BA3C'
    }
    progress.style.background = background
    progress.style.width = percent + '%'
    progress.textContent = percent ? percent + '%' : ''
    progress.style.textAlign = 'center'
    console.log(percent)
}

function computeProgressPercent() {
    if (technologies.length === 0) {
        return 0
    }
    let downCount = 0
    for (let i = 0; i < technologies.length; i++) {
        if (technologies[i].done) {
            downCount += 1
        }
    }
    return Math.round(100 * (downCount / technologies.length))
}

init()

function toCard(tech) {
    const doneClass = tech.done === true ? 'done' : ''
    return `
        <div class="card ${doneClass}">
            <h3>${tech.title}</h3>
        </div>
    ` 
}




buttonElement.addEventListener('click', function() {
    const inputtitleValue = inputTitleElement.value
    const inputDescriptionValue = inputDescriptionElement.value

    if (inputDescriptionValue.trim() === '' || inputtitleValue.trim() === '') {
        alert('не всё заполнено')
    } else {
        technologies.push({title: `${inputtitleValue}`, description: `${inputDescriptionValue}`, type: `${inputtitleValue}`, done: true})

    init()
    console.log(technologies)
    }

    
})












