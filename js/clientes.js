// ============================
// BLOQUE: clientes.js (gestión de contactos con tarjetas)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const clienteForm = document.getElementById("clienteForm");
  const listaClientes = document.getElementById("listaClientes");

  const LS = {
    getClientes: () => JSON.parse(localStorage.getItem("clientes") || "[]"),
    setClientes: (arr) => localStorage.setItem("clientes", JSON.stringify(arr))
  };

  // Renderizar clientes como tarjetas
  function renderClientes() {
    const clientes = LS.getClientes();
    listaClientes.innerHTML = "";

    clientes.forEach((c, index) => {
      const card = document.createElement("div");
      card.className = "cliente-card";

      card.innerHTML = `
        <div class="card-header">
          <span class="cliente-icon">👤</span>
          <strong>${c.nombre}</strong>
        </div>
        <div class="card-details" style="display:none;">
          <p><strong>Teléfono:</strong> ${c.numero}</p>
          <p><strong>Dirección:</strong> ${c.direccion || "-"}</p>
          <button class="deleteBtn">🗑️ Eliminar</button>
        </div>
      `;

      // Toggle detalles al hacer click en el header
      const header = card.querySelector(".card-header");
      const details = card.querySelector(".card-details");
      header.addEventListener("click", () => {
        details.style.display = details.style.display === "none" ? "block" : "none";
      });

      // Botón eliminar
      card.querySelector(".deleteBtn").addEventListener("click", () => {
        clientes.splice(index, 1);
        LS.setClientes(clientes);
        renderClientes();
      });

      listaClientes.appendChild(card);
    });
  }

  // Agregar cliente
  if (clienteForm) {
    clienteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = document.getElementById("clienteNombre").value.trim();
      const numero = document.getElementById("clienteNumero").value.trim();
      const direccion = document.getElementById("clienteDireccion").value.trim();

      if (!nombre || !numero) return;

      const clientes = LS.getClientes();
      clientes.push({ nombre, numero, direccion });
      LS.setClientes(clientes);

      clienteForm.reset();
      renderClientes();
    });
  }

  renderClientes();
});
