import { deleteFunction, editFunction } from './manipulateTasks.js'

let tasks = []
let count = 0

const currentDate = new Date()

function createTasksData(event) {
    try {
        event.preventDefault()

        const title = document.getElementById('title').value
        const description = document.getElementById('description').value
        const data = document.getElementById('expirationDate').value
        const category = document.getElementById('category').value

        const expirationDate = new Date(data)


        if (title.length < 4) {
            alert('Título deve ter no mínimo 4 caractéres')
            return
        }

        if (description.length < 20) {
            alert('descrição deve ter no mínimo 20 caractéres')
            return
        }

        if (tasks.length > 0 && tasks.some((task) => task.title === title)) {
            alert('Já existe uma tarefa com esse título.')
            return
        }

        if (/^\d+$/.test(title)) {
            alert('O título não pode conter apenas números.')
            return;
        }

        tasks.push({
            title,
            description,
            data,
            category,
            id: count,
            status: 'Em andamento'
        })

        const tr = document.createElement('tr')

        tr.setAttribute('class', 'resultSchema')

        readTasks(tr)
        count += 1

        document.getElementById('title').value = ''
        document.getElementById('description').value = ''
        document.getElementById('category').selectedIndex = 0

    } catch (error) {
        throw new Error('Não foi possível Criar a tarefa', error.message)
    }
}

export function readTasks(tr) {
    const tbody = document.getElementById('result')

    const titleElement = document.createElement('td')
    const descriptionElement = document.createElement('td')
    const dataElement = document.createElement('td')
    const categoryElement = document.createElement('td')
    const idElement = document.createElement('td')
    const statusElement = document.createElement('td')
    const spansColumn = document.createElement('td')
    const editRow = document.createElement('span')
    const deleteRow = document.createElement('span')

    spansColumn.appendChild(editRow)
    spansColumn.appendChild(deleteRow)

    spansColumn.setAttribute('class', 'tdEvents')
    editRow.setAttribute('class', 'edit')
    deleteRow.setAttribute('class', 'delete')
    idElement.setAttribute('class', 'id')

    const elements = [titleElement, descriptionElement, dataElement, categoryElement, idElement, statusElement, spansColumn]

    if (tr) {
        tbody.appendChild(tr)

        for (const element of elements) {
            tr.appendChild(element)
        }

        titleElement.innerHTML = tasks[tasks.length - 1].title
        descriptionElement.innerHTML = tasks[tasks.length - 1].description
        dataElement.innerHTML = tasks[tasks.length - 1].data
        categoryElement.innerHTML = tasks[tasks.length - 1].category
        idElement.innerHTML = tasks[tasks.length - 1].id
        statusElement.innerHTML = tasks[tasks.length - 1].status
        editRow.innerHTML = "✏️"
        deleteRow.innerHTML = "❌"

        tr.addEventListener('click', (event) => {
            event.preventDefault()
            const idElement = tr.querySelector('.id')
            if (event.target.classList.value === 'edit') {
                const modalContainer = document.querySelector('#modalContainer')
                modalContainer.classList.add('active')
                if (idElement) {
                    const idValue = idElement.innerHTML
                    editFunction(idValue)
                }
            } else if (event.target.classList.value === 'delete') {
                if (idElement) {
                    const idValue = idElement.innerHTML
                    deleteFunction(idValue)
                }
            }
        })

    } else {
        tbody.innerHTML = ''

        tasks.forEach((task) => {
            const newRow = document.createElement('tr');
            newRow.setAttribute('class', 'resultSchema');

            const titleElement = document.createElement('td');
            titleElement.innerHTML = task.title
            newRow.appendChild(titleElement)

            const descriptionElement = document.createElement('td')
            descriptionElement.innerHTML = task.description
            newRow.appendChild(descriptionElement)

            const dataElement = document.createElement('td')
            dataElement.innerHTML = task.data
            newRow.appendChild(dataElement)

            const categoryElement = document.createElement('td')
            categoryElement.innerHTML = task.category
            newRow.appendChild(categoryElement)

            const idElement = document.createElement('td')
            idElement.innerHTML = task.id
            idElement.classList.add('id')
            newRow.appendChild(idElement)

            const statusElement = document.createElement('td')
            statusElement.innerHTML = task.status
            newRow.appendChild(statusElement)

            const spansColumn = document.createElement('td')
            spansColumn.setAttribute('class', 'tdEvents')
            spansColumn.innerHTML = `
                <span class="edit">✏️</span>
                <span class="delete">❌</span>
            `
            newRow.appendChild(spansColumn)

            newRow.addEventListener('click', (event) => {
                event.preventDefault()
                const idElement = newRow.querySelector('.id')
                if (event.target.classList.value === 'edit') {
                    const modalContainer = document.querySelector('#modalContainer')
                    modalContainer.classList.add('active')
                    if (idElement) {
                        const idValue = idElement.innerHTML
                        editFunction(idValue)
                    }
                } else if (event.target.classList.value === 'delete') {
                    if (idElement) {
                        const idValue = idElement.innerHTML
                        deleteFunction(idValue)
                    }
                }
            })

            tbody.appendChild(newRow)
        })

    }

}

export function manipulateTasks() {
    return tasks
}

export function removeTask(newTasks) {
    tasks = newTasks
    readTasks()
}

export function editTask(editedTask) {
    const taskIndex = tasks.findIndex((task) => task.id === Number(editedTask.id));

    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            id: tasks[taskIndex].id,
            title: editedTask.title,
            description: editedTask.description,
            category: editedTask.category,
            data: editedTask.data,
            status: 'Em andamento'
        }
    }
    readTasks()
}

export function searchIdTask(id) {
    const tbody = document.getElementById('result')
    const noResultSearch = document.getElementById('noResultSearch')

    if (id.trim() === '') {
        noResultSearch.innerHTML = ''
        readTasks()
        return
    }

    if (!isNaN(id)) {
        const foundIndex = tasks.findIndex((task) => task.id === Number(id))
        if (foundIndex !== -1) {
            const tr = document.createElement('tr')
            tr.setAttribute('class', 'resultSchema')

            const elements = ['title', 'description', 'data', 'category', 'id', 'status']

            tbody.innerHTML = ''

            for (const element of elements) {
                const td = document.createElement('td')
                tr.appendChild(td)
                td.innerHTML = tasks[foundIndex][element]
            }

            const spansColumn = document.createElement('td')
            spansColumn.setAttribute('class', 'tdEvents')
            spansColumn.innerHTML = `
                <span class="edit">✏️</span>
                <span class="delete">❌</span>
            `;
            tr.appendChild(spansColumn);

            tr.addEventListener('click', (event) => {
                event.preventDefault()
                const idElement = tr.querySelector('.id')
                if (event.target.classList.value === 'edit') {
                    const modalContainer = document.querySelector('#modalContainer')
                    modalContainer.classList.add('active')
                    if (idElement) {
                        const idValue = idElement.innerHTML
                        editFunction(idValue)
                    }
                } else if (event.target.classList.value === 'delete') {
                    if (idElement) {
                        const idValue = idElement.innerHTML
                        deleteFunction(idValue)
                    }
                }
            })

            tbody.appendChild(tr)
        } else {
            tbody.innerHTML = ''
            noResultSearch.innerHTML = `Não encontrou a tarefa com o ID: ${id}`
            noResultSearch.style.textAlign = 'center'
            noResultSearch.style.color = 'white'
            noResultSearch.style.marginTop = '20px'
        }
    }
}

const createButton = document.getElementById('createButton')
createButton.addEventListener('click', createTasksData)