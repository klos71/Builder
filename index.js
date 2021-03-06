var selected;
var backGroundTiles = [];
var enteties = [];
var factorys = [];
var homes = [];
var shops = [];
var GlobalBuildings = [];
var floorTexture = new Image(32, 32);
floorTexture.src = 'images/floor.png';
var floorHoverTexture = new Image(32, 32);
floorHoverTexture.src = 'images/floorHover.png';
var factoryTexture = new Image(32, 32);
factoryTexture.src = 'images/factory.png';
var shopTexture = new Image(32, 32);
shopTexture.src = 'images/shop.png';
var homeTexture = new Image(32, 32);
homeTexture.src = 'images/Home.png';
var personTexture = new Image(32, 32);
personTexture.src = 'images/person.png';
var roadTexture = new Image(32, 32);
roadTexture.src = 'images/road.png';

var Tutorial = localStorage.getItem('t1') ? false : true;
//house
var Tutorial2 = localStorage.getItem('t2') ? false : true;
//factory
var Tutorial3 = localStorage.getItem('t3') ? false : true;
//shop
var Tutorial4 = localStorage.getItem('t4') ? false : true;

var GameArea = {
	canvas: document.createElement('canvas'),

	day: 0,
	taxMoney: 1600,
	hours: 7,
	minutes: 0,
	Init: function() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = 32 * 16;

		this.context = this.canvas.getContext('2d', { alpha: false });
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(update, 40);
		this.canvas.oncontextmenu = function(e) {
			e.preventDefault();
			selectBuilder('pointer');
		};
		window.onresize = e => {
			this.canvas.width = e.target.innerWidth;
			this.backGround();
		};

		this.canvas.addEventListener('click', e => {
			backGroundTiles.forEach(el => {
				if (e.clientX > el.getPos().x && e.clientX < el.getPos().x + 32) {
					if (e.clientY > el.getPos().y && e.clientY < el.getPos().y + 32) {
						switch (selected) {
							case 'house':
								if (
									GameArea.taxMoney >= 100 &&
									getBuildingOnTile(e.clientX, e.clientY)
								) {
									if (Tutorial2) {
										alert(
											"Good now let's build a factory, select the factory and build it, the house will spawn an ent to work there"
										);
										localStorage.setItem('t2', false);
									}

									homes.push(
										new Home(el.getPos().x, el.getPos().y, homeTexture)
									);
									GameArea.taxMoney += -100;
								}

								break;
							case 'factory':
								if (
									GameArea.taxMoney >= 1000 &&
									getBuildingOnTile(e.clientX, e.clientY)
								) {
									if (Tutorial3) {
										alert(
											"Good now let's build a shop, select the shop and build it, the ent will need food to statisfy it's hunger"
										);
										localStorage.setItem('t3', false);
									}
									factorys.push(
										new Factory(el.getPos().x, el.getPos().y, factoryTexture)
									);
									GameArea.taxMoney += -1000;
								}

								break;
							case 'shop':
								if (
									GameArea.taxMoney >= 500 &&
									getBuildingOnTile(e.clientX, e.clientY)
								) {
									if (Tutorial4) {
										alert(
											'Well done, now continue to expand the world, the roads makes the ents go faster. The tutorial is now over'
										);
										localStorage.setItem('t4', false);
									}
									shops.push(
										new Shop(el.getPos().x, el.getPos().y, shopTexture)
									);
									GameArea.taxMoney += -500;
								}

								break;
							case 'road':
								if (
									GameArea.taxMoney >= 10 &&
									getBuildingOnTile(e.clientX, e.clientY)
								) {
									el.setRoad();
									GameArea.taxMoney += -10;
								}

								break;
							case 'demo':
								demoBuilding(el.getPos());

								break;

							default:
								selected = null;
						}
						el.hover(true);
					} else {
						el.hover(false);
					}
				} else {
					el.hover(false);
				}
			});
		});
		this.canvas.addEventListener('mousemove', e => {
			backGroundTiles.forEach(el => {
				if (e.clientX > el.getPos().x && e.clientX < el.getPos().x + 32) {
					if (e.clientY > el.getPos().y && e.clientY < el.getPos().y + 32) {
						el.hover(true);
					} else {
						el.hover(false);
					}
				} else {
					el.hover(false);
				}
			});
		});
		this.canvas.addEventListener('mouseleave', e => {
			backGroundTiles.forEach(el => {
				el.hover(false);
			});
		});
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	backGround: function() {
		backGroundTiles = [];
		for (var x = 0; x < this.canvas.width; x += 32) {
			for (var y = 0; y < this.canvas.height; y += 32) {
				backGroundTiles.push(new backGroundTile(x, y, floorTexture));
			}
		}
	}
};

class component {
	constructor(width, height, color, x, y) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;

		this.color = color;
	}
	update = () => {
		var ctx = GameArea.context;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);

		if (this.newX > this.x) {
			this.x += this.speed;
		}
		if (this.newX < this.x) {
			this.x -= this.speed;
		}
		if (this.newY > this.y) {
			this.y += this.speed;
		}
		if (this.newY < this.y) {
			this.y -= this.speed;
		}
	};
}
class backGroundTile extends component {
	constructor(x, y, Image) {
		super(32, 32, null, x, y);
		this.x = x;
		this.y = y;
		this.Image = Image;
		this.defaultImage = Image;
		this.type = 0;
	}
	update = () => {
		var ctx = GameArea.context;
		ctx.drawImage(this.Image, this.x, this.y);
	};
	getPos() {
		return { x: this.x, y: this.y };
	}
	getType() {
		return this.type;
	}
	setRoad() {
		this.type = 1;
		this.Image = roadTexture;
		this.defaultImage = roadTexture;
	}
	hover(h) {
		if (h) {
			this.Image = floorHoverTexture;
		} else {
			this.Image = this.defaultImage;
		}
	}
}

function getBuildingOnTile(x, y) {
	GlobalBuildings.push(homes, factorys, shops);
	let colision = false;
	GlobalBuildings.forEach(el => {
		el.forEach(building => {
			if (
				x > building.getPos().x &&
				x < building.getPos().x + 32 &&
				y > building.getPos().y &&
				y < building.getPos().y + 32
			) {
				colision = true;
			}
		});
	});
	return !colision;
	GlobalBuildings = [];
}

function update() {
	var t0 = performance.now();
	GameArea.clear();

	backGroundTiles.forEach(el => {
		el.update();
	});
	factorys.forEach(el => {
		el.update();
	});

	shops.forEach(el => {
		el.update();
	});
	homes.forEach(el => {
		el.update();
	});

	//always render last
	enteties.forEach(el => {
		el.update();
	});

	document.getElementById(
		'entAmount'
	).innerHTML = `Enteties: ${enteties.length}`;
	document.getElementById('ents').innerHTML = `<tr>
    <th>Name</th>
    <th>State</th>
    <th>Money</th>
    <th>Energy</th>
    <th>Hunger</th>
    <th>Inventory</th>
    <th>x</th>
    <th>y</th>
</tr>`;
	var ents = enteties.map(el => {
		return `<tr><td>${el.name}</td><td> ${el.state}</td> <td>${el.money.toFixed(
			1
		)}</td><td>${el.energy.toFixed(1)}</td><td>${el.hunger.toFixed(
			1
		)}</td><td>Sandwitch:${el.inventory.sandwitch.toFixed(0)}</td><td>${
			el.x
		}</td><td>${el.y}</td></tr>`;
	});
	document.getElementById('ents').innerHTML += ents;
	document.getElementById(
		'tax'
	).innerHTML = `TaxMoney: ${GameArea.taxMoney.toFixed(1)}`;
	document.getElementById('day').innerHTML = GameArea.day;
	document.getElementById(
		'time'
	).innerHTML = `${GameArea.hours}:${GameArea.minutes}`;
	//always last for true performance
	var t1 = performance.now();
	document.getElementById('fps').innerHTML = `${t1 - t0}`;
}
function dayUpdate() {
	setInterval(tick, 80);
	function tick() {
		GameArea.minutes++;
		if (GameArea.minutes == 60) {
			GameArea.hours++;
			GameArea.minutes = 0;
		}
		if (GameArea.hours == 24) {
			GameArea.day++;
			GameArea.hours = 0;
			GameArea.minutes = 0;
		}
	}
}
function selectBuilder(type) {
	selected = type;
	switch (selected) {
		case 'house':
			floorHoverTexture.src = 'images/Home.png';
			break;
		case 'shop':
			floorHoverTexture.src = 'images/shop.png';
			break;
		case 'factory':
			floorHoverTexture.src = 'images/factory.png';
			break;
		case 'road':
			floorHoverTexture.src = 'images/road.png';
			break;
		default:
			floorHoverTexture.src = 'images/floorHover.png';
	}
	document.getElementById('selected').innerHTML = type;
}

function demoBuilding(pos) {
	for (var i = 0; i < factorys.length; i++) {
		if (factorys[i].getPos().x == pos.x && factorys[i].getPos().y == pos.y) {
			factorys.splice(i, 1);
		}
	}
	for (var i = 0; i < homes.length; i++) {
		if (homes[i].getPos().x == pos.x && homes[i].getPos().y == pos.y) {
			homes.splice(i, 1);
		}
	}
	for (var i = 0; i < shops.length; i++) {
		if (shops[i].getPos().x == pos.x && shops[i].getPos().y == pos.y) {
			shops.splice(i, 1);
		}
	}
}

function save() {
	var save = {
		GameArea: GameArea,
		backGroundTiles: backGroundTiles,
		enteties: enteties,
		factorys: factorys,
		homes: homes,
		shops: shops
	};
	localStorage.setItem('save', JSON.stringify(save));
}

function load() {
	var save = localStorage.getItem('save');
	save = JSON.parse(save);
	/*destroy();

	GameArea.day = save.GameArea.day;
	GameArea.taxMoney = save.GameArea.taxMoney;
	GameArea.hours = save.GameArea.hours;
	GameArea.minutes = save.GameArea.minutes;
	backGroundTiles = save.backGroundTiles;
	enteties = save.enteties;
	factorys = save.factorys;
	home = save.homes;
	shops = save.shops;
	Init();*/
}

function Init() {
	GameArea.Init();
	GameArea.backGround();
	dayUpdate();
	if (Tutorial) {
		alert('Welcome to this canvas test');
		alert('To begin press the house button and build a house in a tile');
		localStorage.setItem('t1', false);
	}
	if (location.hostname === '127.0.0.1') {
		var debug = true;
	} else {
		var debug = false;
	}

	if (debug) {
		homes.push(new Home(0, 0, homeTexture));
		factorys.push(new Factory(32, 32, factoryTexture));
		shops.push(new Shop(64, 0, shopTexture));
	}
}

function destroy() {
	document.getElementsByTagName('canvas')[0].remove();
}

window.addEventListener('load', function() {
	Init();
});
