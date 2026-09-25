(function () {
  var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  var total = pages.length;
  var current = 0;
  var dotsEl = document.getElementById("dots");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");

  pages.forEach(function (_, i) {
    var d = document.createElement("span");
    d.className = "dot" + (i === 0 ? " on" : "");
    dotsEl.appendChild(d);
  });
  var dots = Array.prototype.slice.call(dotsEl.children);

  var animating = false;

  function go(idx) {
    idx = Math.max(0, Math.min(total - 1, idx));
    if (idx === current || animating) return;
    animating = true;

    var dir = idx > current ? 1 : -1;
    var leaving = pages[current];
    var entering = pages[idx];
    var flipClass = dir > 0 ? "flip-fwd" : "flip-back";

    entering.classList.add("active");
    void leaving.offsetWidth; // force reflow so the flip transition runs
    leaving.classList.add(flipClass);

    function onEnd(e) {
      if (e.target !== leaving || e.propertyName !== "transform") return;
      leaving.removeEventListener("transitionend", onEnd);
      leaving.style.transition = "none";
      leaving.classList.remove("active", flipClass);
      void leaving.offsetWidth;
      leaving.style.transition = "";
      animating = false;
    }
    leaving.addEventListener("transitionend", onEnd);

    dots[current].classList.remove("on");
    dots[idx].classList.add("on");
    current = idx;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.addEventListener("click", function () {
    go(current - 1);
  });
  nextBtn.addEventListener("click", function () {
    go(current + 1);
  });
  prevBtn.disabled = true;

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") go(current + 1);
    if (e.key === "ArrowLeft") go(current - 1);
  });

  var startX = null;
  var book = document.getElementById("book");
  book.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );
  book.addEventListener(
    "touchend",
    function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        dx < 0 ? go(current + 1) : go(current - 1);
      }
      startX = null;
    },
    { passive: true },
  );
})();
