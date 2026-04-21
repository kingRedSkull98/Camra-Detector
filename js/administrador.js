/* =============================================
   ADMINISTRADOR.JS — Lógica Panel Administrador
   Sistema de Control de Acceso Vehicular
   Universidad Libre Cúcuta
============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // --- Marcar enlace activo en el sidebar ---
  const linksNav = document.querySelectorAll('.admin-sidebar nav a');
  const paginaActual = window.location.pathname.split('/').pop();
  linksNav.forEach(function (link) {
    if (link.getAttribute('href') === paginaActual) {
      link.classList.add('activo');
    }
    link.addEventListener('click', function () {
      linksNav.forEach(function (l) { l.classList.remove('activo'); });
      this.classList.add('activo');
    });
  });

  // --- Validar solicitudes pendientes: aprobar o rechazar ---
  const tablaAdmin = document.querySelector('.admin-tabla tbody');
  if (tablaAdmin) {
    tablaAdmin.addEventListener('click', function (e) {
      const btnAprobar  = e.target.closest('.btn-aprobar');
      const btnRechazar = e.target.closest('.btn-rechazar');

      if (btnAprobar) {
        const fila   = btnAprobar.closest('tr');
        const cedula = fila.cells[0] ? fila.cells[0].textContent.trim() : '?';
        const nombre = fila.cells[1] ? fila.cells[1].textContent.trim() : '?';
        if (confirm('\u00bfAprobar solicitud de ' + nombre + ' (' + cedula + ')?')) {
          const estadoCelda = fila.querySelector('.estado-solicitud');
          if (estadoCelda) estadoCelda.innerHTML = '<span class="autorizado"> Aprobado</span>';
          btnAprobar.disabled = true;
          btnRechazar.disabled = true;
          mostrarToast(' Solicitud de ' + nombre + ' aprobada.', 'exito');
        }
      }

      if (btnRechazar) {
        const fila   = btnRechazar.closest('tr');
        const nombre = fila.cells[1] ? fila.cells[1].textContent.trim() : '?';
        const motivo = prompt('Motivo del rechazo para ' + nombre + ':');
        if (motivo !== null) {
          const estadoCelda = fila.querySelector('.estado-solicitud');
          if (estadoCelda) estadoCelda.innerHTML = '<span class="inhabilitado"> Rechazado</span>';
          btnRechazar.disabled = true;
          mostrarToast(' Solicitud de ' + nombre + ' rechazada.', 'error');
        }
      }
    });
  }

  // --- Contador de solicitudes pendientes en el sidebar ---
  function actualizarContadorPendientes() {
    const pendientes = document.querySelectorAll('.estado-solicitud .pendiente').length;
    const badge = document.getElementById('badge-pendientes');
    if (badge) {
      badge.textContent = pendientes;
      badge.style.display = pendientes > 0 ? 'inline-block' : 'none';
    }
  }
  actualizarContadorPendientes();

  // --- Buscar en tabla de administración ---
  const inputBusqAdmin = document.getElementById('buscar-solicitud');
  if (inputBusqAdmin) {
    inputBusqAdmin.addEventListener('input', function () {
      const termino = this.value.toUpperCase().trim();
      document.querySelectorAll('.admin-tabla tbody tr').forEach(function (fila) {
        fila.style.display = fila.textContent.toUpperCase().includes(termino) ? '' : 'none';
      });
    });
  }

  // --- Toast ---
  function mostrarToast(mensaje, tipo) {
    const viejo = document.getElementById('toast-admin');
    if (viejo) viejo.remove();
    const t = document.createElement('div');
    t.id = 'toast-admin';
    t.textContent = mensaje;
    const c = tipo === 'exito'
      ? { bg: '#e8f8f0', color: '#1e6e42', border: '#27ae60' }
      : { bg: '#fdecea', color: '#c0392b', border: '#e74c3c' };
    Object.assign(t.style, {
      position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: '9999',
      padding: '0.8rem 1.3rem', borderRadius: '8px', fontWeight: '600',
      fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      background: c.bg, color: c.color, border: '1.5px solid ' + c.border
    });
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3500);
  }

});
