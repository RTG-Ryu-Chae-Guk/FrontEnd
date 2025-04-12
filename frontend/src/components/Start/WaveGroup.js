import { Wave } from './Wave';

export class WaveGroup {
  constructor() {
    this.totalWaves = 3;
    this.totalPoints = 6;

this.colors = [
  'rgba(18, 111, 254, 0.4)', // 기본색 밝은 버전
  'rgba(18, 111, 254, 0.25)', // 중간 투명도
  'rgba(18, 111, 254, 0.15)', // 가장 연한 색
];

    this.waves = [];

    for (let i = 0; i < this.totalWaves; i++) {
      this.waves.push(new Wave(this.totalPoints, this.colors[i]));
    }
  }

  resize(width, height) {
    this.waves.forEach((wave) => wave.resize(width, height));
  }

  draw(ctx) {
    this.waves.forEach((wave) => wave.draw(ctx));
  }
}
