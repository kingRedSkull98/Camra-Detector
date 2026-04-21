/* =============================================
   REPORTE.JS — Lógica Reportes y Estadísticas
   Sistema de Control de Acceso Vehicular
   Universidad Libre Cúcuta
============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // --- Formulario generación de reporte ---
  const formReporte = document.querySelector('.panel-card form');
  if (formReporte) {
    formReporte.addEventListener('submit', function (e) {
      e.preventDefault();

      const desde   = document.getElementById('rep-desde');
      const hasta   = document.getElementById('rep-hasta');
      const formato = document.querySelector('input[name="formato"]:checked');

      if (!desde.value || !hasta.value) {
        mostrarToast('Seleccione el rango de fechas.', 'error');
        return;
      }

      if (new Date(hasta.value) < new Date(desde.value)) {
        mostrarToast('La fecha de inicio debe ser anterior a la fecha fin.', 'error');
        hasta.style.borderColor = '#c0392b';
        return;
      } else {
        hasta.style.borderColor = '';
      }

      const fmt = formato ? formato.value : 'pantalla';

      if (fmt === 'pdf') {
        mostrarToast(' Generando reporte PDF… (funcionalidad backend requerida)', 'info');
      } else if (fmt === 'excel') {
        exportarTablaReporte();
      } else {
        // Modo pantalla: resaltar la vista previa
        const preview = document.querySelector('.panel-card table');
        if (preview) {
          preview.scrollIntoView({ behavior: 'smooth' });
          preview.style.outline = '3px solid #1a3c6e';
          setTimeout(function () { preview.style.outline = ''; }, 2000);
        }
        mostrarToast(' Mostrando reporte del ' + desde.value + ' al ' + hasta.value, 'exito');
      }
    });
  }

  // --- Exportar tabla de vista previa a CSV ---
  function exportarTablaReporte() {
    const tabla = document.querySelector('.panel-card table');
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
    a.download = 'reporte_accesos.csv';
    a.click();
    mostrarToast(' Archivo Excel descargado correctamente.', 'exito');
  }

  // --- Animación de contadores en tarjetas de estadísticas ---
  function animarContador(elemento, valorFinal, duracion) {
    const valorInicial = 0;
    const incremento   = valorFinal / (duracion / 16);
    let valorActual    = valorInicial;

    const timer = setInterval(function () {
      valorActual += incremento;
      if (valorActual >= valorFinal) {
        elemento.textContent = valorFinal;
        clearInterval(timer);
      } else {
        elemento.textContent = Math.floor(valorActual);
      }
    }, 16);
  }

  // Ejecutar animación cuando las tarjetas sean visibles (IntersectionObserver)
  const stats = document.querySelectorAll('#reportes .stat h3');
  if (stats.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el  = entry.target;
          const val = parseInt(el.textContent, 10);
          if (!isNaN(val)) animarContador(el, val, 1200);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    stats.forEach(function (stat) { observer.observe(stat); });
  }

  // --- Toast de notificación ---
  function mostrarToast(mensaje, tipo) {
    const viejo = document.getElementById('toast-reporte');
    if (viejo) viejo.remove();
    const t = document.createElement('div');
    t.id = 'toast-reporte';
    t.textContent = mensaje;
    const colores = {
      exito: { bg: '#e8f8f0', color: '#1e6e42', border: '#27ae60' },
      error: { bg: '#fdecea', color: '#c0392b', border: '#e74c3c' },
      info:  { bg: '#e8f0fe', color: '#1a3c6e', border: '#2c5090' }
    };
    const c = colores[tipo] || colores.info;
    Object.assign(t.style, {
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: '9999',
      padding: '0.8rem 1.3rem', borderRadius: '8px', fontWeight: '600',
      fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      background: c.bg, color: c.color, border: '1.5px solid ' + c.border
    });
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3500);
  }

});
