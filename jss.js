// ========== EFECTO DE MÁQUINA DE ESCRIBIR (DISEÑO ESTABLE) ==========
// Este código revela las letras una por una manteniendo el ancho total del título estable
// para evitar que el texto y el icono centrado se desplacen horizontalmente (jitter).

const titleElement = document.querySelector('.title-container h1');

if (titleElement) {
    const text = titleElement.textContent.trim(); // Obtiene "YM-ELECTRIC"
    
    // Convertimos cada letra en un span con opacidad 0 para reservar su espacio en el diseño
    titleElement.innerHTML = text
        .split('')
        .map(char => `<span class="char-span" style="opacity: 0; transition: opacity 0.15s ease;">${char}</span>`)
        .join('');
        
    const spans = titleElement.querySelectorAll('.char-span');
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < spans.length) {
            spans[charIndex].style.opacity = '1';
            charIndex++;
            setTimeout(typeWriter, 70); // Velocidad de revelado de letras (ms)
        }
    }
    
    window.addEventListener('load', typeWriter);
}


// ========== ANIMACIÓN AL HACER SCROLL ==========
// Este código hace que los elementos aparezcan cuando haces scroll hacia ellos

// Crea un observador que detecta cuando un elemento entra en la pantalla
// Relacionado con: elementos con clase "hidden" en index.html y estilos .hidden/.show en color1.css
const observer = new IntersectionObserver((entries) => {
    // Para cada elemento observado
    entries.forEach((entry) => {
        // Si el elemento está visible en la pantalla
        if (entry.isIntersecting) {
            // Agrega la clase "show" que activa la animación (definida en color1.css)
            entry.target.classList.add('show');
        }
    });
});

// Selecciona todos los elementos con la clase "hidden"
// Relacionado con: <section class="hidden">, <div class="hidden"> en index.html
const hiddenElements = document.querySelectorAll('.hidden');

// Observa cada elemento para detectar cuando entra en la pantalla
hiddenElements.forEach((el) => observer.observe(el));


// ========== MENÚ HAMBURGUESA PARA MÓVILES ==========
// Este código controla el menú desplegable en dispositivos móviles

// Selecciona el botón hamburguesa y el menú
// Relacionado con: <button class="nav-toggle"> y <ul class="nav-menu"> en index.html
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle && navMenu) {
    // Función para abrir/cerrar el menú al hacer clic en el botón hamburguesa
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Cierra el menú cuando se hace clic en un enlace (en móviles)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remueve la clase "active" del botón y del menú
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}


// ========== RESALTAR ENLACE ACTIVO AL HACER SCROLL ==========
// Este código resalta el enlace de la sección actual mientras haces scroll

// Función que detecta qué sección está visible
function highlightActiveSection() {
    // Obtiene la posición actual del scroll más un offset
    const scrollPosition = window.scrollY + 150;

    // Variable para guardar la sección actual
    let currentSection = '';

    // Revisa cada enlace de navegación
    navLinks.forEach(link => {
        // Obtiene el ID de la sección a la que apunta el enlace
        const sectionId = link.getAttribute('href').substring(1);
        const section = document.getElementById(sectionId);

        if (section) {
            // Obtiene la posición de la sección
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            // Si estamos en esta sección, guarda su ID
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        }
    });

    // Si estamos cerca del final de la página, marca la última sección (formacion)
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        currentSection = 'formacion';
    }

    // Actualiza las clases 'active' en los enlaces
    navLinks.forEach(link => {
        const sectionId = link.getAttribute('href').substring(1);
        if (sectionId === currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Ejecuta la función al hacer scroll solo si existen enlaces de navegación
if (navLinks.length > 0) {
    window.addEventListener('scroll', highlightActiveSection);
}

// ========== SCROLL HORIZONTAL INTELIGENTE (GALERÍA) ==========
const galleryContainer = document.querySelector('.gallery-container');

if (galleryContainer) {
    galleryContainer.addEventListener('wheel', (evt) => {
        const { scrollLeft, scrollWidth, clientWidth } = galleryContainer;
        const isAtStart = scrollLeft === 0;
        const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;
        const isScrollingLeft = evt.deltaY < 0;
        const isScrollingRight = evt.deltaY > 0;

        // Si intenta ir a la izquierda pero ya está al inicio -> Scroll Vertical normal
        if (isAtStart && isScrollingLeft) return;

        // Si intenta ir a la derecha pero ya está al final -> Scroll Vertical normal
        if (isAtEnd && isScrollingRight) return;

        // En cualquier otro caso, transformamos el scroll vertical en horizontal
        evt.preventDefault();
        galleryContainer.scrollLeft += evt.deltaY;
    }, { passive: false });

    // ========== DESPLAZAMIENTO AL CLICKEAR EL INDICADOR ==========
    const scrollBtn = document.getElementById('scroll-gallery-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const cardWidth = 380; // gallery-item width
            const gap = 24; // gap between items
            const scrollAmount = cardWidth + gap;
            
            // Si ya estamos al final del carrusel, vuelve al principio
            const { scrollLeft, scrollWidth, clientWidth } = galleryContainer;
            if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
                galleryContainer.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                galleryContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// ========== MOSTRAR ETIQUETA "VER CERTIFICADO/DETALLE" AL SCROLLEAR ==========
// Detecta cuando las tarjetas con etiqueta entran en la pantalla
const certificateCards = document.querySelectorAll('.experience-card.has-tag');

if (certificateCards.length > 0) {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6 // Cuando el 60% de la tarjeta sea visible
    };

    const certificateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añade la clase que muestra la etiqueta
                entry.target.classList.add('active-hint');
            } else {
                // Opcional: Quitar la clase si quieres que se oculte al salir
                entry.target.classList.remove('active-hint');
            }
        });
    }, observerOptions);

    certificateCards.forEach(card => {
        certificateObserver.observe(card);
    });
}

// ========== FUNCIÓN SEGURA PARA ABRIR CERTIFICADOS ==========
// Verifica que la imagen exista antes de abrirla para evitar errores 404
function verCertificado(ruta) {
    // Cambiar cursor para indicar carga
    document.body.style.cursor = 'wait';

    const img = new Image();

    img.onload = function () {
        // Si la imagen carga bien, restaurar cursor y abrir
        document.body.style.cursor = 'default';
        window.open(ruta, '_blank');
    };

    img.onerror = function () {
        // Si hay error, avisar al usuario
        document.body.style.cursor = 'default';
        alert('Lo sentimos, el archivo del certificado no se encuentra disponible en este momento.');
        console.error('Error: No se pudo cargar la imagen en ' + ruta);
    };

    // Iniciar carga
    img.src = ruta;
}

// ========== FUNCIÓN AUXILIAR PARA ABRIR ENLACE O CERTIFICADO ==========
function abrirDestino(url, certUrl) {
    if (url) {
        window.open(url, '_blank');
    } else if (certUrl) {
        verCertificado(certUrl);
    }
}

// ========== PRECARGA Y SPINNER DE CARGA PARA LAS ETIQUETAS (DETALLES Y CERTIFICADOS) ==========
document.querySelectorAll('.card-tag').forEach(tag => {
    tag.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Si ya está cargando, ignorar nuevos clics
        if (this.classList.contains('is-loading')) return;
        
        const url = this.getAttribute('href');
        const certUrl = this.getAttribute('data-cert');
        const targetUrl = url || certUrl;
        
        if (!targetUrl) return;
        
        this.classList.add('is-loading');
        
        // Crear el spinner
        const spinner = document.createElement('span');
        spinner.className = 'tag-spinner-outside';
        // Insertarlo dentro de la etiqueta para posicionarlo relativo a ella
        this.appendChild(spinner);
        
        // Intentar verificar disponibilidad del recurso (fallo por CORS en local no impide abrir)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        fetch(targetUrl, { signal: controller.signal, mode: 'no-cors' })
            .then(() => {
                clearTimeout(timeoutId);
                // Recurso disponible -> abrir tras breve spinner
                setTimeout(() => {
                    spinner.remove();
                    this.classList.remove('is-loading');
                    abrirDestino(url, certUrl);
                }, 800);
            })
            .catch(() => {
                clearTimeout(timeoutId);
                // Si falla (CORS, offline, etc.) igual intentamos abrir
                setTimeout(() => {
                    spinner.remove();
                    this.classList.remove('is-loading');
                    abrirDestino(url, certUrl);
                }, 800);
            });
    });
});

// ========== SECCIÓN DE COMENTARIOS CON ESTRELLAS ==========

let ratingSeleccionado = 0;
let unsubscribeComentarios = null;

function renderEstrellas(container, rating) {
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = i <= rating ? 'fas fa-star' : 'far fa-star';
        container.appendChild(star);
    }
}

function renderEstrellasActivas(container, activas) {
    const estrellas = container.querySelectorAll('.estrella');
    estrellas.forEach((star, i) => {
        star.classList.toggle('activa', i < activas);
    });
}

function formatearFecha(timestamp) {
    if (!timestamp) return '';
    const d = timestamp.toDate();
    const ahora = new Date();
    const diff = ahora - d;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (mins < 1) return 'Ahora mismo';
    if (mins < 60) return `Hace ${mins} min`;
    if (hrs < 24) return `Hace ${hrs}h`;
    if (dias < 7) return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderizarComentarios(comentarios) {
    const lista = document.getElementById('comentarios-lista');
    if (!lista) return;

    const total = comentarios.length;
    const promedio = total > 0 ? (comentarios.reduce((s, c) => s + c.rating, 0) / total) : 0;
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    comentarios.forEach(c => counts[c.rating]++);

    const numEl = document.getElementById('promedio-numero');
    const avgEl = document.getElementById('promedio-estrellas');
    const totalEl = document.getElementById('promedio-total');

    if (numEl) numEl.textContent = total > 0 ? promedio.toFixed(1) : '0.0';
    if (avgEl) renderEstrellas(avgEl, Math.round(promedio));
    if (totalEl) totalEl.textContent = `${total} opinión${total !== 1 ? 'es' : ''}`;

    const barras = document.getElementById('barras-container');
    if (barras) {
        barras.innerHTML = '';
        for (let i = 5; i >= 1; i--) {
            const count = counts[i] || 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            const fila = document.createElement('div');
            fila.className = 'barra-fila';
            fila.innerHTML = `
                <span class="barra-fila-label">${i}★</span>
                <div class="barra-fila-track">
                    <div class="barra-fila-fill" style="width: ${pct}%"></div>
                </div>
                <span class="barra-fila-count">${count}</span>
            `;
            barras.appendChild(fila);
        }
    }

    if (comentarios.length === 0) {
        lista.innerHTML = '<div class="comentarios-vacio">Sé el primero en dejar una opinión ✨</div>';
        return;
    }

    lista.innerHTML = '';
    comentarios.forEach(c => {
        const item = document.createElement('div');
        item.className = 'comentario-item';
        item.innerHTML = `
            <div class="comentario-item-header">
                <div class="comentario-item-estrellas"></div>
                <span class="comentario-item-fecha">${formatearFecha(c.created_at)}</span>
            </div>
            <div class="comentario-item-texto">${escapeHtml(c.comentario)}</div>
        `;
        renderEstrellas(item.querySelector('.comentario-item-estrellas'), c.rating);
        lista.appendChild(item);
    });
}

function iniciarEscuchaComentarios() {
    const lista = document.getElementById('comentarios-lista');
    if (!lista) return;

    lista.innerHTML = '<div class="comentarios-loading">Cargando opiniones...</div>';

    if (unsubscribeComentarios) {
        unsubscribeComentarios();
    }

    unsubscribeComentarios = db.collection('comentarios')
        .orderBy('created_at', 'desc')
        .limit(100)
        .onSnapshot(snapshot => {
            const comentarios = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            renderizarComentarios(comentarios);
        }, error => {
            console.error('Firestore error:', error);
            lista.innerHTML = '<div class="comentarios-vacio">Error al cargar opiniones. Verifica la conexión.</div>';
        });
}

function initEstrellas() {
    const container = document.getElementById('estrellas-input');
    if (!container) return;

    const estrellas = container.querySelectorAll('.estrella');

    estrellas.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.valor);
            estrellas.forEach((s, i) => {
                s.classList.toggle('hover', i < val);
            });
        });

        star.addEventListener('mouseleave', () => {
            estrellas.forEach(s => s.classList.remove('hover'));
        });

        star.addEventListener('click', () => {
            ratingSeleccionado = parseInt(star.dataset.valor);
            renderEstrellasActivas(container, ratingSeleccionado);
            const ayuda = document.getElementById('estrella-ayuda');
            if (ayuda) {
                const labels = ['', 'Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];
                ayuda.textContent = labels[ratingSeleccionado] || '';
            }
        });
    });
}

async function enviarComentario() {
    const btn = document.getElementById('btn-enviar-comentario');
    const texto = document.getElementById('comentario-texto');
    const mensaje = document.getElementById('comentario-mensaje');

    if (!btn || !texto || !mensaje) return;

    if (ratingSeleccionado === 0) {
        mensaje.textContent = 'Selecciona una calificación con estrellas';
        mensaje.className = 'comentario-mensaje error';
        return;
    }

    const comentario = texto.value.trim();
    if (!comentario) {
        mensaje.textContent = 'Escribe un comentario';
        mensaje.className = 'comentario-mensaje error';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando...';
    mensaje.textContent = '';

    try {
        await db.collection('comentarios').add({
            rating: ratingSeleccionado,
            comentario: comentario,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        });

        mensaje.textContent = '¡Opinión enviada con éxito!';
        mensaje.className = 'comentario-mensaje exito';

        texto.value = '';
        ratingSeleccionado = 0;
        renderEstrellasActivas(document.getElementById('estrellas-input'), 0);
        document.getElementById('estrella-ayuda').textContent = 'Selecciona una calificación';
        document.getElementById('char-count').textContent = '0 / 1000';

        setTimeout(() => {
            mensaje.textContent = '';
            mensaje.className = 'comentario-mensaje';
        }, 3000);
    } catch (e) {
        mensaje.textContent = 'Error al enviar. Revisa la consola para más detalles.';
        mensaje.className = 'comentario-mensaje error';
        console.error('Error al guardar comentario:', e);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Enviar Opinión';
    }
}

function initCharCounter() {
    const textarea = document.getElementById('comentario-texto');
    const counter = document.getElementById('char-count');
    if (!textarea || !counter) return;

    textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        counter.textContent = `${len} / 1000`;
        counter.classList.toggle('limit', len >= 900);
    });
}

async function initComentarios() {
    try {
        await auth.signInAnonymously();
    } catch (e) {
        console.error('Auth anónimo:', e);
    }

    initEstrellas();
    initCharCounter();

    const btn = document.getElementById('btn-enviar-comentario');
    if (btn) btn.addEventListener('click', enviarComentario);

    iniciarEscuchaComentarios();
}

document.addEventListener('DOMContentLoaded', initComentarios);