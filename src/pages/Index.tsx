import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BenefitsClients from "@/components/landing/BenefitsClients";
import BenefitsBusiness from "@/components/landing/BenefitsBusiness";
import HowItWorks from "@/components/landing/HowItWorks";
import RecommendedBusinesses from "@/components/landing/RecommendedBusinesses";
import Categories from "@/components/landing/Categories";
import BusinessCTA from "@/components/landing/BusinessCTA";
import VIPPlan from "@/components/landing/VIPPlan";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />
      <RecommendedBusinesses />
      <BenefitsClients />
      <BenefitsBusiness />
      <HowItWorks />
      <BusinessCTA />
      <VIPPlan />
      <Footer />
    </div>
  );
};

export default Index;
