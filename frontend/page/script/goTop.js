const returnTop = document.querySelector(".return_top");

window.addEventListener("scroll", () => {
  let scrollY = window.scrollY;
  if (scrollY >= 100) {
    //classにactive付与
    returnTop.classList.add("active");
  } else {
    //classからactive削除
    returnTop.classList.remove("active");
  }
});
