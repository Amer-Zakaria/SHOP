import type { IProductWithId } from "../types/IProduct";

interface SearchResult {
  product: IProductWithId;
  score: number;
  startIndex?: number;
  endIndex?: number;
}

/**
 * Attempts a fuzzy match of `query` inside `str`.
 * It returns null if not all characters in the query can be found in order.
 * If a match is found, it returns the match's score, start index, and end index.
 */
function fuzzyMatch(
  str: string,
  query: string
): { score: number; startIndex?: number; endIndex?: number } | null {
  const lowerStr = str.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // If the query appears as a contiguous substring, return that match.
  const exactIndex = lowerStr.indexOf(lowerQuery);
  if (exactIndex !== -1) {
    return {
      // You can decide on a scoring strategy for exact matches.
      score: 1 + (exactIndex === 0 ? 0.5 : 0),
      startIndex: exactIndex,
      endIndex: exactIndex + lowerQuery.length - 1,
    };
  }

  // Otherwise, do a fuzzy match (matching characters in order).
  let startIndex = -1;
  let currentIndex = 0;
  let lastMatchIndex = -1;

  for (let i = 0; i < lowerQuery.length; i++) {
    const ch = lowerQuery[i];
    const foundIndex = lowerStr.indexOf(ch, currentIndex);
    if (foundIndex === -1) {
      return { score: 0 };
    }
    if (startIndex === -1) {
      startIndex = foundIndex;
    }
    lastMatchIndex = foundIndex;
    currentIndex = foundIndex + 1;
  }

  const span = lastMatchIndex - startIndex + 1;
  let score = lowerQuery.length / span;
  if (startIndex === 0) {
    score += 0.5;
  }

  return { score };
}

/**
 * smartSearch takes an array of strings and a search query.
 * It returns an array of SearchResult objects that include the item,
 * the matching score, and the start and end indices of the match.
 * The results are sorted from the highest score (best match) to lowest.
 */
export default function smartSearch(
  products: IProductWithId[],
  query: string
): SearchResult[] {
  const results: SearchResult[] = [];

  for (const product of products) {
    const match = fuzzyMatch(product.name, query);
    if (match) {
      results.push({
        product,
        score: match.score,
        startIndex: match.startIndex,
        endIndex: match.endIndex,
      });
    }
  }

  // Sort results in descending order by score.
  results.sort((a, b) => b.score - a.score);

  return results;
}
