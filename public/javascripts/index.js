/**
 * City animation autogenerator
 * Eugene Maslovich
 * ehpc@ehpc.io
 *
 * Description:
 * 1. `generateCity` creates an array of coordinates for a specified width
 * 1.1. `build` creates an array of coordinates for a specified width
 * 1.1.1. `buildOne` creates one building from up to N coordinates
 * 1.1.1.1. `calc` creates a coordinate based on the prevous one
 * 2. `drawCity` draws lines based on those coordinates
 */

var cityBuilder = cityBuilder || (function () {

	var canvas, // Canvas element
		ctx, // Canvas context
		viewport = { // Coordinate system
			topY: 0,
			middleY: 0,
			bottomY: 0,
			leftX: 0,
			middleX: 0,
			rightX: 0,
			width: function () {
				return this.rightX - this.leftX;
			}
		},
		animSpeedFactor = 100, // For controlling overall animation speed
		animLastTimestamp = 0, // For controlling FPS
		animDrawRate = 1000 / 25, // FPS
		animPx = animSpeedFactor / 5, // How many pixels to generate each frame
		city = [], // Collection of coordinates for all buildings in the city
		cityColor = '#e2e2e2', // Base color of the city
		skyColor = '#999999', // Base color of the sky
		cityTopDeviation, // How long the buildings could be
		cityBottomDeviation, // How grounded the buildings could be
		cityLengthFactor, // Determines how wide the buildings could be
		cityLengthDeviation, // Determines maximum building width
		sun = { // Every city has a sun (except Zion)
			x: 0,
			y: 0,
			size: 0,
			width: 0,
			height: 0,
			angle: Math.PI - 0.2,
			speed: animSpeedFactor / 10000,
			color: '#e9e9e9' // Sun color
		};

	/**
	 * Recalculates the viewport
	 */
	function recalcViewport() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		cityTopDeviation = canvas.height / 9;
		cityBottomDeviation = canvas.height / 35;
		cityLengthFactor = canvas.height / 100;
		cityLengthDeviation = canvas.height / 18;
		viewport.middleY = canvas.height / 2 + cityTopDeviation / 2;
		viewport.bottomY = canvas.height;
		viewport.rightX = canvas.width - 1;
		viewport.middleX = canvas.width / 2;
		sun.size = canvas.height / 25;
		sun.width = canvas.width - sun.size * 2;
		sun.height = canvas.height - sun.size * 2;
	}

	/**
	 * Initializes the whole system
	 */
	function init() {
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		recalcViewport();
		city = generateCity(city, viewport.width());
		drawCity(city);
		mainLoop();
		window.addEventListener('resize', function () {
			recalcViewport();
		});
	}

	/**
	 * Main animation loop
	 * @param {number} timestamp Current timesptamp
	 */
	function mainLoop(timestamp) {
		window.requestAnimationFrame(mainLoop);
		if (timestamp - animLastTimestamp >= animDrawRate) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// Removing buildings from the left and shifting the city position
			city = demolishBuildings(city, animPx);
			// If there are no buildings left to show
			if (city[city.length - 1].x <= viewport.rightX) {
				city = generateCityMore(city, animPx);
			}
			moveSun(sun);
			changeLight();
			drawSun(sun);
			drawCity(city);
			animLastTimestamp = timestamp;
		}
	}

	function changeLight() {

	}

	/**
	 * Propels the sun forward
	 * @param {object} sun The sun
	 */
	function moveSun(sun) {
		sun.x = viewport.middleX + Math.cos(sun.angle) * sun.width * 0.5;
		sun.y = viewport.middleY + Math.sin(sun.angle) * sun.height * 0.5;
		sun.angle += sun.speed;
	}

	/**
	 * Draws the sun
	 * @param {object} sun The sun :)
	 */
	function drawSun(sun) {
		ctx.fillStyle = sun.color;
		ctx.beginPath();
		ctx.arc(sun.x, sun.y, sun.size, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}

	/**
	 * Draws a whole city on the canvas
	 * @param {array} city Coordinates for a city
	 */
	function drawCity(city) {
		var i;
		ctx.beginPath();
		ctx.moveTo(city[0].x, city[0].y);
		for (i = 1; i < city.length; i++) {
			ctx.lineTo(city[i].x, city[i].y);
		}
		ctx.lineTo(city[city.length - 1].x, viewport.bottomY);
		ctx.lineTo(viewport.leftX, viewport.bottomY);
		ctx.closePath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = cityColor;
		ctx.fillStyle = cityColor;
		ctx.fill();
		ctx.stroke();
	}

	/**
	 * Demolishes coordinates from the left side for the specified width
	 * @param {Array} city City
	 * @param {number} width Required width to demolist
	 * @return {Array} New city
	 */
	function demolishBuildings(city, width) {
		var availableWidth = width,
			i, n = 0;
		for (i = 0; i < city.length; i++) {
			// Deleting coordinates
			if (availableWidth > 0) {
				// If we cannot delete the whole coordinate
				if (city[i].x > availableWidth || city[i + 1].x - city[i].x > availableWidth) {
					city[i].x = viewport.leftX;
					availableWidth = 0;
				}
				else {
					availableWidth -= city[i + 1].x - city[i].x;
					n++;
				}
			}
			// Moving remaining coordinates to the left
			else {
				city[i].x -= width;
			}
		}
		city.splice(0, n);
		return city;
	}

	/**
	 * Generates a whole city
	 * @param {array} city City to work on
	 * @param {number} requiredWidth City width
	 * @return {array} City coordinates
	 */
	function generateCity(city, requiredWidth) {
		var buildings = build(city[city.length - 1], requiredWidth);
		return city.concat(buildings);
	}

	/**
	 * Generates some more buildings for a city and shifts coordinates
	 * @param {array} city City to work on
	 * @param {number} requiredWidth City width
	 * @return {array} City coordinates
	 */
	function generateCityMore(city, requiredWidth) {
		var buildings = build(city[city.length - 1], requiredWidth);
		city = city.concat(buildings);
		return city;
	}

	/**
	 * Generates some buildings for specified width
	 * @param {object} previous Previous coordinate
	 * @param {number} width Maximum width to generate
	 * @return {array} Array of generated coordinates
	 */
	function build(previous, width) {
		var availableWidth = width, // How much width left to build
			next, // Coordinates of the built building
			built = []; // Coordinates for all built buildings
		while (availableWidth > 0) {
			// Constructing a building
			next = buildOne(previous);
			// Reducing width left to build
			availableWidth -= next[next.length - 1].x - (previous ? previous.x : viewport.leftX);
			previous = next[next.length - 1];
			// Addind built buildings to the output
			built = built.concat(next);
		}
		return built;
	}

	/**
	 * Builds one building
	 * @param {object} previous Last coordinate
	 * @return {array} Array of coordinates for a building
	 */
	function buildOne(previous) {
		var count = 5, // How many coordinates for one building
			coordinates = [],
			current, i;
		for (i = 0; i < count; i++) {
			current = calc(previous);
			coordinates.push(current);
			previous = current;
		}
		return coordinates;
	}

	/**
	 * Calculates new coordinate based on the previous one.
	 * The algorithm is purely imperical, so don't try too hard to undestand it.
	 * @param {object} previous Previous coordinate
	 * @return {object} New coordinate
	 */
	function calc(previous) {
		var firstRun = false,
			probability = Math.random(),
			direction = 0, // 0 - right, 1 - up, 2 - down, 3 - stop and chill out
			horizonY = viewport.middleY,
			horizonBottomBoundary = horizonY + cityBottomDeviation,
			horizonTopBoundary = horizonY - cityTopDeviation,
			x, y, length;
		if (typeof previous === 'undefined') {
			previous = {
				x: viewport.leftX,
				y: viewport.middleY,
				direction: 0
			};
			firstRun = true;
		}
		// Calculate line length
		length = Math.floor(probability * cityLengthFactor) * 2;
		// Calculate direction
		if (length === 0) {
			direction = 3;
		}
		else if (previous.direction === 3) {
			direction = 0;
		}
		else if (probability > 0.5) {
			if (previous.direction === 2) {
				direction = 2;
			}
			else {
				direction = 1;
			}
		}
		else if (probability > 0) {
			if (previous.direction === 1) {
				direction = 1;
			}
			else {
				direction = 2;
			}
		}
		if (previous.direction === 0 && direction === 0 && probability > 0.5) {
			direction = 1;
		}
		else if (previous.direction === 0 && direction === 0 && probability > 0) {
			direction = 2;
		}
		if (length && direction === 2 && previous.y + length > horizonBottomBoundary) {
			direction = 0;
		}
		else if (length && direction === 1 && previous.y - length < horizonTopBoundary) {
			direction = 0;
		}
		// Ajusting length
		if (direction === 0) {
			length = length * 2;
		}
		// Calculate x coordinate
		if (firstRun) {
			x = previous.x;
		}
		else if (direction === 0) {
			x = previous.x + length;
		}
		else {
			x = previous.x;
		}
		// Calculate y coordinate
		if (direction === 1) {
			y = previous.y - length;
		}
		else if (direction === 2) {
			y = previous.y + length;
		}
		else {
			y = previous.y;
		}
		// Fixing too wide coordinates
		if (previous.y > viewport.middleY && y > viewport.middleY && x - previous.x > cityLengthDeviation) {
			direction = 2;
		}
		return {
			x: x,
			y: y,
			direction: direction
		};
	}

	return {
		init: init
	};
})();

window.onload = cityBuilder.init;
