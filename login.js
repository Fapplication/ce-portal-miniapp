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
"https://script.google.com/macros/s/AKfycbw4ogBvGCINM25cXPdxjnbobI1wEskVjtTVi4b_S2stwt6mNhYujuP_KMYfC2CoS5Z5/exec",
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
