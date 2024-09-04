const add_task = document.getElementById("add_task");
const update_tasks = document.querySelectorAll("#update_task");
const popup_dialog = document.getElementById("popup");
const h3 = popup_dialog.querySelector("h3");
const form = popup_dialog.querySelector("form");
const cls_btn = document.getElementById('close-btn');
const cls_icon = document.getElementById("close-icon");
const form_title = form.querySelector('[name="title"]');
const form_duration = form.querySelector('[name="duration"]');
const form_description = form.querySelector('[name="description"]');
const check_boxes = document.querySelectorAll('input[type="checkbox"]');
const tasks_boxes = document.getElementsByClassName('task-box');
const date = new Date();
let task_id = null;


add_task.addEventListener("click", () => openDialog("add", null));

update_tasks.forEach((update_task) => {
  update_task.addEventListener("click", function()  {
    task_id = this.querySelector("#task-id").value;
    openDialog("update");
  })
})

function openDialog(dialog){
  if (dialog == "update"){
    h3.textContent = "Update todo task";
    form.action = `update_task/${task_id}`;
    fetch(`get_task_data/${task_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error){
          console.error('Task not found');
        }
        else{
          form_title.value = data.title;
          form_duration.value = data.duration;
          form_description.value = data.description;
        }
      })
  }
  else{
    form.action = "add_task/";
    h3.textContent = "Add todo task";
  }
  popup_dialog.style.display = "block";
  popup_dialog.querySelector('.popup-dialog').style.display = "block";
}

cls_icon.addEventListener("click", clearData);
cls_btn.addEventListener("click", clearData);

function clearData(){
  popup_dialog.style.display = "none"
  form_title.value = "";
  form_duration.value = "";
  form_description.value = "";
}

check_boxes.forEach((check_box) => {
  check_box.addEventListener("click", function(){
    task_id = this.parentNode.parentNode.querySelector('#task-id').value;
    if (check_box.checked){
      getCookies();
      markTask(true);
    }
    else{
      getCookies();
      markTask(false);
    }
  })
})

function showTasks(done){
  let check_ = []
  Array.from(tasks_boxes).forEach((task_box) => {
    task_box.style.display = "grid";
  })
  check_boxes.forEach((check_box) => {
    if (check_box.checked && done==false) {
      check_box.parentNode.parentNode.style.display = "none";
    }
    else if (!check_box.checked && done==true) {
      check_box.parentNode.parentNode.style.display = "none";
    }
    else{
      check_.push(check_box)
    }
  })
  check_[(check_.length - 1)].parentNode.parentNode.style.margin = 0
}

function markTask(selected){
  fetch(`mark_task/${task_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookies()
    },
    body: selected
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.error){
      console.error('Task not found!')
    }
  })
}

function getCookies(){
  let csrf_token = null;
  if (document.cookie && document.cookie !== ''){
    const cookies = document.cookie.split(';'); // splitting to an array
    csrf_token = cookies.find(csrf_token => csrf_token.trim().startsWith('csrftoken='));
    if(csrf_token){
      csrf_token = csrf_token.split('=')[1];
    }
  }
  return csrf_token
};

function deleteDialog(id){
  popup_dialog.querySelector('.popup-dialog').style.display = "none";
  popup_dialog.style.display = "block"
  popup_dialog.querySelector('.removal-task').style.display = "block";
  task_id = id
}

function deleteTask(){
  fetch(`delete_task/${task_id}`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCookies()
    }
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.success){
      window.location.href = '/';
    }
    else{
      console.error('Task not found!');
    }
  })
  popup_dialog.style.display = "none";
  popup_dialog.querySelector('.removal-task').style.display = "none";
}

function cancelDeleteTask(){
  popup_dialog.style.display = "none";
  popup_dialog.querySelector('.removal-task').style.display = "none";
}

