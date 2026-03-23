document.getElementById("signup-btn").addEventListener("click", register);

async function register() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    const data = await res.json();

    console.log(data);

    if(res.ok){
        alert("Đăng ký thành công");
        window.location.href="/src/views/Login.html";
    }else{
        alert("Đăng ký thất bại");
    }

}