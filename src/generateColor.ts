const MAX_COLOR = 16777215;

export function generateColor() {
  return `#${Math.round(Math.random() * MAX_COLOR).toString(16).padStart(6, '0')}`;
}