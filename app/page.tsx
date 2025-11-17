import VanListing from "@/components/global/vanListing";
import AboutUs from "@/components/static/aboutHome";
import HeroSlider from "@/components/static/HeroSlider";
import ReservationHero from "@/components/static/ReservationHero";
import Testimonials from "@/components/static/testominial";
import WhyUs from "@/components/static/whyus";

export default function Home() {
  return (
    <>
      <ReservationHero />
      <VanListing showFilters={true} />
      <HeroSlider />
      <WhyUs />
      <Testimonials layout="grid" autoPlay={true} autoPlayInterval={5000} />
      <AboutUs />
    </>
  );
}
