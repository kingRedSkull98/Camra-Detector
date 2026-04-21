document.addEventListener("DOMContentLoaded", function () {
  iniciarSimuladorWhatsapp();
  iniciarFiltroHistorial();
  iniciarBurbujaDemo();
});

// =============================================
// DATOS SIMULADOS DE NOTIFICACIONES
// =============================================
const notificaciones = [
  { placa: "ABC123", propietario: "Carlos Pérez",  celular: "300 123 4567", evento: "Ingreso al campus",  fecha: "22/03/2026", hora: "07:30", estado: "Enviado" },
  { placa: "XYZ789", propietario: "María López",   celular: "311 987 6543", evento: "Salida del campus",  fecha: "22/03/2026", hora: "17:00", estado: "Enviado" },
  { placa: "LMN456", propietario: "Juan García",   celular: "315 456 7890", evento: "Ingreso al campus",  fecha: "23/03/2026", hora: "09:00", estado: "Enviado" },
  { placa: "PQR321", propietario: "Ana Torres",    celular: "320 333 2211", evento: "Acceso no autorizado", fecha: "24/03/2026", hora: "10:30", estado: "Pendiente" },
];

// =============================================
// 1. SIMULADOR: GENERAR NOTIFICACIÓN WHATSAPP
// =============================================
function iniciarSimuladorWhatsapp() {
  const btnSimular = document.getElementById("btn-simular-whatsapp");
  if (!btnSimular) return;

  btnSimular.addEventListener("click", function () {
    const placa    = document.getElementById("wa-placa")?.value.trim().toUpperCase();
    const celular  = document.getElementById("wa-celular")?.value.trim();
    const evento   = document.getElementById("wa-evento")?.value;

    if (!placa || placa.length < 5) {
      mostrarMensajeWA("wa-mensaje", "Escribe una placa válida.", "error");
      return;
    }

    if (!celular || celular.length < 7) {
      mostrarMensajeWA("wa-mensaje", "Escribe un número de celular válido.", "error");
      return;
    }

    if (!evento) {
      mostrarMensajeWA("wa-mensaje", "Selecciona el tipo de evento.", "error");
      return;
    }

    const ahora = new Date();
    const fecha = ahora.toLocaleDateString("es-CO");
    const hora  = ahora.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

    actualizarBurbujaWhatsapp(placa, fecha, hora, evento);
    agregarFilaHistorial(placa, "-", celular, evento, `${fecha} — ${hora}`, "Enviado");
    mostrarMensajeWA("wa-mensaje", `✅ Notificación simulada enviada a ${celular} para placa ${placa}.`, "exito");

    document.getElementById("wa-placa").value   = "";
    document.getElementById("wa-celular").value = "";
    document.getElementById("wa-evento").value  = "";
  });

  const inputPlaca = document.getElementById("wa-placa");
  if (inputPlaca) {
    inputPlaca.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  }
}

// =============================================
// 2. FILTRO DEL HISTORIAL POR PLACA
// =============================================
function iniciarFiltroHistorial() {
  const inputFiltro = document.getElementById("filtro-historial");
  if (!inputFiltro) return;

  inputFiltro.addEventListener("input", function () {
    const texto = this.value.toLowerCase().trim();
    const filas = document.querySelectorAll("#historial-body tr");

    filas.forEach(function (fila) {
      const contenido = fila.textContent.toLowerCase();
      fila.style.display = contenido.includes(texto) ? "" : "none";
    });
  });
}

// =============================================
// 3. BURBUJA DEMO INTERACTIVA
// =============================================
function iniciarBurbujaDemo() {
  const burbuja = document.querySelector(".burbuja-whatsapp");
  if (!burbuja) return;

  burbuja.style.cursor = "pointer";
  burbuja.title = "Haz clic para simular una nueva notificación de ejemplo";

  const demos = [
    { placa: "ABC123", evento: "Ingreso autorizado al campus", hora: "07:30 AM" },
    { placa: "XYZ789", evento: "Salida del campus registrada",  hora: "05:00 PM" },
    { placa: "LMN456", evento: "Ingreso autorizado al campus",  hora: "09:15 AM" },
    { placa: "PQR321", evento: "Acceso no autorizado detectado", hora: "10:45 AM" },
  ];

  let indice = 0;

  burbuja.addEventListener("click", function () {
    indice = (indice + 1) % demos.length;
    const demo = demos[indice];
    const hoy  = new Date().toLocaleDateString("es-CO");

    actualizarBurbujaWhatsapp(demo.placa, hoy, demo.hora, demo.evento);
  });
}

// =============================================
// FUNCIONES DE APOYO
// =============================================
function actualizarBurbujaWhatsapp(placa, fecha, hora, evento) {
  const burbujaPlaca  = document.getElementById("demo-placa");
  const burbujaFecha  = document.getElementById("demo-fecha");
  const burbujaHora   = document.getElementById("demo-hora");
  const burbujaEvento = document.getElementById("demo-evento");

  if (burbujaPlaca)  burbujaPlaca.textContent  = placa;
  if (burbujaFecha)  burbujaFecha.textContent  = fecha;
  if (burbujaHora)   burbujaHora.textContent   = hora;
  if (burbujaEvento) burbujaEvento.textContent = evento;
}

function agregarFilaHistorial(placa, propietario, celular, evento, fechaHora, estado) {
  const tbody = document.getElementById("historial-body");
  if (!tbody) return;

  const icono  = estado === "Enviado" ? "✅" : "⏳";
  const fila   = document.createElement("tr");
  fila.innerHTML = `
    <td>${placa}</td>
    <td>${propietario}</td>
    <td>${celular}</td>
    <td>${evento}</td>
    <td>${fechaHora}</td>
    <td>${icono} ${estado}</td>
  `;
  tbody.prepend(fila);
}

function mostrarMensajeWA(idElemento, texto, tipo) {
  const el = document.getElementById(idElemento);
  if (!el) return;

  el.textContent = texto;
  el.className   = `wa-mensaje ${tipo}`;

  setTimeout(() => {
    el.textContent = "";
    el.className   = "wa-mensaje";
  }, 5000);
}