document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-cambiar-video");
  const input = document.getElementById("link-evento");
  const iframe = document.getElementById("iframe-evento");
  const mensaje = document.getElementById("mensaje-evento");

  const videoInicial = "I_PBBqh2gIw";
  iframe.src = `https://www.youtube.com/embed/${videoInicial}`;

  boton.addEventListener("click", () => {
    const url = input.value.trim();
    const videoId = extraerIdYouTube(url);

    if (!videoId) {
      mensaje.textContent = "El enlace no es válido.";
      return;
    }

    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    mensaje.textContent = "Video actualizado correctamente.";
  });

  input.addEventListener("input", () => {
    mensaje.textContent = "";
  });
});

function extraerIdYouTube(url) {
  try {
    const enlace = new URL(url);

    if (enlace.hostname === "youtu.be") {
      return enlace.pathname.slice(1);
    }

    if (
      enlace.hostname === "www.youtube.com" ||
      enlace.hostname === "youtube.com" ||
      enlace.hostname === "m.youtube.com"
    ) {
      if (enlace.pathname === "/watch") {
        return enlace.searchParams.get("v");
      }

      if (enlace.pathname.startsWith("/embed/")) {
        return enlace.pathname.split("/embed/")[1];
      }
    }

    return null;
  } catch {
    return null;
  }
}