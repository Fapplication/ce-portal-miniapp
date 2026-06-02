const studentData =
localStorage.getItem("student")

if(!studentData){

window.location.href = "login.html"

}

const student = JSON.parse(studentData)

document.getElementById("studentInfo").innerHTML = `

<h3>${student.name}</h3>

<p><strong>Email:</strong> ${student.email}</p>

<p><strong>Course:</strong> ${student.course}</p>

`

document.getElementById("mid").innerHTML =
student.mid

document.getElementById("test").innerHTML =
student.test

document.getElementById("assignment").innerHTML =
student.assignment

document.getElementById("final").innerHTML =
student.final

document.getElementById("total").innerHTML =
student.total

document.getElementById("grade").innerHTML =
student.grade

async function sendComplaint(){

const complaint =
document.getElementById("complaint").value

await fetch("https://script.google.com/macros/s/AKfycbyQH5jvZR9UqLdP12Fdn6Ai5kqzjm5xOMhx9gLInmjvVuga-v2amszTBvyCwDPzAp3z/exec",{

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

localStorage.removeItem("student")

window.location.href = "login.html"

}
