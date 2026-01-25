import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://successvanhire.co.uk/';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'SuccessVan - Van Hire & Rental in London | Last Minute Bookings',
    template: '%s | SuccessVan',
  },
  description: 'Premium van hire and rental services in North West London. Book your van today with SuccessVan - serving Cricklewood, Golders Green, Hampstead, Hendon, Mill Hill, Wembley and more.',
  keywords: 'van hire London, van rental, last minute van hire, North West London, Cricklewood, Golders Green, Hampstead, Hendon, Mill Hill, Wembley',
  authors: [{ name: 'SuccessVan' }],
  creator: 'SuccessVan',
  publisher: 'SuccessVan',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: baseUrl,
    siteName: 'SuccessVan',
    title: 'SuccessVan - Van Hire & Rental in London',
    description: 'Premium van hire and rental services in North West London',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'SuccessVan - Van Hire London',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SuccessVan - Van Hire & Rental in London',
    description: 'Premium van hire and rental services in North West London',
    images: [`${baseUrl}/og-image.jpg`],
    creator: '@successvan',
  },
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const locationMetadata = (location: string, description: string): Metadata => ({
  title: `Van Hire in ${location} | SuccessVan`,
  description,
  keywords: `van hire ${location}, van rental ${location}, last minute van hire ${location}`,
  openGraph: {
    title: `Van Hire in ${location} | SuccessVan`,
    description,
    type: 'website',
    locale: 'en_GB',
    url: `${baseUrl}/${location.toLowerCase().replace(/\s+/g, '-')}`,
  },
});
