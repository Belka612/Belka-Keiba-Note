import "./RacePage.css";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { parseRaceMarkdown } from "../utils/markdownRace";
import HorseNameLink from "../components/HorseNameLink.jsx";

export default function Weekly() {
  const { id } = useParams();
  const [list, setList] = useState([]);
  const [err, setErr] = useState(null);
  const [md, setMd] = useState(null);

  useEffect(() => {
    fetch("/races.json")
      .then((r) => r.json())
      .then(setList)
      .catch(setErr);
  }, []);

  useEffect(() => {
    if (!id) return;
    setMd(null);
    fetch(`/races/${id}.md`)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then(setMd)
      .catch(() => setMd(null));
  }, [id]);

  // ルートに id があれば races.json から見出しを補完
  const race = useMemo(() => {
    if (!id) return { title: "今週の重賞", date: "", course: "" };
    const found = (list || []).find((r) => r.id === id);
    if (!found) return { title: "レース", date: "", course: "" };
    return { title: found.title, date: found.date, course: found.course };
  }, [id, list]);

  const parsed = useMemo(() => (md ? parseRaceMarkdown(md) : null), [md]);

  const entries = [
    { no: 1, horse: "エフフォーリア", jockey: "横山武史", weight: 58 },
    { no: 2, horse: "スターズオンアース", jockey: "ルメール", weight: 56 },
    { no: 3, horse: "タイトルホルダー", jockey: "横山和生", weight: 58 },
  ];

  const draw = [
    { gate: 1, horse: "エフフォーリア" },
    { gate: 2, horse: "スターズオンアース" },
    { gate: 3, horse: "タイトルホルダー" },
  ];

  const picks = [
    { mark: "◎", horse: "エフフォーリア", reason: "距離最適、ロンスパ適性。内枠で好位確保。" },
    { mark: "○", horse: "スターズオンアース", reason: "切れ味最上位。展開次第で突き抜け。" },
    { mark: "▲", horse: "タイトルホルダー", reason: "自分の形なら粘り込み十分。" },
  ];

  const comments = [
    { horse: "エフフォーリア", text: "前走は仕掛け遅れ。札幌の小回りで機動力活きる。" },
    { horse: "スターズオンアース", text: "瞬発力勝負は本馬。展開が噛み合えば。" },
    { horse: "タイトルホルダー", text: "楽逃げの隊列なら押し切りまで。" },
  ];

  const info = [
    "小回り・コーナー4回、上がり性能より持続力重視",
    "馬場は内有利傾向、先行有利",
  ];

  const pace = "内枠先行が多く淡々→3Fロンスパを想定。中盤で極端に緩まず、4角でペースアップ。";

  const bets = [
    { type: "本線", lines: "馬連 1-2 / ワイド 1-2" },
    { type: "抑え", lines: "三連複 1-2-3" },
  ];

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
              <div className="rp-sub">Markdown テンプレートに沿って記事を書けます。</div>
              <div>ファイル: <code>/public/races/{id}.md</code> を作成してください（例: <code>/public/races/sapporo-memorial-2025.md</code>）。</div>
            </div>
          </div>
        </section>
      )}

      <section className="rp-sec">
        <h2>このレースの情報</h2>
        <div className="rp-card rp-callout">
          <div className="rp-card-body">
            <ul className="rp-list">
              {(parsed?.weekly.info || info).map((line, i) => (<li key={i}>{line}</li>))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rp-sec">
        <h2>出走馬</h2>
        <div className="rp-card">
          <div className="rp-card-body">
            <div className="rp-entries">
              {(parsed?.weekly.entries || entries).map((e, i) => (
                <div key={e.no ?? i} className="rp-entry">
                  <div className="rp-entry-left">
                    {e.no ? <span className="rp-pill">{e.no}</span> : null}
                    <HorseNameLink name={e.horse} className="rp-entry-name" />
                  </div>
                  <div className="rp-entry-right">
                    <span className="rp-pill">{e.jockey}</span>
                    <span className="rp-pill">{e.weight}kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rp-sec">
        <h2>枠順</h2>
        <div className="rp-card">
          <div className="rp-card-body">
            <div className="rp-draw">
              {(parsed?.weekly.draw || draw).map((g, i) => (
                <div key={g.gate ?? i} className="rp-gate">
                  {g.gate ? <span className="rp-gate-no">{g.gate}</span> : null}
                  <HorseNameLink name={g.horse} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rp-sec">
        <h2>印</h2>
        <div className="rp-card">
          <div className="rp-card-body">
            <div className="rp-picks">
              {(parsed?.weekly.picks || picks).map((p, i) => (
                <div key={i} className="rp-pick">
                  <div className="rp-mark">{p.mark}</div>
                  <div className="rp-reason"><strong><HorseNameLink name={p.horse} /></strong> — {p.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rp-sec">
        <h2>各馬コメント</h2>
        <div className="rp-grid-2">
          {(parsed?.weekly.comments || comments).map((c, i) => (
            <article key={i} className="rp-comment">
              <header>
                <h3><HorseNameLink name={c.horse} /></h3>
              </header>
              <div className="rp-card-body">{c.text}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="rp-sec">
        <h2>展開予想</h2>
        <div className="rp-card rp-callout">
          <div className="rp-card-body">{parsed?.weekly.pace || pace}</div>
        </div>
      </section>

      <section className="rp-sec">
        <h2>買い目</h2>
        <div className="rp-card">
          <div className="rp-card-body">
            <div className="rp-bets">
              {(parsed?.weekly.bets || bets).map((b, i) => (
                <div key={i} className="rp-bet">
                  <div className="rp-bet-type">{b.type}</div>
                  <div className="rp-bet-lines">{b.lines}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
