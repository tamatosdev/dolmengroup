import Image from "next/image";
import arrowRight from "../../assets/arrow-right.svg";
import brush from "../../assets/brush.svg";
import dolmenPopup from "../../assets/dolmen-popup.png";
import dolmenUnitedPakistan from "../../assets/Dolmen-united-pakistan.png";
import dolmenFestival from "../../assets/Dolmen-festival.png";

type Update = {
  image: typeof dolmenPopup;
  title: string;
};

const updates: Update[] = [
  { image: dolmenPopup, title: "Dolmen Pop-up" },
  { image: dolmenUnitedPakistan, title: "Dolmen United Pakistan" },
  { image: dolmenFestival, title: "Dolmen Festival" },
];

const updateDescription = "Step into a world of shopping, entertainment, and unforgettable experiences at Dolmen Mall. Join us for our latest event and make the most of your visit.";

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

      <div className="latest-updates-grid">
        {updates.map((update) => (
          <article className="latest-update-card" key={update.title}>
            <Image className="latest-update-image" src={update.image} alt="" />
            <div className="latest-update-meta">
              <span>Mall</span>
              <span>2026</span>
            </div>
            <h3>{update.title}</h3>
            <p>{updateDescription}</p>
            <a href={`#${update.title.toLowerCase().replaceAll(" ", "-")}`}>
              Learn More
              <Image src={arrowRight} alt="" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
