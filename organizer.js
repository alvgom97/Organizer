/* Create structure */

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

const header = document.getElementsByTagName("header")[0];
const title = createNode("h1", "My Task Organizer");
const input = document.createElement("input");
const add = createNode("span", "+");

input.type = "text"; input.placeholder = "Name you new task";

const creator = createNode("div", input);

creator.appendChild(add);

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

let cardNum = 1;

const createCard = function (title){

    const card = document.createElement('div');
    const cardTitle = createNode("p", title);
    card.appendChild(cardTitle);
    card.className = 'card' + cardNum;
    card.draggable = true;

    card.addEventListener("dragstart", function(event){
        event.dataTransfer.setData("card", event.target.className)
    });

    cardNum++;

    return card;
}

/* Add Events */

add.addEventListener("click", function(){

    console.log(input.value);
    if(input.value.length > 0){

        toDoList.appendChild(createCard(input.value));
        input.value = "";

    }
});

const drop = function(event){
    event.preventDefault();
    let data = event.dataTransfer.getData("card");
    event.target.appendChild(document.getElementsByClassName(data)[0]);
}

const allowDrop = function(event){

    event.preventDefault();
}

toDoList.addEventListener("drop", drop);
doingList.addEventListener("drop", drop);
doneList.addEventListener("drop", drop);

toDoList.addEventListener("dragover", allowDrop);
doingList.addEventListener("dragover", allowDrop);
doneList.addEventListener("dragover", allowDrop);