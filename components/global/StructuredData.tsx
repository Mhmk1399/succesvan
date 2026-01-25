"use client";

export function StructuredData() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://successvanhire.co.uk/";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SuccessVan",
    image: `${baseUrl}/logo.png`,
    description: "Premium van hire and rental services in North West London",
    url: baseUrl,
    telephone: "+44 20 3011 1198",
    email: "Info@successvanhire.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Strata House, Waterloo Road,London, NW2 7UH",
      addressLocality: "London",
      addressRegion: "London",
      postalCode: "Your Postal Code",
      addressCountry: "GB",
    },
    sameAs: [
      "https://www.facebook.com/topvanhire",
      "https://www.instagram.com/success.van.hire",
      "https://twitter.com/MatinDiba?t=GKR1BWNSQK6yB2Rj4W5Jhg&s=09",
    ],
    areaServed: [
      "Cricklewood",
      "Golders Green",
      "Hampstead",
      "Hendon",
      "Mill Hill",
      "Wembley",
      "North West London",
    ],
    priceRange: "£",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Van Hire & Rental",
    provider: {
      "@type": "LocalBusiness",
      name: "SuccessVan",
      url: baseUrl,
    },
    areaServed: {
      "@type": "City",
      name: "London",
    },
    description:
      "Premium van hire and rental services with last minute booking availability",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
