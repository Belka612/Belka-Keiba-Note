import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./HorseList.css";

export default function HorseList() {
  const [all, setAll] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/horses/index.json")
      .then(r => r.json())
      .then(setAll)
      .catch(e => console.error("horses/index.json load error", e));
  }, []);

  const list = useMemo(() => {
    const norm = (s) => (s || "").toString().toLowerCase().replace(/[-_\s]/g, "");
    const qq = norm(q.trim());
    if (!qq) return all;
    return all.filter(h => norm(h.name).includes(qq) || norm(h.id).includes(qq));
  }, [all, q]);

  return (
    <main className="hl-wrap">
      <h1>各馬データベース</h1>

      <div className="hl-controls">
        <input
          className="hl-search"
          type="search"
          placeholder="馬名で検索"
          value={q}
          onChange={e => setQ(e.target.value)}
          autoFocus
        />
        <div className="hl-count">{list.length} 件</div>
      </div>

      <ul className="hl-list">
        {list.map(h => (
          <li key={h.id}>
            {/* HashRouter 前提：Link の path は /horses/:id */}
            <Link to={`/horses/${encodeURIComponent(h.id)}`} className="hl-item">
              {h.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
