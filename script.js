// ============================================================
//  SCRIPT PRINCIPAL — index.html
//  Funciones: saludo dinámico, reloj en vivo, contador de
//  tarjetas, animación de entrada y resalte de nav activo.
// ============================================================

window.addEventListener('DOMContentLoaded', function () {

    /* --------------------------------------------------
       1. SALUDO DINÁMICO según la hora del día
    -------------------------------------------------- */
    const p = document.querySelector('header p');
    const hora = new Date().getHours();
    let saludo = '';

    if (hora >= 6  && hora < 12) saludo = '🌤️ Buenos días';
    else if (hora >= 12 && hora < 18) saludo = '☀️ Buenas tardes';
    else saludo = '🌙 Buenas noches';

    p.insertAdjacentHTML(
        'afterend',
        `<p id="saludo" style="
            font-size:0.95em; color:#f7c5c5;
            margin-top:6px; font-style:italic;
        ">${saludo} — Bienvenido al sistema de acceso vehicular</p>`
    );


    /* --------------------------------------------------
       2. RELOJ EN VIVO en el header
    -------------------------------------------------- */
    const relojEl = document.createElement('p');
    relojEl.id = 'reloj';
    relojEl.style.cssText = `
        font-size: 0.9em; color: #f7c5c5;
        margin-top: 4px; letter-spacing: 1px;
    `;
    document.querySelector('header').appendChild(relojEl);

    function actualizarReloj() {
        const ahora = new Date();
        relojEl.textContent = '🕐 ' + ahora.toLocaleString('es-CO', {
            weekday: 'long', day: '2-digit',
            month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }
    actualizarReloj();
    setInterval(actualizarReloj, 1000);


    /* --------------------------------------------------
       3. RESALTAR ENLACE ACTIVO del nav según la página
    -------------------------------------------------- */
    const pagina = window.location.pathname.split('/').pop();
    const enlaces = document.querySelectorAll('nav ul li a');
    enlaces.forEach(function (a) {
        if (a.getAttribute('href') === pagina) {
            a.style.cssText = `
                background-color: rgba(255,255,255,0.25);
                border-radius: 4px;
                padding: 4px 10px;
                font-weight: bold;
            `;
        }
    });


    /* --------------------------------------------------
       4. CONTADOR ANIMADO en las tarjetas del main
    -------------------------------------------------- */
    const datos = {
        'Visión Artificial':   '98% precisión',
        'Control de Barrera':  '< 2 seg. respuesta',
        'Notificación WhatsApp':'Instantánea',
        'Control de Seguridad':'24 / 7'
    };

    document.querySelectorAll('.card').forEach(function (card) {
        const titulo = card.querySelector('h3').textContent.trim();

        // Busca si el título contiene alguna clave
        const clave = Object.keys(datos).find(k => titulo.includes(k));
        if (!clave) return;

        const badge = document.createElement('span');
        badge.textContent = datos[clave];
        badge.style.cssText = `
            display: inline-block; margin-top: 10px;
            background-color: #b90606; color: white;
            padding: 4px 12px; border-radius: 20px;
            font-size: 0.82em; font-weight: bold;
            letter-spacing: 0.5px;
        `;
        card.appendChild(badge);
    });


    /* --------------------------------------------------
       5. ANIMACIÓN DE ENTRADA para secciones del main
    -------------------------------------------------- */
    const secciones = document.querySelectorAll('main section');

    // Estilo inicial: invisible y desplazado hacia abajo
    secciones.forEach(function (sec) {
        sec.style.cssText += `
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        `;
    });

    // Usa IntersectionObserver para animar al entrar en pantalla
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    secciones.forEach(sec => observer.observe(sec));


    /* --------------------------------------------------
       6. TOOLTIP al pasar el ratón sobre la imagen de cámara
    -------------------------------------------------- */
    const imgCamara = document.querySelector('img[usemap]');
    if (imgCamara) {
        const tip = document.createElement('div');
        tip.textContent = '📷 Haz clic para ir al sitio oficial o ver en el mapa';
        tip.style.cssText = `
            display: none; position: fixed;
            background: rgba(0,0,0,0.8); color: white;
            padding: 8px 14px; border-radius: 6px;
            font-size: 0.85em; pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(tip);

        imgCamara.addEventListener('mousemove', function (e) {
            tip.style.display = 'block';
            tip.style.left = (e.clientX + 14) + 'px';
            tip.style.top  = (e.clientY + 14) + 'px';
        });
        imgCamara.addEventListener('mouseleave', function () {
            tip.style.display = 'none';
        });
    }

});