const form = document.getElementById("registerForm")

form.addEventListener("submit",async(e)=>{

e.preventDefault()

const data = {
action:"register",
name:document.getElementById("name").value,
email:document.getElementById("email").value,
password:document.getElementById("password").value,
course:document.getElementById("course").value
}

await fetch("https://script.google.com/macros/s/AKfycbzNbI_ahaAXsod_YQ43--6wuncIIdT5EAh-0HG-8bnywONGMcWnUmDDfZl_zsk0c-9W/exec",{
method:"POST",
body:JSON.stringify(data)
})

alert("Registration Successful")

window.location.href="login.html"

})
