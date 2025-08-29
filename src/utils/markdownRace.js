// Very small markdown parser specialized for our race templates.

function parseFrontmatter(text) {
  const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) return [{}, text];
  const body = text.slice(fmMatch[0].length);
  const meta = {};
  fmMatch[1].split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (m) meta[m[1]] = m[2];
  });
  return [meta, body];
}

function splitSections(md) {
  const lines = md.split(/\r?\n/);
  const sec = [];
  let current = { title: '', lines: [] };
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      if (current.title || current.lines.length) sec.push(current);
      current = { title: h2[1].trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.title || current.lines.length) sec.push(current);
  return sec;
}

function pickSection(sections, names) {
  const t = sections.find((s) => names.includes(s.title));
  return t ? t.lines.join("\n").trim() : '';
}

function parseList(body) {
  return body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^[-*+]\s+/.test(l))
    .map((l) => l.replace(/^[-*+]\s+/, ''));
}

function parseEntries(body) {
  // Format: "1. エフフォーリア | 横山武史 | 58"
  return parseList(body).map((item) => {
    const m = item.match(/^(\d+)[\.|）)]?\s*([^|]+)\|\s*([^|]+)\|\s*(\d+)/);
    if (m) {
      return { no: Number(m[1]), horse: m[2].trim(), jockey: m[3].trim(), weight: Number(m[4]) };
    }
    // fallback: "エフフォーリア | 横山武史 | 58"
    const p = item.split('|').map((x) => x.trim());
    return { no: null, horse: p[0] || item, jockey: p[1] || '', weight: p[2] ? Number(p[2]) : null };
  });
}

function parseDraw(body) {
  // Format: "1: エフフォーリア"
  return parseList(body).map((item) => {
    const m = item.match(/^(\d+)\s*[:：]\s*(.+)$/);
    return m ? { gate: Number(m[1]), horse: m[2].trim() } : { gate: null, horse: item };
  });
}

function parsePicks(body) {
  // Format: "◎ エフフォーリア: 理由"
  return parseList(body).map((item) => {
    const m = item.match(/^([◎○▲△☆×])\s*([^:：]+)[:：]?\s*(.*)$/);
    if (m) return { mark: m[1], horse: m[2].trim(), reason: m[3].trim() };
    return { mark: '', horse: item, reason: '' };
  });
}

function parseKeyedBullets(body) {
  // Format: "- 名前: 本文"
  return parseList(body).map((l) => {
    const m = l.match(/^([^:：]+)[:：]\s*(.*)$/);
    return m ? { key: m[1].trim(), text: m[2].trim() } : { key: l, text: '' };
  });
}

function parseSubsections(body) {
  // ### 馬名 で区切られたコメント
  const blocks = [];
  const parts = body.split(/\n(?=###\s+)/);
  for (const part of parts) {
    const m = part.match(/^###\s+(.+)\n([\s\S]*)$/);
    if (m) blocks.push({ horse: m[1].trim(), text: m[2].trim() });
  }
  return blocks.length ? blocks : parseKeyedBullets(body).map(({ key, text }) => ({ horse: key, text }));
}

function parseBets(body) {
  // "- 本線: 馬連 1-2 / ワイド 1-2" or "- 本線: 馬連 1-2 | +1240"
  return parseList(body).map((l) => {
    const m = l.match(/^([^:：]+)[:：]\s*(.*)$/);
    if (!m) return { type: '', lines: l, result: '' };
    const rest = m[2];
    const [lines, result] = rest.split('|').map((x) => x.trim());
    return { type: m[1].trim(), lines: lines || '', result: result || '' };
  });
}

function parseResultsTable(body) {
  // "- 1 | エフフォーリア | 横山武史 | 1:58.8 | クビ | 3.2"
  return parseList(body).map((l) => {
    const p = l.split('|').map((x) => x.trim());
    return {
      pos: Number(p[0]) || p[0],
      horse: p[1] || '',
      jockey: p[2] || '',
      time: p[3] || '',
      margin: p[4] || '',
      odds: p[5] || '',
    };
  });
}

export function parseRaceMarkdown(md) {
  const [meta, body] = parseFrontmatter(md);
  const sections = splitSections(body);

  const weekly = {
    entries: parseEntries(pickSection(sections, ['出走馬', 'Entries'])),
    draw: parseDraw(pickSection(sections, ['枠順', 'Draw'])),
    picks: parsePicks(pickSection(sections, ['印', 'Picks'])),
    comments: parseSubsections(pickSection(sections, ['各馬コメント', 'Comments'])),
    info: parseList(pickSection(sections, ['このレースの情報', 'Info'])),
    pace: pickSection(sections, ['展開予想', 'Pace']),
    bets: parseBets(pickSection(sections, ['買い目', 'Bets'])),
  };

  const results = {
    resultTable: parseResultsTable(pickSection(sections, ['結果', 'Results'])),
    recap: pickSection(sections, ['回顧', 'Recap', '回顧 / 展開']),
    figureNotes: parseList(pickSection(sections, ['レース情報メモ', 'Notes'])),
    nextUp: parseKeyedBullets(pickSection(sections, ['次走注目馬', 'Next Up'])).map(({ key, text }) => ({ horse: key, note: text })),
    bets: parseBets(pickSection(sections, ['買い目/結果', 'Bets/Results'])),
  };

  const header = {
    title: meta.title || '',
    date: meta.date || '',
    course: meta.course || '',
    id: meta.id || '',
  };

  return { header, weekly, results };
}

