document.addEventListener("DOMContentLoaded", function () {
  iniciarFormularioHabilitar();
  iniciarCargaMasiva();
  iniciarRegistroIndividual();
  iniciarRegistroNoAutorizado();
});

// =============================================
// 1. HABILITAR VEHÍCULO
// =============================================
function iniciarFormularioHabilitar() {
  const form = document.querySelector("#administrador form:first-of-type");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const placa = document.getElementById("adm-placa").value.trim().toUpperCase();
    const cedula = document.getElementById("adm-cedula").value.trim();
    const vigencia = document.getElementById("adm-vigencia").value;

    if (!validarPlaca(placa)) {
      mostrarAlerta("La placa debe tener entre 5 y 7 caracteres alfanuméricos.", "error");
      return;
    }

    if (!cedula) {
      mostrarAlerta("La cédula es obligatoria.", "error");
      return;
    }

    if (!vigencia) {
      mostrarAlerta("La fecha de vigencia es obligatoria.", "error");
      return;
    }

    const hoy = new Date().toISOString().split("T")[0];
    if (vigencia < hoy) {
      mostrarAlerta("La fecha de vigencia no puede ser anterior a hoy.", "error");
      return;
    }

    console.log("Vehículo habilitado:", { placa, cedula, vigencia });
    mostrarAlerta(`Vehículo ${placa} habilitado correctamente hasta ${formatearFecha(vigencia)}.`, "exito");
    form.reset();
  });
}

// =============================================
// 2. CARGA MASIVA CSV / XLS
// =============================================
function iniciarCargaMasiva() {
  const formCarga = document.getElementById("archivo")?.closest("form");
  if (!formCarga) return;

  formCarga.addEventListener("submit", function (e) {
    e.preventDefault();

    const archivo = document.getElementById("archivo").files[0];

    if (!archivo) {
      mostrarAlerta("Selecciona un archivo antes de continuar.", "error");
      return;
    }

    const extensionesPermitidas = [".csv", ".xls", ".xlsx"];
    const nombreArchivo = archivo.name.toLowerCase();
    const tieneExtensionValida = extensionesPermitidas.some(ext => nombreArchivo.endsWith(ext));

    if (!tieneExtensionValida) {
      mostrarAlerta("El archivo debe ser .csv, .xls o .xlsx.", "error");
      return;
    }

    console.log("Archivo seleccionado:", archivo.name, "Tamaño:", archivo.size, "bytes");
    mostrarAlerta(`Archivo "${archivo.name}" cargado correctamente. Procesando...`, "exito");
    formCarga.reset();
  });
}

// =============================================
// 3. REGISTRO INDIVIDUAL DE USUARIO
// =============================================
function iniciarRegistroIndividual() {
  const formInd = document.getElementById("ind-cedula")?.closest("form");
  if (!formInd) return;

  formInd.addEventListener("submit", function (e) {
    e.preventDefault();

    const cedula = document.getElementById("ind-cedula").value.trim();
    const nombre = document.getElementById("ind-nombre").value.trim();
    const tipo = document.getElementById("ind-tipo").value;
    const placa = document.getElementById("ind-placa").value.trim().toUpperCase();

    if (!cedula || cedula.length < 6) {
      mostrarAlerta("La cédula debe tener al menos 6 dígitos.", "error");
      return;
    }

    if (!nombre || nombre.length < 3) {
      mostrarAlerta("El nombre completo es obligatorio.", "error");
      return;
    }

    if (!tipo) {
      mostrarAlerta("Debes seleccionar el tipo de usuario.", "error");
      return;
    }

    if (!validarPlaca(placa)) {
      mostrarAlerta("La placa debe tener entre 5 y 7 caracteres alfanuméricos.", "error");
      return;
    }

    console.log("Usuario registrado:", { cedula, nombre, tipo, placa });
    mostrarAlerta(`Usuario ${nombre} registrado correctamente con placa ${placa}.`, "exito");
    formInd.reset();
  });

  const inputPlaca = document.getElementById("ind-placa");
  if (inputPlaca) {
    inputPlaca.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  }

  const admPlaca = document.getElementById("adm-placa");
  if (admPlaca) {
    admPlaca.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  }
}

// =============================================
// 4. REGISTRAR PERSONA NO AUTORIZADA
// =============================================
function iniciarRegistroNoAutorizado() {
  const formVis = document.getElementById("vis-nombre")?.closest("form");
  if (!formVis) return;

  formVis.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("vis-nombre").value.trim();
    const cedula = document.getElementById("vis-cedula").value.trim();
    const placa = document.getElementById("vis-placa").value.trim().toUpperCase();
    const destino = document.getElementById("vis-destino").value.trim();
    const obs = document.getElementById("vis-obs").value.trim();

    if (!nombre || nombre.length < 3) {
      mostrarAlerta("El nombre completo es obligatorio.", "error");
      return;
    }

    if (!cedula) {
      mostrarAlerta("La cédula o documento es obligatorio.", "error");
      return;
    }

    if (!validarPlaca(placa)) {
      mostrarAlerta("La placa debe tener entre 5 y 7 caracteres alfanuméricos.", "error");
      return;
    }

    console.log("Persona no autorizada registrada:", { nombre, cedula, placa, destino, obs });
    mostrarAlerta(`Visitante ${nombre} registrado correctamente con placa ${placa}.`, "exito");
    formVis.reset();
  });

  const visPlaca = document.getElementById("vis-placa");
  if (visPlaca) {
    visPlaca.addEventListener("input", function () {
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

function formatearFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
}

function mostrarAlerta(mensaje, tipo) {
  let contenedor = document.getElementById("alerta-admin");

  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "alerta-admin";
    document.querySelector("#administrador").prepend(contenedor);
  }

  contenedor.textContent = mensaje;
  contenedor.className = tipo === "exito" ? "alerta-exito" : "alerta-error";
  contenedor.style.display = "block";

  setTimeout(() => {
    contenedor.style.display = "none";
  }, 4000);
}