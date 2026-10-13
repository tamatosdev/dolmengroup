import Image from "next/image";
import footerImage from "../../assets/footer-image.jpg";

export default function FutureMarquee() {
  return (
    <section className="footer-image-section" aria-hidden="true">
      <Image
        className="footer-image"
        src={footerImage}
        alt=""
        sizes="100vw"
        priority={false}
      />
    </section>
  );
}
