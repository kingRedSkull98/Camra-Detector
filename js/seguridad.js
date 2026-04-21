/* =============================================
   SEGURIDAD.JS — Lógica Panel Empresa de Seguridad
   Sistema de Control de Acceso Vehicular
   Universidad Libre Cúcuta
============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // --- Formatear placa a mayúsculas en tiempo real ---
  document.querySelectorAll('.form-seguridad input[name="placa"], #vis-placa').forEach(function (input) {
    input.addEventListener('input', function () {
      this.value = this.value.toUpperCase();
    });
  });

  // --- Formulario autorizar vehículo no registrado ---
  const formAutorizar = document.querySelector('.form-seguridad');
  if (formAutorizar) {
    formAutorizar.addEventListener('submit', function (e) {
      e.preventDefault();

      const placa   = this.querySelector('input[name="placa"]');
      const nombre  = this.querySelector('input[name="nombre"], input[id="vis-nombre"]');
      const cedula  = this.querySelector('input[name="cedula"], input[id="vis-cedula"]');

      let error = false;

      if (placa && !validarPlaca(placa.value)) {
        placa.style.borderColor = '#c0392b';
        placa.style.boxShadow   = '0 0 0 3px rgba(192,57,43,0.15)';
        mostrarAlerta('Placa inválida. Verifique el formato colombiano (Ej: STU222).', 'error');
        error = true;
      } else if (placa) {
        placa.style.borderColor = '';
        placa.style.boxShadow   = '';
      }

      if (!error) {
        const placaVal  = placa  ? placa.value.trim().toUpperCase()  : 'N/A';
        const nombreVal = nombre ? nombre.value.trim() : 'N/A';

        // Añadir registro al historial de autorizaciones manuales
        agregarRegistroSeguridad(placaVal, nombreVal);

        mostrarAlerta(' Vehículo ' + placaVal + ' autorizado manualmente por seguridad.', 'exito');
        this.reset();
      }
    });
  }

  // --- Añadir fila en historial de autorizaciones manuales ---
  function agregarRegistroSeguridad(placa, nombre) {
    const tbody = document.querySelector('.historial-seguridad tbody');
    if (!tbody) return;

    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-CO');
    const hora  = ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

    const fila = document.createElement('tr');
    fila.innerHTML =
      '<td>' + placa + '</td>' +
      '<td>' + nombre + '</td>' +
      '<td>' + fecha + '</td>' +
      '<td>' + hora + '</td>' +
      '<td>Entrada</td>' +
      '<td><span class="pendiente"> Por seguridad</span></td>';

    fila.style.background = '#fff5d6';
    setTimeout(function () { fila.style.background = ''; }, 2000);
    tbody.insertBefore(fila, tbody.firstChild);
  }

  // --- Validar formato de placa colombiana ---
  function validarPlaca(valor) {
    const regex = /^[A-Za-z]{3}\d{3}$|^[A-Za-z]{2}\d{3}[A-Za-z]$/;
    return regex.test(valor.trim().toUpperCase());
  }

  // --- Alerta inline ---
  function mostrarAlerta(mensaje, tipo) {
    const viejo = document.getElementById('alerta-seguridad');
    if (viejo) viejo.remove();
    const div = document.createElement('div');
    div.id = 'alerta-seguridad';
    div.textContent = mensaje;
    Object.assign(div.style, {
      position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: '9999',
      maxWidth: '360px', padding: '0.9rem 1.3rem', borderRadius: '8px',
      fontWeight: '600', fontSize: '0.93rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      background: tipo === 'exito' ? '#e8f8f0' : '#fdecea',
      color:      tipo === 'exito' ? '#1e6e42' : '#c0392b',
      border: '1.5px solid ' + (tipo === 'exito' ? '#27ae60' : '#e74c3c')
    });
    document.body.appendChild(div);
    setTimeout(function () { div.remove(); }, 4000);
  }

});
