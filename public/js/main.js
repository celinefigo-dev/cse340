document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".menu-toggle")
  const navList = document.querySelector(".navigation")

  if (button && navList) {
    button.addEventListener("click", () => {
      navList.classList.toggle("open")
    })
  }
})