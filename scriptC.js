ocument.addEventListener("DOMContentLoaded", function () {
  iniciarBusquedaGlosario();
  iniciarAnimacionLista();
  iniciarPasosInteractivos();
});

// =============================================
// 1. BUSCADOR DEL GLOSARIO
// =============================================
function iniciarBusquedaGlosario() {
  const inputBuscar = document.getElementById("buscar-glosario");
  if (!inputBuscar) return;

  inputBuscar.addEventListener("input", function () {
    const texto = this.value.toLowerCase().trim();
    const terminos = document.querySelectorAll("#glosario-lista dt");

    terminos.forEach(function (dt) {
      const dd = dt.nextElementSibling;
      const coincide =
        dt.textContent.toLowerCase().includes(texto) ||
        (dd && dd.textContent.toLowerCase().includes(texto));

      dt.style.display = coincide ? "block" : "none";
      if (dd) dd.style.display = coincide ? "block" : "none";
    });

    const sinResultados = document.getElementById("glosario-vacio");
    if (!sinResultados) return;

    const hayResultados = [...terminos].some(dt => dt.style.display !== "none");
    sinResultados.style.display = hayResultados ? "none" : "block";
  });
}

// =============================================
// 2. ANIMACIÓN DE FUNCIONALIDADES AL HACER SCROLL
// =============================================
function iniciarAnimacionLista() {
  const items = document.querySelectorAll("#lista-funcionalidades li");
  if (!items.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(function (item) {
    item.classList.add("oculto");
    observer.observe(item);
  });
}

// =============================================
// 3. PASOS INTERACTIVOS (clic para marcar como leído)
// =============================================
function iniciarPasosInteractivos() {
  const pasos = document.querySelectorAll("#pasos-lista li");
  if (!pasos.length) return;

  pasos.forEach(function (paso, indice) {
    paso.style.cursor = "pointer";
    paso.title = "Haz clic para marcar este paso";

    paso.addEventListener("click", function () {
      const yaActivo = this.classList.contains("paso-activo");

      pasos.forEach(p => p.classList.remove("paso-activo"));

      if (!yaActivo) {
        this.classList.add("paso-activo");

        const progreso = document.getElementById("progreso-pasos");
        if (progreso) {
          progreso.textContent = `Paso ${indice + 1} de ${pasos.length}`;
        }
      } else {
        const progreso = document.getElementById("progreso-pasos");
        if (progreso) progreso.textContent = "";
      }
    });
  });
}