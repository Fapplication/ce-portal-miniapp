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

await fetch("https://script.google.com/macros/s/AKfycby154AKDwrWangKhnkV3pYvOxw7HjRX_qMVY5PSu_g6rB5BAFP96dC4LXhTb_BSJM8L/exec",{
method:"POST",
body:JSON.stringify(data)
})

alert("Registration Successful")

window.location.href="login.html"

})
