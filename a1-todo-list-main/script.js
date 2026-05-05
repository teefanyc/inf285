
let toDoInput = document.querySelector('input');
let toDoBtn = document.querySelector('.todo-btn');
toDoBtn.addEventListener('click', addToDo);
let toDoList = document.querySelector('.todo-list');
toDoList.addEventListener('click', checkToDos);

//Checks when the add button is clicked on
function addToDo(event) {
    // Prevents form from submitting and reloading
    event.preventDefault();

    if (toDoInput.value === '') {
        //If there's no todo, prompt for a task. Kinda clunky, but it's okay 
        alert("Write your task!");
    } 
    else {
        // Create a new div
        let toDoDiv = document.createElement("div");
        toDoDiv.classList.add('todo-div');

        // Create button to check off todo
        let checked = document.createElement('button');
        checked.classList.add('check-btn');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        toDoDiv.appendChild(checked);

        // Create a list item to nest in div
        let newToDo = document.createElement('li');
        newToDo.innerText = toDoInput.value;
        toDoDiv.appendChild(newToDo);

        
        // Create button to delete todo
        let deleted = document.createElement('button');
        deleted.classList.add('delete-btn');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        toDoDiv.appendChild(deleted);

        // Add to todo list
        toDoList.appendChild(toDoDiv);

        // Clear text input
        toDoInput.value = '';
    }

}   

//Checks whenever an input item is clicked on
function checkToDos(event){
    let item = event.target;

    // Check if the delete button was clicked on
    if(item.classList.contains('delete-btn'))
    {
        // If so, add the "remove" class
        item.parentElement.classList.add("remove");

        // Once the animation plays, delete the item
        item.parentElement.addEventListener('transitionend', function(){
            item.parentElement.remove();
        });
    }

    // Check if the complete button was clicked on
    if(item.classList.contains('check-btn'))
    {
        //If so, add the "completed" class
        item.parentElement.classList.toggle("completed");
    }
}