import apiClient from '../../../api/client';
import type { GlobalResponse } from '../../focusing/types';
import type { QuoteResponse } from './quotes.dto';

export type { QuoteResponse } from './quotes.dto';

/**
 * GET /api/quotes/random
 */
export async function getRandomQuote(): Promise<QuoteResponse> {
  const response = await apiClient.get<GlobalResponse<QuoteResponse>>('/api/quotes/random');
  return response.data.result;
}
