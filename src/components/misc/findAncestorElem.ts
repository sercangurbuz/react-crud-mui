/**
 * this is polyfill for legacy browser
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function findAncestor(el: any, cls: string) {
  // eslint-disable-next-line no-empty
  while ((el = el.parentElement) && !el.classList.contains(cls)) {}
  return el;
}
