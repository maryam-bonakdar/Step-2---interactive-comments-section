import data from './data.json' assert { type: 'json'}
console.log(data);

let sectionAll = document.querySelector('#sectionAll');

function getData (userImg , userName ,userDate , replyingTo , userComment , userScore, wrapperClass){
    sectionAll.className = wrapperClass
    let section = document.createElement('section');
    section.className = "section"; 
    createHeader(userImg , userName ,userDate , section);
    createMain(replyingTo , userComment , section);
    createFooter(userScore , userName , section);
    return section
}

function createHeader (userImg , userName ,userDate , section){
    let header = document.createElement('div');
    header.className = "header";
    let img = document.createElement('img');
    img.className = "img";
    let textName = document.createElement('div');
    textName.className="name";
    let textYou = document.createElement('div');
    textYou.className="you";
    let textDate = document.createElement('div');
    textDate.className="date";

    img.src = userImg
    textName.textContent = userName;
    textYou.innerHTML += '<p>you</p>';
    textDate.textContent = userDate;

    header.appendChild(img);
    header.appendChild(textName);
    if(userName == data.currentUser.username){
        header.appendChild(textYou);    
    }
    header.appendChild(textDate);
    section.appendChild(header);
}

function createMain(replyingTo , userComment , section){
    let main = document.createElement('div');
    main.className = "main";
    let textComment = document.createElement('div');
    textComment.className="comment";

    if(replyingTo){
        textComment.innerHTML = `<span class="mention">@${replyingTo}</span>`;
        section.classList.add('reply')
        }
    textComment.innerHTML += `<span>${userComment}</span>`;
    main.appendChild(textComment);
    section.appendChild(main);    
}

function createFooter(userScore , userName , section){
    let footer = document.createElement('div');
    footer.className = "footer";
    let score = document.createElement('div');
    score.className="score";
    let buttons = document.createElement('div');
    buttons.className="buttons"

    createScore(userScore , score , footer)

    if(userName == data.currentUser.username){
        deleteButton(footer);
        editButton(footer);
    }
    else{
        replyButton(userName , footer);
    }
    section.appendChild(footer);
}

function createScore(userScore , score , footer){
    let plus = document.createElement('img');
    plus.className="plus";
    let textScore = document.createElement('span');
    textScore.className="textScore";
    let minus = document.createElement('img');
    minus.className="minus";

    plus.src = "images/icon-plus.svg";
    textScore.textContent = userScore;
    minus.src = "images/icon-minus.svg";

    score.appendChild(plus);
    score.appendChild(textScore);
    score.appendChild(minus);
    footer.appendChild(score);

    plus.addEventListener('click' , () => plusHandler(textScore));
   
    minus.addEventListener('click' , () => minusHandler(textScore));
}

function plusHandler(textScore){
    textScore.textContent = parseInt(textScore.textContent) + 1;
}  

function minusHandler(textScore){
    textScore.textContent = parseInt(textScore.textContent) - 1;
}

function deleteButton(footer){
    let delButton = document.createElement('button');
    delButton.className="delButton"
    delButton.textContent = 'Delete';

    let delIcon = document.createElement('img');
    delIcon.className="delIcon"
    delIcon.src = "images/icon-delete.svg";
    delButton.appendChild(delIcon);
    
    footer.appendChild(delButton);

    delButton.addEventListener('click' , () => delButtonHandler(footer));    
}

function delButtonHandler(footer){
    let dialogElement = dialogModal();
    sectionAll.appendChild(dialogElement);
    dialogElement.classList.remove('hidden');

    let yes = dialogElement.querySelector('.dialogYes');
    let no = dialogElement.querySelector('.dialogNo');

    yes.addEventListener('click' , () => yesButtonHandler(footer , dialogElement)); 

    no.addEventListener('click' , () => noButtonHandler(dialogElement));
}

function yesButtonHandler(footer , dialogElement){
    footer.parentNode.classList.add('hidden'); 
    dialogElement.classList.add('hidden');
}

function noButtonHandler(dialogElement){
    dialogElement.classList.add('hidden');
}


function dialogModal(){
    let dialogParent = document.createElement('section');
    dialogParent.className="dialogParent hidden"

    let dialog = document.createElement('div');
    dialog.className="deleteDialog"

    let dialogHeader = document.createElement('header');
    dialogHeader.className = "dialogHeader"
    dialogHeader.textContent = 'Delete comment';
    dialog.appendChild(dialogHeader);

    let dialogMain = document.createElement('div');
    dialogMain.className = "dialogMain"
    dialogMain.innerHTML += `<p>Are you sure you want to delete this comment? This will remove the comment and can't be undone</p>`;
    dialog.appendChild(dialogMain);

    let dialogFooter = document.createElement('div');
    dialogFooter.className = "dialogFooter"

    let dialogNo = document.createElement('button');
    dialogNo.className = "dialogNo";
    dialogNo.textContent = 'NO,CANCEL';
    dialogFooter.appendChild(dialogNo);

    let dialogYes = document.createElement('button');
    dialogYes.className = "dialogYes";
    dialogYes.textContent = 'YES,DELETE';
    dialogFooter.appendChild(dialogYes);

    dialog.appendChild(dialogFooter);
    
    dialogParent.appendChild(dialog);

    return dialogParent;
}

function editButton(footer){
    let edButton = document.createElement('button');
    edButton.className="editButton"
    edButton.textContent = 'Edit';

    let edlIcon = document.createElement('img');
    edlIcon.className="edlIcon"
    edlIcon.src = "images/icon-edit.svg";
    edButton.appendChild(edlIcon);

    footer.appendChild(edButton);

    let update = document.createElement('button');
    update.className = "update";
    update.textContent = 'UPDATE'

    edButton.addEventListener('click' , () => edButtonHandler(footer , edButton , update)); 

    update.addEventListener ('click' , () => updateHandler(footer , edButton , update));
}

function edButtonHandler(footer , edButton , update){
    footer.previousElementSibling.firstElementChild.setAttribute("contenteditable" , "true");
    footer.previousElementSibling.firstElementChild.style.border = "1px solid #070707";
    footer.previousElementSibling.firstElementChild.focus();
    edButton.classList.add('transparency');
    document.querySelector('.delButton').classList.add('transparency');
    footer.previousElementSibling.appendChild(update);
}

function updateHandler(footer , edButton , update){
    footer.previousElementSibling.firstElementChild.setAttribute("contenteditable" , "false");
    footer.previousElementSibling.firstElementChild.style.border = "none";
    edButton.classList.remove('transparency');
    document.querySelector('.delButton').classList.remove('transparency');
    footer.previousElementSibling.removeChild(update);
}

function replyButton(userName , footer){
    let rep = document.createElement('div');
    rep.className="rep"

    let repIcon = document.createElement('img');
    repIcon.className="repIcon"
    repIcon.src = "images/icon-reply.svg";
    rep.appendChild(repIcon);

    let repButton = document.createElement('button');
    repButton.className="repbutton"
    repButton.textContent = 'Reply';
    rep.appendChild(repButton);

    footer.appendChild(rep);

    rep.addEventListener('click', () => replyHandler(footer , rep, userName));
}

function replyHandler(footerElement , rep, userName){

    // Add reply
    if(footerElement.lastElementChild == rep){
        let repForm = document.querySelector('.formSend')
        const clone = repForm.cloneNode(true);
        clone.classList.remove('formSend');
        clone.classList.add('formReply');
        footerElement.appendChild(clone);

        let submitName = footerElement.querySelector('.submitName');
        submitName.value = 'reply';
        let commentArea = footerElement.querySelector('.addComment');
        commentArea.classList.add('mention');
        commentArea.focus();
        commentArea.value = `@${userName} `;
        
        //reply submit
        document.querySelector('.formReply').addEventListener('submit', event => replySubmit(event));
    }           
}

function replySubmit(event) {
    event.preventDefault();
    let submitName = document.querySelector('.formReply').querySelector('.submitName');
    let mydate = 'now';
    let comment = document.querySelector('.formReply').querySelector('.addComment');

    if(submitName.value == 'reply'){
        const newSection = getData(data.currentUser.image.png , data.currentUser.username , mydate , null , comment.value , 0 , "attribution reply");
        let parentNodeName = document.querySelector('.formReply').parentNode.parentNode.nextElementSibling;
        sectionAll.insertBefore(newSection , parentNodeName)
        newSection.classList.add('reply');
        document.querySelector('.formReply').classList.add('hidden');
    }
}

// Form for Add Comment and Reply 
let imgForm = document.querySelector('.imgForm');
imgForm.src = data.currentUser.image.png;

for(let obj of data.comments){
    const newSection = getData (obj.user.image.png , obj.user.username ,obj.createdAt , null , obj.content , obj.score, "attribution");
    sectionAll.appendChild(newSection) 
    if(obj.replies.length>0){
        for(obj of obj.replies){
            const replySection = getData (obj.user.image.png , obj.user.username ,obj.createdAt , obj.replyingTo , obj.content , obj.score , "attribution reply");
            sectionAll.appendChild(replySection) 

        }
    }
}

//send submit 
document.querySelector('.formSend').addEventListener('submit', (event) => sendSubmitHandler(event));
function sendSubmitHandler(event) {
    event.preventDefault();
    let submitName = document.querySelector('.formSend').querySelector('.submitName');
    let mydate = 'now';
    let comment = document.querySelector('.formSend').querySelector('.addComment');
   
    if(submitName.value == 'send'){
        const newSection = getData(data.currentUser.image.png , data.currentUser.username , mydate , null , comment.value , 0 , "attribution");
        sectionAll.appendChild(newSection)
        comment.value = 'Add a comment';
    }
}

//Textarea Placeholder
document.querySelector('.addComment').addEventListener('focus', (event) => clearPlaceholderOnFocus(event));

function clearPlaceholderOnFocus(event) {
    if (event.target.value === 'Add a comment...') {
        event.target.value = '';
    }
}










