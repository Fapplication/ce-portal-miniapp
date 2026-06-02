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

await fetch("https://script.google.com/macros/s/AKfycbyQH5jvZR9UqLdP12Fdn6Ai5kqzjm5xOMhx9gLInmjvVuga-v2amszTBvyCwDPzAp3z/exec",{
method:"POST",
body:JSON.stringify(data)
})

alert("Registration Successful")

window.location.href="login.html"

})
