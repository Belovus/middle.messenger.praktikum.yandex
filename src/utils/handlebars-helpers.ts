export function And(a: unknown, b: unknown) {
  return a && b;
}

export function Or(a: unknown, b: unknown) {
  return a || b;
}

export function Not(a: unknown) {
  return !a;
}

export function Equal(a: unknown, b: unknown) {
  return a == b;
}
