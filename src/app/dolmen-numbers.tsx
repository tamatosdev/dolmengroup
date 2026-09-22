const figures = [
  {
    number: "18M+",
    heading: "Sq. Ft. of Project Portfolio",
    text: "Across landmark retail, commercial, residential and mixed-use destinations.",
  },
  {
    number: "500+",
    heading: "Retail and commercial partners",
    text: "Home to most renowned international and local brands.",
  },
  {
    number: "2,000+",
    heading: "Working Professionals",
    text: "A team of individual experts, working towards one vision.",
  },
  {
    number: "45M+",
    heading: "Annual Visitors",
    text: "Welcomed across Dolmen destinations every year.",
  },
];

export default function DolmenNumbers() {
  return (
    <section className="dolmen-numbers" aria-labelledby="dolmen-numbers-title">
      <h2 id="dolmen-numbers-title">
        Dolmen in <span>Numbers</span>
      </h2>

      <div className="dolmen-numbers-grid">
        {figures.map((figure) => (
          <article className="dolmen-number" key={figure.number}>
            <strong>{figure.number}</strong>
            <h3>{figure.heading}</h3>
            <p>{figure.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
