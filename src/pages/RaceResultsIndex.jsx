import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./RacePage.css";

export default function RaceResultsIndex() {
  const [all, setAll] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch("/races.json")
      .then((r) => r.json())
      .then(setAll)
      .catch(setErr);
  }, []);

  const list = useMemo(() => {
    const parsed = (all || []).map((r) => ({ ...r, key: `${r.date}-${r.id}` }));
    const qq = q.trim();
    const filtered = qq
      ? parsed.filter(
          (r) => r.title.includes(qq) || r.course?.includes(qq) || r.date?.includes(qq)
        )
      : parsed;
    return filtered.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [all, q]);

  return (
    <main className="rp-wrap">
      <header className="rp-head">
        <div>
          <h1 className="rp-title">過去のレース結果</h1>
          <div className="rp-sub">検索して対象レースの詳細へ</div>
        </div>
      </header>

      <section className="rp-sec">
        <div className="rp-card">
          <div className="rp-card-body" style={{display:'flex', gap:10, alignItems:'center'}}>
            <input
              type="search"
              placeholder="レース名・日付・コースで検索"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{flex:1, padding:'10px 12px', borderRadius:8, border:'1px solid var(--border)', background:'rgba(255,255,255,.02)', color:'var(--fg)'}}
            />
            <div style={{color:'var(--muted)'}}>{list.length} 件</div>
          </div>
        </div>
      </section>

      {err && <p style={{color:'#f88'}}>races.jsonの読み込みに失敗しました</p>}

      <section className="rp-sec">
        <div className="rp-grid">
          {list.map((r) => (
            <Link key={r.key} to={`/race-results/${encodeURIComponent(r.id)}`} className="rp-card" style={{textDecoration:'none'}}>
              <div className="rp-card-body" style={{display:'grid', gap:6}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:10}}>
                  <h2 style={{margin:0, fontSize:16, color:'#d7efe4'}}>{r.title}</h2>
                  <span className="rp-sub">{r.date}</span>
                </div>
                {r.course && <div className="rp-sub">{r.course}</div>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

