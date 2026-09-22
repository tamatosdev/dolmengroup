import Image from "next/image";
import arrowRight from "../../assets/arrow-right.svg";
import marqueeIcon from "../../assets/marquee icon.svg";
import betterFutureBackground from "../../assets/better-future-bg.png";

const marqueeItems = Array.from({ length: 2 }, (_, index) => (
  <span className="future-marquee-item" key={index}>
    <span>Building a better future</span>
    <Image src={marqueeIcon} alt="" aria-hidden="true" />
  </span>
));

export default function FutureMarquee() {
  return (
    <section className="future-marquee" id="contact" aria-label="Building a better future">
      <Image
        className="future-marquee-background"
        src={betterFutureBackground}
        alt=""
        fill
        sizes="100vw"
      />
      <div className="future-marquee-track">
        {marqueeItems}
      </div>
      <div className="future-marquee-contact">
        <h2>We are here to<br />listen to you</h2>
        <a href="#contact-form">
          Let&apos;s Talk
          <Image src={arrowRight} alt="" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
