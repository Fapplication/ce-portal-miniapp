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

await fetch("https://script.google.com/macros/s/AKfycbxAw2GI1gTjMFdutXHhd-IbIf345Le6ciZ-QXn8qAVztk5PrHwUjYfxuRxXZ3YUbzn2/exec",{
method:"POST",
body:JSON.stringify(data)
})

alert("Registration Successful")

window.location.href="login.html"

})
