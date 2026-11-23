import Image from "next/image";
import arrowRight from "../../assets/arrow-right.svg";
import brush from "../../assets/brush.svg";
import dolmenAutoShow from "../../assets/Dolmen Auto Show.jpg";
import groveResidency from "../../assets/The Grove Residency.jpg";

type Update = {
  image: typeof groveResidency;
  category: string;
  year: string;
  title: string;
  description: string;
  /** External site the "Learn More" button opens (in a new tab). */
  href: string;
};

const updates: Update[] = [
  {
    image: groveResidency,
    category: "Residency",
    year: "2026",
    title: "The Grove Residency",
    description:
      "Discover refined waterfront residences designed for modern living, privacy, and everyday comfort. Explore architectural spaces crafted to elevate your lifestyle.",
    href: "https://groveresidency.com/",
  },
  {
    image: dolmenAutoShow,
    category: "Mall",
    year: "2026",
    title: "Dolmen Auto Show",
    description:
      "Experience iconic rides, automotive showcases, and high-energy crowd moments at Dolmen Mall. Explore the latest lineups and plan your visit today.",
    href: "https://dolmenmalls.com/",
  },
];

export default function LatestUpdates() {
  return (
    <section className="latest-updates" id="updates" aria-labelledby="latest-updates-title">
      <h2 id="latest-updates-title">
        The Latest
        <br />
        from{" "}
        <span>
          Dolmen.
          <Image
            className="title-brush"
            src={brush}
            alt=""
            aria-hidden="true"
            style={{ width: "100%", height: "14px" }}
          />
        </span>
      </h2>

      <div
        className="latest-updates-grid"
        style={{ "--updates-count": Math.min(updates.length, 3) } as React.CSSProperties}
      >
        {updates.map((update) => (
          <article className="latest-update-card" key={update.title}>
            <Image className="latest-update-image" src={update.image} alt={update.title} />
            <div className="latest-update-meta">
              <span>{update.category}</span>
              <span>{update.year}</span>
            </div>
            <h3>{update.title}</h3>
            <p>{update.description}</p>
            <a href={update.href} target="_blank" rel="noopener noreferrer">
              Learn More
              <Image src={arrowRight} alt="" aria-hidden="true" />
              <span className="sr-only"> about {update.title} (opens in a new tab)</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
