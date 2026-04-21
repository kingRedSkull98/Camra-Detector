/* =============================================
   EVENTOS.JS — Lógica Historial de Eventos
   Sistema de Control de Acceso Vehicular
   Universidad Libre Cúcuta
============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // --- Filtro en tiempo real por placa ---
  const inputFiltro = document.getElementById('filtro-placa');
  if (inputFiltro) {
    inputFiltro.addEventListener('input', function () {
      filtrarTablaEventos();
    });
  }

  // --- Filtro por estado ---
  const selectEstado = document.getElementById('filtro-estado');
  if (selectEstado) {
    selectEstado.addEventListener('change', function () {
      filtrarTablaEventos();
    });
  }

  // --- Filtro por fecha ---
  const inputFecha = document.getElementById('filtro-fecha');
  if (inputFecha) {
    inputFecha.addEventListener('change', function () {
      filtrarTablaEventos();
    });
  }

  function filtrarTablaEventos() {
    const terminoBusqueda = inputFiltro ? inputFiltro.value.toUpperCase().trim() : '';
    const estadoFiltro    = selectEstado ? selectEstado.value : '';
    const fechaFiltro     = inputFecha ? inputFecha.value : '';

    const filas = document.querySelectorAll('#eventos tbody tr');
    let visibles = 0;

    filas.forEach(function (fila) {
      const placa  = fila.cells[0] ? fila.cells[0].textContent.toUpperCase() : '';
      const fecha  = fila.cells[1] ? fila.cells[1].textContent : '';
      const estado = fila.cells[4] ? fila.cells[4].textContent.toLowerCase() : '';

      const coincidePlaca  = placa.includes(terminoBusqueda);
      const coincideEstado = estadoFiltro === '' || estado.includes(estadoFiltro.toLowerCase());
      const coincideFecha  = fechaFiltro === '' || convertirFecha(fecha) === fechaFiltro;

      if (coincidePlaca && coincideEstado && coincideFecha) {
        fila.style.display = '';
        visibles++;
      } else {
        fila.style.display = 'none';
      }
    });

    // Mostrar mensaje si no hay resultados
    let sinResultados = document.getElementById('sin-resultados-eventos');
    if (visibles === 0) {
      if (!sinResultados) {
        sinResultados = document.createElement('tr');
        sinResultados.id = 'sin-resultados-eventos';
        sinResultados.innerHTML = '<td colspan="7" style="text-align:center;padding:1.5rem;color:#888;">No se encontraron eventos con esos filtros.</td>';
        document.querySelector('#eventos tbody').appendChild(sinResultados);
      }
    } else {
      if (sinResultados) sinResultados.remove();
    }
  }

  // Convierte DD/MM/YYYY a YYYY-MM-DD para comparar con input date
  function convertirFecha(fecha) {
    const partes = fecha.trim().split('/');
    if (partes.length !== 3) return '';
    return partes[2] + '-' + partes[1] + '-' + partes[0];
  }

  // --- Resaltar fila al hacer clic ---
  document.querySelectorAll('#eventos tbody tr').forEach(function (fila) {
    fila.style.cursor = 'pointer';
    fila.addEventListener('click', function () {
      document.querySelectorAll('#eventos tbody tr').forEach(function (f) {
        f.style.background = '';
      });
      this.style.background = '#dce8ff';
    });
  });

  // --- Botón exportar CSV (si existe) ---
  const btnExportar = document.getElementById('btn-exportar-eventos');
  if (btnExportar) {
    btnExportar.addEventListener('click', function () {
      exportarCSV('eventos');
    });
  }

  function exportarCSV(idTabla) {
    const tabla = document.querySelector('#' + idTabla + ' table');
    if (!tabla) return;
    let csv = [];
    tabla.querySelectorAll('tr').forEach(function (fila) {
      const celdas = fila.querySelectorAll('th, td');
      const fila_csv = Array.from(celdas).map(function (c) {
        return '"' + c.textContent.trim().replace(/"/g, '""') + '"';
      });
      csv.push(fila_csv.join(','));
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'historial_eventos.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

});
