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
			},
			height: function () {
				return this.bottomY - this.topY;
			}
		},
		animSpeedFactor = 100, // For controlling overall animation speed
		animLastTimestamp = 0, // For controlling FPS
		animDrawRate = 1000 / 25, // FPS
		animPx = animSpeedFactor / 5, // How many pixels to generate each frame
		city = [], // Collection of coordinates for all buildings in the city
		colors = {
			cityColor: '#222222', // Base color of the city
			skyColor: '#333333', // Base color of the sky
			sunColor: '#ffffff', // Sun color
			logoColor: '#ffffff' // Logo color
		},
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
			angle: Math.PI - 0.75,
			speed: animSpeedFactor / 10000,
			revolutionCount: 0, // How many times the sun circled
			previousRevolutionCount: -1,
			invisible: true // If sun is behind horizon
		},
		maxStarsCount, // Maximum number of stars in the sky
		stars = []; // Collection of stars

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
		viewport.rightX = canvas.width;
		viewport.middleX = canvas.width / 2;
		sun.size = canvas.height / 25;
		sun.width = canvas.width - sun.size * 2;
		sun.height = canvas.height - sun.size * 2;
		maxStarsCount = Math.ceil(viewport.width() * viewport.height() / 200);
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
			// Adding buildings fast so nobody will see a gap
			if (city[city.length - 1].x <= viewport.rightX) {
				city = generateCityMore(city, viewport.rightX - city[city.length - 1].x);
			}
			// We need new stars cause old ones covered less area than is available now
			sun.previousRevolutionCount = sun.revolutionCount - 1;
			stars = generateStars(stars);
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
			setLight();
			// Removing buildings from the left and shifting the city position
			city = demolishBuildings(city, animPx);
			// If there are no buildings left to show
			if (city[city.length - 1].x <= viewport.rightX) {
				city = generateCityMore(city, animPx);
			}
			sun = moveSun(sun);
			stars = generateStars(stars);
			drawStars(stars);
			drawSun(sun);
			drawCity(city);
			animLastTimestamp = timestamp;
		}
	}

	/**
	 * Generate some stars
	 * @param {array} stars Stars
	 * @return {array} Stars
	 */
	function generateStars(stars) {
		var count, i;
		if (sun.previousRevolutionCount !== sun.revolutionCount) {
			stars = [];
			count = Math.ceil(Math.random() * maxStarsCount);
			if (count < maxStarsCount * 0.3) {
				count = maxStarsCount * 0.3;
			}
			for (i = 0; i < count; i++) {
				stars.push({
					x: viewport.leftX + Math.random() * viewport.width(),
					y: viewport.topY + Math.random() * viewport.height() * 0.7,
					size: Math.random() * 2
				});
			}
			sun.previousRevolutionCount = sun.revolutionCount;
		}
		if (sun.ivisible) {
			return [];
		}
		return stars;
	}

	/**
	 * Draw all stars
	 * @param {array} stars Stars array
	 */
	function drawStars(stars) {
		var angle, i;
		if (!colors.currentStarsColorInvisible) {
			ctx.fillStyle = colors.currentStarsColor;
			for (i = 0; i < stars.length; i++) {
				ctx.fillRect(stars[i].x, stars[i].y, stars[i].size, stars[i].size);
			}
		}
	}

	/**
	 * Calculate lighting shift in respect to the sun in percents
	 * @param {boolean} dark Calculate for dark sky
	 * @return {number} Shift in percents
	 */
	function calcLightShift(dark) {
		var dPi, dLighten;
		// Angle deviation
		dPi = dark ? sun.angle : sun.angle - Math.PI;
		if (dPi > Math.PI / 2) {
			dPi = Math.PI - dPi;
		}
		// Lighten = angle * 100 / PI/2
		dLighten = dark ? dPi * 100 / Math.PI : dPi * 200 / Math.PI;
		if (dLighten < 0) {
			dLighten = 0;
		}
		return dLighten;
	}

	/**
	 * Calculate lighting shift for stars
	 * @return {number} Shift between 0 and 1
	 */
	function calcLightShiftForStars() {
		var padding = 0.5,
			leftAngle = Math.PI + padding,
			rightAngle = Math.PI * 2 - padding,
			angleRange = Math.PI + padding * 2,
			halfAngleRange = angleRange / 2,
			dLighten, normalizedAngle;
		if (sun.angle >= leftAngle && sun.angle <= rightAngle) {
			return 0;
		}
		else {
			if (sun.angle > rightAngle) {
				normalizedAngle = sun.angle - rightAngle;
			}
			else {
				normalizedAngle = sun.angle + padding;
			}
			if (normalizedAngle > halfAngleRange) {
				normalizedAngle = angleRange - normalizedAngle;
			}
			dLighten = normalizedAngle * 1 / (angleRange * 0.5);
			if (dLighten < 0) {
				dLighten = 0;
			}
			return dLighten;
		}
	}

	/**
	 * Draws light on the scene
	 */
	function setLight() {
		var color, dLighten;
		// Lighting the sky
		if (sun.angle > 0 && sun.angle < Math.PI) {
			color = colors.skyColor;
			colors.currentCityColor = colors.cityColor;
			colors.currentLogoColor = colors.logoColor;
		}
		else {
			dLighten = calcLightShift();
			// If we are getting too bright (shouldn't be brighter than sun)
			if (dLighten > 70) {
				color = colors.previousSkyColor;
			}
			else {
				color = window.tinycolor(colors.skyColor).lighten(dLighten).toHexString();
			}
			colors.previousSkyColor = color;

			// Calculate buildings color for later use
			colors.currentCityColor = window.tinycolor(colors.cityColor).lighten(dLighten).toHexString();

			// Set logo color
			colors.currentLogoColor = window.tinycolor(colors.logoColor).darken(dLighten * 5).toHexString();
			document.getElementById('logo').style.color = colors.currentLogoColor;
		}
		ctx.fillStyle = color;
		ctx.fillRect(viewport.leftX, viewport.topY, viewport.width(), viewport.height());

		// Lighting for stars
		dLighten = calcLightShiftForStars();
		colors.currentStarsColor = 'hsla(0, 100%, 100%, ' + dLighten + ')';
		if (dLighten === 0) {
			colors.currentStarsColorInvisible = true;
		}
		else {
			colors.currentStarsColorInvisible = false;
		}
	}

	/**
	 * Propels the sun forward
	 * @param {object} sun The sun
	 */
	function moveSun(sun) {
		var noon = Math.PI * 3 / 2;
		sun.x = viewport.middleX + Math.cos(sun.angle) * sun.width * 0.5;
		sun.y = viewport.middleY + Math.sin(sun.angle) * sun.height * 0.5;
		// Sun revolved one more time around the city
		if (sun.angle < noon && sun.angle + sun.speed > noon) {
			sun.revolutionCount++;
		}
		sun.angle += sun.speed;
		// Normalizing PI
		if (sun.angle >= 2 * Math.PI) {
			sun.angle = sun.angle - 2 * Math.PI;
		}
		sun.invisible = sun.angle < Math.PI;
		return sun;
	}

	/**
	 * Draws the sun
	 * @param {object} sun The sun :)
	 */
	function drawSun(sun) {
		ctx.fillStyle = colors.sunColor;
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
		var i, gradient;
		ctx.beginPath();
		ctx.moveTo(city[0].x, city[0].y);
		for (i = 1; i < city.length; i++) {
			ctx.lineTo(city[i].x, city[i].y);
		}
		ctx.lineTo(city[city.length - 1].x, viewport.bottomY);
		ctx.lineTo(viewport.leftX, viewport.bottomY);
		ctx.closePath();
		ctx.lineWidth = 1;

		if (typeof colors.currentCityColor === 'undefined') {
			colors.currentCityColor = colors.cityColor;
		}
		ctx.strokeStyle = 'rgba(1, 1, 1, 0)';
		gradient = ctx.createLinearGradient(viewport.leftX, viewport.topY, viewport.leftX, viewport.bottomY);
		gradient.addColorStop(0.35, colors.currentCityColor);
		gradient.addColorStop(0.6, colors.cityColor);
		ctx.fillStyle = gradient;

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
