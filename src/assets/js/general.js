// const cloud = document.getElementById("icloud");
// const barraLateral = document.querySelector(".barraLateral");
// const spans = document.querySelectorAll("span");
// const main = document.querySelector("main");

// cloud.addEventListener("click", ()=>{
//     barraLateral.classList.toggle("miniBarra");
//     main.classList.toggle("min-main");
//     spans.forEach((span)=> {
//         span.classList.toggle("oculto");
//     });
// });

const cloud = document.getElementById("icloud");
const barraLateral = document.querySelector(".barraLateral");
const spans = document.querySelectorAll("span");
const main = document.querySelector("main");

// Función para contraer/expandir la barra
function toggleBarra() {
  barraLateral.classList.toggle("miniBarra");
  main.classList.toggle("min-main");
  cloud.classList.toggle("bee-dif");
  spans.forEach((span) => {
    span.classList.toggle("oculto");
  });
}

// Evento click manual (usuario)
cloud.addEventListener("click", toggleBarra);

// Detectar cambios en el tamaño de la pantalla
const mediaQuery = window.matchMedia("(max-width: 870px)");

function handleResponsive(e) {
  if (e.matches) {
    // Pantalla < 760px: Contraer barra (si no está ya contraída)
    if (!barraLateral.classList.contains("miniBarra")) {
        toggleBarra(); // Simula el click
    }
  } else {
    // Pantalla > 760px: Expandir barra (si está contraída)
    if (barraLateral.classList.contains("miniBarra")) {
        toggleBarra(); // Simula el click nuevamente
    }
  }
}

// Ejecutar al cargar y al cambiar el tamaño
mediaQuery.addListener(handleResponsive);
handleResponsive(mediaQuery); // Verificar estado inicial