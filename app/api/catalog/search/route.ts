import { NextRequest } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const MAX_RETRIES = 3;
const getRetryDelay = (attempt: number) => Math.pow(2, attempt) * 1000;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({
  region: process.env.AWS_REGION || 'eu-west-1'
}));

function normalize(input: string) {
  return input.toLowerCase().trim().replace(/\s+/g, ' ');
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  const qNorm = normalize(q);

  if (qNorm.length < 2) {
    return Response.json({ items: [] });
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await ddb.send(
        new QueryCommand({
          TableName: process.env.CATALOG_TABLE_NAME || 'DigitalAndSpecialTitles',
          IndexName: 'GSI_TitleSearch',
          KeyConditionExpression: '#catalog = :catalogVal AND begins_with(#title_norm, :q)',
          FilterExpression: '#mediaType = :mediaType',
          ExpressionAttributeNames: {
            '#catalog': 'catalog',
            '#title_norm': 'title_norm',
            '#mediaType': 'mediaType',
          },
          ExpressionAttributeValues: {
            ':catalogVal': 'CATALOG',
            ':q': qNorm,
            ':mediaType': 'DIGITAL_DOWNLOAD',
          },
          Limit: 50,
        })
      );

      return Response.json({ items: result.Items ?? [] });
    } catch (error) {
      lastError = error as Error;
      console.error(`Search attempt ${attempt + 1}/${MAX_RETRIES} failed:`, error);

      if (attempt < MAX_RETRIES - 1) {
        await sleep(getRetryDelay(attempt));
      }
    }
  }

  console.error('Catalog search failed after retries:', lastError);
  return Response.json({ error: 'Search failed' }, { status: 500 });
}
