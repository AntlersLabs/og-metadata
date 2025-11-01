import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';
import { MetaData } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the URL
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGMetaPreview/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = load(html);

    // Extract all meta tags
    const metaData: MetaData = {
      // Basic HTML meta
      title: $('title').first().text() || '',
      description: $('meta[name="description"]').attr('content') || '',

      // Open Graph meta tags
      og: {
        title: $('meta[property="og:title"]').attr('content') || '',
        description: $('meta[property="og:description"]').attr('content') || '',
        type: $('meta[property="og:type"]').attr('content') || '',
        url: $('meta[property="og:url"]').attr('content') || '',
        image: $('meta[property="og:image"]').attr('content') || '',
        imageAlt: $('meta[property="og:image:alt"]').attr('content') || '',
        imageWidth: $('meta[property="og:image:width"]').attr('content') || '',
        imageHeight: $('meta[property="og:image:height"]').attr('content') || '',
        siteName: $('meta[property="og:site_name"]').attr('content') || '',
        locale: $('meta[property="og:locale"]').attr('content') || '',
      },

      // Twitter Card meta tags
      twitter: {
        card: $('meta[name="twitter:card"]').attr('content') || '',
        site: $('meta[name="twitter:site"]').attr('content') || '',
        creator: $('meta[name="twitter:creator"]').attr('content') || '',
        title: $('meta[name="twitter:title"]').attr('content') || '',
        description: $('meta[name="twitter:description"]').attr('content') || '',
        image: $('meta[name="twitter:image"]').attr('content') || '',
        imageAlt: $('meta[name="twitter:image:alt"]').attr('content') || '',
      },

      // Additional meta tags
      canonical: $('link[rel="canonical"]').attr('href') || '',
      author: $('meta[name="author"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      robots: $('meta[name="robots"]').attr('content') || '',

      // Favicon
      favicon: $('link[rel="icon"]').attr('href') ||
               $('link[rel="shortcut icon"]').attr('href') || '',
    };

    // Fallback logic for missing data
    if (!metaData.og.title) metaData.og.title = metaData.title;
    if (!metaData.og.description) metaData.og.description = metaData.description;
    if (!metaData.twitter.title) metaData.twitter.title = metaData.og.title || metaData.title;
    if (!metaData.twitter.description) metaData.twitter.description = metaData.og.description || metaData.description;
    if (!metaData.twitter.image) metaData.twitter.image = metaData.og.image;

    return NextResponse.json({
      success: true,
      data: metaData,
      fetchedUrl: url
    });

  } catch (error) {
    console.error('Error fetching meta data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meta data' },
      { status: 500 }
    );
  }
}
