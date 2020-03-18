class Player {
	constructor(x, y, home) {
		this.width = 16;
		this.height = 16;
		this.x = x;
		this.y = y;
		this.newX = x;
		this.newy = y;
		this.speed = 2;
		this.energy = 100;
		this.sleep = 0;
		this.hunger = 0;
		this.money = 0;
		this.name = getRandomName();
		this.state = 'idle';
		this.workplace;
		this.home = home;
		this.inventory = { sandwitch: 0 };
		this.Image = personTexture;
	}

	update = () => {
		var ctx = GameArea.context;
		ctx.drawImage(this.Image, this.x, this.y);
		this.energy += -0.005;
		this.hunger += 0.005;
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
		if (this.energy > 3 && GameArea.hours > 6 && GameArea.hours < 17) {
			if (this.state == 'home' && GameArea.hours < 16) {
			} else {
				this.work();
			}
		}
		if (this.energy < 3 || GameArea.hours > 17) {
			this.goHome();
		}
		if (this.hunger > 70 || (GameArea.hours > 11 && GameArea.hours < 13)) {
			this.shop();
		}
		if (this.inventory.sandwitch > 0) {
			this.inventory.sandwitch += -0.1;
			this.energy += 0.15;
			this.hunger -= 0.5;
		}

		if (getRoad(this.x, this.y)) {
			this.speed = 4;
		} else {
			this.speed = 2;
		}
	};

	work = () => {
		this.state = 'going to work';
		try {
			var closest = getClosest(this.x, this.y, factorys);
			var workX = closest.x + 8;
			var workY = closest.y + 8;
			this.move(workX, workY);
			if (getInside(this.x, this.y, closest.getPos().x, closest.getPos().y)) {
				if (this.energy > 3) {
					this.state = 'is working';
					this.money += 0.5;
					this.energy -= 0.1;
					this.hunger += 0.1;
				}
			}
		} catch (err) {
			console.error(err);
			this.state = "can't find work";
		}
	};

	shop = () => {
		this.state = 'going shopping';
		try {
			var closest = getClosest(this.x, this.y, shops);
			var shopX = closest.x + 8;
			var shopY = closest.y + 8;
			this.move(shopX, shopY);
			if (getInside(this.x, this.y, closest.getPos().x, closest.getPos().y)) {
				for (var i = 0; i < 5; i++) {
					if (this.money >= 5 && this.inventory.sandwitch <= 5) {
						this.money += -5;
						this.inventory.sandwitch++;
						GameArea.taxMoney += 5;
					}
				}
				this.state = 'shopped food';
			}
		} catch (err) {
			console.log(err);
			this.state = "can't find shop";
		}
	};

	goHome = () => {
		this.state = 'going home';
		try {
			var homeX = this.home.getPos().x + 8;
			var homeY = this.home.getPos().y + 8;
			this.move(homeX, homeY);
			if (
				getInside(this.x, this.y, this.home.getPos().x, this.home.getPos().y)
			) {
				this.state = 'Home';
				this.energy += 0.2;
			}
		} catch (err) {
			this.state = "can't find home...";
		}
	};

	move = (x, y) => {
		this.newX = x;
		this.newY = y;
	};
}

function getRoad(x, y) {
	backGroundTiles.forEach(el => {
		if (x > el.getPos().x && x < el.getPos().x + 32) {
			if (y > el.getPos().y && y < el.getPos().y + 32) {
				if (el.getType() == 1) {
					return true;
				} else {
					return false;
				}
			}
		}
	});
}

function getInside(x, y, posx, posy) {
	return x > posx && x < posx + 32 && y > posy && y < posy + 32;
}

function getClosest(startX, startY, array) {
	var closest = getDistance({ x: startX, y: startY }, array[0].getPos());
	var fact = array[0];
	for (var i = 0; i < array.length; i++) {
		var temp = getDistance({ x: startX, y: startY }, array[i].getPos());

		if (closest > temp) {
			closest = temp;
			fact = array[i];
		}
	}

	return fact;
}

function getDistance(pt1, pt2) {
	var diff1 = pt1.x - pt2.x;
	var diff2 = pt1.y - pt2.y;

	return Math.abs(diff1) + Math.abs(diff2);
}

function getRandomName() {
	var names = [
		'Websites_Nuclear',
		'Ice_cream_cone_Shelf',
		'Toolbox_Drugs',
		'Soda_Rollers',
		'Clock_Breakfast',
		'Elevator_Body',
		'Plus_Rollers',
		'Bird_Fence',
		'Trees_Boat',
		'Fusion_Monster',
		'Cat_Robot',
		'Dislike_Ice_cream',
		'Puppy_Plants',
		'Solar_Robot',
		'Solar_Cat',
		'Dislike_Leash',
		'Rollers_Toolbox',
		'Toolbox_Whale',
		'Male_Monster',
		'Urine_Website',
		'Dislike_Toilet',
		'Kitty_Body',
		'Video_games_Laptop',
		'System_Male',
		'Cat_Toolbox',
		'Toilet_Sink',
		'Fusion_Solar',
		'Post_office_Leash',
		'Poop_Shoes',
		'Towel_YouTube',
		'Horse_Websites',
		'Solar_Dislike',
		'Sink_Horse',
		'Boat_Puppy',
		'Drugs_Mail',
		'Mail_Poop',
		'Laptop_Kitty',
		'Whale_Rollers',
		'Flowers_Plus',
		'Plus_Nuclear',
		'Toilet_Shoe',
		'Fusion_BBQ',
		'Trees_Ice_cream',
		'Monster_Nuclear',
		'Whale_Poop',
		'Elevator_Water',
		'Laptop_Running',
		'Printer_Male',
		'Hnads_Clock',
		'Settings_Website',
		'Dislike_Light_saber',
		'Body_Sink',
		'Hnads_Rollers',
		'Leash_Kitty',
		'Video_games_Poop',
		'Urine_Shower',
		'Allergies_Whale',
		'Clock_Toolbox',
		'Mail_Ice_cream',
		'Shower_Fence',
		'Kitty_Breakfast',
		'Body_Elevator',
		'Plants_Soap',
		'Floppy_Disk_Android',
		'Breakfast_Dog',
		'Clock_Websites',
		'Websites_Settings',
		'Fusion_Post_office',
		'Plants_Poop',
		'Towel_System',
		'Clock_Breakfast',
		'Water_Android',
		'Robot_Towel',
		'Towel_Toilet',
		'Light_saber_Urine',
		'Kitty_Trees',
		'Bird_Prints',
		'Ring_Shelf',
		'Allergies_Poop',
		'Prints_Water',
		'Poop_Soap',
		'Whale_System',
		'YouTube_Robot',
		'Toolbox_Puppy',
		'Mail_Cat',
		'Fusion_Allergies',
		'Urine_Puppy',
		'Trees_Website',
		'Bird_Body',
		'Kitty_Drugs',
		'Cone_Ice_cream',
		'Drugs_Shoe',
		'Robot_Printer',
		'Ice_cream_BBQ',
		'Cat_Sink',
		'Video_games_Light_saber',
		'System_Elevator',
		'Soap_Ice_cream_cone',
		'Comics_Dislike',
		'Running_Shelf'
	];
	return names[Math.floor(Math.random() * names.length)];
}
