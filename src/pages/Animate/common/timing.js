export class Timing {
  constructor({ duration, iterations = 1, easing = (p) => p } = {}) {
    this.startTime = Date.now();
    this.duration = duration;
    this.iterations = iterations;
    this.easing = easing;
  }

  get time() {
    return Date.now() - this.startTime;
  }

  get p() {
    const process = Math.min(this.time / this.duration, this.iterations);
    return this.isFinished ? 1 : this.easing(process % 1);
  }

  get isFinished() {
    return this.time / this.duration >= this.iterations;
  }
}
