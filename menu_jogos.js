document.addEventListener('DOMContentLoaded', function() {
  // Adiciona efeito de hover nos game cards
  const gameCards = document.querySelectorAll('.game-card');
  
  gameCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
          // Adiciona efeito de brilho extra
          this.style.transform = 'translateY(-15px)';
          this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
          
          // Animação suave nas luzes do arcade quando passa o mouse sobre um card
          const lights = document.querySelectorAll('.light');
          lights.forEach(light => {
              light.style.animationDuration = '0.8s';
          });
      });
      
      card.addEventListener('mouseleave', function() {
          // Remove efeito de brilho
          this.style.transform = '';
          this.style.boxShadow = '';
          
          // Retorna a animação das luzes ao normal
          const lights = document.querySelectorAll('.light');
          lights.forEach(light => {
              light.style.animationDuration = '2s';
          });
      });
  });
  
  // Efeito de clique nos botões de play
  const playButtons = document.querySelectorAll('.play-button:not([disabled])');
  
  playButtons.forEach(button => {
      button.addEventListener('click', function(e) {
          // Não fazemos nada especial se o botão estiver desabilitado
          if (this.hasAttribute('disabled')) return;
          
          // Adiciona efeito visual de clique
          this.style.transform = 'scale(0.95)';
          
          // Cria um efeito de onda ao clicar
          const ripple = document.createElement('span');
          ripple.classList.add('ripple-effect');
          this.appendChild(ripple);
          
          // Posiciona o efeito onde o usuário clicou
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          
          // Remove o efeito após a animação
          setTimeout(() => {
              ripple.remove();
              this.style.transform = '';
          }, 600);
      });
  });
  
  // Efeito de partículas no título
  const arcadeTitle = document.querySelector('.arcade-title');
  
  arcadeTitle.addEventListener('mouseenter', function() {
      createParticles(this);
  });
  
  function createParticles(element) {
      // Cria 20 partículas que saem do título
      for (let i = 0; i < 20; i++) {
          const particle = document.createElement('div');
          particle.classList.add('title-particle');
          
          // Estilo da partícula
          particle.style.position = 'absolute';
          particle.style.width = '8px';
          particle.style.height = '8px';
          particle.style.borderRadius = '50%';
          particle.style.pointerEvents = 'none';
          
          // Cores aleatórias para as partículas
          const colors = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'];
          particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          
          // Posição inicial no centro do título
          const rect = element.getBoundingClientRect();
          const containerRect = document.querySelector('.arcade-container').getBoundingClientRect();
          
          particle.style.left = (rect.left + rect.width / 2 - containerRect.left) + 'px';
          particle.style.top = (rect.top + rect.height / 2 - containerRect.top) + 'px';
          
          // Adiciona à página
          document.querySelector('.arcade-container').appendChild(particle);
          
          // Animação da partícula
          const angle = Math.random() * Math.PI * 2; // Ângulo aleatório
          const distance = 50 + Math.random() * 100; // Distância aleatória
          
          const destinationX = parseFloat(particle.style.left) + Math.cos(angle) * distance;
          const destinationY = parseFloat(particle.style.top) + Math.sin(angle) * distance;
          
          // Anima a partícula
          particle.animate([
              {
                  transform: 'scale(0)',
                  opacity: 1
              },
              {
                  transform: 'scale(1)',
                  opacity: 0.8,
                  left: destinationX + 'px',
                  top: destinationY + 'px'
              },
              {
                  transform: 'scale(0)',
                  opacity: 0,
                  left: destinationX + 'px',
                  top: destinationY + 'px'
              }
          ], {
              duration: 1000 + Math.random() * 500,
              easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
          });
          
          // Remove a partícula após a animação
          setTimeout(() => {
              particle.remove();
          }, 1500);
      }
  }
  
  // Adiciona estilos CSS adicionais diretamente via JavaScript
  const style = document.createElement('style');
  style.textContent = `
      .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.7);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
      }
      
      @keyframes ripple {
          to {
              transform: scale(4);
              opacity: 0;
          }
      }
      
      .play-button {
          overflow: hidden;
          position: relative;
      }
      
      .game-card {
          transform-origin: center bottom;
      }
      
      .game-title {
          position: relative;
          display: inline-block;
      }
  `;
  
  document.head.appendChild(style);
});