import { manipulateTasks, removeTask, editTask, searchIdTask } from "./index.js"

export function deleteFunction(id) {
    const tasks = manipulateTasks()
    const tasksWithoutDeletedOne = tasks.filter((task) => task.id !== Number(id))
    removeTask(tasksWithoutDeletedOne)
}

export function editFunction(id) {

    const tasks = manipulateTasks()

    const modalContainer = document.querySelector('#modalContainer')
    const close = document.querySelector('#closeModal')
    const saveButton = document.querySelector('#saveButton')
    const selectedTask = tasks.filter((task) => task.id === Number(id))

    document.querySelector('#editTitle').value = selectedTask[0].title
    document.querySelector('#editDescription').value = selectedTask[0].description
    document.querySelector('#editCategory').value = selectedTask[0].category
    document.querySelector('#editExpirationDate').value = selectedTask[0].data


    close.addEventListener('click', () => {
        modalContainer.classList.remove('active')
    })

    saveButton.addEventListener('click', (event) => {
        event.preventDefault()

        const editTitle = document.querySelector('#editTitle').value
        const editDescription = document.querySelector('#editDescription').value
        const editCategory = document.querySelector('#editCategory').value
        const editExpirationDate = document.querySelector('#editExpirationDate').value

        if (editTitle.length < 4) {
            alert('Título deve ter no mínimo 4 caractéres')
            return
        }

        if (editDescription.length < 20) {
            alert('descrição deve ter no mínimo 20 caractéres')
            return
        }

        if (tasks.length > 0 && tasks.some((task) => task.title === editTitle)) {
            alert('Já existe uma tarefa com esse título.')
            return
        }

        if (/^\d+$/.test(editTitle)) {
            alert('O título não pode conter apenas números.')
            return
        }



        editTask({
            id: selectedTask[0].id,
            title: editTitle,
            description: editDescription,
            category: editCategory,
            data: editExpirationDate
        })

        modalContainer.classList.remove('active')
    })

}

const searchInput = document.querySelector('#search')

searchInput.addEventListener('input', () => {
    const textoDigitado = searchInput.value
    searchIdTask(textoDigitado)
})


