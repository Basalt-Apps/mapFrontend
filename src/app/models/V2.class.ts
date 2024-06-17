export class V2 {
  public x: number;
  public y: number;

  public constructor(x?: number | HTMLImageElement, y?: number) {
    if (typeof x === 'object') {
      this.x = x.offsetWidth;
      this.y = x.offsetHeight
    } else {
      this.x = x ?? 0;
      this.y = y ?? 0;
    }
  }

  public add(other: V2): V2 {
    return new V2(this.x + other.x, this.y + other.y);
  }

  public subtract(other: V2): V2 {
    return new V2(this.x - other.x, this.y - other.y);
  }

  public multiply(scalar: number): V2 {
    return new V2(this.x * scalar, this.y * scalar);
  }

  public divide(dividend: number): V2 {
    return new V2(this.x / dividend, this.y / dividend);
  }

  public hadamardProduct(other: V2): V2 {
    return new V2(this.x * other.x, this.y * other.y);
  }

  public hadamardDivision(other: V2): V2 {
    return new V2(this.x / other.x, this.y / other.y);
  }

  public min(min: V2): V2 {
    return new V2(Math.min(this.x, min.x), Math.min(this.y, min.y))
  }

  public max(max: V2): V2 {
    return new V2(Math.max(this.x, max.x), Math.max(this.y, max.y))
  }
}
