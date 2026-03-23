export function triggerConfetti() {
  try {
    // Create celebration modal
    const celebrationContainer = document.createElement("div");
    celebrationContainer.style.position = "fixed";
    celebrationContainer.style.top = "0";
    celebrationContainer.style.left = "0";
    celebrationContainer.style.width = "100%";
    celebrationContainer.style.height = "100%";
    celebrationContainer.style.pointerEvents = "none";
    celebrationContainer.style.zIndex = "9999";
    celebrationContainer.id = "celebration-container";

    // Add styles for the animation
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes celebration-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
      }

      @keyframes particle-burst {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(var(--tx), var(--ty)) scale(0);
          opacity: 0;
        }
      }

      @keyframes sparkle-glow {
        0%, 100% { opacity: 0.3; filter: blur(0px); }
        50% { opacity: 1; filter: blur(2px); }
      }

      @keyframes float-up {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) rotate(720deg);
          opacity: 0;
        }
      }

      @keyframes wave-pulse {
        0% {
          transform: scale(1);
          opacity: 0.8;
        }
        100% {
          transform: scale(3);
          opacity: 0;
        }
      }

      @keyframes confetti-spin {
        0% { transform: rotate(0deg) translateY(0); }
        100% { transform: rotate(720deg) translateY(100vh); }
      }
    `;
    document.head.appendChild(styleSheet);

    if (document.body) {
      document.body.appendChild(celebrationContainer);
    }

    // Create center burst particles
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 200 + Math.random() * 300;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const size = Math.random() * 8 + 4;
      const duration = Math.random() * 0.6 + 0.8;

      const colors = ["#14B8A6", "#0D9488", "#0891B2", "#06B6D4", "#FFD700", "#FF6B9D"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.position = "fixed";
      particle.style.left = centerX + "px";
      particle.style.top = centerY + "px";
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.backgroundColor = color;
      particle.style.borderRadius = "50%";
      particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      particle.style.pointerEvents = "none";
      particle.style.setProperty("--tx", tx + "px");
      particle.style.setProperty("--ty", ty + "px");
      particle.style.animation = `particle-burst ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;

      celebrationContainer.appendChild(particle);
    }

    // Create expanding wave rings
    for (let ring = 0; ring < 3; ring++) {
      const waveDot = document.createElement("div");
      const dotSize = 30;
      const delay = ring * 0.15;

      waveDot.style.position = "fixed";
      waveDot.style.left = (centerX - dotSize / 2) + "px";
      waveDot.style.top = (centerY - dotSize / 2) + "px";
      waveDot.style.width = dotSize + "px";
      waveDot.style.height = dotSize + "px";
      waveDot.style.borderRadius = "50%";
      waveDot.style.border = "3px solid #14B8A6";
      waveDot.style.pointerEvents = "none";
      waveDot.style.animation = `wave-pulse 0.8s ease-out ${delay}s forwards`;

      celebrationContainer.appendChild(waveDot);
    }

    // Create sparkles around screen
    const sparkleCount = 40;
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement("div");
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const size = Math.random() * 3 + 1;
      const delay = Math.random() * 0.3;
      const duration = Math.random() * 1 + 1.5;

      sparkle.style.position = "fixed";
      sparkle.style.left = x + "px";
      sparkle.style.top = y + "px";
      sparkle.style.width = size + "px";
      sparkle.style.height = size + "px";
      sparkle.style.backgroundColor = "#FFD700";
      sparkle.style.borderRadius = "50%";
      sparkle.style.pointerEvents = "none";
      sparkle.style.boxShadow = "0 0 8px #FFD700";
      sparkle.style.animation = `sparkle-glow ${duration}s ease-in-out ${delay}s infinite`;

      celebrationContainer.appendChild(sparkle);
    }

    // Create celebration text modal
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.left = "50%";
    modal.style.top = "50%";
    modal.style.transform = "translate(-50%, -50%) scale(0)";
    modal.style.zIndex = "10000";
    modal.style.pointerEvents = "none";

    const modalContent = document.createElement("div");
    modalContent.style.background = "rgba(255, 255, 255, 0.95)";
    modalContent.style.backdropFilter = "blur(10px)";
    modalContent.style.borderRadius = "20px";
    modalContent.style.padding = "40px 60px";
    modalContent.style.textAlign = "center";
    modalContent.style.border = "2px solid #14B8A6";
    modalContent.style.boxShadow = "0 20px 60px rgba(20, 184, 166, 0.3)";
    modalContent.style.minWidth = "350px";

    const titleEl = document.createElement("h2");
    titleEl.textContent = "🎉 Parabéns! 🎉";
    titleEl.style.fontSize = "48px";
    titleEl.style.margin = "0 0 10px 0";
    titleEl.style.color = "#14B8A6";
    titleEl.style.fontWeight = "bold";

    const subtitleEl = document.createElement("p");
    subtitleEl.textContent = "Você atingiu sua meta mensal!";
    subtitleEl.style.fontSize = "20px";
    subtitleEl.style.margin = "0";
    subtitleEl.style.color = "#0D9488";
    subtitleEl.style.fontWeight = "600";

    modalContent.appendChild(titleEl);
    modalContent.appendChild(subtitleEl);
    modal.appendChild(modalContent);
    celebrationContainer.appendChild(modal);

    // Animate modal entrance
    setTimeout(() => {
      modal.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
      modal.style.transform = "translate(-50%, -50%) scale(1)";
    }, 100);

    // Confetti pieces falling
    const confettiPieces = 30;
    for (let i = 0; i < confettiPieces; i++) {
      const confetti = document.createElement("div");
      const startX = Math.random() * window.innerWidth;
      const size = Math.random() * 6 + 4;
      const duration = Math.random() * 2 + 2;
      const delay = Math.random() * 0.3;
      const colors = ["#14B8A6", "#0D9488", "#0891B2", "#FFD700", "#FF6B9D"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      confetti.style.position = "fixed";
      confetti.style.left = startX + "px";
      confetti.style.top = "-20px";
      confetti.style.width = size + "px";
      confetti.style.height = size + "px";
      confetti.style.backgroundColor = color;
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";
      confetti.style.boxShadow = `0 0 ${size}px ${color}`;
      confetti.style.pointerEvents = "none";
      confetti.style.animation = `confetti-spin ${duration}s ease-in ${delay}s forwards`;

      celebrationContainer.appendChild(confetti);
    }

    // Cleanup after animation
    setTimeout(() => {
      const container = document.getElementById("celebration-container");
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      if (styleSheet && styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    }, 5000);
  } catch (error) {
    console.error("Celebration animation error:", error);
  }
}
