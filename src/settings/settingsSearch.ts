import type { SettingsCategory, SettingsItem } from './settingsConfig'

export type ScoredCategory = SettingsCategory & {
  score: number
  filteredItems: ScoredItem[]
}

export type ScoredItem = SettingsItem & {
  score: number
}

function normalizeQuery(input: string): string[] {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(w => w.length > 0)
}

function scoreText(text: string, words: string[]): number {
  const lower = text.toLowerCase()
  let best = 0

  for (const word of words) {
    if (lower === word) {
      best = Math.max(best, 100)
    } else if (lower.startsWith(word)) {
      best = Math.max(best, 75)
    } else if (lower.includes(word)) {
      best = Math.max(best, 50)
    }
  }

  return best
}

function scoreTriggers(triggers: string[], words: string[], t: (key: string) => string): number {
  let best = 0
  for (const triggerKey of triggers) {
    const triggerText = t(triggerKey)
    const s = scoreText(triggerText, words)
    if (s > best) best = s
    if (best >= 100) break
  }
  // trigger matches score slightly lower than title matches
  return best > 0 ? best - 1 : 0
}

function scoreEntry(
  titleKey: string,
  triggers: string[],
  words: string[],
  t: (key: string) => string,
): number {
  const titleScore = scoreText(t(titleKey), words)
  const triggerScore = scoreTriggers(triggers, words, t)
  return Math.max(titleScore, triggerScore)
}

export function filterAndSortSettings(
  categories: SettingsCategory[],
  query: string,
  t: (key: string) => string,
): ScoredCategory[] {
  const trimmed = query.trim()

  // If 3 chars or less, return all with score 0 (no filtering)
  if (trimmed.length <= 3) {
    return categories.map(cat => ({
      ...cat,
      score: 0,
      filteredItems: cat.items.map(item => ({ ...item, score: 0 })),
    }))
  }

  const words = normalizeQuery(trimmed)
  const result: ScoredCategory[] = []

  for (const category of categories) {
    const catScore = scoreEntry(category.titleKey, category.triggers, words, t)

    const scoredItems: ScoredItem[] = []
    for (const item of category.items) {
      const itemScore = scoreEntry(item.titleKey, item.triggers, words, t)
      if (itemScore > 0 || catScore > 0) {
        scoredItems.push({ ...item, score: itemScore })
      }
    }

    if (catScore > 0 || scoredItems.some(i => i.score > 0)) {
      // Sort items: matched items first (by score desc), then unmatched
      scoredItems.sort((a, b) => b.score - a.score)

      const bestItemScore = scoredItems.length > 0 ? scoredItems[0].score : 0
      const combinedScore = Math.max(catScore, bestItemScore)

      result.push({
        ...category,
        score: combinedScore,
        filteredItems: scoredItems,
      })
    }
  }

  // Sort categories by relevance
  result.sort((a, b) => b.score - a.score)

  return result
}
