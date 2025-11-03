// src/components/SEO/SEO.tsx
import { FC } from "react";
import { Helmet } from "react-helmet";

type SEOProps = {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
  twitterHandle?: string;
};

const SEO: FC<SEOProps> = ({
  title,
  description,
  url = "https://yourdomain.com",
  image = "https://yourdomain.com/og-image.png",
  type = "website",
  twitterHandle = "@NOACBTPractice",
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={twitterHandle} />
    </Helmet>
  );
};

export default SEO;
