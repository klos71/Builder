class building {
	constructor(x, y, Image) {
		this.width = 32;
		this.height = 32;
		this.x = x;
		this.y = y;
		this.Image = Image;
		this.defaultImage = Image;
	}
	update = () => {
		var ctx = GameArea.context;
		ctx.drawImage(this.Image, this.x, this.y);
	};
	getPos() {
		return { x: this.x, y: this.y };
	}
}
class Factory extends building {
	constructor(x, y, Image) {
		super(x, y, Image);
		this.x = x;
		this.y = y;
		this.Image = Image;
	}
}
class Shop extends building {
	constructor(x, y, Image) {
		super(x, y, Image);
		this.x = x;
		this.y = y;
		this.Image = Image;
	}
}
class Home extends building {
	constructor(x, y, Image) {
		super(x, y, Image);
		enteties.push(new Player(this.getPos().x, this.getPos().y, this));
	}
}
