import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Services from "@/components/landing/Services";
import TrackingWidget from "@/components/landing/TrackingWidget";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Testimonials from "@/components/landing/Testimonials";
import Location from "@/components/landing/Location";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Services />
      <TrackingWidget />
      <WhyChooseUs />
      <Testimonials />
      <Location />
      <Footer />
    </>
  );
}
