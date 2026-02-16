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

