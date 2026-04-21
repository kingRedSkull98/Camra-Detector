document.addEventListener("DOMContentLoaded", function () {
  iniciarAcceso();
  iniciarRegistroPlaca();
  iniciarBusquedaVehiculo();
  iniciarAlertas();
});

// =============================================
// 1. CONTROL DE ACCESO (Entrada / Salida)
// =============================================
function iniciarAcceso() {
  const formAcceso = document.getElementById("form-acceso");
  if (!formAcceso) return;

  formAcceso.addEventListener("submit", function (e) {
    e.preventDefault();

    const placa = document.getElementById("seg-placa")?.value.trim().toUpperCase();
    const movimiento = document.getElementById("seg-movimiento")?.value;

    if (!validarPlaca(placa)) {
      mostrarMensaje("seg-mensaje", "La placa no es válida.", "error");
      return;
    }

    if (!movimiento) {
      mostrarMensaje("seg-mensaje", "Selecciona Entrada o Salida.", "error");
      return;
    }

    const hora = new Date().toLocaleTimeString("es-CO");
    const fecha = new Date().toLocaleDateString("es-CO");
    const icono = movimiento === "entrada" ? "🟢" : "🔴";

    mostrarMensaje(
      "seg-mensaje",
      `${icono} Placa ${placa} registrada como ${movimiento.toUpperCase()} el ${fecha} a las ${hora}.`,
      "exito"
    );

    agregarFilaRegistro(placa, movimiento, fecha, hora);
    formAcceso.reset();
  });

  const inputPlaca = document.getElementById("seg-placa");
  if (inputPlaca) {
    inputPlaca.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  }
}

// =============================================
// 2. REGISTRO DE PLACA DESCONOCIDA
// =============================================
function iniciarRegistroPlaca() {
  const formDesconocido = document.getElementById("form-desconocido");
  if (!formDesconocido) return;

  formDesconocido.addEventListener("submit", function (e) {
    e.preventDefault();

    const placa = document.getElementById("desc-placa")?.value.trim().toUpperCase();
    const motivo = document.getElementById("desc-motivo")?.value.trim();

    if (!validarPlaca(placa)) {
      mostrarMensaje("desc-mensaje", "La placa no es válida.", "error");
      return;
    }

    if (!motivo || motivo.length < 5) {
      mostrarMensaje("desc-mensaje", "Describe el motivo (mínimo 5 caracteres).", "error");
      return;
    }

    const hora = new Date().toLocaleTimeString("es-CO");
    const fecha = new Date().toLocaleDateString("es-CO");

    mostrarMensaje(
      "desc-mensaje",
      `⚠️ Placa ${placa} registrada como NO AUTORIZADA el ${fecha} a las ${hora}.`,
      "advertencia"
    );

    formDesconocido.reset();
  });

  const inputDescPlaca = document.getElementById("desc-placa");
  if (inputDescPlaca) {
    inputDescPlaca.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  }
}

// =============================================
// 3. BÚSQUEDA DE VEHÍCULO
// =============================================
function iniciarBusquedaVehiculo() {
  const btnBuscar = document.getElementById("btn-buscar-vehiculo");
  if (!btnBuscar) return;

  btnBuscar.addEventListener("click", function () {
    const placa = document.getElementById("buscar-placa")?.value.trim().toUpperCase();
    const resultado = document.getElementById("resultado-busqueda");

    if (!resultado) return;

    if (!validarPlaca(placa)) {
      resultado.textContent = "Escribe una placa válida para buscar.";
      resultado.className = "seg-resultado error";
      return;
    }

    const vehiculoEncontrado = buscarEnBaseDatos(placa);

    if (vehiculoEncontrado) {
      resultado.textContent = `✅ Placa ${placa} — ${vehiculoEncontrado.propietario} (${vehiculoEncontrado.tipo}) — Vigencia: ${vehiculoEncontrado.vigencia}`;
      resultado.className = "seg-resultado exito";
    } else {
      resultado.textContent = `❌ Placa ${placa} no encontrada en el sistema.`;
      resultado.className = "seg-resultado error";
    }
  });

  const inputBuscar = document.getElementById("buscar-placa");
  if (inputBuscar) {
    inputBuscar.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  }
}

// =============================================
// 4. ALERTAS DE ACCESO NO AUTORIZADO
// =============================================
function iniciarAlertas() {
  const btnAlerta = document.getElementById("btn-nueva-alerta");
  if (!btnAlerta) return;

  btnAlerta.addEventListener("click", function () {
    const placa = document.getElementById("alerta-placa")?.value.trim().toUpperCase();
    const lista = document.getElementById("lista-alertas");

    if (!validarPlaca(placa)) {
      alert("Placa no válida.");
      return;
    }

    if (!lista) return;

    const hora = new Date().toLocaleTimeString("es-CO");
    const item = document.createElement("li");
    item.textContent = `🚨 ${hora} — Acceso no autorizado: ${placa}`;
    lista.prepend(item);

    document.getElementById("alerta-placa").value = "";
  });

  const inputAlerta = document.getElementById("alerta-placa");
  if (inputAlerta) {
    inputAlerta.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  }
}

// =============================================
// FUNCIONES DE APOYO
// =============================================
function validarPlaca(placa) {
  const regex = /^[A-Z0-9]{5,7}$/;
  return regex.test(placa);
}

function mostrarMensaje(idElemento, texto, tipo) {
  const el = document.getElementById(idElemento);
  if (!el) return;

  el.textContent = texto;
  el.className = `seg-mensaje ${tipo}`;

  setTimeout(() => {
    el.textContent = "";
    el.className = "seg-mensaje";
  }, 5000);
}

function agregarFilaRegistro(placa, movimiento, fecha, hora) {
  const tabla = document.getElementById("tabla-accesos-body");
  if (!tabla) return;

  const icono = movimiento === "entrada" ? "🟢" : "🔴";
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${placa}</td>
    <td>${fecha}</td>
    <td>${hora}</td>
    <td>${icono} ${movimiento.charAt(0).toUpperCase() + movimiento.slice(1)}</td>
  `;
  tabla.prepend(fila);
}

function buscarEnBaseDatos(placa) {
  const vehiculos = [
    { placa: "ABC123", propietario: "Carlos Pérez", tipo: "Docente", vigencia: "31/12/2026" },
    { placa: "XYZ789", propietario: "María López", tipo: "Administrativo", vigencia: "30/06/2026" },
    { placa: "LMN456", propietario: "Juan García", tipo: "Estudiante", vigencia: "31/12/2025" },
  ];
  return vehiculos.find(v => v.placa === placa) || null;
}