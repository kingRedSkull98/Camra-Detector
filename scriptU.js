function obtenerUbicacion() {
  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización.");
    return;
  }

  const estado = document.getElementById("estado-ubicacion");
  const latitudTexto = document.getElementById("latitud");
  const longitudTexto = document.getElementById("longitud");
  const precisionTexto = document.getElementById("precision");

  if (estado) estado.textContent = "Obteniendo ubicación...";

  const opciones = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(
    function (posicion) {
      const lat = posicion.coords.latitude;
      const lon = posicion.coords.longitude;
      const precision = posicion.coords.accuracy;

      if (latitudTexto) latitudTexto.textContent = lat.toFixed(6);
      if (longitudTexto) longitudTexto.textContent = lon.toFixed(6);
      if (precisionTexto) precisionTexto.textContent = `${precision.toFixed(2)} m`;
      if (estado) estado.textContent = "Ubicación obtenida correctamente.";
    },
    function (error) {
      let mensaje = "No se pudo obtener la ubicación.";

      if (error.code === 1) mensaje = "Permiso de ubicación denegado.";
      if (error.code === 2) mensaje = "Ubicación no disponible.";
      if (error.code === 3) mensaje = "Tiempo de espera agotado.";

      if (estado) estado.textContent = mensaje;
      alert(mensaje);
    },
    opciones
  );
}