// =======================================
// 0. UTILIDAD: Feedback al usuario
// =======================================
function mostrarFeedback(mensaje, esExito) {
  const feedback = document.getElementById("mensajeFeedback");
  if (!feedback) return;
  feedback.textContent = mensaje;
  feedback.className = esExito ? "feedback-message success" : "feedback-message error";
  feedback.style.display = "block";
  // Oculta después de 5s
  setTimeout(() => {
    if (feedback) feedback.style.display = "none";
  }, 5000);
}


// =======================================
// 1. FORMULARIO DE CONTACTO (EmailJS)
// =======================================
function setupContactForm() {
  // --- Inicializar EmailJS (sin .then/.catch) ---
  try {
    emailjs.init("1uos-VH02BLwzOAnj"); // Public Key
    console.log("EmailJS inicializado.");
  } catch (err) {
    console.error("Error al inicializar EmailJS:", err);
    mostrarFeedback("Error al cargar el servicio de correo.", false);
  }

  // --- Elementos del DOM ---
  const mostrarBtn = document.getElementById("mostrarFormulario");
  const formContainer = document.getElementById("formContainer");
  const formulario = document.getElementById("formularioContacto");
  const cancelBtn = document.getElementById("cancelBtn");
  const feedback = document.getElementById("mensajeFeedback");

  if (!mostrarBtn || !formContainer || !formulario || !cancelBtn) {
    console.error("Faltan elementos del formulario de contacto en el DOM.");
    return;
  }

  // --- Mostrar formulario ---
  mostrarBtn.addEventListener("click", () => {
    formContainer.classList.remove("hidden");
    mostrarBtn.style.display = "none";
    if (feedback) feedback.style.display = "none";
  });

  // --- Cancelar / ocultar ---
  cancelBtn.addEventListener("click", () => {
    formContainer.classList.add("hidden");
    mostrarBtn.style.display = "inline-block";
    formulario.reset();
    if (feedback) feedback.style.display = "none";
  });

  // --- Enviar formulario ---
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    // Datos
    const nombre  = document.getElementById("nombre").value.trim();
    const correo  = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    // Validaciones básicas
    if (!nombre || !correo || !mensaje) {
      mostrarFeedback("Todos los campos son obligatorios.", false);
      return;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!correoValido) {
      mostrarFeedback("Por favor ingresa un correo válido.", false);
      return;
    }

    // Estado de carga en botón
    const submitBtn = formulario.querySelector("[type=submit]");
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Enviando...';

    // ⚠️ AJUSTA los nombres a los campos de tu plantilla EmailJS:
    const templateParams = {
      from_name: nombre,       // <-- en tu plantilla: {{from_name}}
      from_email: correo,      // <-- en tu plantilla: {{from_email}}
      message: mensaje,        // <-- en tu plantilla: {{message}}
      time: new Date().toLocaleString() // <-- opcional, si lo incluiste
    };

    emailjs.send("service_u8ffglm", "template_yoykqer", templateParams)
      .then(() => {
        mostrarFeedback("¡Mensaje enviado con éxito! 😊", true);
        formulario.reset();
        // Oculta después de un momento
        setTimeout(() => {
          formContainer.classList.add("hidden");
          mostrarBtn.style.display = "inline-block";
        }, 2000);
      })
      .catch((error) => {
        console.error("Error al enviar:", error);
        mostrarFeedback(
          `Error al enviar. ${error?.text || "Por favor inténtalo más tarde."}`,
          false
        );
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  });
}


// =======================================
// INICIO AL CARGAR EL DOM
document.addEventListener("DOMContentLoaded", setupContactForm);

// =======================================
// 2. DESCRIPCIÓN DE MIEMBROS DEL EQUIPO
// =======================================

let currentMember = null;

function toggleMemberDescription(member) {
  const descriptions = {
    alvaro: 'Creemos que un snack puede ser más que comida: puede ser un respiro, un empujón de energía o un momento feliz. Nuestro sueño es convertir a Tecamochas en ese compañero confiable que siempre está cuando más lo necesitas. Y apenas estamos comenzando.',
    yesica: 'Con cada coctel que preparamos, queremos recordarte que no estás solo. Sabemos que los días pueden ser pesados, y por eso creamos algo sencillo, natural y reconfortante. Tecamochas existe para cuidarte sin que tengas que pedirlo.',
    fernando: 'Tecamochas no solo se trata de fruta: se trata de comunidad, alegría y complicidad. Queremos que disfrutes cada sabor, pero también cada historia, cada dinámica, cada momento que compartas con nosotros. Porque al final, esto lo hacemos contigo.'
  };

  const descContainer = document.getElementById('member-description');
  if (!descContainer) return;

  if (currentMember === member) {
    descContainer.style.display = 'none';
    currentMember = null;
  } else {
    descContainer.textContent = descriptions[member];
    descContainer.style.display = 'block';
    currentMember = member;
  }
}

window.toggleMemberDescription = toggleMemberDescription;


// =======================================
// 3. INICIALIZAR FUNCIONES AL CARGAR EL DOM
// =======================================

document.addEventListener('DOMContentLoaded', () => {

  // =========================
  // FORMULARIO DE COMENTARIOS
  // =========================

  const commentForm = document.getElementById('commentForm');
  const commentsContainer = document.getElementById('commentsContainer');
  const bgColors = ['bg-blue-100', 'bg-pink-100', 'bg-orange-100', 'bg-purple-100', 'bg-green-100'];

  if (commentForm && commentsContainer) {
    commentForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const userName = document.getElementById('userName').value;
      const userComment = document.getElementById('userComment').value;

      if (userName && userComment) {
        const newComment = document.createElement('div');
        const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];

        newComment.className = `${randomColor} rounded-xl p-4 shadow-md touch-card`;
        newComment.innerHTML = `"${userComment}" <span class="font-semibold">- ${userName}</span>`;

        commentsContainer.prepend(newComment);
        commentForm.reset();

        saveCommentToLocalStorage(userName, userComment);
      }
    });

    function saveCommentToLocalStorage(author, text) {
      const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
      savedComments.unshift({ author, text });
      localStorage.setItem('comments', JSON.stringify(savedComments));
    }

    function loadSavedComments() {
      const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
      savedComments.forEach(comment => {
        const newComment = document.createElement('div');
        const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];

        newComment.className = `${randomColor} rounded-xl p-4 shadow-md touch-card`;
        newComment.innerHTML = `"${comment.text}" <span class="font-semibold">- ${comment.author}</span>`;

        commentsContainer.prepend(newComment);
      });
    }

    loadSavedComments();
  }

  // =========================
  // EMOJIS DE FRUTA ANIMADOS
  // =========================

  function createFruitEmojis() {
    const container = document.getElementById('frutas-container');
    if (!container) return;

    const emojis = ['🍎', '🍊', '🍌', '🍓', '🍉', '🍇', '🍍', '🥭'];
    const colors = ['#FF5252', '#FFEB3B', '#4CAF50', '#FF4081', '#9C27B0'];
    const emojiCount = 70;

    for (let i = 0; i < emojiCount; i++) {
      const emoji = document.createElement('div');
      emoji.className = 'fruit-emoji';
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = `${Math.random() * 100}vw`;
      emoji.style.top = `${Math.random() * 100}vh`;
      emoji.style.fontSize = `${Math.random() * 2 + 1.5}rem`;
      emoji.style.animationDuration = `${Math.random() * 10 + 10}s`;
      emoji.style.animationDelay = `${Math.random() * 5}s`;
      emoji.style.color = colors[Math.floor(Math.random() * colors.length)];
      emoji.style.setProperty('--y-end', `${Math.random() * 100 - 50}px`);
      emoji.style.setProperty('--x-rotate', `${Math.random() * 20 - 10}deg`);
      container.appendChild(emoji);
    }
  }

  // =========================
  // EFECTO DE MOUSE SOBRE EMOJIS
  // =========================

  function setupMouseEffect() {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      document.querySelectorAll('.fruit-emoji').forEach((emoji, index) => {
        const speed = 0.1 + (index * 0.005);
        const xMove = (x - 0.5) * 50 * speed;
        const yMove = (y - 0.5) * 50 * speed;
        emoji.style.transform = `translate(${xMove}px, ${yMove}px)`;
      });
    });
  }

  // =========================
  // ANIMACIONES AL HACER SCROLL
  // =========================

  function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.slide-in').forEach(el => {
      observer.observe(el);
    });
  }

  // =========================
  // EFECTO TÁCTIL EN DISPOSITIVOS
  // =========================

  function setupTouchEffects() {
    const cards = document.querySelectorAll('.touch-card');

    cards.forEach(card => {
      card.addEventListener('touchstart', () => {
        card.classList.add('vibrate');
      });

      card.addEventListener('touchend', () => {
        card.classList.remove('vibrate');
      });
    });
  }

  // =========================
  // MOSTRAR/OCULTAR FORMULARIO DE COMENTARIOS
  // =========================

  const toggleCommentFormBtn = document.getElementById('showCommentFormBtn');
  const commentFormContainer = document.getElementById('commentFormContainer');

  if (toggleCommentFormBtn && commentFormContainer) {
    toggleCommentFormBtn.addEventListener('click', () => {
      const isHidden = commentFormContainer.classList.contains('hidden');
      commentFormContainer.classList.toggle('hidden');
      toggleCommentFormBtn.textContent = isHidden ? 'Cancelar' : 'Comentar';
    });
  }

  // =========================
  // INICIALIZACIÓN
  // =========================

  createFruitEmojis();
  setupMouseEffect();
  setupScrollAnimation();
  setupTouchEffects();
});

//MODAL AVISO DE PROVACIDAD
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modalAviso');
  const abrirBtn = document.getElementById('abrirModal');
  const aceptarBtn = document.querySelector('.boton-aceptar');
  
  // Abrir modal
  abrirBtn.addEventListener('click', function() {
    modal.classList.add('visible');
  });
  
  // Cerrar modal al hacer clic en aceptar
  aceptarBtn.addEventListener('click', function() {
    modal.classList.remove('visible');
  });
  
  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('visible');
    }
  });
});
