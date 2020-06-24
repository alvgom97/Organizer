/* Functions */

// Store the tasks and last task number
const update = function (){

    if(tasks !== null){
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("lastCard", cardNum.toString());
    } else {
        localStorage.setItem("tasks", "[]");
    }
    
}

// Create new node
const createNode = function(tag, content) {
    const node = document.createElement(tag);
    if(typeof content === 'string') {
      const nodeTxt = document.createTextNode(content);
      node.appendChild(nodeTxt);
    } else if(typeof content === 'object') {
      node.appendChild(content);
    }
    return node;  
}

// Create new card
const createCard = function (title){

    const card = document.createElement('div');
    const cardTitle = document.createTextNode(title.toUpperCase());
    card.appendChild(cardTitle);
    card.className = 'card' + cardNum;
    card.draggable = true;

    card.addEventListener("dragstart", function(event){
        event.dataTransfer.setData("card", event.target.className)
    });

    tasks.push({class: "card"+cardNum, title: title, parent: "toDoList"});

    cardNum++;

    return card;
}

// Load the stored tasks 
function loadTasks() {

    tasks = JSON.parse(localStorage.getItem("tasks"));

    if(tasks !== null){

        tasks.sort(function (a, b){

            if(a.parent < b.parent){ return 1; }
            if(a.parent > b.parent) { return -1; }
            return 0;
        });

        for (const t of tasks) {
            
            const card = document.createElement('div');
            const cardTitle = document.createTextNode(t.title.toUpperCase());
            card.appendChild(cardTitle);
            card.className = t.class;
            card.draggable = true;

            card.addEventListener("dragstart", function(event){
                event.dataTransfer.setData("card", event.target.className)
            });

            if(t.parent.charAt(0) == "c"){

                document.querySelector("."+t.parent).appendChild(card);

            } else {

                document.querySelector("#"+t.parent).appendChild(card);
            }
        }
    } else {
        tasks = [];
    }
}

// Create new task
const newTask = function(){

    if(input.value.length > 0){

        toDoList.appendChild(createCard(input.value));
        input.value = "";
    }

    update();
}

// Handle when you drop the task
const drop = function(event){
    event.preventDefault();
    let data = event.dataTransfer.getData("card");
    event.target.appendChild(document.getElementsByClassName(data)[0]);

    tasks.forEach(t => {
        if(t.class == data){
            t.parent = event.target.attributes[0].value;
        }
    });

    update();
}

// Handle when you drop the task on the trash
const dropDelete = function(event){
    event.preventDefault();
    let data = event.dataTransfer.getData("card");
    let card1 = document.getElementsByClassName(data)[0];
    card1.parentElement.removeChild(card1);

    tasks.splice(tasks.findIndex(t => t.class == data), 1);

    update();
}

// Let you drop an item
const allowDrop = function(event){

    event.preventDefault();
}

/* Create structure */

let tasks = [];

const header = document.getElementsByTagName("header")[0];
const title = createNode("h1", "My Task Organizer");
const input = document.createElement("input");

input.type = "text"; input.placeholder = "Name you new task";

const creator = createNode("div", input);

header.appendChild(title); header.appendChild(creator);

const main = document.getElementsByTagName("main")[0];
const toDo = createNode("h3", "To Do");
const doing = createNode("h3", "In Progress");
const done = createNode("h3", "Done");

toDo.id = "toDo"; doing.id = "doing"; done.id = "done";

main.appendChild(toDo); main.appendChild(doing); main.appendChild(done);

const toDoList = document.createElement("div"); toDoList.id = "toDoList";
const doingList = document.createElement("div"); doingList.id = "doingList";
const doneList = document.createElement("div"); doneList.id = "doneList";

main.appendChild(toDoList); main.appendChild(doingList); main.appendChild(doneList);

let cardNum;

if(localStorage.getItem("lastCard")){
    cardNum = parseInt(localStorage.getItem("lastCard"));
} else {
    cardNum = 1;
}

const trash = document.getElementsByTagName("svg")[0];

/* Add Events */

toDoList.addEventListener("drop", drop);
doingList.addEventListener("drop", drop);
doneList.addEventListener("drop", drop);
trash.addEventListener("drop", dropDelete);


toDoList.addEventListener("dragover", allowDrop);
doingList.addEventListener("dragover", allowDrop);
doneList.addEventListener("dragover", allowDrop);
trash.addEventListener("dragover", allowDrop);

document.addEventListener("keypress", function(event){

    if(event.keyCode === 13){
        newTask();
    }
});

loadTasks();
update();
