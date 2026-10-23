import { NextRequest, NextResponse } from 'next/server';
import { analyzeStartupWithGemma } from '@/lib/ai/gemma';

const CRAWL4AI_API_KEY = process.env.CRAWL4AI_API_KEY;

async function scrapeWithCrawl4AI(url: string): Promise<string> {
  if (!CRAWL4AI_API_KEY) throw new Error('no key');
  const response = await fetch('https://api.crawl4ai.com/scrape', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + CRAWL4AI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error('Crawl4AI error: ' + response.status);
  const data = await response.json();
  return data.markdown || data.content || '';
}

import { execSync } from 'child_process';

async function scrapeDirectly(url: string): Promise<string> {
  // 1. Try standard fetch with real browser headers & redirect follow
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) {
      const html = await res.text();
      const cleaned = cleanHtml(html);
      if (cleaned.length > 50) return cleaned;
    }
  } catch (fetchErr) {
    console.warn('[scrapeDirectly] Node fetch failed, attempting system curl fallback:', fetchErr);
  }

  // 2. Resilient fallback: system curl (bypasses TLS/cert & proxy quirks on Windows)
  try {
    const sanitizedUrl = url.replace(/["$`\\]/g, '');
    const curlOut = execSync(`curl.exe -s -L --max-time 15 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "${sanitizedUrl}"`, {
      encoding: 'utf8',
      timeout: 18000,
    });
    const cleaned = cleanHtml(curlOut);
    if (cleaned.length > 50) return cleaned;
  } catch (curlErr) {
    console.warn('[scrapeDirectly] System curl failed:', curlErr);
  }

  throw new Error('Unable to connect to website. Check the URL or verify site is online.');
}

function cleanHtml(html: string): string {
  // Extract meta tags & title (essential for SPAs / React apps where body is empty before JS)
  const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || '';
  const metaDesc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
  const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)?.[1] || '';

  const metaSummary = [
    title ? `TITLE: ${title}` : '',
    ogTitle ? `PRODUCT/BRAND: ${ogTitle}` : '',
    metaDesc ? `DESCRIPTION: ${metaDesc}` : '',
    ogDesc ? `DETAILS: ${ogDesc}` : '',
  ].filter(Boolean).join('\n');

  const strippedBody = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, '\n')
    .trim();

  return `${metaSummary}\n\nPAGE TEXT:\n${strippedBody}`.substring(0, 15000);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url: string = body.url;
    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : 'https://' + url);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400 });
    }
    const normalized = parsedUrl.toString();

    // Scrape the page
    let content = '';
    let method = 'direct';
    if (CRAWL4AI_API_KEY) {
      try {
        content = await scrapeWithCrawl4AI(normalized);
        method = 'crawl4ai';
      } catch (e) {
        console.warn('[crawl] Crawl4AI failed, using direct fetch:', e);
        content = await scrapeDirectly(normalized);
      }
    } else {
      content = await scrapeDirectly(normalized);
    }

    if (!content || content.length < 50) {
      return NextResponse.json(
        { success: false, error: 'Could not extract content from that URL. The page may block crawlers or require login.' },
        { status: 422 }
      );
    }

    // Analyze using Google Gemma 4 (no npm 'openai' dependency required)
    const analysis = await analyzeStartupWithGemma(content, normalized);

    return NextResponse.json({
      success: true,
      startupInfo: analysis.startupInfo,
      sourceUrl: normalized,
      scrapeMethod: method,
      contentLength: content.length,
      aiModel: analysis.model,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown crawl error';
    console.error('[/api/crawl]', msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}