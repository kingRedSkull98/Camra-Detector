/* =============================================
   VEHICULOS.JS — Lógica Vehículos Registrados
   Sistema de Control de Acceso Vehicular
   Universidad Libre Cúcuta
============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // --- Búsqueda en tiempo real dentro de la tabla ---
  const inputBusqueda = document.getElementById('buscar-vehiculo');
  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', function () {
      const termino = this.value.toUpperCase().trim();
      const filas   = document.querySelectorAll('#vehiculos tbody tr');
      let visibles   = 0;

      filas.forEach(function (fila) {
        const texto = fila.textContent.toUpperCase();
        if (texto.includes(termino)) {
          fila.style.display = '';
          visibles++;
        } else {
          fila.style.display = 'none';
        }
      });

      let sinRes = document.getElementById('sin-resultados-vehiculos');
      if (visibles === 0) {
        if (!sinRes) {
          sinRes = document.createElement('tr');
          sinRes.id = 'sin-resultados-vehiculos';
          sinRes.innerHTML = '<td colspan="7" style="text-align:center;padding:1.5rem;color:#888;">No se encontraron vehículos con esa búsqueda.</td>';
          document.querySelector('#vehiculos tbody').appendChild(sinRes);
        }
      } else {
        if (sinRes) sinRes.remove();
      }
    });
  }

  // --- Filtro por estado (selector) ---
  const selectEstado = document.getElementById('filtro-estado-vehiculo');
  if (selectEstado) {
    selectEstado.addEventListener('change', function () {
      const valor = this.value.toLowerCase();
      const filas = document.querySelectorAll('#vehiculos tbody tr');
      filas.forEach(function (fila) {
        const estadoCelda = fila.cells[6] ? fila.cells[6].textContent.toLowerCase() : '';
        fila.style.display = (valor === '' || estadoCelda.includes(valor)) ? '' : 'none';
      });
    });
  }

  // --- Botón Habilitar / Inhabilitar dentro de tabla ---
  document.querySelectorAll('#vehiculos tbody').forEach(function (tbody) {
    tbody.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn-accion');
      if (!btn) return;

      const fila   = btn.closest('tr');
      const placa  = fila.cells[0] ? fila.cells[0].textContent.trim() : '?';
      const estadoCelda = fila.cells[6];

      if (btn.classList.contains('btn-habilitar')) {
        estadoCelda.innerHTML = '<span class="autorizado"> Autorizado</span>';
        btn.textContent = ' Inhabilitar';
        btn.classList.replace('btn-habilitar', 'btn-inhabilitar');
        mostrarToast(' Vehículo ' + placa + ' habilitado.', 'exito');

      } else if (btn.classList.contains('btn-inhabilitar')) {
        estadoCelda.innerHTML = '<span class="inhabilitado"> Inhabilitado</span>';
        btn.textContent = ' Habilitar';
        btn.classList.replace('btn-inhabilitar', 'btn-habilitar');
        mostrarToast(' Vehículo ' + placa + ' inhabilitado.', 'error');

      } else if (btn.classList.contains('btn-detalle')) {
        alert('Placa: ' + fila.cells[0].textContent +
              '\nPropietario: ' + fila.cells[1].textContent +
              '\nTipo: '  + fila.cells[2].textContent +
              '\nMarca/Línea: ' + fila.cells[3].textContent +
              '\nDependencia: ' + fila.cells[4].textContent +
              '\nVigencia: '  + fila.cells[5].textContent);
      }
    });
  });

  // --- Exportar tabla a CSV ---
  const btnExportar = document.getElementById('btn-exportar-vehiculos');
  if (btnExportar) {
    btnExportar.addEventListener('click', function () {
      const tabla = document.querySelector('#vehiculos table');
      if (!tabla) return;
      let csv = [];
      tabla.querySelectorAll('tr').forEach(function (fila) {
        const celdas = fila.querySelectorAll('th, td');
        csv.push(Array.from(celdas).map(function (c) {
          return '"' + c.textContent.trim().replace(/"/g, '""') + '"';
        }).join(','));
      });
      const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'vehiculos_registrados.csv';
      a.click();
    });
  }

  // --- Toast ---
  function mostrarToast(mensaje, tipo) {
    const viejo = document.getElementById('toast-vehiculos');
    if (viejo) viejo.remove();
    const t = document.createElement('div');
    t.id = 'toast-vehiculos';
    t.textContent = mensaje;
    Object.assign(t.style, {
      position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:'9999',
      padding:'0.8rem 1.3rem', borderRadius:'8px', fontWeight:'600',
      fontSize:'0.9rem', boxShadow:'0 4px 16px rgba(0,0,0,0.12)',
      background: tipo === 'exito' ? '#e8f8f0' : '#fdecea',
      color: tipo === 'exito' ? '#1e6e42' : '#c0392b',
      border: '1.5px solid ' + (tipo === 'exito' ? '#27ae60' : '#e74c3c')
    });
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3000);
  }

});
