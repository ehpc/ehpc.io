/**
 * City builder
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
			rightX: 0,
			width: function () {
				return this.rightX - this.leftX;
			}
		},
		city = []; // Collection of coordinates for all buildings in the city

	/**
	 * Recalculates the viewport
	 */
	function recalcViewport() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		viewport.middleY = canvas.height / 2;
		viewport.bottomY = canvas.height - 1;
		viewport.rightX = canvas.width - 1;
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
	}

	/**
	 * Draws a whole city on the canvas
	 * @param {array} city Coordinates for a city
	 */
	function drawCity(city) {
		var i;
		ctx.moveTo(city[0].x, city[0].y);
		for (i = 1; i < city.length; i++) {
			ctx.lineTo(city[i].x, city[i].y);
		}
		ctx.lineTo(city[city.length - 1].x, viewport.bottomY);
		ctx.lineTo(viewport.leftX, viewport.bottomY);
		ctx.closePath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#333';
		ctx.fillStyle = '#555'; //#ECECEC
		ctx.fill();
		ctx.stroke();
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
			horizonBottomBoundary = horizonY + 30,
			horizonTopBoundary = horizonY - 100,
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
		length = Math.floor(probability * 10) * 2;
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
