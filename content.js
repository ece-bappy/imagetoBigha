let drawing = false;
let points = [];
let isEnabled = false;

chrome.storage.local.get('isOn', function(data) {
  isEnabled = data.isOn || false;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'enable') {
    isEnabled = true;
  } else if (request.action === 'disable') {
    isEnabled = false;
    removePolygon();
  }
});

document.addEventListener('mousedown', startDrawing);
document.addEventListener('mousemove', draw);
document.addEventListener('mouseup', stopDrawing);

function startDrawing(e) {
  if (!isEnabled) return;
  drawing = true;
  points = [{ x: e.clientX, y: e.clientY }];
  createPolygon();
}

function draw(e) {
  if (!isEnabled || !drawing) return;
  points.push({ x: e.clientX, y: e.clientY });
  updatePolygon();
}

function stopDrawing() {
  drawing = false;
}

function createPolygon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";
  svg.setAttribute("id", "polygon-drawer");
  
  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("fill", "rgba(255, 0, 0, 0.5)");
  polygon.setAttribute("stroke", "black");
  
  svg.appendChild(polygon);
  document.body.appendChild(svg);
}

function updatePolygon() {
  const polygon = document.querySelector("#polygon-drawer polygon");
  const pointsString = points.map(p => `${p.x},${p.y}`).join(" ");
  polygon.setAttribute("points", pointsString);
}

function removePolygon() {
  const svg = document.querySelector("#polygon-drawer");
  if (svg) svg.remove();
}