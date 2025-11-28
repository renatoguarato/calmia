import { HeroSection } from '@/components/sections/HeroSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { ForCompaniesSection } from '@/components/sections/ForCompaniesSection'
import { ExampleSection } from '@/components/sections/ExampleSection'
import { SocialProofSection } from '@/components/sections/SocialProofSection'
import { FAQSection } from '@/components/sections/FAQSection'

const Index = () => {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <ForCompaniesSection />
      <ExampleSection />
      <SocialProofSection />
      <FAQSection />
    </div>
  )
}

export default Index
