const app = document.getElementById("app");

let multas = [];
let usuario = null;


function generarCoordenadasSantoDomingo() {
  const latitudes = [18.4021, 18.5091];
  const longitudes = [-69.9402, -69.8835];

  const lat = (Math.random() * (latitudes[1] - latitudes[0])) + latitudes[0];
  const lon = (Math.random() * (longitudes[1] - longitudes[0])) + longitudes[0];

  return { lat, lng: lon };
}

// Función principal para renderizar vistas
function render(view) {
  if (view === "login") renderLogin();
  if (view === "dashboardAgente") renderDashboardAgente();
  if (view === "registrarMulta") renderRegistrarMulta();
  if (view === "listadoMultas") renderListadoMultas();
  if (view === "mapaMultas") renderMapaMultas();
  if (view === "comisionPorMes") renderComisionPorMes();
  if (view === "acercaDe") renderAcercaDe();
}

// Login
function renderLogin() {
  app.innerHTML = `
    <header><h1>Gestión de Multas</h1></header>
    <div class="card">
      <h3>Iniciar Sesión</h3>
      <form id="loginForm">
        <input type="text" id="cedula" placeholder="Cédula" required />
        <input type="password" id="clave" placeholder="Clave" required />
        <button type="submit">Entrar</button>
      </form>
    </div>
  `;

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const cedula = document.getElementById("cedula").value;
    const clave = document.getElementById("clave").value;
  
    if (cedula === "adamix" && clave === "estoesfacil") {
      usuario = { rol: "agente", nombre: "Adamix" };
      render("dashboardAgente");
    } else {
      alert("Credenciales incorrectas");
    }
  });
}

// Dashboard Agente
function renderDashboardAgente() {
  app.innerHTML = `
    <header><h1>Bienvenido, ${usuario.nombre}</h1></header>
    <div class="menu">
      <div class="menu-item" onclick="render('registrarMulta')">📝 Registrar Multa</div>
      <div class="menu-item" onclick="render('listadoMultas')">📋 Listado de Multas</div>
      <div class="menu-item" onclick="render('mapaMultas')">🗺️ Mapa de Multas</div>
      <div class="menu-item" onclick="render('comisionPorMes')">💰 Comisión por Mes</div>
      <div class="menu-item" onclick="render('acercaDe')">👤 Acerca de</div>
      <div class="menu-item" onclick="render('login')">🚪 Salir</div>
    </div>
  `;
}

// Registrar Multa
function renderRegistrarMulta() {
  app.innerHTML = `
    <header><h1>Registrar Multa</h1></header>
    <div class="card">
      <form id="multaForm">
        <input type="text" id="cedula" placeholder="Cédula del Ciudadano" required />
        <input type="text" id="nombre" placeholder="Nombre del Ciudadano" required />
        <select id="concepto" required>
          <option value="">Seleccionar Concepto</option>
          <option value="Exceso de velocidad">Exceso de Velocidad</option>
          <option value="Estacionamiento indebido">Estacionamiento Indebido</option>
        </select>
        <textarea id="descripcion" placeholder="Descripción"></textarea>
        <button type="submit">Registrar Multa</button>
      </form>
    </div>
  `;

  document.getElementById("multaForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const multa = {
      cedula: document.getElementById("cedula").value,
      nombre: document.getElementById("nombre").value,
      concepto: document.getElementById("concepto").value,
      descripcion: document.getElementById("descripcion").value,
      coordenadas: generarCoordenadasSantoDomingo(),
      monto: 100,
      fecha: new Date().toLocaleString(),
      estado: "Activa",
    };
    multas.push(multa);
    alert("Multa registrada");
    render("dashboardAgente");
  });
}

// Listado de Multas
function renderListadoMultas() {
  app.innerHTML = `
    <header><h1>Listado de Multas</h1></header>
    <div class="card">
      ${multas.length === 0 ? "<p>No hay multas registradas.</p>" : ""}
      <ul>
        ${multas
          .map(
            (multa) =>
              `<li>${multa.nombre} - ${multa.concepto} (${multa.estado})</li>`
          )
          .join("")}
      </ul>
      <button onclick="render('dashboardAgente')">Volver</button>
    </div>
  `;
}

// Mapa de Multas con Leaflet
function renderMapaMultas() {
  app.innerHTML = `
    <header><h1>Mapa de Multas en Santo Domingo</h1></header>
    <div id="map" style="width: 100%; height: 400px;"></div>
    <button onclick="render('dashboardAgente')">Volver</button>
  `;


  const map = L.map("map").setView([18.4861, -69.9312], 13); 
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Agregar marcadores de multas
  multas.forEach((multa) => {
    L.marker([multa.coordenadas.lat, multa.coordenadas.lng])
      .addTo(map)
      .bindPopup(
        `<b>${multa.nombre}</b><br>${multa.concepto}<br>${multa.descripcion}`
      )
      .openPopup();
  });
}

// Comisión por Mes
function renderComisionPorMes() {
  const comisionTotal = multas.reduce((total, multa) => total + multa.monto * 0.1, 0);

  app.innerHTML = `
    <header><h1>Comisión por Mes</h1></header>
    <div class="card">
      <h2>Total Comisión: $${comisionTotal.toFixed(2)}</h2>
      <p>Últimas multas:</p>
      <ul>
        ${multas
          .slice(-5)
          .map((multa) => `<li>${multa.nombre} - $${(multa.monto * 0.1).toFixed(2)}</li>`)
          .join("")}
      </ul>
      <button onclick="render('dashboardAgente')">Volver</button>
    </div>
  `;
}

// Acerca de
function renderAcercaDe() {
  app.innerHTML = `
    <header><h1>Acerca de</h1></header>
    <div class="card">
      <p>Aplicación desarrollada por:</p>
      <div class="programador-info">
        <img src="/mnt/data/foto 2x2.jpg" alt="Cristian Pimentel" style="width: 200px; height: 200px; border-radius: 50%; object-fit: cover;" />
        <p><strong>Cristian Pimentel</strong></p>
        <p>Contacto: <a href="https://t.me/YoungCris" target="_blank">Telegram</a></p>
      </div>
      <button onclick="render('dashboardAgente')">Volver</button>
    </div>
  `;
}


render("login");
