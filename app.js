// Harbour & Pine — The Rescue Box landing page.
// Live data: (1) harbour_pine_inventory Google Sheet via JSONP on every load,
// (2) UK Carbon Intensity API for the cleanest delivery window. Hosted on GitHub Pages.

const CFG = window.CONFIG;
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${CFG.SHEET_ID}/gviz/tq?tqx=out:json&headers=1`;

const STATE = {
  rows: [],
  sheet: { lastRefresh: null, count: 0 },
  carbon: { lastRefresh: null, forecast: null, index: null }
};

function fetchSheetJsonp() {
  return new Promise((resolve, reject) => {
    let prevFn = window.google;
    const cleanup = () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (prevFn) window.google = prevFn;
      else delete window.google;
    };
    window.google = {
      visualization: {
        Query: {
          setResponse: (resp) => {
            cleanup();
            if (resp && resp.status === "ok") resolve(resp.table);
            else reject(new Error("Sheet status: " + (resp && resp.status)));
          }
        }
      }
    };
    const script = document.createElement("script");
    script.src = SHEET_URL;
    script.async = true;
    script.onerror = () => {
      cleanup();
      reject(new Error("Could not load the live Google Sheet."));
    };
    document.head.appendChild(script);
  });
}

function tableToObjects(table) {
  const labels = table.cols.map((c) => c.label);
  return (table.rows || []).map((row) => {
    const obj = {};
    labels.forEach((label, i) => {
      const cell = row.c && row.c[i];
      let v = cell ? cell.v : null;
      if (typeof v === "string") v = v.trim();
      if (v === "") v = null;
      obj[label] = v;
    });
    return obj;
  });
}

function fmtEuro(n) {
  return "\u20AC" + Number(n).toFixed(2);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[m]);
}

function setSheetStat(text) {
  document.getElementById("sheet-stat").innerHTML = `<span class="dot"></span> ` + text;
}

function setCarbonStat(text) {
  document.getElementById("carbon-stat").innerHTML = `<span class="dot"></span> ` + text;
}

function todayISO() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function isRescueEligible(row) {
  if (row.in_rescue === null) return false;
  return /^(y|yes|true|1)$/i.test(String(row.in_rescue));
}

function productNote(r) {
  const parts = [];
  if (r.quantity_available != null) parts.push(`${r.quantity_available} ${r.unit || "in stock"}`);
  if (r.best_before_days != null) {
    const d = Number(r.best_before_days);
    parts.push(`best before ${d} ${d === 1 ? "day" : "days"}`);
  }
  if (r.price_eur != null) parts.push(fmtEuro(r.price_eur));
  return parts.join(" · ");
}

function detailImage(r) {
  if (r.item_id) return "images/" + r.item_id + ".svg";
  const slug = String(r.product || r.item || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return "images/" + slug + ".svg";
}

function renderBox() {
  const list = document.getElementById("box-list");
  list.innerHTML = "";

  const eligible = STATE.rows.filter(isRescueEligible).sort((a, b) =>
    String(a.expiry_date || "").localeCompare(String(b.expiry_date || ""))
  );

  if (eligible.length === 0) {
    list.innerHTML = '<p class="loading">No rescue-eligible lines in the sheet right now.</p>';
    return;
  }

  eligible.forEach((r) => {
    const div = document.createElement("div");
    const qty = r.quantity_available != null ? r.quantity_available : "?";
    const bestBefore = r.best_before_days != null ? ` · best before <strong>${r.best_before_days} days</strong>` : "";
    const name = r.product || r.item || "Item";
    const note = productNote(r);
    div.className = "box-item product-item";
    div.setAttribute("data-product-name", name);
    div.setAttribute("data-detail-image", detailImage(r));
    if (note) div.setAttribute("data-detail-note", note);
    div.innerHTML =
      `<div>
         <div class="name">${escapeHtml(name)}</div>
         <div class="meta">${escapeHtml(r.category || "")} · ${escapeHtml(qty)} ${escapeHtml(r.unit || "")}${bestBefore}</div>
       </div>
       <div class="price">${fmtEuro(r.price_eur != null ? r.price_eur : 0)}</div>`;
    list.appendChild(div);
  });

  const totalValue = eligible.reduce((s, r) => s + Number(r.price_eur || 0), 0);
  const pay = totalValue * (1 - Number(CFG.BOX_DISCOUNT_PERCENT) / 100);
  document.getElementById("box-count").textContent = eligible.length;
  document.getElementById("box-value").textContent = fmtEuro(totalValue);
  document.getElementById("box-pay").textContent = fmtEuro(pay);
}

async function loadInventory() {
  const loading = document.getElementById("box-loading");
  try {
    const table = await fetchSheetJsonp();
    STATE.rows = tableToObjects(table);
    STATE.sheet.lastRefresh = new Date();
    STATE.sheet.count = STATE.rows.length;
    setSheetStat(`Live inventory · ${STATE.sheet.count} rows · ${STATE.sheet.lastRefresh.toLocaleTimeString("en-GB")}`);
    if (loading) loading.remove();
    renderBox();
  } catch (err) {
    setSheetStat("Live inventory · could not reach the sheet");
    document.getElementById("box-list").innerHTML =
      '<p class="loading">Could not reach the live inventory sheet. Check <code>config.js</code> and SHEET_SETUP.md.</p>';
  }
}

function indexAdvice(index) {
  const map = {
    "very low": { tone: "good", text: "The grid is at its cleanest. This is an excellent window for delivery." },
    low: { tone: "good", text: "The grid is clean right now. A good window for delivery." },
    moderate: { tone: "good", text: "The grid is moderate. A reasonable window to deliver." },
    high: { tone: "bad", text: "The grid is fairly dirty right now. Consider a later, cleaner window." },
    "very high": { tone: "bad", text: "The grid is very dirty right now. We would schedule delivery outside this window." }
  };
  return map[String(index || "").toLowerCase()] || { tone: "good", text: "" };
}

async function loadCarbon() {
  const box = document.getElementById("carbon-box");
  try {
    const res = await fetch("https://api.carbonintensity.org.uk/intensity", { mode: "cors" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();
    const d = json.data[0];
    STATE.carbon.lastRefresh = new Date();
    STATE.carbon.forecast = d.intensity.forecast;
    STATE.carbon.index = d.intensity.index;
    const a = indexAdvice(d.intensity.index);
    setCarbonStat(`UK grid · ${d.intensity.forecast} gCO\u2082/kWh · ${d.intensity.index} · ${STATE.carbon.lastRefresh.toLocaleTimeString("en-GB")}`);
    box.innerHTML =
      `<div class="index">${escapeHtml(d.intensity.index)} carbon</div>
       <div class="value">Forecast ${d.intensity.forecast} gCO\u2082/kWh (${new Date(d.from).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} – ${new Date(d.to).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })})</div>
       <div class="advice ${a.tone}">${a.text}</div>`;
  } catch (err) {
    setCarbonStat("UK grid · not available");
    box.innerHTML = '<p class="loading">Could not reach the UK Carbon Intensity API.</p>';
  }
}

function handleForm(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const frequency = document.querySelector('input[name="frequency"]:checked');
  const status = document.getElementById("form-status");

  if (!name || !email) {
    status.textContent = "Please add your name and email.";
    status.className = "form-status err";
    return;
  }

  const payload = {
    name, email,
    frequency: frequency ? frequency.value : "weekly",
    source: "Rescue Box landing page (live)",
    inventory_loaded_at: STATE.sheet.lastRefresh ? STATE.sheet.lastRefresh.toISOString() : "",
    submitted_at: new Date().toISOString()
  };

  if (CFG.FORMSPREE_ENDPOINT) {
    fetch(CFG.FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then((r) => {
        status.textContent = r.ok
          ? "Box reserved — we\u2019ll email you to confirm."
          : "Something went wrong. Please email hello@harbourandpine.example instead.";
        status.className = "form-status " + (r.ok ? "ok" : "err");
      })
      .catch(() => {
        status.textContent = "Something went wrong. Please email hello@harbourandpine.example instead.";
        status.className = "form-status err";
      });
    return;
  }

  const subject = encodeURIComponent("Rescue Box reservation — " + payload.name);
  const body = encodeURIComponent(
    `Name: ${payload.name}\nEmail: ${payload.email}\nFrequency: ${payload.frequency}\n`
  );
  window.location.href = `mailto:hello@harbourandpine.example?subject=${subject}&body=${body}`;
  status.textContent = "Opening your email app to confirm the reservation. If nothing opens, email hello@harbourandpine.example.";
  status.className = "form-status ok";
}

function init() {
  document.getElementById("signup-form").addEventListener("submit", handleForm);
  loadInventory();
  loadCarbon();
}

document.addEventListener("DOMContentLoaded", init);
