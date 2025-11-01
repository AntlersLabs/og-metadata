export interface MetaData {
  title: string;
  description: string;
  og: {
    title: string;
    description: string;
    type: string;
    url: string;
    image: string;
    imageAlt: string;
    imageWidth: string;
    imageHeight: string;
    siteName: string;
    locale: string;
  };
  twitter: {
    card: string;
    site: string;
    creator: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  canonical: string;
  author: string;
  keywords: string;
  robots: string;
  favicon: string;
}
