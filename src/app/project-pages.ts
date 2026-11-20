/** Projects that have their own inner page, keyed by the title shown on the site. */
const projectPages: Record<string, string> = {
  "The Grove Residency": "/the-grove-residency/",
  "Grove Residency": "/the-grove-residency/",
  "Grove Residency Karachi": "/the-grove-residency/",
  "Dolmen Mall Lahore": "/dolmen-mall-lahore/",
  "Dolmen Mall Clifton": "/dolmen-mall-clifton/",
  "Dolmen Mall Tariq Road": "/dolmen-mall-tariq-road/",
  "Dolmen Mall Hyderi": "/dolmen-mall-hyderi/",
  "Dolmen City Islamabad": "/dolmen-city-islamabad/",
  "The Harbour Front": "/the-harbour-front/",
  "Sky Towers": "/sky-towers/",
  "Corporate Office Block": "/corporate-office-block/",
  "Executive Tower": "/executive-tower/",
  "Giordano": "/giordano/",
  "Bala Bala": "/bala-bala/",
  "Sindbad's Wonderland": "/sindbads-wonderland/",
};

/** The project's inner page, or undefined if it doesn't have one yet. */
export function projectPage(title: string): string | undefined {
  return projectPages[title];
}

/** Link for a project: its inner page if it has one, else the old in-page anchor. */
export function projectHref(title: string): string {
  return projectPage(title) ?? `#${title.toLowerCase().replaceAll(" ", "-")}`;
}
