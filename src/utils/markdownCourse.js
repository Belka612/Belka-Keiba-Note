// Minimal markdown to nodes parser for course pages

export function parseCourseMarkdown(text){
  // frontmatter
  let meta = {};
  let body = text || '';
  const m = body.match(/^---\n([\s\S]*?)\n---\n?/);
  if (m){
    m[1].split(/\r?\n/).forEach((l)=>{
      const mm = l.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
      if (mm) meta[mm[1]] = mm[2];
    });
    body = body.slice(m[0].length);
  }

  const lines = body.split(/\r?\n/);
  const nodes = [];
  let listBuf = null;
  const flushList = () => { if (listBuf && listBuf.length){ nodes.push({ type:'ul', items:listBuf }); } listBuf = null; };

  for (const line of lines){
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    const h4 = line.match(/^####\s+(.+)$/);
    const li = line.match(/^[-*+]\s+(.+)$/);
    if (h2){ flushList(); nodes.push({ type:'h2', text: h2[1].trim() }); continue; }
    if (h3){ flushList(); nodes.push({ type:'h3', text: h3[1].trim() }); continue; }
    if (h4){ flushList(); nodes.push({ type:'h4', text: h4[1].trim() }); continue; }
    if (li){ listBuf = listBuf || []; listBuf.push(li[1]); continue; }
    const t = line.trim();
    if (!t){ flushList(); continue; }
    flushList();
    nodes.push({ type:'p', text: line });
  }
  flushList();

  return { meta, nodes };
}

