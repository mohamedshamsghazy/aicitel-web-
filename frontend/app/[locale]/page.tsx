import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import UberUns from '@/components/UberUns';
import CareerOpportunities from '@/components/CareerOpportunities';
import BenefitsHighlight from '@/components/BenefitsHighlight';
import MentoringDetails from '@/components/MentoringDetails';
import EmployeeSuccess from '@/components/EmployeeSuccess';
import ProductPartner from '@/components/ProductPartner';
import ComplianceSection from '@/components/ComplianceSection';
import Contact from '@/components/Contact';
import TrustSection from '@/components/TrustSection';

export default function HomePage() {
    return (
        <>
            <Hero />
            <TrustSection />
            <ProductPartner /> {/* Services/Solutions */}
            <CareerOpportunities />
            <BenefitsHighlight />
            <Contact />

            {/* Secondary Sections */}
            <Mission />
            <ComplianceSection />
            <UberUns />
            <MentoringDetails />
            <EmployeeSuccess />
        </>
    );
}
