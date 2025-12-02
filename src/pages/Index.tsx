import { HeroSection } from '@/components/sections/HeroSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { ForCompaniesSection } from '@/components/sections/ForCompaniesSection'
import { ExampleSection } from '@/components/sections/ExampleSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { SEO } from '@/components/SEO'

const Index = () => {
  const baseUrl = window.location.origin
  const ogImage = `${baseUrl}/og-image.png`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'CalmIA',
        url: baseUrl,
        logo: `${baseUrl}/CalmIA-Logo-Black.png`,
        description:
          'Assistente de saúde mental com IA focado em profissionais sob alta pressão.',
      },
      {
        '@type': 'WebPage',
        name: 'CalmIA - Saúde Mental para Profissionais sob Pressão',
        description:
          'Um assistente com IA que gera ações práticas para reduzir o estresse do dia a dia, adaptado à sua profissão e sentimentos.',
        url: baseUrl,
        inLanguage: 'pt-BR',
        isPartOf: {
          '@type': 'WebSite',
          name: 'CalmIA',
          url: baseUrl,
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'CalmIA App',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
        },
      },
    ],
  }

  return (
    <>
      <SEO
        title="CalmIA - Saúde Mental para Profissionais sob Pressão"
        description="Descubra a CalmIA, o assistente de saúde mental com IA que oferece ações práticas e personalizadas para reduzir o estresse e prevenir o burnout em sua rotina profissional."
        canonical={baseUrl}
        image={ogImage}
        schema={schema}
      />
      <div className="flex flex-col w-full">
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
        <ForCompaniesSection />
        <ExampleSection />
        <FAQSection />
      </div>
    </>
  )
}

export default Index
