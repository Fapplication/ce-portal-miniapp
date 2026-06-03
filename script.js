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

await fetch("https://script.google.com/macros/s/AKfycbw5I6LxE2nVGvSN84u4Q8PaEytjGQhpJP9WyjkBSG4i33joXVuYUdk0adB_Sc7Fej4z/exec",{
method:"POST",
body:JSON.stringify(data)
})

alert("Registration Successful")

window.location.href="login.html"

})
