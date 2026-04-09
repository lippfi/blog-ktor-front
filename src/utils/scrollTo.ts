export function scrollToElement(el: HTMLElement | null | undefined) {
  if (!el) return;

  const header = document.querySelector<HTMLElement>('.app-header');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;

  const elementTop = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: elementTop - headerHeight, behavior: 'smooth' });
}
