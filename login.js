const loginForm =
document.getElementById("loginForm")

loginForm.addEventListener("submit",

async (e)=>{

e.preventDefault()

const email =
document.getElementById("loginEmail").value

const password =
document.getElementById("loginPassword").value

try{

const response = await fetch(
"https://script.google.com/macros/s/AKfycbwIBwmdPOdtaISQVR1zxTlmWH7-cG0g1_56Gj4LIhvVfpY5ZTOgWMP6-Hpx268uFciR/exec",
{
method:"POST",

body:JSON.stringify({

action:"login",

email:email,

password:password

})

}
)

const result = await response.json()

console.log(result)

if(result.status === "success"){

localStorage.setItem(
"student",
JSON.stringify(result.student)
)

window.location.href = "dashboard.html"

}else{

alert("Invalid Email or Password")

}

}catch(error){

console.log(error)

alert("Login Error")

}

})
