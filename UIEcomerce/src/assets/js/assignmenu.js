function getPanelActive(panelid) {
  const headPanels = document.getElementsByClassName("headPanel");
  for (let i = 0; i < headPanels.length; i++) {
    headPanels[i].classList.remove(
      "text-blue-600",
      "border-b-2",
      "border-blue-600",
      "pb-1"
    );
    headPanels[i].classList.add("text-gray-700", "hover:text-blue-600");
  }
  const selectedPanel = document.querySelector(
    `strong[onclick="getPanelActive('${panelid}')"]`
  );
  if (selectedPanel) {
    selectedPanel.classList.add(
      "text-blue-600",
      "border-b-2",
      "border-blue-600",
      "pb-1"
    );
    selectedPanel.classList.remove("text-gray-700", "hover:text-blue-600");
  }

  const todosLosPaneles = document.querySelectorAll(".panel");
  debugger;
  todosLosPaneles.forEach((panel) => {
    panel.classList.add("hidden");
  });

  const panelSeleccionado = document.getElementById(panelid);
  if (panelSeleccionado) {
    panelSeleccionado.classList.remove("hidden");
  }
}

function getMenuActive(panelid) {
  alert(panelid);
  const headPanels = document.getElementsByClassName("headPanel");
  for (let i = 0; i < headPanels.length; i++) {
    headPanels[i].classList.remove(
      "text-blue-600",
      "border-b-2",
      "border-blue-600",
      "pb-1"
    );
    headPanels[i].classList.add("text-gray-700", "hover:text-blue-600");
  }
  const selectedPanel = document.querySelector(
    `<a [onclick="getMenuActive('${panelid}')"]`
  );
  if (selectedPanel) {
    selectedPanel.classList.add(
      "text-blue-600",
      "border-b-2",
      "border-blue-600",
      "pb-1"
    );
    selectedPanel.classList.remove("text-gray-700", "hover:text-blue-600");
  }
}
