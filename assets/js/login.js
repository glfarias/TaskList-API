const eyeIcons = [
    document.getElementById("pin-show"), 
    document.getElementById("pin-hide")
]

const loginInput = document.getElementById("login-input");
const pinInput = document.getElementById("pin-input");
const pinHide = document.getElementById("pin-hide");
const loginBtn = document.getElementById("login-button");
const signUpBtn = document.getElementById('signup-button');
const errorText = document.getElementById('error-text');

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

    if (!loginInput.value.trim() || !pinInput.value.trim()) {
        errorText.innerHTML = 'Login and PIN required';
        return;
    }
    console.log(`https://689688bc250b078c203facac.mockapi.io/api/users?name=${encodeURIComponent(loginInput.value.trim())}`);
    axios.get(`https://689688bc250b078c203facac.mockapi.io/api/users?name=${encodeURIComponent(loginInput.value.trim())}`)
    .then((response) => {
        if (response.data.length > 0) {
            errorText.innerHTML = ('User already exists, try logging in')
        } else {
            const user = loginInput.value.trim();
            const pin = pinInput.value.trim();
            const tasksList = [];
            const newUserObject = new User(user, pin, tasksList);
            createNewUser(newUserObject)
        }
    })
    .catch((error) => {

        if (error.status === 404) {
            const user = loginInput.value.trim();
            const pin = pinInput.value.trim();
            const tasksList = [];
            const newUserObject = new User(user, pin, tasksList);
            createNewUser(newUserObject)
        } else {
            errorText.innerHTML = ('Unexpected error, try again later');
            console.log(error)
        }
    })
}

function createNewUser(newUserObject) {
    axios.post("https://689688bc250b078c203facac.mockapi.io/api/users", newUserObject)
    .then(response => {
        const newUserCreated = response.data;
        localStorage.setItem("tasksList", JSON.stringify(newUserCreated.tasks));
        localStorage.setItem("user", JSON.stringify(newUserCreated.name));
        localStorage.setItem("userId", JSON.stringify(newUserCreated.id));
        window.location.replace('tasks.html');
    })
    .catch(error => {
        errorText.innerHTML = ('Error creating user, try again later');
        console.log(error);
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
    if (!loginInput.value.trim() || !pinInput.value.trim()) {
        errorText.innerHTML = 'Login and PIN required';
        return;
    }

    axios.get(`https://689688bc250b078c203facac.mockapi.io/api/users?name=${encodeURIComponent(loginInput.value.trim())}`)
    .then(response => {
        if (response.data.length == 0) {
            handleUserNotFound();
        } else {
            if (response.data[0].name === loginInput.value.trim() && response.data[0].pin === pinInput.value.trim()) {
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
                errorText.innerHTML = 'Invalid PIN, try again';
                pinInput.value = '';
                checkInputs();
                pinInput.focus()
            }
        }
    })
    .catch(error => {
        if (error.response && error.response.status === 404) {
            handleUserNotFound();
        } else {
            errorText.innerHTML = 'Unexpected error, try again later';
            console.log(error)
        }
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

function handleUserNotFound() {
    checkSignUp();
    loginInput.focus();
    errorText.innerHTML = 'User not found, maybe click sign-up?';
}