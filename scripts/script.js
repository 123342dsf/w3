const canvas = document.querySelector('canvas');
//调用getContext获取2d画画的环境，ctx代指画布上允许画画的区域
const ctx = canvas.getContext('2d');

//设置画布的宽和高，等于浏览器的宽和高
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min,max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
  }
  function randomColor() {
    return (
      "rgb(" +
      random(0, 255) +
      ", " +
      random(0, 255) +
      ", " +
      random(0, 255) +
      ")"
    );
  }

function Shape(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = true;
  }
  
  Shape.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  };
  
  Shape.prototype.update = function () {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }
  
    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
  
    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }
  
    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
  
    this.x += this.velX;
    this.y += this.velY;
  };
  
  
  Shape.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
      if (this !== balls[j]) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = randomColor();
        }
      }
    }
  };

function Ball(x, y, velX, velY, color, size) {
    Shape.call(this, x, y, velX, velY); // 调用 Shape 构造器
    this.color = color;
    this.size = size;
}

// 继承 Shape 的原型
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

function EvilCircle(x, y) {
    Shape.call(this, x, y, 20, 20, exists); // 调用 Shape 构造器
    this.color = white;
    this.size = 10;
}
EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle=this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke(); 
}
EvilCircle.prototype.checkBounds = function () {
    if (this.x + this.size >= width) {
        this.x = -this.size;
      }
    
      if (this.x - this.size <= 0) {
        this.x = -this.size;
      }
    
      if (this.y + this.size >= height) {
        this.y = -this.size;
      }
    
      if (this.y - this.size <= 0) {
        this.y = -this.size;
      }
}
EvilCircle.prototype.setControls = function () {
    window.onkeydown = (e) => {
        switch (e.key) {
          case "a":
            this.x -= this.velX;
            break;
          case "d":
            this.x += this.velX;
            break;
          case "w":
            this.y -= this.velY;
            break;
          case "s":
            this.y += this.velY;
            break;
        }
      };
}
EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + balls[j].size) 
            {
                  balls.splice(1, 1);
            }
        }
      }
}

function loop() {
    //这是在下一个视图画出来时用来遮住之前的视图的
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);
  
    for (let i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
      
    }
    circle.draw();
   
  
    requestAnimationFrame(loop);
  }

let balls = [];

while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size,
  );
  balls.push(ball);
}
let circle=new EvilCircle(width/2,height);
circle.setControls();
loop();
