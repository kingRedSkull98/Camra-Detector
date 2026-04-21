const registros = [
  { placa: "ABC123", propietario: "Carlos Pérez", tipo: "Docente", fecha: "2026-03-22", hora: "07:30", movimiento: "Entrada" },
  { placa: "XYZ789", propietario: "María López", tipo: "Administrativo", fecha: "2026-03-22", hora: "08:15", movimiento: "Entrada" },
  { placa: "ABC123", propietario: "Carlos Pérez", tipo: "Docente", fecha: "2026-03-22", hora: "17:45", movimiento: "Salida" },
  { placa: "LMN456", propietario: "Juan García", tipo: "Estudiante", fecha: "2026-03-23", hora: "09:00", movimiento: "Entrada" },
  { placa: "PQR321", propietario: "Ana Torres", tipo: "Visitante", fecha: "2026-03-24", hora: "10:30", movimiento: "Entrada" },
  { placa: "PQR321", propietario: "Ana Torres", tipo: "Visitante", fecha: "2026-03-24", hora: "14:00", movimiento: "Salida" }
];

document.addEventListener("DOMContentLoaded", () => {
  iniciarReporte();
  cargarEstadisticas();
  mostrarEnPantalla(registros);
});

function iniciarReporte() {
  const form = document.getElementById("form-reporte");

  if (!form) {
    console.error("No existe el formulario con id form-reporte");
    return;
  }

  form.addEventListener("submit", manejarEnvioReporte);
}

function manejarEnvioReporte(e) {
  e.preventDefault();

  const desde = document.getElementById("rep-desde").value;
  const hasta = document.getElementById("rep-hasta").value;
  const formato = document.querySelector('input[name="formato"]:checked')?.value || "pantalla";

  if (!validarFechas(desde, hasta)) return;

  const filtrados = filtrarRegistrosPorFecha(desde, hasta);
  const mensaje = document.getElementById("mensaje-vacio");

  limpiarTabla();

  if (filtrados.length === 0) {
    if (mensaje) mensaje.style.display = "block";
    return;
  }

  if (mensaje) mensaje.style.display = "none";

  if (formato === "pantalla") {
    mostrarEnPantalla(filtrados);
  }

  if (formato === "excel") {
    exportarExcel(filtrados);
  }

  if (formato === "pdf") {
    exportarPDF(filtrados, desde, hasta);
  }
}

function validarFechas(desde, hasta) {
  if (!desde || !hasta) {
    alert("Debes seleccionar fecha desde y fecha hasta.");
    return false;
  }

  if (desde > hasta) {
    alert("La fecha desde no puede ser mayor que la fecha hasta.");
    return false;
  }

  return true;
}

function filtrarRegistrosPorFecha(desde, hasta) {
  return registros.filter(registro => registro.fecha >= desde && registro.fecha <= hasta);
}

function limpiarTabla() {
  const cuerpo = document.getElementById("cuerpo-tabla");
  if (cuerpo) cuerpo.innerHTML = "";
}

function mostrarEnPantalla(datos) {
  const cuerpo = document.getElementById("cuerpo-tabla");

  if (!cuerpo) {
    console.error("No existe tbody con id cuerpo-tabla");
    return;
  }

  cuerpo.innerHTML = datos.map(registro => `
    <tr>
      <td>${registro.placa}</td>
      <td>${registro.propietario}</td>
      <td>${registro.tipo}</td>
      <td>${formatearFecha(registro.fecha)}</td>
      <td>${registro.hora}</td>
      <td>${registro.movimiento}</td>
    </tr>
  `).join("");
}

function formatearFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
}

function cargarEstadisticas() {
  const totalVehiculos = document.getElementById("total-vehiculos");
  const ingresosHoy = document.getElementById("ingresos-hoy");

  const placasUnicas = new Set(registros.map(r => r.placa));
  const hoy = new Date().toISOString().split("T")[0];
  const totalIngresosHoy = registros.filter(r => r.fecha === hoy && r.movimiento === "Entrada").length;

  if (totalVehiculos) totalVehiculos.textContent = placasUnicas.size;
  if (ingresosHoy) ingresosHoy.textContent = totalIngresosHoy;
}

function exportarExcel(datos) {
  if (typeof XLSX === "undefined") {
    alert("No se cargó la librería XLSX.");
    return;
  }

  const data = datos.map(registro => ({
    Placa: registro.placa,
    Propietario: registro.propietario,
    Tipo: registro.tipo,
    Fecha: formatearFecha(registro.fecha),
    Hora: registro.hora,
    Movimiento: registro.movimiento
  }));

  const hoja = XLSX.utils.json_to_sheet(data);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Reporte");
  XLSX.writeFile(libro, "reporte_accesos.xlsx");
}

function exportarPDF(datos, desde, hasta) {
  if (typeof window.jspdf === "undefined") {
    alert("No se cargó la librería jsPDF.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text(`Reporte de accesos (${formatearFecha(desde)} - ${formatearFecha(hasta)})`, 14, 15);

  const columnas = [["Placa", "Propietario", "Tipo", "Fecha", "Hora", "Movimiento"]];
  const filas = datos.map(registro => [
    registro.placa,
    registro.propietario,
    registro.tipo,
    formatearFecha(registro.fecha),
    registro.hora,
    registro.movimiento
  ]);

  doc.autoTable({
    head: columnas,
    body: filas,
    startY: 25
  });

  doc.save("reporte_accesos.pdf");
}