import { ProposalExperience } from "@/components/proposal-experience";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Onboarding Review — an interactive product concept for Remote",
    headline: "Review international hires with country rules, cited evidence and clear human decisions.",
    description:
      "An interactive queue showing how five fictional EOR hires are checked, when AI is useful, and which decisions still require a specialist.",
    author: {
      "@type": "Person",
      name: "Alessio Carrà"
    },
    isAccessibleForFree: true
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProposalExperience />
    </>
  );
}
