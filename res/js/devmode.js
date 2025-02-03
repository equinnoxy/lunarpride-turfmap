var devMode = false; // Change this to control button visibility
	
var svg = document.getElementById('_mapa');
var newPolygon = null;
var isDrawing = false;

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
        e.preventDefault();
    }
});

function createPolygon(x, y) {
	if (!newPolygon) {
		newPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
		newPolygon.setAttribute('stroke', 'white');
		newPolygon.setAttribute('stroke-width', '2');
		newPolygon.setAttribute('fill', 'rgba(255, 0, 0, 0.2)');
		svg.appendChild(newPolygon);
	}

	var pointString = newPolygon.getAttribute('points');
	if (!pointString) pointString = '';

	if (pointString !== '') pointString += ' ';
	pointString += x + ',' + y;

	newPolygon.setAttribute('points', pointString);
}

svg.addEventListener('click', function(event) {
	if (isDrawing) {
		var coords = svg.getBoundingClientRect();
		var mouseX = event.clientX - coords.left;
		var mouseY = event.clientY - coords.top;

		createPolygon(mouseX, mouseY);
	}
});

document.getElementById('toggleButton').addEventListener('click', function() {
isDrawing = !isDrawing;

if (!isDrawing) {
	var turfName = prompt("Enter turf name:");
	var turfColor = prompt("Enter turf color (hexadecimal format):");
	var threadLink = prompt("Enter thread link:");
	var turfID = Math.floor(Math.random() * 10000);

	var turfPoints = newPolygon.getAttribute('points').trim().split(/\s+/).map(coord => coord.split(',').map(parseFloat));

	console.log(turfPoints);

	var turfCenterX = 0;
	var turfCenterY = 0;

	// Turf merkezinin x ve y koordinatlarını hesapla
	for (var i = 0; i < turfPoints.length; i++) {
		turfCenterX += turfPoints[i][0];
		turfCenterY += turfPoints[i][1];
	}

	turfCenterX /= turfPoints.length;
	turfCenterY /= turfPoints.length;

	var minX = Math.min(...turfPoints.map(coord => coord[0]));
	var maxX = Math.max(...turfPoints.map(coord => coord[0]));
	var minY = Math.min(...turfPoints.map(coord => coord[1]));
	var maxY = Math.max(...turfPoints.map(coord => coord[1]));

	var width = maxX - minX;
	var height = maxY - minY;

	var centerXDiff = turfCenterX - minX;
	var centerYDiff = turfCenterY - minY;
	var relativeCenterX = centerXDiff / width;
	var relativeCenterY = centerYDiff / height;

	var turfDimensions = [[width, height]];
	
	var turfLimits = [{"minx": minX, "miny": minY, "maxx": maxX, "maxy": maxY}];

	var turfData = {
		"id": turfID,
		"name": turfName,
		"color": turfColor,
		"thread": threadLink,
		"turfIDs": [turfID.toString()],
		"turfs": [newPolygon.getAttribute('points').replace(/,/g, ' ')],
		"turfcenter": [[turfCenterX, turfCenterY]],
		"turfPolygon": [],
		"dimensions": turfDimensions,
		"limits": turfLimits
	};

	var output = JSON.stringify(turfData, null, 2);
	console.log(output);
}
});

document.getElementById('clearButton').addEventListener('click', function() {
	if (newPolygon) {
		svg.removeChild(newPolygon);
		newPolygon = null;
		console.log("Polygons cleared.");
	} else {
		console.log("No polygon to clear.");
	}
});

// Hide or show buttons based on dev mode
if (!devMode) {
	var controlButtons = document.querySelectorAll('.controlButton');
	controlButtons.forEach(function(button) {
		button.style.display = 'none';
	});
}