document.addEventListener("DOMContentLoaded", () => {

  const pedidoForm = document.getElementById("pedidoForm");

  // ---------------------------
  // Login (index.html)
  // ---------------------------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("username").value.trim();
      const pass = document.getElementById("password").value.trim();

      if (user === "admin" && pass === "1234") {
        window.location.href = "dashboard.html";
      } else {
        const msg = document.getElementById("loginMessage");
        if (msg) msg.textContent = "Usuario o contraseña incorrectos";
      }
    });
  }
// ---------------------------
// Botones inferiores (dashboard, pedidos, nuevo, registro)
// ---------------------------
const nuevoBtn = document.getElementById("nuevoBtn");
if (nuevoBtn) {
  nuevoBtn.addEventListener("click", () => {
    // limpiar cualquier pedido en edición
    localStorage.removeItem("pedidoEditando");
    window.location.href = "nuevo.html";
  });
}

const pedidosBtn = document.getElementById("pedidosBtn");
if (pedidosBtn) {
  pedidosBtn.addEventListener("click", () => {
    window.location.href = "pedidos.html";
  });
}

const registroBtn = document.getElementById("registroBtn");
if (registroBtn) {
  registroBtn.addEventListener("click", () => {
    window.location.href = "registro.html";
  });
}

  // ---------------------------
  // Menú lateral
  // ---------------------------
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");

  if (menuToggle && sideMenu) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      sideMenu.classList.toggle("show");
    });

    sideMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => sideMenu.classList.remove("show"));
    });

    document.addEventListener("click", (e) => {
      if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        sideMenu.classList.remove("show");
      }
    });
  }

  // ---------------------------
  // Utilidades de almacenamiento
  // ---------------------------
  const LS = {
    getPedidos: () => JSON.parse(localStorage.getItem("pedidos") || "[]"),
    setPedidos: (arr) => localStorage.setItem("pedidos", JSON.stringify(arr)),
    getRegistro: () => JSON.parse(localStorage.getItem("registro") || "[]"),
    setRegistro: (arr) => localStorage.setItem("registro", JSON.stringify(arr)),
    getEliminados: () => parseInt(localStorage.getItem("eliminados") || "0", 10),
    incEliminados: () => localStorage.setItem("eliminados", String(LS.getEliminados() + 1)),
  };

// ---------------------------
// Ingredientes dinámicos en nuevo.html
// ---------------------------
const ingredientesContainer = document.getElementById("ingredientesContainer");
const addIngredienteBtn = document.getElementById("addIngredienteBtn");
const totalInfo = document.getElementById("totalInfo"); // texto informativo
const monedaSelect = document.getElementById("moneda");

if (ingredientesContainer && addIngredienteBtn) {
  function calcularTotal() {
  let totalBs = 0;
  let totalUSD = 0;
  let totalCOP = 0;

  ingredientesContainer.querySelectorAll(".ingrediente-item").forEach(item => {
    const costo = parseFloat(item.querySelector(".costoInput")?.value || 0);
    const moneda = item.querySelector(".monedaInput")?.value || "$";

    if (moneda === "Bs") totalBs += costo;
    else if (moneda === "$") totalUSD += costo;
    else if (moneda === "COP") totalCOP += costo;
  });

  if (totalInfo) {
    totalInfo.textContent = `${totalBs.toFixed(2)} Bs | ${totalUSD.toFixed(2)} $ | ${totalCOP.toFixed(2)} COP`;
  }
}


  function crearIngrediente() {
  const div = document.createElement("div");
  div.className = "ingrediente-item";
  div.innerHTML = `
    <input type="text" placeholder="Producto" class="nombreInput" />
    <input type="number" placeholder="Costo" class="costoInput" />
    <select class="monedaInput">
      <option value="Bs">Bs (Bolívares)</option>
      <option value="$">$ (USD)</option>
      <option value="COP">COP (Pesos Colombianos)</option>
    </select>
    <button type="button" class="removeIngrediente">✖</button>
  `;

  // recalcular al escribir costo
  div.querySelector(".costoInput").addEventListener("input", calcularTotal);

  // recalcular al cambiar moneda
  div.querySelector(".monedaInput").addEventListener("change", calcularTotal);

  // recalcular al eliminar
  div.querySelector(".removeIngrediente").addEventListener("click", () => {
    div.remove();
    calcularTotal();
  });

  ingredientesContainer.appendChild(div);
}

// botón para agregar nuevo ingrediente
addIngredienteBtn.addEventListener("click", crearIngrediente);
}

if (pedidoForm) {
  pedidoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Capturar datos del formulario
    const evento = document.getElementById("evento")?.value || "-";
    const tipo = document.querySelector('input[name="tipo"]:checked')?.value || "-";
    const tamano = document.getElementById("tamano")?.value || "-";
    const cantidad = document.getElementById("cantidad")?.value || "0";
    const descripcion = document.getElementById("descripcion")?.value || "";
    const clienteNombre = document.getElementById("clienteNombre")?.value || "-";
    const clienteNumero = document.getElementById("clienteNumero")?.value || "-";
    const clienteDireccion = document.getElementById("clienteDireccion")?.value || "-";
    const fechaEntrega = document.getElementById("fechaEntrega")?.value || "-";

    // Capturar ingredientes
    const ingredientes = [];
    ingredientesContainer?.querySelectorAll(".ingrediente-item").forEach(item => {
      ingredientes.push({
        nombre: item.querySelector(".nombreInput")?.value || "-",
        costo: item.querySelector(".costoInput")?.value || "0",
        moneda: item.querySelector(".monedaInput")?.value || "$"
      });
    });

    // Calcular totales por moneda
    let totalBs = 0, totalUSD = 0, totalCOP = 0;
    ingredientes.forEach(i => {
      const costo = parseFloat(i.costo || 0);
      if (i.moneda === "Bs") totalBs += costo;
      else if (i.moneda === "$") totalUSD += costo;
      else if (i.moneda === "COP") totalCOP += costo;
    });

    // Precio manual
    const monto = document.getElementById("monto")?.value || "0";
    const moneda = document.getElementById("moneda")?.value || "Bs";

    // Crear objeto pedido
    const nuevoPedido = {
      evento,
      tipo,
      tamano,
      cantidad,
      descripcion,
      cliente: {
        nombre: clienteNombre,
        numero: clienteNumero,
        direccion: clienteDireccion,
        fechaEntrega
      },
      precio: {
        bs: totalBs.toFixed(2),
        usd: totalUSD.toFixed(2),
        cop: totalCOP.toFixed(2),
        manual: { monto, moneda }
      },
      ingredientes,
      estatus: "espera",
      pagado: "No"
    };

    // Guardar en localStorage
    const pedidos = LS.getPedidos();
    pedidos.push(nuevoPedido);
    LS.setPedidos(pedidos);

    // Redirigir a pedidos.html
    window.location.href = "pedidos.html";
  });
}



function formatFecha(fechaStr) {
  if (!fechaStr) return "-";
  const fecha = new Date(fechaStr);
  if (isNaN(fecha)) return fechaStr; // si no se puede convertir, devuelve tal cual
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = String(fecha.getFullYear()).slice(-2);
  return `${dia}/${mes}/${año}`;
}



// ---------------------------
// Render de Pedidos (pedidos.html)
// ---------------------------
const listaPedidos = document.getElementById("listaPedidos");
if (listaPedidos) {
  let pedidos = LS.getPedidos();

  function save() { LS.setPedidos(pedidos); }

  function render() {
    listaPedidos.innerHTML = "";
    pedidos.forEach((p, index) => {
      const card = document.createElement("div");
      card.className = "pedido-card";

      card.innerHTML = `
        <div class="pedido-header">
          <span class="estatus ${p.estatus}">
            ${p.estatus === "espera" ? "🕒 En espera" : p.estatus === "proceso" ? "🔥 En proceso" : "✅ Finalizado"}
          </span>
          <span class="pagado">${p.pagado === "Sí" ? "Pagado" : "No Pagado"}</span>
        </div>
        <p><strong>Cliente:</strong> ${p.cliente?.nombre || "-"}</p>
        <p><strong>Evento:</strong> ${p.evento}</p>
        <p><strong>Tipo:</strong> ${p.tipo || "-"}</p>
        <p><strong>Cantidad:</strong> ${p.cantidad ? p.cantidad + " Personas" : "-"}</p>
        <p><strong>Fecha entrega:</strong> ${p.cliente?.fechaEntrega ? formatFecha(p.cliente.fechaEntrega) : "-"}</p>
        <p><strong>Precio del pedido:</strong> 
          ${p.precio?.manual ? `${p.precio.manual.monto} ${p.precio.manual.moneda}` : "-"}
        </p>

        <div class="botones-linea">
          ${p.estatus === "espera" ? `
            <button class="hornearBtn">🔥 Hornear</button>
            <button class="pagarBtn">${p.pagado === "Sí" ? "❌ No Pago" : "💰 Pagar"}</button>
            <button class="finalizarBtn">✅ Finalizar</button>
            <button class="deleteBtn">🗑️ Eliminar</button>
          ` : p.estatus === "proceso" ? `
            <button class="apagarBtn">🛑 Apagar</button>
            <button class="pagarBtn">${p.pagado === "Sí" ? "❌ No Pago" : "💰 Pagar"}</button>
            <button class="finalizarBtn">✅ Finalizar</button>
            <button class="deleteBtn">🗑️ Eliminar</button>
          ` : `
            <button class="deleteBtn">🗑️ Eliminar</button>
          `}
        </div>

        <div class="ver-detalles-container">
          <button class="verDetallesBtn">🔎 Ver detalles</button>
          <div class="detalles" style="display:none; margin-top:10px;">
            <p><strong>Tamaño:</strong> ${p.tamano || "-"}</p>
            <p><strong>Cantidad:</strong> ${p.cantidad || "-"}</p>
            <p><strong>Descripción:</strong> ${p.descripcion || "-"}</p>
            <p><strong>Fecha entrega:</strong> ${p.cliente?.fechaEntrega ? formatFecha(p.cliente.fechaEntrega) : "-"}</p>
            <h4>Ingredientes:</h4>
            <ul>
              ${p.ingredientes?.map(i => `<li>${i.nombre}: ${i.costo} ${i.moneda}</li>`).join("") || "<li>-</li>"}
            </ul>
            <h4>Totales calculados:</h4>
            <p>${p.precio?.bs} Bs | ${p.precio?.usd} $ | ${p.precio?.cop} COP</p>
          </div>
        </div>
      `;

      // Botones funcionales
      const hornearBtn = card.querySelector(".hornearBtn");
      if (hornearBtn) {
        hornearBtn.addEventListener("click", () => {
          pedidos[index].estatus = "proceso";
          save();
          render();
        });
      }

      const apagarBtn = card.querySelector(".apagarBtn");
      if (apagarBtn) {
        apagarBtn.addEventListener("click", () => {
          pedidos[index].estatus = "espera";
          save();
          render();
        });
      }

      const pagarBtn = card.querySelector(".pagarBtn");
      if (pagarBtn) {
        pagarBtn.addEventListener("click", () => {
          pedidos[index].pagado = pedidos[index].pagado === "Sí" ? "No" : "Sí";
          save();
          render();
        });
      }

      const finalizarBtn = card.querySelector(".finalizarBtn");
      if (finalizarBtn) {
        finalizarBtn.addEventListener("click", () => {
          const registro = LS.getRegistro();
          const pedidoFinalizado = { ...pedidos[index], estatus: "finalizado" };
          registro.push(pedidoFinalizado);
          pedidos.splice(index, 1);
          LS.setRegistro(registro);
          save();
          render();
        });
      }

      const deleteBtn = card.querySelector(".deleteBtn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          pedidos.splice(index, 1);
          LS.incEliminados();
          save();
          render();
        });
      }

      const verDetallesBtn = card.querySelector(".verDetallesBtn");
      const detallesDiv = card.querySelector(".detalles");
      if (verDetallesBtn && detallesDiv) {
        verDetallesBtn.addEventListener("click", () => {
          detallesDiv.style.display = detallesDiv.style.display === "none" ? "block" : "none";
        });
      }

      listaPedidos.appendChild(card);
    }); // cierre forEach
  } // cierre function render

  // Primera carga
  render();
} // cierre if(listaPedidos)


// ---------------------------
// Render de Registro (registro.html)
// ---------------------------
const listaRegistro = document.getElementById("listaRegistro");
if (listaRegistro) {
  const fNombre = document.getElementById("fNombre");
  const fTipo = document.getElementById("fTipo");
  const fPagado = document.getElementById("fPagado");
  const fFecha = document.getElementById("fFecha");

  function aplicarFiltros(pedidos) {
    return pedidos.filter(p => {
      const nombreOk = !fNombre?.value || (p.cliente?.nombre || "").toLowerCase().includes(fNombre.value.toLowerCase());
      const tipoOk = !fTipo?.value || p.evento === fTipo.value;
      const pagadoOk = !fPagado?.value || p.pagado === fPagado.value;
      const fechaOk = !fFecha?.value || (p.cliente?.fechaEntrega === fFecha.value);
      return nombreOk && tipoOk && pagadoOk && fechaOk;
    });
  }

  function renderRegistro() {
    const registro = LS.getRegistro();
    const filtrados = aplicarFiltros(registro);
    listaRegistro.innerHTML = "";

    filtrados.forEach((p, index) => {
      const card = document.createElement("div");
      card.className = "pedido-card " + (p.pagado === "Sí" ? "pagado-card" : "nopago-card");
      
            // Inicializa minimizado en true si no existe
      if (typeof p.minimizado === "undefined") {
        p.minimizado = true;
      }

      
      if (p.minimizado) {
        card.innerHTML = `
          <div class="pedido-header">
            <span class="estatus ${p.estatus}">✅ Finalizado</span>
            <span class="pagado ${p.pagado === "Sí" ? "pagado-si" : "pagado-no"}">
              ${p.pagado === "Sí" ? "Pagado" : "Por pagar"}
            </span>
          </div>
          <p><strong>Cliente:</strong> ${p.cliente?.nombre || "-"}</p>
          <p><strong>Tipo:</strong> ${p.tipo || "-"}</p>
          <div class="pedido-actions">
            <button class="expandirBtn">🔼</button>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="pedido-header">
            <span class="estatus ${p.estatus}">
              ${p.estatus === "espera" ? "🕒 En espera" : p.estatus === "proceso" ? "🔥 En proceso" : "✅ Finalizado"}
            </span>
            <span class="pagado ${p.pagado === "Sí" ? "pagado-si" : "pagado-no"}">
              ${p.pagado === "Sí" ? "Pagado" : "Por pagar"}
            </span>
          </div>
          <p><strong>Cliente:</strong> ${p.cliente?.nombre || "-"}</p>
          <p><strong>Evento:</strong> ${p.evento}</p>
          <p><strong>Tipo:</strong> ${p.tipo || "-"}</p>
          <p><strong>Cantidad:</strong> ${p.cantidad ? p.cantidad + " Personas" : "-"}</p>
          <p><strong>Fecha entrega:</strong> ${p.cliente?.fechaEntrega ? formatFecha(p.cliente.fechaEntrega) : "-"}</p>
          <div class="pedido-actions">
            <button class="togglePagoBtn ${p.pagado === "Sí" ? "pagado" : "nopago"}">
              ${p.pagado === "Sí" ? "❌ Marcar como no pagado" : "💰 Marcar como pagado"}
            </button>
            <button class="minimizarBtn">➖</button>
            <button class="regresarBtn">↩️</button>
          </div>
        `;
      }

      // Minimizar
      const minimizarBtn = card.querySelector(".minimizarBtn");
      if (minimizarBtn) {
        minimizarBtn.addEventListener("click", () => {
          registro[index].minimizado = true;
          LS.setRegistro(registro);
          renderRegistro();
        });
      }

      // Expandir
      const expandirBtn = card.querySelector(".expandirBtn");
      if (expandirBtn) {
        expandirBtn.addEventListener("click", () => {
          registro[index].minimizado = false;
          LS.setRegistro(registro);
          renderRegistro();
        });
      }

      // Toggle pagado
      const togglePagoBtn = card.querySelector(".togglePagoBtn");
      if (togglePagoBtn) {
        togglePagoBtn.addEventListener("click", () => {
          registro[index].pagado = registro[index].pagado === "Sí" ? "No" : "Sí";
          LS.setRegistro(registro);
          renderRegistro();
        });
      }

      // Regresar a pedidos
      const regresarBtn = card.querySelector(".regresarBtn");
      if (regresarBtn) {
        regresarBtn.addEventListener("click", () => {
          const pedidos = LS.getPedidos();
          const pedidoRegresado = { ...registro[index], estatus: "espera", minimizado: false };
          pedidos.push(pedidoRegresado);
          registro.splice(index, 1);
          LS.setPedidos(pedidos);
          LS.setRegistro(registro);
          renderRegistro();
        });
      }

      listaRegistro.appendChild(card);
    }); // cierre forEach
  } // cierre function renderRegistro

  [fNombre, fTipo, fPagado, fFecha].forEach(el => {
    if (el) el.addEventListener("input", renderRegistro);
  });

  renderRegistro();
} // cierre if(listaRegistro)

}); // cierre del DOMContentLoaded
