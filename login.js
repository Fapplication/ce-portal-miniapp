const loginForm = document.getElementById("loginForm")

loginForm.addEventListener("submit",(e)=>{

e.preventDefault()

const email = document.getElementById("loginEmail").value
const password = document.getElementById("loginPassword").value

localStorage.setItem("studentEmail",email)

window.location.href="dashboard.html"

})
