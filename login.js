*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial,sans-serif;
}

body{
background:linear-gradient(135deg,#4facfe,#00f2fe);
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
padding:15px;
}

.container{
width:100%;
display:flex;
justify-content:center;
align-items:center;
}

.card{
background:white;
width:100%;
max-width:420px;
padding:35px;
border-radius:20px;
box-shadow:0 10px 30px rgba(0,0,0,0.15);
}

h2{
text-align:center;
margin-bottom:25px;
font-size:32px;
color:#222;
}

form{
width:100%;
}

input{
width:100%;
padding:14px;
margin-bottom:18px;
border:1px solid #ccc;
border-radius:10px;
font-size:16px;
outline:none;
transition:0.3s;
}

input:focus{
border-color:#007bff;
box-shadow:0 0 5px rgba(0,123,255,0.3);
}

button{
width:100%;
padding:14px;
border:none;
border-radius:10px;
background:#007bff;
color:white;
font-size:16px;
cursor:pointer;
transition:0.3s;
}

button:hover{
background:#0056b3;
}

p{
text-align:center;
margin-top:18px;
font-size:15px;
}

a{
text-decoration:none;
color:#007bff;
font-weight:bold;
}

textarea{
width:100%;
padding:14px;
border:1px solid #ccc;
border-radius:10px;
margin-bottom:15px;
resize:none;
font-size:16px;
}

@media screen and (max-width:768px){

.card{
max-width:95%;
padding:25px;
}

h2{
font-size:28px;
}

}

@media screen and (max-width:480px){

body{
padding:10px;
}

.card{
padding:20px;
border-radius:15px;
}

h2{
font-size:24px;
margin-bottom:20px;
}

input,
button,
textarea{
font-size:15px;
padding:12px;
}

}
