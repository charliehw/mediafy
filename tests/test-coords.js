module('mediafy.Coords tests');

test('Test initialisation', function () {
	var data = {
		x: 0,
		y: 5,
		width: 100,
		height: 200
	};
	var c = new mediafy.Coords(data);
	equal(c.x, data.x, 'x position matches the object passed in.');
	equal(c.y, data.y, 'y position matches the object passed in.');
	equal(c.width, data.width, 'width matches the object passed in.');
	equal(c.height, data.height, 'height matches the object passed in.');
});

test('Test scale', function () {
	var data = {
		x: 0,
		y: 5,
		width: 100,
		height: 200
	};
	var c = new mediafy.Coords(data);
	c.scale(0.5);
	equal(c.width, 50, 'Width is correctly scaled');
	equal(c.height, 100, 'Height is correctly scaled');
});

test('Test translate', function () {
	var data = {
		x: 0,
		y: 5,
		width: 100,
		height: 200
	};
	var c = new mediafy.Coords(data);
	c.translate([50, 100]);
	equal(c.x, 50, 'x correctly translated');
	equal(c.y, 105, 'y correctly translated');
});