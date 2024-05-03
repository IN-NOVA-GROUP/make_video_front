//variables globales
const carruselImagenes = document.querySelector(".carrusel-imagenes");
const ventanaModal = document.querySelector(".ventanaModal");
const form = document.querySelector(".formulario");
let imgSeleccionada;
let mensajeListo;
let numeroCel;
let nombreUser;
let nombreDestinatario;

document.addEventListener("DOMContentLoaded", function () {
    const nombreUsuario = document.getElementById("nombreUsuario");
    const nombreRemitente = document.getElementById("nombreRemitente");
    const celular = document.getElementById("celular");
    const mensaje = document.getElementById("mensaje");
    let formularioEnviado = false;

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitamos que el formulario se envíe automáticamente

        // Realizamos las validaciones
        let errores = [];

        if (nombreUsuario.value.trim() === "") {
            errores.push("Por favor, ingresa tu nombre.");
        }

        if (nombreRemitente.value.trim() === "") {
            errores.push("Por favor, ingresa el nombre del destinatario.");
        }

        const celularRegex = /^[0-9]{12}$/;
        if (!celularRegex.test(celular.value.trim())) {
            errores.push("El número de teléfono debe contener 10 dígitos numéricos.");
        }

        if (mensaje.value.trim() === "") {
            errores.push("Por favor, ingresa un mensaje.");
        }

        // Si hay errores, los mostramos
        if (errores.length > 0) {
            alert(errores.join("\n"));
            return; // Detenemos el proceso
        }
        // Si no hay errores el formulario se envía, se oculta y se muestra el carrusel de imagenes
        formularioEnviado = true;

        //verificar datos en consola
        // console.log(nombreUsuario.value);
        // console.log(nombreRemitente.value);
        // console.log(celular.value);
        // console.log(mensaje.value);

        if (formularioEnviado) {
            form.style.display = "none";
            carruselImagenes.style.display = "block";
            mensajeListo = mensaje.value;
            numeroCel = celular.value;
            nombreDestinatario = nombreRemitente.value;
            nombreUser = nombreUsuario.value;
            // console.log("Mensaje listo", mensajeListo);
        }
        form.reset();
    });
});

//Trear imagenes del back

const URL = "https://videoangelicaldemo.onrender.com/api/v1/imgs";
fetch(URL)
    .then((res) => res.json())
    .then((data) => {
        // console.log("Numero de imagenes que recibe:", data.length);
        const contenedorImg = document.querySelector(".contenedor-img");
        for (let i = 0; i < data.imgs.length; i++) {
            const img = document.createElement("img");
            img.src = data.imgs[i].url;
            contenedorImg.appendChild(img);
        }
        const imagenes = document.querySelectorAll(".contenedor-img img");
        for (const img of imagenes) {
            img.addEventListener("click", () => {
                const imgSRC = img.src;

                //Actualizar el src en la ventana modal
                const imgModal = document.querySelector(".imgModal");
                imgModal.src = imgSRC;
                ventanaModal.style.display = "flex";

                //Guardar la direccion src
                imgSeleccionada = imgSRC.substring(imgSRC.lastIndexOf("/") + 1);
                console.log(imgSeleccionada);
            });
        }
    });

const cerrarModal = document.querySelector(".btnCancelar");
cerrarModal.addEventListener("click", () => {
    ventanaModal.style.display = "none";
});

const ventanaMensaje = document.querySelector(".VentanaMensaje");
const botonCerrar = document.querySelector(".cerrar");
const btnConfirmar = document.querySelector(".btnConfirmar");
btnConfirmar.addEventListener("click", () => {
    //ocultar ventana modal
    ventanaModal.style.display = "none";

    //ocultar carrusel de imagenes
    carruselImagenes.style.display = "none";

    //mostrar formulario
    form.style.display = "flex";

    //mostrar ventana con mensaje de espera
    ventanaMensaje.style.display = "flex";

    document.querySelector("#MensajeEspera").textContent = "Creando video...";

    // Enviar el mensaje y la imagen seleccionada al back
    // code here...
    const datos = {
        de: nombreUser,
        para: nombreDestinatario,
        imagen: imgSeleccionada,
        numero: numeroCel,
        mensaje: mensajeListo,
    };

    const URL_BACK = "https://videoangelicaldemo.onrender.com/api/v1/generate";

    const opciones = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    };

    //Realizar la solicitud POST al backned
    fetch(URL_BACK, opciones)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al enviar datos al servidor");
            }
            return response.json();
        })
        .then((data) => {
            document.querySelector("#MensajeEspera").textContent = data.message;
            setTimeout(() => {
                botonCerrar.style.display = "block";
                // document.querySelector(".btnDescargar").style.display = "block";
                // document.querySelector(".contenedor-video").style.display = "block";
            }, 3000);
        })

        .catch((error) => {
            console.log("Error:", error);
        });
});

// fetch()
//     .then((res) => res.json())
//     .then((data) => {
//         const video = document.querySelector("#videoCreado");
//         video.src = data.url;
//     });

botonCerrar.addEventListener("click", () => {
    ventanaMensaje.style.display = "none";
});
