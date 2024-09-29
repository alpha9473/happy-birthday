let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Function to handle both mouse and touch drag
    const handleMove = (x, y) => {
      if (!this.rotating) {
        this.mouseX = x;
        this.mouseY = y;
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      
      const dirX = x - this.mouseTouchX;
      const dirY = y - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Mouse events
    document.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    // Touch events
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];  // Handle the first touch
      handleMove(touch.clientX, touch.clientY);
    });

    // Start dragging with mouse or touch
    const startDrag = (x, y, button) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (button === 0 || button === undefined) {
        this.mouseTouchX = x;
        this.mouseTouchY = y;
        this.prevMouseX = x;
        this.prevMouseY = y;
      }
      if (button === 2) {
        this.rotating = true;
      }
    };

    // Mouse down event
    paper.addEventListener('mousedown', (e) => {
      startDrag(e.clientX, e.clientY, e.button);
    });

    // Touch start event
    paper.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];  // Handle the first touch
      startDrag(touch.clientX, touch.clientY);
    });

    // Stop dragging (mouse or touch)
    const stopDrag = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
