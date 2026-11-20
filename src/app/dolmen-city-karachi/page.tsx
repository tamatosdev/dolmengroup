import type { Metadata } from "next";
import heroImage from "../../../assets/Dolmen City Karachi/hero section.jpg";
import destinationImage from "../../../assets/Dolmen City Karachi/Waterfront Retail & Business Destination.jpg";
import ProjectHero from "../project-hero";
import ProjectSplitIntro from "../project-split-intro";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

const description =
  "A landmark destination where waterfront living meets modern business and lifestyle. Experience Karachi’s finest blend of retail, leisure and corporate excellence.";

export const metadata: Metadata = {
  title: "Dolmen City Karachi | Dolmen Group",
  description,
};

export default function DolmenCityKarachiPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Community"
        titleLines={["Dolmen City", "Karachi"]}
        description={description}
        image={heroImage}
        mobileFocus={20}
      />
      <ProjectSplitIntro
        titleLines={["Waterfront Retail &", "Business"]}
        highlight="Destination"
        paragraphs={[
          "Dolmen City Karachi redefines waterfront luxury across 4.2 million sq. ft. of mixed-use development, featuring Pakistan’s first international-standard shopping mall (Dolmen Mall Clifton) for an unparalleled retail, dining and lifestyle experience.",
          "Seamlessly integrating retail with commerce, it serves as the country’s largest corporate hub, housing four premier office towers and a dedicated corporate block. It stands as South Asia’s first Real Estate Investment Trust (REIT) listed on the Pakistan Stock Exchange.",
        ]}
        image={{ src: destinationImage, alt: "Dolmen City Karachi on the Clifton waterfront" }}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
