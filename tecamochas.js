let currentMember = null; // Declaración única de currentMember

function mostrarFeedback(mensaje, esExito) {
  const feedback = document.getElementById("mensajeFeedback");
  if (!feedback) return;
  feedback.textContent = mensaje;
  feedback.className = esExito ? "feedback-message success" : "feedback-message error";
  feedback.style.display = "block";
  setTimeout(() => {
    if (feedback) feedback.style.display = "none";
  }, 5000);
}

function setupContactForm() {
  try {
    emailjs.init("1uos-VH02BLwzOAnj");
    console.log("EmailJS inicializado.");
  } catch (err) {
    console.error("Error al inicializar EmailJS:", err);
    mostrarFeedback("Error al cargar el servicio de correo.", false);
  }

  const mostrarBtn = document.getElementById("mostrarFormulario");
  const formContainer = document.getElementById("formContainer");
  const formulario = document.getElementById("formularioContacto");
  const cancelBtn = document.getElementById("cancelBtn");
  const feedback = document.getElementById("mensajeFeedback");

  if (!mostrarBtn || !formContainer || !formulario || !cancelBtn) {
    console.error("Faltan elementos del formulario de contacto en el DOM.");
    return;
  }

  mostrarBtn.addEventListener("click", () => {
    formContainer.classList.remove("hidden");
    mostrarBtn.style.display = "none";
    if (feedback) feedback.style.display = "none";
  });

  cancelBtn.addEventListener("click", () => {
    formContainer.classList.add("hidden");
    mostrarBtn.style.display = "inline-block";
    formulario.reset();
    if (feedback) feedback.style.display = "none";
  });

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !correo || !mensaje) {
      mostrarFeedback("Todos los campos son obligatorios.", false);
      return;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!correoValido) {
      mostrarFeedback("Por favor ingresa un correo válido.", false);
      return;
    }

    const submitBtn = formulario.querySelector("[type=submit]");
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Enviando...';

    const templateParams = {
      from_name: nombre,
      from_email: correo,
      message: mensaje,
      time: new Date().toLocaleString()
    };

    emailjs.send("service_u8ffglm", "template_yoykqer", templateParams)
      .then(() => {
        mostrarFeedback("¡Mensaje enviado con éxito! 😊", true);
        formulario.reset();
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

document.addEventListener('DOMContentLoaded', () => {
  setupContactForm();

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

  const toggleCommentFormBtn = document.getElementById('showCommentFormBtn');
  const commentFormContainer = document.getElementById('commentFormContainer');
  if (toggleCommentFormBtn && commentFormContainer) {
    toggleCommentFormBtn.addEventListener('click', () => {
      const isHidden = commentFormContainer.classList.contains('hidden');
      commentFormContainer.classList.toggle('hidden');
      toggleCommentFormBtn.textContent = isHidden ? 'Cancelar' : 'Comentar';
    });
  }

  function setupChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');

    if (!chatbotToggle || !chatbotWindow || !chatbotClose || !chatbotForm || !chatbotMessages || !chatbotInput) {
      console.error("Faltan elementos del chatbot en el DOM:", {
        chatbotToggle: !!chatbotToggle,
        chatbotWindow: !!chatbotWindow,
        chatbotClose: !!chatbotClose,
        chatbotForm: !!chatbotForm,
        chatbotMessages: !!chatbotMessages,
        chatbotInput: !!chatbotInput
      });
      return;
    }

    // Add welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'chatbot-message bot';
    welcomeMessage.textContent = '¡Hola! Bienvenido a Tecamochas 🍎 ¿En qué puedo ayudarte hoy?';
    chatbotMessages.appendChild(welcomeMessage);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    chatbotToggle.addEventListener('click', () => {
      chatbotWindow.classList.toggle('hidden');
      if (!chatbotWindow.classList.contains('hidden')) {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }
    });

    chatbotClose.addEventListener('click', () => {
      chatbotWindow.classList.add('hidden');
    });

    let lastRequestTime = 0;
    const minInterval = 15000; // 15 segundos de intervalo mínimo entre peticiones

    chatbotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = chatbotInput.value.trim();
      if (!message) return;

      const currentTime = Date.now();
      if (currentTime - lastRequestTime < minInterval) {
        mostrarFeedback("Por favor espera 15 segundos antes de enviar otro mensaje 🍎", false);
        return;
      }

      // Add user message
      const userMessage = document.createElement('div');
      userMessage.className = 'chatbot-message user';
      userMessage.textContent = message;
      chatbotMessages.appendChild(userMessage);
      chatbotInput.value = '';
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'Eres un asistente amigable de Tecamochas, una marca de snacks frutales. Responde en español con un tono alegre y útil, usando emojis relacionados con frutas (🍎🍊🍉) cuando sea apropiado. Ayuda con preguntas sobre productos, pedidos, o cualquier tema relacionado con Tecamochas.' },
              { role: 'user', content: message }
            ],
            max_tokens: 150
          })
        });

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Demasiadas solicitudes. Por favor, espera unos minutos y vuelve a intentarlo.');
          }
          throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
        }

        const data = await response.json();
        const botMessage = document.createElement('div');
        botMessage.className = 'chatbot-message bot';
        botMessage.textContent = data.choices[0].message.content.trim();
        chatbotMessages.appendChild(botMessage);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        lastRequestTime = currentTime;
      } catch (error) {
        console.error('Error al conectar con Open AI:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'chatbot-message bot';
        errorMessage.textContent = error.message || '¡Ups! Algo salió mal, intenta de nuevo 🍎';
        chatbotMessages.appendChild(errorMessage);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }
    });
  }

  // Initialize all functions after DOM is fully loaded
  setupChatbot();
  createFruitEmojis();
  setupMouseEffect();
  setupScrollAnimation();
  setupTouchEffects();
});

// MODAL AVISO DE PRIVACIDAD
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modalAviso');
  const abrirBtn = document.getElementById('abrirModal');
  const aceptarBtn = document.querySelector('.boton-aceptar');

  if (!modal || !abrirBtn || !aceptarBtn) {
    console.error("Faltan elementos del modal en el DOM. Asegúrate de que 'modalAviso', 'abrirModal' y '.boton-aceptar' existan en el HTML.");
    return;
  }

  abrirBtn.addEventListener('click', function() {
    modal.classList.add('active');
  });

  aceptarBtn.addEventListener('click', function() {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

function toggleDescripcion(element) {
  const valores = document.querySelectorAll('.valor-bubble');
  const isActive = element.classList.contains('active');
  valores.forEach(v => v.classList.remove('active'));
  if (!isActive) {
    element.classList.add('active');
  }
}
