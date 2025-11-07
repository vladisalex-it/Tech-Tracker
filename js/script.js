const APP_TITLE = document.title
const LS_KEY = 'MY_TECHS'

const modalElement = document.querySelector('#modal')
const contentElement = document.querySelector('#content')
const backdropElement = document.querySelector('#backdrop')
const progress = document.querySelector('#progress')
const formElement = document.querySelector('#form')
const deleteCardBtnElement = document.querySelector('#deleteCardButton')

formElement.addEventListener('submit', createTech)
contentElement.addEventListener('click', openCard)
backdropElement.addEventListener('click', closeModal)
modalElement.addEventListener('change', toggleTech)


const javaScriptText = `JavaScript (JS) — интерпретируемый язык программирования высокого уровня, который в основном используется для создания интерактивных веб-страниц и веб-приложений. Часто в текстах и обучающих материалах название языка сокращают до JS. otus.ru blog.skillfactory.ru digitalocean.ru Простыми словами, JavaScript — язык скриптов или сценариев, который выполняется при загрузке веб-страницы. Скрипты можно прописать внутри кода страницы или подключить к HTML отдельным файлом.`

const reactText = `React (иногда React.js или ReactJS) — JavaScript-библиотека с открытым исходным кодом для разработки пользовательских интерфейсов. Разработана Facebook, поддерживается сообществом разработчиков. Основная идея: создавать небольшие, независимые компоненты, которые затем объединяются для построения более сложных интерфейсов. Каждый компонент — это законченная часть веб-приложения, которая может быть повторно использована в других частях приложения или в других проектах.`

const nodeJsText = `Node или Node.js - программная платформа, основанная на движке V8 (компилирующем JavaScript в машинный код), превращающая JavaScript из узкоспециализированного языка в язык общего назначения. Node.js добавляет возможность JavaScript взаимодействовать с устройствами ввода-вывода через свой API, написанный на C++, подключать другие внешние библиотеки, написанные на разных языках, обеспечивая вызовы к ним из JavaScript-кода. Node.js применяется преимущественно на сервере, выполняя роль веб-сервера, но есть возможность разрабатывать на Node.js и десктопные оконные приложения.`

const initialStaticTechnologies = [
  { title: 'JavaScript', description: `${javaScriptText}`, type: 'html', done: true },
  { title: 'React', description: `${reactText}`, type: 'css', done: true },
  { title: 'Node.js', description: `${nodeJsText}`, type: 'javascript', done: false }
];
let technologies = getState()

if (technologies.length === 0) {
  technologies = initialStaticTechnologies;
  saveState(technologies);
  console.log("LocalStorage был пуст, инициализирован статическими данными.");
} else {
  console.log("LocalStorage уже содержит данные.");
}


function toggleTech(event) {
    const targetType = event.target.dataset.type
    const currentTech = technologies.find((t) => t.type === `${targetType}`)
    currentTech.done = event.target.checked

    saveState()
    init()
}

function openCard(event) {
    const isDeleteClick = event.target.matches('#deleteCardButton')
    if (isDeleteClick) {
        const targetType = event.target.parentElement.dataset.type
        const idx = technologies.findIndex((t) => t.type === targetType)
        if (idx !== -1) technologies.splice(idx, 1)
        init()
        saveState()
    }
    const data = event.target.dataset
    const tech = technologies.find((tech) => tech.type === data.type)
    if (!tech) return
    openModal(toModal(tech), tech.title)
}

function toModal(tech) {
    const checked = tech.done ? 'checked' : ''
    return `
        <h2>${tech.title}</h2>
        <p>${tech.description}</p>
        <hr>
        <div>
            <input type="checkbox" id="done" ${checked} data-type="${tech.type}">
            
            <label for="done">Выучил</label>
        </div>
    `
}

function openModal(html, title = APP_TITLE) {
    document.title = `${title} | ${APP_TITLE}`
    modalElement.classList.add('open')
    modalElement.innerHTML = html

}

function closeModal() {
    document.title = APP_TITLE
    modalElement.classList.remove('open')
}

function init() {
    renderCards()
    renderProgress()
}

function renderCards() {
    contentElement.innerHTML = technologies.length === 0
        ? '<p class="empty">Технологий пока нет. Добавьте новую</p>'
        : technologies.map(toCard).join('')
}

function toCard(tech) {
    const doneClass = tech.done === true ? 'done' : ''
    return `
        <div class="card ${doneClass}" data-type="${tech.type}">
            <button id="deleteCardButton" type="button" style="display: inline-flex;" class="card__close" aria-label="Close">×</button>

            <h3 data-type="${tech.type}">${tech.title}</h3>
        </div>
    `
}

function renderProgress() {
    const percent = computeProgressPercent()
    const progressTitle = progress.parentElement.previousElementSibling
    let progressText = progressTitle.querySelector('span')
    if (!progressText) {
        progressText = document.createElement('span')
        progressTitle.append(progressText)
    }
    progressText.textContent = percent ? percent + '%' : ''
    progressText.style.marginLeft = '6px'

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
}

function computeProgressPercent() {
    if (technologies.length === 0) {
        return 0
    }
    let donwCount = technologies.filter((tech) => tech.done).length
    return Math.round((donwCount / technologies.length) * 100)
}

function isInvalid(title, description) {
    return !title.value || !description.value
}

function createTech(event) {
    event.preventDefault()
    const { title, description } = event.target

    if (isInvalid(title, description)) {
        if (!title.value) title.classList.add('invalid')
        if (!description.value) description.classList.add('invalid')

        setTimeout(() => {
            title.classList.remove('invalid')
            description.classList.remove('invalid')
        }, 2000)
        return
    }

    const newTech = {
        title: title.value,
        description: description.value,
        type: title.value.toLowerCase(),
        done: false
    }

    technologies.push(newTech)
    saveState()
    title.value = ''
    description.value = ''
    init()
}

function saveState() {
    localStorage.setItem(LS_KEY, JSON.stringify(technologies))
}

function getState() {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
}

init()










