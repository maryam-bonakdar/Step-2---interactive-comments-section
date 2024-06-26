import data from "./data.json" with { type: "json" };

syncData();

function syncData() {
  let comments = localStorage.getItem("comments");

  if (!comments) {
    localStorage.setItem("comments", JSON.stringify(data));
  }
}

let sectionAll = document.querySelector("#sectionAll");

function getData(
  userImg,
  userName,
  userDate,
  replyingTo,
  userComment,
  userScore,
  wrapperClass,
  id
) {
  sectionAll.className = wrapperClass;
  let section = document.createElement("section");
  section.className = "section";
  section.id = id;
  createHeader(userImg, userName, userDate, section);
  createMain(replyingTo, userComment, section);
  createFooter(userScore, userName, section, id);
  return section;
}

function createHeader(userImg, userName, userDate, section) {
  let header = document.createElement("div");
  header.className = "header";
  let img = document.createElement("img");
  img.className = "img";
  let textName = document.createElement("div");
  textName.className = "name";
  let textYou = document.createElement("div");
  textYou.className = "you";
  let textDate = document.createElement("div");
  textDate.className = "date";

  img.src = userImg;
  textName.textContent = userName;
  textYou.innerHTML += "<p>you</p>";
  textDate.innerHTML += userDate;

  header.appendChild(img);
  header.appendChild(textName);
  if (userName == data.currentUser.username) {
    header.appendChild(textYou);
  }
  header.appendChild(textDate);
  section.appendChild(header);
}

function createMain(replyingTo, userComment, section) {
  let main = document.createElement("div");
  main.className = "main";
  let textComment = document.createElement("div");
  textComment.className = "comment";

  if (replyingTo) {
    section.classList.add("reply");
  }
  const commentArray = userComment.split(" ");
  const formattedUserComment = commentArray.map((word) => {
    if (word[0] === "@") {
      return `<span class="mention">${word}</span>`;
    } else {
      return word;
    }
  });

  textComment.innerHTML += `<span>${formattedUserComment.join(" ")}</span>`;
  main.appendChild(textComment);
  section.appendChild(main);
}

function createFooter(userScore, userName, section, id) {
  let footer = document.createElement("div");
  footer.className = "footer";
  let score = document.createElement("div");
  score.className = "score";
  let buttons = document.createElement("div");
  buttons.className = "buttons";

  createScore(userScore, score, footer, id);

  if (userName == data.currentUser.username) {
    deleteButton(footer, id);
    editButton(footer, id);
  } else {
    replyButton(userName, footer);
  }
  section.appendChild(footer);
}

function createScore(userScore, score, footer, id) {
  let plus = document.createElement("img");
  plus.className = "plus";
  let textScore = document.createElement("span");
  textScore.className = "textScore";
  let minus = document.createElement("img");
  minus.className = "minus";

  plus.src = "images/icon-plus.svg";
  textScore.textContent = userScore;
  minus.src = "images/icon-minus.svg";

  score.appendChild(plus);
  score.appendChild(textScore);
  score.appendChild(minus);
  footer.appendChild(score);

  plus.addEventListener("click", () => plusHandler(footer, textScore, id));

  minus.addEventListener("click", () => minusHandler(footer, textScore, id));
}

function plusHandler(footer, textScore, id) {
  textScore.textContent = parseInt(textScore.textContent) + 1;
  updateLocalStorage(footer, textScore, id, "scoreUpdate");
}

function minusHandler(footer, textScore, id) {
  if (parseInt(textScore.textContent) > 0) {
    textScore.textContent = parseInt(textScore.textContent) - 1;
    updateLocalStorage(footer, textScore, id, "scoreUpdate");
  }
}

function deleteButton(footer, id) {
  let delButton = document.createElement("button");
  delButton.className = "delButton";
  delButton.textContent = "Delete";

  let delIcon = document.createElement("img");
  delIcon.className = "delIcon";
  delIcon.src = "images/icon-delete.svg";
  delButton.appendChild(delIcon);

  footer.appendChild(delButton);

  delButton.addEventListener("click", () => delButtonHandler(footer, id));
}

function delButtonHandler(footer, id) {
  let dialogElement = dialogModal();
  sectionAll.appendChild(dialogElement);
  dialogElement.classList.remove("hidden");

  let yes = dialogElement.querySelector(".dialogYes");
  let no = dialogElement.querySelector(".dialogNo");

  yes.addEventListener("click", () =>
    yesButtonHandler(footer, dialogElement, id)
  );

  no.addEventListener("click", () => noButtonHandler(dialogElement));
}

function yesButtonHandler(footer, dialogElement, id) {
  footer.parentNode.classList.add("hidden");
  dialogElement.classList.add("hidden");

  // Save deleted to localStorage
  updateLocalStorage(footer, "", id, "deletedUpdate");
}

function noButtonHandler(dialogElement) {
  dialogElement.classList.add("hidden");
}

function dialogModal() {
  let dialogParent = document.createElement("section");
  dialogParent.className = "dialogParent hidden";

  let dialog = document.createElement("div");
  dialog.className = "deleteDialog";

  let dialogHeader = document.createElement("header");
  dialogHeader.className = "dialogHeader";
  dialogHeader.textContent = "Delete comment";
  dialog.appendChild(dialogHeader);

  let dialogMain = document.createElement("div");
  dialogMain.className = "dialogMain";
  dialogMain.innerHTML += `<p>Are you sure you want to delete this comment? This will remove the comment and can't be undone</p>`;
  dialog.appendChild(dialogMain);

  let dialogFooter = document.createElement("div");
  dialogFooter.className = "dialogFooter";

  let dialogNo = document.createElement("button");
  dialogNo.className = "dialogNo";
  dialogNo.textContent = "NO,CANCEL";
  dialogFooter.appendChild(dialogNo);

  let dialogYes = document.createElement("button");
  dialogYes.className = "dialogYes";
  dialogYes.textContent = "YES,DELETE";
  dialogFooter.appendChild(dialogYes);

  dialog.appendChild(dialogFooter);

  dialogParent.appendChild(dialog);

  return dialogParent;
}

function editButton(footer, id) {
  let edButton = document.createElement("button");
  edButton.className = "editButton";
  edButton.textContent = "Edit";

  let edlIcon = document.createElement("img");
  edlIcon.className = "edlIcon";
  edlIcon.src = "images/icon-edit.svg";
  edButton.appendChild(edlIcon);

  footer.appendChild(edButton);

  let update = document.createElement("button");
  update.className = "update";
  update.textContent = "UPDATE";

  edButton.addEventListener("click", () =>
    edButtonHandler(footer, edButton, update)
  );

  update.addEventListener("click", () =>
    updateHandler(footer, edButton, update, id)
  );
}

function edButtonHandler(footer, edButton, update) {
  footer.previousElementSibling.firstElementChild.setAttribute(
    "contenteditable",
    "true"
  );
  footer.previousElementSibling.firstElementChild.style.border =
    "1px solid #070707";
  footer.previousElementSibling.firstElementChild.focus();
  edButton.classList.add("transparency");
  document.querySelector(".delButton").classList.add("transparency");
  footer.previousElementSibling.appendChild(update);
}

function updateHandler(footer, edButton, update, id) {
  footer.previousElementSibling.firstElementChild.setAttribute(
    "contenteditable",
    "false"
  );
  footer.previousElementSibling.firstElementChild.style.border = "none";
  edButton.classList.remove("transparency");
  document.querySelector(".delButton").classList.remove("transparency");
  footer.previousElementSibling.removeChild(update);

  // Save edited to localStorage
  updateLocalStorage(footer, "", id, "editedUpdate");
}

function replyButton(userName, footer) {
  let rep = document.createElement("div");
  rep.className = "rep";

  let repIcon = document.createElement("img");
  repIcon.className = "repIcon";
  repIcon.src = "images/icon-reply.svg";
  rep.appendChild(repIcon);

  let repButton = document.createElement("button");
  repButton.className = "repbutton";
  repButton.textContent = "Reply";
  rep.appendChild(repButton);

  footer.appendChild(rep);

  rep.addEventListener("click", () => replyHandler(footer, rep, userName));
}

function replyHandler(footerElement, rep, userName) {
  // Add reply
  if (footerElement.lastElementChild == rep) {
    let repForm = document.querySelector(".formSend");
    const clone = repForm.cloneNode(true);
    clone.classList.remove("formSend");
    clone.classList.add("formReply");
    footerElement.appendChild(clone);

    let imgForm = document.querySelector(".imgForm");
    imgForm.src = data.currentUser.image.png;

    let submitName = footerElement.querySelector(".submitName");
    submitName.value = "reply";
    let commentArea = footerElement.querySelector(".addComment");
    // commentArea.classList.add('mention');
    commentArea.focus();
    commentArea.value = `@${userName} `;

    //reply submit
    document
      .querySelector(".formReply")
      .addEventListener("submit", (event) =>
        replySubmit(event, userName, commentArea)
      );
  }
}

function replySubmit(event, userName, commentArea) {
  event.preventDefault();
  let submitName = document
    .querySelector(".formReply")
    .querySelector(".submitName");
  let createDate = new Date();
  let comment = document
    .querySelector(".formReply")
    .querySelector(".addComment");

  if (submitName.value == "reply") {
    const newSection = getData(
      data.currentUser.image.png,
      data.currentUser.username,
      calculatedDate(createDate),
      null,
      comment.value,
      0,
      "attribution reply",
      data.currentUser.id
    );
    let parentNodeName =
      document.querySelector(".formReply").parentNode.parentNode
        .nextElementSibling;
    sectionAll.insertBefore(newSection, parentNodeName);
    newSection.classList.add("reply");
    document.querySelector(".formReply").classList.add("hidden");

    // Save the new reply to localStorage
    let currentComments = JSON.parse(localStorage.getItem("comments"));
    for (comment of currentComments.comments) {
      if (comment.user.username == userName) {
        comment.replies.push({
          user: {
            image: { png: data.currentUser.image.png },
            username: data.currentUser.username,
          },
          id: Math.random(),
          replyingTo: userName,
          createdAt: calculatedDate(createDate),
          content: commentArea.value,
          score: 0,
          timeStamp : createDate
        });
        localStorage.setItem("comments", JSON.stringify(currentComments));
      }
    }
  }
}

dataConfig();
function dataConfig() {
  const data = JSON.parse(localStorage.getItem("comments"));
  for (let obj of data.comments) {
    let createdDate = obj.createdAt
    if(obj.timeStamp){
      createdDate = calculatedDate(obj.timeStamp)
    }
    const newSection = getData(
      obj.user.image.png,
      obj.user.username,
      createdDate,
      null,
      obj.content,
      obj.score,
      "attribution",
      obj.id
    );
    sectionAll.appendChild(newSection);
    if (obj.replies.length > 0) {
      for (let replyObj of obj.replies) {
        let createdDateReply = replyObj.createdAt;
        if(replyObj.timeStamp){
          createdDateReply = calculatedDate(replyObj.timeStamp)
        }
        const replySection = getData(
          replyObj.user.image.png,
          replyObj.user.username,
          createdDateReply,
          replyObj.replyingTo,
          replyObj.content,
          replyObj.score,
          "attribution reply",
          replyObj.id
        );
        sectionAll.appendChild(replySection);
      }
    }
  }
}

//send submit
let imgForm = document.querySelector(".imgForm");
imgForm.src = data.currentUser.image.png;
document
  .querySelector(".formSend")
  .addEventListener("submit", (event) => sendSubmitHandler(event));

function sendSubmitHandler(event) {
  event.preventDefault();
  let submitName = document
    .querySelector(".formSend")
    .querySelector(".submitName");
  let createDate = new Date();
  let comment = document
    .querySelector(".formSend")
    .querySelector(".addComment");

  if (submitName.value == "send") {
    const newSection = getData(
      data.currentUser.image.png,
      data.currentUser.username,
      calculatedDate(createDate),
      null,
      comment.value,
      0,
      "attribution",
      Math.random()
    );
    sectionAll.appendChild(newSection);

    // Save the new comment to localStorage
    let currentComments = JSON.parse(localStorage.getItem("comments"));
    currentComments.comments.push({
      user: {
        image: { png: data.currentUser.image.png },
        username: data.currentUser.username,
      },
      id: Math.random(),
      replies: [],
      createdAt: calculatedDate(createDate),
      content: comment.value,
      score: 0,
      timeStamp : createDate
    });
    localStorage.setItem("comments", JSON.stringify(currentComments));
    comment.value = "Add a comment";
  }
}

//Textarea Placeholder
document
  .querySelector(".addComment")
  .addEventListener("focus", (event) => clearPlaceholderOnFocus(event));

function clearPlaceholderOnFocus(event) {
  if (event.target.value === "Add a comment...") {
    event.target.value = "";
  }
}

function updateLocalStorage(footer, textScore, id, mode) {

  let currentComments = JSON.parse(localStorage.getItem("comments"));
  for (let comment of currentComments.comments) {
    if(comment.id<1 && comment.user.username=="juliusomo"){
      let createDate = comment.timeStamp;
      comment.createdAt = calculatedDate(createDate);
      localStorage.setItem("comments", currentComments);
    }
    for(let rep of comment.replies) {
      if(rep.id<1 && rep.user.username=="juliusomo"){
        let createDate = rep.timeStamp;
        rep.createdAt = calculatedDate(createDate)
        localStorage.setItem("comments", currentComments);   
      }
    }
  }  

  if (footer.parentNode.classList.contains("reply")) {
    for (let comment of currentComments.comments) {
      for (let rep of comment.replies) {
        if (rep.id == id) {
          let idIndex = comment.replies.findIndex((rep) => rep.id == id);
          if (mode == "scoreUpdate") {
            comment.replies[idIndex].score = textScore.textContent;
          } else if (mode == "deletedUpdate") {
            comment.replies.splice(idIndex, 1);
          } else if (mode == "editedUpdate") {
            let editedText =
              footer.previousElementSibling.firstElementChild.firstElementChild
                .textContent;
            comment.replies[idIndex].content = editedText;
          }
          localStorage.setItem("comments", JSON.stringify(currentComments));
          return localStorage;
        }
      }
    }
  } 
  else {
    for (let comment of currentComments.comments) {
      if (comment.id == id) {
        let idIndex = currentComments.comments.findIndex(
          (comment) => comment.id == id
        );
        if (mode == "scoreUpdate") {
          currentComments.comments[idIndex].score = textScore.textContent;
        } else if (mode == "deletedUpdate") {
          currentComments.comments.splice(idIndex, 1);
        } else if (mode == "editedUpdate") {
          let editedText =
            footer.previousElementSibling.firstElementChild.textContent;
          currentComments.comments[idIndex].content = editedText;
        }
        localStorage.setItem("comments", JSON.stringify(currentComments));
        return localStorage;
      }
    }
  }
}


function calculatedDate(previousDate) {
  const currentDate = new Date().getTime();
  let diff = currentDate - new Date(previousDate).getTime();
  switch (true) {
    case diff < 60 * 1000: 
      diff = Math.round(diff / 1000);
      return `${diff} sec ago`;
      break;
    case 60 * 1000 < diff < 60 * 60 * 1000:
      diff = Math.round(diff / (60 * 1000));
      return `${diff} min ago`;
      break;
    case 60 * 60 * 1000 < diff < 24 * 60 * 60 * 1000:
      diff = Math.round(diff / (60 * 60 * 1000));
      return `${diff} hours ago`;
      break;
    case 24 * 60 * 60 * 1000 < diff < 7 * 24 * 60 * 60 * 1000:
      diff = Math.round(diff / (24 * 60 * 60 * 1000));
      return `${diff} days ago`;
    case 7 * 24 * 60 * 60 * 1000 < diff < 4 * 7 * 24 * 60 * 60 * 1000:
      diff = Math.round(diff / (7 * 24 * 60 * 60 * 1000));
      return `${diff} weeks ago`;
      break;
    case 4 * 7 * 24 * 60 * 60 * 1000 < diff < 12 * 4 * 7 * 24 * 60 * 60 * 1000:
      diff = Math.round(diff / (4 * 7 * 24 * 60 * 60 * 1000));
      return `${diff} months ago`;
      break;
    case diff > 365 * 24 * 60 * 60 * 1000:
      diff = Math.round(diff / (365 * 24 * 60 * 60 * 1000));
      return `${diff} years ago`;
      break;
  }
}
