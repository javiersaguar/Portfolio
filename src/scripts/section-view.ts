export const portfolioSections = ['top', 'projects', 'about', 'education', 'experience', 'skills', 'stack', 'certifications', 'activity', 'contact'] as const;
export type PortfolioSection = typeof portfolioSections[number];

/** Muestra únicamente el apartado elegido y devuelve su ancla válida. */
export function showSection(id: string): PortfolioSection {
  const section = portfolioSections.includes(id as PortfolioSection) ? id as PortfolioSection : 'top';
  document.documentElement.dataset.section = section;
  document.querySelectorAll<HTMLElement>('#portfolio-content > section[id]').forEach(element => {
    element.dataset.portfolioSection = element.id;
    element.hidden = element.id !== section;
    element.inert = element.hidden;
  });
  document.querySelectorAll<HTMLElement>('#portfolio-content > .foot').forEach(footer => {
    footer.hidden = section !== 'contact';
    footer.inert = footer.hidden;
  });
  document.dispatchEvent(new CustomEvent('portfolio-section', { detail: section }));
  return section;
}
