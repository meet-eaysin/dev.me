export interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
}

export interface ChunkResult {
  index: number;
  content: string;
  tokenCount: number;
  headingContext?: string;
}

export function chunkText(
  text: string,
  opts: ChunkOptions = {},
): ChunkResult[] {
  const chunkSize = opts.chunkSize || 1000;

  const lines = text.split('\n');
  const chunks: ChunkResult[] = [];
  let currentChunk = '';
  let currentHeading = '';
  let chunkIndex = 0;

  const pushChunk = (content: string) => {
    if (!content.trim()) return;
    chunks.push({
      index: chunkIndex++,
      content: content.trim(),
      tokenCount: Math.ceil(content.split(/\s+/).length * 1.3),
      headingContext: currentHeading || '',
    });
  };

  for (let line of lines) {
    // Heading detection
    if (line.startsWith('#')) {
      currentHeading = line.replace(/^#+\s*/, '').trim();
    }

    // If a single line is too long, split it by sentences or spaces
    if (line.length > chunkSize) {
      if (currentChunk.length > 0) {
        pushChunk(currentChunk);
        currentChunk = '';
      }

      while (line.length > chunkSize) {
        let splitIdx = line.lastIndexOf('. ', chunkSize);
        if (splitIdx === -1) splitIdx = line.lastIndexOf(' ', chunkSize);
        if (splitIdx === -1) splitIdx = chunkSize;

        const segment = line.slice(0, splitIdx);
        pushChunk(segment);
        line = line.slice(splitIdx).trim();
      }
      currentChunk = line + '\n';
      continue;
    }

    if ((currentChunk + line).length > chunkSize && currentChunk.length > 0) {
      pushChunk(currentChunk);

      // Simple overlap: take last few words
      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-Math.min(words.length, 20)); // Max 20 words overlap
      currentChunk = overlapWords.join(' ') + ' ' + line + '\n';
    } else {
      currentChunk += line + '\n';
    }
  }

  if (currentChunk.trim().length > 0) {
    pushChunk(currentChunk);
  }

  return chunks;
}
