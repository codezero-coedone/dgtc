document.addEventListener("click", (event) => {
  if (!event.target.closest(".menu-button") && !event.target.closest(".mobile-panel")) {
    document.body.classList.remove("nav-open");
  }
});