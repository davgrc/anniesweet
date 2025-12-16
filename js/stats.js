// ============================
// BLOQUE: stats.js (conteo correcto de En espera y Activos)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // BLOQUE: Utilidades de almacenamiento
  // ============================
  const LS = {
    getPedidos: () => {
      try { return JSON.parse(localStorage.getItem("pedidos") || "[]"); }
      catch { return []; }
    },
    getRegistro: () => {
      try { return JSON.parse(localStorage.getItem("registro") || "[]"); }
      catch { return []; }
    },
    getEliminados: () => parseInt(localStorage.getItem("eliminados") || "0", 10),
    clearAll: () => {
      localStorage.setItem("pedidos", JSON.stringify([]));
      localStorage.setItem("registro", JSON.stringify([]));
      localStorage.setItem("eliminados", "0");
    }
  };

  // ============================
  // BLOQUE: Render de estadísticas
  // ============================
  function renderStats() {
    // Obtener datos primero
    const pedidos = LS.getPedidos();
    const registro = LS.getRegistro();
    const eliminados = LS.getEliminados();

    // Normaliza: toma 'estatus' o 'status', quita espacios y pasa a minúsculas
    const estado = p => String(p.estatus ?? p.status ?? "").trim().toLowerCase();

    // Métricas
    const espera = pedidos.filter(p => estado(p) === "espera").length;
    const activos = pedidos.filter(p => estado(p) === "proceso").length; // Activos = exactamente "horneando"
    const finalizados = registro.length;
    const pagados = registro.filter(p => String(p.pagado ?? "").trim().toLowerCase() === "sí").length;
    const porPagar = registro.filter(p => String(p.pagado ?? "").trim().toLowerCase() !== "sí").length;

    // Pintar en DOM con guardas
    const $espera = document.getElementById("statEspera");
    if ($espera) $espera.textContent = espera;

    const $activos = document.getElementById("statActivos");
    if ($activos) $activos.textContent = activos;

    const $finalizados = document.getElementById("statFinalizados");
    if ($finalizados) $finalizados.textContent = finalizados;

    const $eliminados = document.getElementById("statEliminados");
    if ($eliminados) $eliminados.textContent = eliminados;

    const $pagados = document.getElementById("statPagados");
    if ($pagados) $pagados.textContent = pagados;

    const $porPagar = document.getElementById("statPorPagar");
    if ($porPagar) $porPagar.textContent = porPagar;
  }

  // ============================
  // BLOQUE: Botón Reiniciar
  // ============================
  const resetBtn = document.getElementById("resetStatsBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("¿Seguro que quieres reiniciar todas las estadísticas?")) {
        LS.clearAll();
        renderStats();
        // location.reload(); // opcional: refresca toda la UI
      }
    });
  }

  // ============================
  // BLOQUE: Inicialización
  // ============================
  renderStats();

  // ============================
  // BLOQUE: API pública (opcional)
  // ============================
  window.renderStats = renderStats;
});
