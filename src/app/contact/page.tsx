import type { Metadata } from "next";
import ContactBanner from "../contact-banner";
import ContactTalk from "../contact-talk";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Contact | Dolmen Group",
  description:
    "Connect with Dolmen Group. From landmark developments to everyday experiences, get in touch with our team.",
};

export default function ContactPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ContactBanner />
      <ContactTalk />
      <SiteFooter />
    </div>
  );
}
