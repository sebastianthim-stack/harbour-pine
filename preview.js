(function () {
  var MOBILE_MAX = 640;

  var panel = document.getElementById("product-preview");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "product-preview";
    panel.className = "product-preview";
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML =
      '<img class="pp-image" alt="" />' +
      '<div class="pp-name"></div>' +
      '<div class="pp-note"></div>';
    document.body.appendChild(panel);
  }
  var img = panel.querySelector(".pp-image");
  var nameEl = panel.querySelector(".pp-name");
  var noteEl = panel.querySelector(".pp-note");

  img.onerror = function () {
    if (!img.dataset.fbk && img.src.slice(-4) === ".jpg") {
      img.dataset.fbk = "1";
      img.src = img.src.slice(0, -4) + ".svg";
    } else {
      img.hidden = true;
    }
  };
  img.onload = function () {
    img.dataset.fbk = "";
  };

  var list = document.getElementById("box-list");
  if (!list) return;

  var visible = false;

  function isMobile() {
    return window.matchMedia("(max-width: " + MOBILE_MAX + "px)").matches;
  }

  function position(x, y) {
    var MARGIN = 14;
    var w = panel.offsetWidth;
    var h = panel.offsetHeight;
    var left = x + MARGIN;
    var top = y + MARGIN;
    if (left + w > window.innerWidth - MARGIN) left = x - w - MARGIN;
    if (left < MARGIN) left = MARGIN;
    if (top + h > window.innerHeight - MARGIN) top = y - h - MARGIN;
    if (top < MARGIN) top = MARGIN;
    panel.style.left = left + "px";
    panel.style.top = top + "px";
  }

  function show(item, x, y) {
    var name = item.dataset.productName || "";
    var src = item.dataset.detailImage || "";
    var note = item.dataset.detailNote || "";
    nameEl.textContent = name;
    noteEl.textContent = note;
    if (src) {
      img.src = src;
      img.hidden = false;
    } else {
      img.hidden = true;
    }
    panel.hidden = false;
    position(x, y);
    visible = true;
  }

  function hide() {
    if (!visible) return;
    panel.hidden = true;
    visible = false;
  }

  function onMouseMove(e) {
    if (isMobile()) {
      hide();
      return;
    }
    var item = e.target.closest(".product-item");
    if (item) show(item, e.clientX, e.clientY);
    else hide();
  }

  list.addEventListener("mousemove", onMouseMove);
  list.addEventListener("mouseleave", hide);
  window.addEventListener("resize", function () {
    if (isMobile()) hide();
  });
})();
