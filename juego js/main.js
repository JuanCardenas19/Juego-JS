// Clases y lógica del juego y autenticación

class Usuario {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}

class Auth {
    constructor() {
        this.users = [];
        this.currentUser = null;
    }

    register(email, password) {
        // Si el usuario ya existe
        if (this.users.find(user => user.email === email)) {
            alert("El correo ya está registrado.");
            return;
        }
        const newUser = new Usuario(email, password);
        this.users.push(newUser);
        alert("Registro exitoso. ¡Ahora puedes iniciar sesión!");
        toggleForms();
    }

    login(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        if (user) {
            this.currentUser = user;
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
        } else {
            alert("Correo o contraseña incorrectos.");
        }
    }

    logout() {
        this.currentUser = null;
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('game-container').style.display = 'none';
    }
}

// Lógica del juego

class Juego {
    constructor() {
        this.puntosUsuario = 0;
        this.puntosPC = 0;
        this.instrucciones = document.querySelector("#instrucciones");
        this.contenedorPuntosUsuario = document.querySelector("#puntos-usuario");
        this.contenedorPuntosPC = document.querySelector("#puntos-computadora");
        this.mensaje = document.querySelector("#mensaje");
        this.contenedorGanaPunto = document.querySelector("#gana-punto");
        this.elegiTuArma = document.querySelector("#elegi-tu-arma");
        this.contenedorEleccionUsuario = document.querySelector("#eleccion-usuario");
        this.contenedorEleccionPC = document.querySelector("#eleccion-computadora");

        this.botonesArmas = document.querySelectorAll(".arma");
        this.reiniciar = document.querySelector("#reiniciar");

        this.botonesArmas.forEach(boton => {
            boton.addEventListener("click", this.iniciarTurno.bind(this));
        });
    }

    iniciarTurno(e) {
        const eleccionUsuario = e.currentTarget.id;
        const eleccionPC = this.obtenerEleccionPC();

        if (this.ganador(eleccionUsuario, eleccionPC) === "usuario") {
            this.ganaUsuario();
        } else if (this.ganador(eleccionUsuario, eleccionPC) === "pc") {
            this.ganaPC();
        } else {
            this.empate();
        }

        this.mostrarElecciones(eleccionUsuario, eleccionPC);

        if (this.puntosUsuario === 5 || this.puntosPC === 5) {
            this.finDelJuego();
        }
    }

    obtenerEleccionPC() {
        const opciones = ["piedra🪨", "papel📋", "tijera✂️", "lagarto🦎", "spock🖖"];
        const aleatorio = Math.floor(Math.random() * 5);
        return opciones[aleatorio];
    }

    ganador(eleccionUsuario, eleccionPC) {
        if (
            (eleccionUsuario === "piedra🪨" && (eleccionPC === "tijera✂️" || eleccionPC === "lagarto🦎")) ||
            (eleccionUsuario === "papel📋" && (eleccionPC === "piedra🪨" || eleccionPC === "spock🖖")) ||
            (eleccionUsuario === "tijera✂️" && (eleccionPC === "papel📋" || eleccionPC === "lagarto🦎")) ||
            (eleccionUsuario === "lagarto🦎" && (eleccionPC === "papel📋" || eleccionPC === "spock🖖")) ||
            (eleccionUsuario === "spock🖖" && (eleccionPC === "piedra🪨" || eleccionPC === "tijera✂️"))
        ) {
            return "usuario";
        } else if (
            (eleccionPC === "piedra🪨" && (eleccionUsuario === "tijera✂️" || eleccionUsuario === "lagarto🦎")) ||
            (eleccionPC === "papel📋" && (eleccionUsuario === "piedra🪨" || eleccionUsuario === "spock🖖")) ||
            (eleccionPC === "tijera✂️" && (eleccionUsuario === "papel📋" || eleccionUsuario === "lagarto🦎")) ||
            (eleccionPC === "lagarto🦎" && (eleccionUsuario === "papel📋" || eleccionUsuario === "spock🖖")) ||
            (eleccionPC === "spock🖖" && (eleccionUsuario === "piedra🪨" || eleccionUsuario === "tijera✂️"))
        ) {
            return "pc";
        } else {
            return "empate";
        }
    }

    ganaUsuario() {
        this.puntosUsuario++;
        this.contenedorPuntosUsuario.innerText = this.puntosUsuario;
        this.contenedorGanaPunto.innerText = "¡Ganaste un punto! 🔥";
    }

    ganaPC() {
        this.puntosPC++;
        this.contenedorPuntosPC.innerText = this.puntosPC;
        this.contenedorGanaPunto.innerText = "¡La computadora ganó un punto! 😭";
    }

    empate() {
        this.contenedorGanaPunto.innerText = "¡Empate! 😱";
    }

    mostrarElecciones(eleccionUsuario, eleccionPC) {
        this.contenedorEleccionUsuario.innerText = eleccionUsuario;
        this.contenedorEleccionPC.innerText = eleccionPC;
        this.mensaje.classList.remove("disabled");
    }

    finDelJuego() {
        if (this.puntosUsuario === 5) {
            this.instrucciones.innerText = "🔥 ¡Ganaste el juego! 🔥";
        }

        if (this.puntosPC === 5) {
            this.instrucciones.innerText = "😭 ¡La computadora ganó el juego! 😭";
        }

        this.elegiTuArma.classList.add("disabled");
        this.reiniciar.classList.remove("disabled");
        this.reiniciar.addEventListener("click", this.reiniciarJuego.bind(this));
    }

    reiniciarJuego() {
        this.reiniciar.classList.add("disabled");
        this.elegiTuArma.classList.remove("disabled");
        this.mensaje.classList.add("disabled");

        this.puntosUsuario = 0;
        this.puntosPC = 0;

        this.contenedorPuntosUsuario.innerText = this.puntosUsuario;
        this.contenedorPuntosPC.innerText = this.puntosPC;

        this.instrucciones.innerText = "El primero en llegar a 5 puntos gana.";
    }
}

// Llamamos a las funciones necesarias para manejar la autenticación
const auth = new Auth();
const juego = new Juego();

// Mostrar y ocultar los formularios de inicio de sesión y registro
function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
}

// Función para registrar al usuario
function register() {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    // Guardar en localStorage
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    alert("¡Te has registrado exitosamente!");
    // Redirigir o mostrar el juego
}

// Función para iniciar sesión
function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    if (email === storedEmail && password === storedPassword) {
        alert("Inicio de sesión exitoso.");
        // Redirigir o mostrar el juego
        showGame();
    } else {
        alert("Correo o contraseña incorrectos.");
    }
}

// Función para mostrar el juego después de iniciar sesión o registrarse
function showGame() {
    document.getElementById("game-container").style.display = "block";
    document.getElementById("auth-container").style.display = "none";
}

function logout() {
    // Eliminar los datos del usuario del localStorage
    localStorage.removeItem('user');

    // Mostrar el formulario de inicio de sesión y ocultar el contenedor del juego
    document.getElementById("auth-container").style.display = "flex";
    document.getElementById("game-container").style.display = "none";

    // Limpiar los campos del formulario
    document.getElementById("login-email").value = '';
    document.getElementById("login-password").value = '';
}


