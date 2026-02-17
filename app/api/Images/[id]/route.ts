import { NextRequest } from 'next/server';

const CACHE_DURATION = 60 * 60;
const MAX_RETRIES = 3;
const getRetryDelay = (attempt: number) => Math.pow(2, attempt) * 1000;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, maxRetries: number = MAX_RETRIES): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : getRetryDelay(attempt);
        console.log(`Rate limited. Retrying after ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`);
        await sleep(delayMs);
        continue;
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      console.error(`Fetch attempt ${attempt + 1}/${maxRetries} failed:`, error);

      if (attempt < maxRetries - 1) {
        const delayMs = getRetryDelay(attempt);
        console.log(`Retrying after ${delayMs}ms...`);
        await sleep(delayMs);
      }
    }
  }

  throw lastError || new Error('Failed to fetch after multiple retries');
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id;
  const subscriptionKey = process.env.NEXT_PUBLIC_IVA_SUBSCRIPTION_KEY || '3187f3754f7b40b38882d7f20a924f09';

  try {
    const ivaUrl = `https://ee.iva-api.com/api/Images/${id}/Redirect?subscription-Key=${subscriptionKey}`;

    const response = await fetchWithRetry(ivaUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': `public, max-age=${CACHE_DURATION}`,
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new Response('Image not found', { status: 404 });
  }
}
