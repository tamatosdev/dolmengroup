import type { Metadata } from "next";
import elevatedDiningExperience from "../../../assets/Dolmen Mall lahore page/Elevated Dining Experience/Elevated Dining Experience.jpg";
import familyEntertainment from "../../../assets/Dolmen Mall lahore page/Elevated Dining Experience/slider.jpg";
import retailGalleries from "../../../assets/Dolmen Mall lahore page/Elevated Dining Experience/slider 3.jpg";
import skylitAtrium from "../../../assets/Dolmen Mall lahore page/Elevated Dining Experience/slider 4.jpg";
import heroImage from "../../../assets/Dolmen Mall lahore page/hero section image.jpg";
import atriumImage from "../../../assets/Dolmen Mall lahore page/Redefining Retail Experience/image 1335.jpg";
import diningCourtImage from "../../../assets/Dolmen Mall lahore page/Redefining Retail Experience/image 1336.png";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Dolmen Mall Lahore | Dolmen Group",
  description:
    "Dolmen Mall Lahore brings shopping, dining and entertainment together in a landmark destination designed for the city.",
};

export default function DolmenMallLahorePage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Malls"
        titleLines={["Dolmen Mall", "Lahore"]}
        description="Dolmen Mall Lahore brings shopping, dining and entertainment together in a landmark destination designed for the city."
        image={heroImage}
      />
      <ProjectIntro
        reverse
        titleLines={["Redefining Retail"]}
        highlight="Experience"
        paragraphs={[
          "Dolmen Mall Lahore is Pakistan’s premier shopping and entertainment destination. Spanning an impressive 2.1 million square feet, this world-class lifestyle hub flawlessly blends modern architecture with top-tier amenities.",
          "With over 13 million annual visitors, it stands as the ultimate retail epicenter for Lahore and the wider Punjab region. Here, you can discover an unparalleled mix of local and international brands designed to elevate the city’s lifestyle, all spread across three stunning levels and nearly 800,000 square feet of dynamic retail space.",
        ]}
        wideImage={{ src: atriumImage, alt: "Skylit atrium inside Dolmen Mall Lahore" }}
        tallImage={{ src: diningCourtImage, alt: "Sculptural column and restaurants inside Dolmen Mall Lahore" }}
      />
      <ProjectStats
        label="Dolmen Mall Lahore at a glance"
        stats={[
          {
            value: "2M+",
            title: "Sq. Ft. Total Built-up Area",
            text: "A landmark retail destination designed to bring shopping, leisure and lifestyle together.",
          },
          {
            value: "800K",
            title: "Sq. Ft. Leasable Area",
            text: "Expansive retail spaces offering brands room to connect with their customers.",
          },
          {
            value: "13M+",
            title: "Annual Visitors",
            text: "Welcoming millions of visitors to an engaging shopping and lifestyle experience.",
          },
          {
            value: "290+",
            title: "Retail, Dining & Entertainment Outlets",
            text: "A diverse mix of shopping, dining and entertainment experiences under one roof.",
          },
        ]}
      />
      <ProjectGallery
        titleLead={
          <>
            Where Every Experience
            <br />
            Comes
          </>
        }
        highlight="Together"
        slides={[
          { src: elevatedDiningExperience, title: "Elevated Dining Experience" },
          { src: familyEntertainment, title: "Family Entertainment" },
          { src: retailGalleries, title: "Premium Retail Galleries" },
          { src: skylitAtrium, title: "Skylit Grand Ceiling" },
          { src: heroImage, title: "Iconic Architecture" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
