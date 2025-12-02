import { HeroSection } from '@/components/sections/HeroSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { ForCompaniesSection } from '@/components/sections/ForCompaniesSection'
import { ExampleSection } from '@/components/sections/ExampleSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { useMetaTags } from '@/hooks/use-meta-tags'

const Index = () => {
  useMetaTags('/og-image.png')

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <ForCompaniesSection />
      <ExampleSection />
      <FAQSection />
    </div>
  )
}

export default Index
