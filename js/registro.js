/* =============================================
   REGISTRO.JS — Lógica página de Registro
   Sistema de Control de Acceso Vehicular
   Universidad Libre Cúcuta
============================================= */

// --- Validación en tiempo real de la placa (formato colombiano: AAA000 o AA000A) ---
function validarPlaca(valor) {
  const regex = /^[A-Za-z]{3}\d{3}$|^[A-Za-z]{2}\d{3}[A-Za-z]$/;
  return regex.test(valor.trim().toUpperCase());
}

// --- Formatear placa a mayúsculas automáticamente ---
document.querySelectorAll('input[name="placa"], input[id="placa"], input[id="ind-placa"], input[id="vis-placa"], input[id="inh-placa"]')
  .forEach(function(input) {
    input.addEventListener('input', function() {
      this.value = this.value.toUpperCase();
    });
  });

// --- Validación del formulario principal al enviar ---
const formRegistro = document.querySelector('#registro-usuario form[method="post"]');
if (formRegistro) {
  formRegistro.addEventListener('submit', function(e) {
    e.preventDefault();

    const cedula    = document.getElementById('cedula');
    const nombre    = document.getElementById('nombre');
    const email     = document.getElementById('email');
    const celular   = document.getElementById('celular');
    const placa     = document.getElementById('placa');
    const fechaIni  = document.getElementById('fecha-inicio');
    const fechaFin  = document.getElementById('fecha-fin');
    const terminos  = document.querySelector('input[name="terminos"]');

    let errores = [];

    // Cédula: solo números
    if (!/^\d{6,12}$/.test(cedula.value.trim())) {
      errores.push('La cédula debe tener entre 6 y 12 dígitos numéricos.');
      resaltarError(cedula);
    } else limpiarError(cedula);

    // Nombre
    if (nombre.value.trim().length < 4) {
      errores.push('Ingrese su nombre completo.');
      resaltarError(nombre);
    } else limpiarError(nombre);

    // Email institucional
    if (!email.value.includes('@unilibre.edu.co') && !email.value.includes('@')) {
      errores.push('Ingrese un correo electrónico válido.');
      resaltarError(email);
    } else limpiarError(email);

    // Celular
    if (!/^3\d{9}$/.test(String(celular.value).trim())) {
      errores.push('El número WhatsApp debe ser colombiano (10 dígitos, empieza en 3).');
      resaltarError(celular);
    } else limpiarError(celular);

    // Placa
    if (!validarPlaca(placa.value)) {
      errores.push('Placa inválida. Use formato colombiano: ABC123.');
      resaltarError(placa);
    } else limpiarError(placa);

    // Fechas
    if (fechaIni.value && fechaFin.value) {
      if (new Date(fechaFin.value) <= new Date(fechaIni.value)) {
        errores.push('La fecha fin debe ser posterior a la fecha inicio.');
        resaltarError(fechaFin);
      } else limpiarError(fechaFin);
    }

    // Términos
    if (!terminos.checked) {
      errores.push('Debe aceptar los términos y condiciones.');
    }

    if (errores.length > 0) {
      mostrarAlerta(errores.join('\n'), 'error');
    } else {
      mostrarAlerta(' Usuario y vehículo registrados correctamente. Su solicitud está pendiente de aprobación.', 'exito');
      setTimeout(function() { formRegistro.reset(); }, 2500);
    }
  });
}

// --- Formulario inhabilitar vehículo ---
const formInhabilitar = document.querySelector('form input[id="inh-placa"]');
if (formInhabilitar) {
  formInhabilitar.closest('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const placa = document.getElementById('inh-placa').value.trim().toUpperCase();
    if (!validarPlaca(placa)) {
      mostrarAlerta('Placa inválida. Verifique el formato.', 'error');
      return;
    }
    mostrarAlerta(' Vehículo ' + placa + ' inhabilitado correctamente.', 'exito');
    this.reset();
  });
}

// --- Formulario carga masiva --- 
const formArchivo = document.querySelector('input[type="file"]');
if (formArchivo) {
  formArchivo.closest('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const archivo = formArchivo.files[0];
    if (!archivo) {
      mostrarAlerta('Seleccione un archivo CSV o XLS.', 'error');
      return;
    }
    const ext = archivo.name.split('.').pop().toLowerCase();
    if (!['csv', 'xls', 'xlsx'].includes(ext)) {
      mostrarAlerta('Solo se permiten archivos .csv, .xls o .xlsx', 'error');
      return;
    }
    mostrarAlerta(' Archivo "' + archivo.name + '" cargado. Procesando...', 'exito');
  });
}

// --- Formulario visitante no autorizado ---
const formVisitante = document.querySelector('input[id="vis-nombre"]');
if (formVisitante) {
  formVisitante.closest('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const placa = document.getElementById('vis-placa').value.trim().toUpperCase();
    if (!validarPlaca(placa)) {
      mostrarAlerta('Placa inválida para el visitante.', 'error');
      return;
    }
    mostrarAlerta(' Visitante registrado con placa ' + placa + '.', 'exito');
    this.reset();
  });
}

// --- Funciones de utilidad ---
function resaltarError(campo) {
  campo.style.borderColor = '#c0392b';
  campo.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.15)';
}

function limpiarError(campo) {
  campo.style.borderColor = '';
  campo.style.boxShadow = '';
}

function mostrarAlerta(mensaje, tipo) {
  const viejo = document.getElementById('alerta-registro');
  if (viejo) viejo.remove();

  const div = document.createElement('div');
  div.id = 'alerta-registro';
  div.style.cssText = [
    'position:fixed', 'top:1.5rem', 'right:1.5rem', 'z-index:9999',
    'max-width:380px', 'padding:1rem 1.4rem',
    'border-radius:8px', 'font-size:0.93rem', 'font-weight:600',
    'box-shadow:0 4px 20px rgba(0,0,0,0.15)',
    'white-space:pre-line', 'line-height:1.5'
  ].join(';');

  if (tipo === 'exito') {
    div.style.background = '#e8f8f0';
    div.style.color = '#1e6e42';
    div.style.border = '1.5px solid #27ae60';
  } else {
    div.style.background = '#fdecea';
    div.style.color = '#c0392b';
    div.style.border = '1.5px solid #e74c3c';
  }

  div.textContent = mensaje;
  document.body.appendChild(div);
  setTimeout(function() { div.remove(); }, 4000);
}
