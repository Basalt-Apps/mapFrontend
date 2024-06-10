export class V2 {
  public x: number;
  public y: number;

  public constructor(x?: number, y?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
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
}
