const showPassword = document.querySelector
    ("#show-password") ;
 
const passwordField = document.querySelector
    ("#password");

showPassword.addEventListener("click", function () {
    const isPassword = passwordField.type == "password";
    passwordField.type = isPassword ? "text" : "password";

    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");

});
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const email = document.getElementBtId("email").value;
    const password = document.getElementById("password").value;

    try {
        
        const res = await fetch("http://localhost:3000/auth/login" , {
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

        if (res.ok){
            alert("Login thành công");

        }else {
            alert(data.message || "Login thất bại");
        }
    }catch (err) {
        console.error(err);
        alert("Không thể kết nối server");
    }
});
