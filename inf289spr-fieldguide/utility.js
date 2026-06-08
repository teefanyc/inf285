document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".main > div[id]");
  const steps = document.querySelectorAll(".timeline-step");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = [...sections].findIndex(s => s.id === entry.target.id);
        steps.forEach((step, i) => {
          step.classList.toggle("active", i === index); // only current section is active
        });
      }
    });
  }, {
    rootMargin: "-20% 0px -60% 0px"
  });

  sections.forEach(s => observer.observe(s));
});