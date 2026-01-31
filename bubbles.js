document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("skillsBox");
  const bubbles = container.querySelectorAll(".skill-bubble");

  const boxWidth = container.clientWidth;
  const boxHeight = container.clientHeight;

  bubbles.forEach(bubble => {
    const size = bubble.offsetWidth;

    let x = Math.random() * (boxWidth - size);
    let y = Math.random() * (boxHeight - size);

    let dx = (Math.random() - 0.5) * 0.8; // slow speed
    let dy = (Math.random() - 0.5) * 0.8;

    function animate() {
      x += dx;
      y += dy;

      // Bounce inside container
      if (x <= 0 || x >= boxWidth - size) dx *= -1;
      if (y <= 0 || y >= boxHeight - size) dy *= -1;

      bubble.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(animate);
    }

    animate();
  });
});