import { Point } from './Point';

export class Wave {
  constructor(totalPoints, color) {
    this.totalPoints = totalPoints;
    this.color = color;
    this.points = [];
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.centerY = height / 2;
    this.pointGap = width / (this.totalPoints - 1);

    this.init();
  }

  init() {
    this.points = [];
    for (let i = 0; i < this.totalPoints; i++) {
      this.points.push(new Point(i, this.pointGap * i, this.centerY));
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.totalPoints - 1; i++) {
      this.points[i].update();

      const prev = this.points[i - 1];
      const current = this.points[i];
      const next = this.points[i + 1];

      const cx = (current.x + next.x) / 2;
      const cy = (current.y + next.y) / 2;

      ctx.quadraticCurveTo(current.x, current.y, cx, cy);
    }

    // 마지막 곡선 마무리
    const secondLast = this.points[this.totalPoints - 2];
    const last = this.points[this.totalPoints - 1];
    ctx.quadraticCurveTo(secondLast.x, secondLast.y, last.x, last.y);

    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.lineTo(this.points[0].x, this.points[0].y);

    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
