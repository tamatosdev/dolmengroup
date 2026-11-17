type ProjectStat = {
  value: string;
  title: string;
  text: string;
};

type ProjectStatsProps = {
  label: string;
  stats: ProjectStat[];
};

/** Project inner page key figures, one bordered cell per stat. */
export default function ProjectStats({ label, stats }: ProjectStatsProps) {
  return (
    <section className="project-stats" aria-label={label}>
      <div className="project-stats-grid" style={{ "--project-stats-count": stats.length } as React.CSSProperties}>
        {stats.map((stat, index) => (
          <article
            className="project-stat"
            key={stat.title}
            data-reveal
            style={{ "--reveal-delay": `${index * 120}ms` } as React.CSSProperties}
          >
            <strong>{stat.value}</strong>
            <h3>{stat.title}</h3>
            <p>{stat.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
