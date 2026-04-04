export function isCaretInsideAvatarsBlock(text: string, caretPosition: number): boolean {
  if (caretPosition < 0 || caretPosition > text.length) {
    return false;
  }

  const openTagPattern = /\[\s*avatars\s*\]/g;
  const closeTagPattern = /\[\/\s*avatars\s*\]/g;

  const tagMatches: Array<{ type: 'open' | 'close'; index: number; length: number }> = [];

  for (const match of text.matchAll(openTagPattern)) {
    if (match.index !== undefined) {
      tagMatches.push({ type: 'open', index: match.index, length: match[0].length });
    }
  }

  for (const match of text.matchAll(closeTagPattern)) {
    if (match.index !== undefined) {
      tagMatches.push({ type: 'close', index: match.index, length: match[0].length });
    }
  }

  tagMatches.sort((a, b) => a.index - b.index);

  const openStack: number[] = [];
  for (const tag of tagMatches) {
    if (tag.type === 'open') {
      openStack.push(tag.index + tag.length);
      continue;
    }

    const currentOpenContentStart = openStack.pop();
    if (currentOpenContentStart === undefined) {
      continue;
    }

    if (caretPosition >= currentOpenContentStart && caretPosition <= tag.index) {
      return true;
    }
  }

  return false;
}
