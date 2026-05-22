const student = JSON.parse(localStorage.getItem("student"))

if(!student){

window.location.href = "login.html"

}

document.getElementById("studentInfo").innerHTML = `

<h3>${student.name}</h3>

<p><strong>Email:</strong> ${student.email}</p>

<p><strong>Course:</strong> ${student.course}</p>

`

document.getElementById("mid").textContent =
student.mid || 0

document.getElementById("test").textContent =
student.test || 0

document.getElementById("assignment").textContent =
student.assignment || 0

document.getElementById("final").textContent =
student.final || 0

document.getElementById("total").textContent =
student.total || 0

document.getElementById("grade").textContent =
student.grade || "F"

async function sendComplaint(){

const complaint =
document.getElementById("complaint").value

await fetch("YOUR_WEB_APP_URL",{

method:"POST",

body:JSON.stringify({

action:"complaint",

student:student.email,

complaint:complaint

})

})

alert("Complaint Submitted")

}

function logout(){

localStorage.clear()

window.location.href = "login.html"

}
