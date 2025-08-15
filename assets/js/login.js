const eyeIcons = [
    document.getElementById("pin-show"), 
    document.getElementById("pin-hide")
]

const loginInput = document.getElementById("login-input");
const pinInput = document.getElementById("pin-input");
const pinHide = document.getElementById("pin-hide");
const loginBtn = document.getElementById("login-button");
const signUpBtn = document.getElementById('signup-button');

loginBtn.addEventListener('click', login);

signUpBtn.addEventListener('click', newUser)


class User {
    constructor(name, pin, tasks) {
        this.name = name;
        this.pin = pin;
        this.tasks = tasks;
    }
}

function newUser() {
    axios.get(`https://689688bc250b078c203facac.mockapi.io/api/users?name=${loginInput.value}`)
    .then((response) => {
        if (response.data.length > 0) {
            const errorText = document.querySelector(".error-text");
            errorText.innerHTML = ('User already exists, try logging in')
        } else {
            const user = loginInput.value;
            const pin = pinInput.value;
            const tasksList = [];
            const newUser = new User(user, pin, tasksList);
            axios.post("https://689688bc250b078c203facac.mockapi.io/api/users/", newUser)
            .then(response => {
                const newUserCreated = response.data;
                localStorage.setItem("tasksList", JSON.stringify(newUserCreated.tasks));
                localStorage.setItem("user", JSON.stringify(newUserCreated.name));
                localStorage.setItem("userId", JSON.stringify(newUserCreated.id));
                window.location.replace('tasks.html');
            })
            .catch(() => {
                const errorText = document.querySelector(".error-text");
                errorText.innerHTML = ('Unexpected error, try again later')
            })
        }
    })
    .catch(() => {
                const errorText = document.querySelector(".error-text");
                errorText.innerHTML = ('Unexpected error, try again later')
            })
}

eyeIcons.forEach(icon => {
    icon.addEventListener('click', () => {

        // TOGGLE VISIBILITY OF BOTH ICONS
        eyeIcons.forEach(icon => {
            icon.classList.toggle("hidden");
        });

        // TOGGLE pin VISIBILITY
        if (pinHide.classList.contains("hidden")) {
            pinInput.type="text";
        } else {
            pinInput.type="password";   
        }

    });
});

[loginInput, pinInput].forEach(input => {
    input.addEventListener('input', checkInputs);
    input.addEventListener('keydown', checkEnter);
})

function checkEnter(keyPressed) {
    if (keyPressed.key === 'Enter') {
            login();
        }
}

function checkInputs() {
    if (loginInput.value && pinInput.value) {
        loginBtn.disabled = false;
        loginBtn.style.cursor = 'pointer';
        loginBtn.style.backgroundColor = 'var(--myBlue)';

    } else {
        loginBtn.disabled = true;
        loginBtn.style.cursor = 'default';
        loginBtn.style.backgroundColor = 'white';
    }
}

function login() {
    const promise = axios.get("https://689688bc250b078c203facac.mockapi.io/api/users?name=" + loginInput.value);
    promise.then(response => {

        if (response.data.length > 0) {
            if (response.data[0].name === loginInput.value && response.data[0].pin === pinInput.value) {
                const tasksList = response.data[0].tasks;
                const user = response.data[0].name;
                const userId = response.data[0].id;
                localStorage.setItem("tasksList", JSON.stringify(tasksList));
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("userId", JSON.stringify(userId));
                
                setTimeout(() => {
                    window.location.replace('tasks.html');
                }, 250);
    
            } else {
                const errorText = document.querySelector(".error-text");
                errorText.innerHTML = 'Invalid PIN, try again';
                pinInput.value = '';
                checkInputs();
                pinInput.focus()
            }
        } else {
            checkSignUp();
            loginInput.focus();
            const errorText = document.querySelector(".error-text");
            errorText.innerHTML = 'User not found, maybe click sign-up?';
        }
    });

    promise.catch(error => {
        const errorText = document.querySelector(".error-text");
        errorText.innerHTML = 'Unexpected error, try again later';
    })

}

function checkSignUp() {
    signUpBtn.style.animation = 'none';
    signUpBtn.offsetHeight;
    signUpBtn.style.animation = 'scaleup 1s';
}

function clearInputs() {
    loginInput.value = '';
    pinInput.value = '';
}