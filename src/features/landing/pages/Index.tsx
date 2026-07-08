import Navbar from "@/features/landing/components/Navbar";
import Hero from "@/features/landing/components/Hero";
import BenefitsClients from "@/features/landing/components/BenefitsClients";
import BenefitsBusiness from "@/features/landing/components/BenefitsBusiness";
import HowItWorks from "@/features/landing/components/HowItWorks";
import RecommendedBusinesses from "@/features/landing/components/RecommendedBusinesses";
import Categories from "@/features/landing/components/Categories";
import BusinessCTA from "@/features/landing/components/BusinessCTA";
import VIPPlan from "@/features/landing/components/VIPPlan";
import Footer from "@/features/landing/components/Footer";

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
