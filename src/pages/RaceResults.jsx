import "./RacePage.css";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { parseRaceMarkdown } from "../utils/markdownRace";
import HorseNameLink from "../components/HorseNameLink.jsx";

export default function RaceResults() {
  const { id } = useParams();
  const [list, setList] = useState([]);
  const [md, setMd] = useState(null);
  useEffect(() => {
    fetch("/races.json").then(r=>r.json()).then(setList).catch(()=>{});
  }, []);
  useEffect(() => {
    if (!id) return;
    setMd(null);
    fetch(`/races/${id}.md`).then(r=> r.ok ? r.text() : Promise.reject()).then(setMd).catch(()=>setMd(null));
  }, [id]);
  const race = useMemo(() => {
    if (!id) return { title: "レース結果", date: "", course: "" };
    const found = (list || []).find((r) => r.id === id);
    if (!found) return { title: "レース結果", date: "", course: "" };
    return { title: found.title, date: found.date, course: found.course };
  }, [id, list]);
  const parsed = useMemo(() => (md ? parseRaceMarkdown(md) : null), [md]);

  const resultTable = parsed?.results.resultTable || [];
  const recap = parsed?.results.recap || "";
  const figureNotes = parsed?.results.figureNotes || [];
  const nextUp = parsed?.results.nextUp || [];
  const bets = parsed?.results.bets || [];

  return (
    <main className="rp-wrap">
      <header className="rp-head">
        <div>
          <h1 className="rp-title">{race.title}</h1>
          <div className="rp-sub">{race.date}・{race.course}</div>
        </div>
      </header>

      {id && !parsed && (
        <section className="rp-sec">
          <div className="rp-card">
            <div className="rp-card-body">
              <div className="rp-sub">Markdown テンプレートの結果セクションを追加すると、このページに反映されます。</div>
              <div>ファイル: <code>/public/races/{id}.md</code> の「結果」「回顧」「次走注目馬」「買い目/結果」などを記述。</div>
            </div>
          </div>
        </section>
      )}

      <section className="rp-sec">
        <h2>結果（上位）</h2>
        <div className="rp-card">
          <div className="rp-card-body">
            <table className="rp-table">
              <thead>
                <tr>
                  <th>着</th><th>馬名</th><th>騎手</th><th>タイム</th><th>着差</th><th>人気</th>
                </tr>
              </thead>
              <tbody>
                {resultTable.map((r, i) => (
                  <tr key={i}>
                    <td>{r.pos}</td>
                    <td><HorseNameLink name={r.horse} /></td>
                    <td>{r.jockey}</td>
                    <td>{r.time}</td>
                    <td>{r.margin}</td>
                    <td>{r.odds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rp-sec">
        <h2>回顧 / 展開</h2>
        <div className="rp-card rp-callout">
          <div className="rp-card-body">{recap}</div>
        </div>
      </section>

      <section className="rp-sec">
        <h2>レース情報メモ</h2>
        <div className="rp-card">
          <div className="rp-card-body">
            <ul className="rp-list">
              {figureNotes.map((n, i) => (<li key={i}>{n}</li>))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rp-sec">
        <h2>次走注目馬</h2>
        <div className="rp-grid-2">
          {nextUp.map((n, i) => (
            <article key={i} className="rp-comment">
              <header>
                <h3><HorseNameLink name={n.horse} /></h3>
              </header>
              <div className="rp-card-body">{n.note}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="rp-sec">
        <h2>買い目／結果</h2>
        <div className="rp-card">
          <div className="rp-card-body">
            <div className="rp-bets">
              {bets.map((b, i) => (
                <div key={i} className="rp-bet">
                  <div className="rp-bet-type">{b.type}</div>
                  <div className="rp-bet-lines">{b.lines} {b.result && <span style={{color:'#9fe3b7', marginLeft:8}}>{b.result}</span>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
