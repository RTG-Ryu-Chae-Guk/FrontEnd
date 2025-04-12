export class Point {
  constructor(index, x, y) {
    this.x = x;
    this.y = y;
    this.index = index;
    this.baseY = y;
    this.cur = index;
    this.speed = 0.04;
    this.max = Math.random() * 30 + 30;
  }

  update() {
    this.cur += this.speed;
    this.y = this.baseY + Math.sin(this.cur) * this.max;
  }
}
