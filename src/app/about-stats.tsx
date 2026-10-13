const stats = [
  {
    number: "10M+",
    heading: "Sq Ft. of Project Portfolio",
    text: "Across landmark retail, commercial, residential and mixed-use destinations.",
  },
  {
    number: "35M+",
    heading: "Annual Visitors",
    text: "Across flagship retail malls and integrated commercial destinations.",
  },
  {
    number: "35+",
    heading: "Years of Excellence",
    text: "Shaping Pakistan's real estate landscape with landmark retail and mixed-use projects.",
  },
  {
    number: "500+",
    heading: "Retail Stores & Commercial Offices",
    text: "Home to leading international and top Pakistani local brands.",
  },
  {
    number: "2000+",
    heading: "Working Professionals",
    text: "Dedicated team of experts driving growth & delivering excellence across developments.",
  },
];

export default function AboutStats() {
  return (
    <section className="about-stats" aria-label="Dolmen at a glance">
      <div className="about-stats-grid">
        {stats.map((stat) => (
          <article className="dolmen-number about-stat" key={stat.heading}>
            <strong>{stat.number}</strong>
            <h3>{stat.heading}</h3>
            <p>{stat.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
