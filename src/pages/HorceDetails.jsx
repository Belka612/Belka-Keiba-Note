import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { calcAge } from "../utils/calcAge";
import "./HorseDetail.css";

export default function HorseDetail() {
  const { id } = useParams();
  const [horse, setHorse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setHorse(null);
    setError(null);
    fetch(`/horses/${id}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(setHorse)
      .catch((e) => setError(e));
  }, [id]);

  if (error) return <main className="horse-detail"><p>データが見つかりません。</p></main>;
  if (!horse) return <main className="horse-detail"><p>Loading...</p></main>;

  return (
    <main className="horse-detail">
      <header className="hd-header">
        <div>
          <h1 className="hd-title">{horse.name}</h1>
          <div className="hd-sub">{horse.sex}・{calcAge(horse.birth)}歳</div>
        </div>
      </header>

      <section className="hd-meta">
        <div className="hd-meta-item">
          <span className="hd-k">血統</span>
          <span className="hd-v">
            父 {horse.sire}
            {horse.damsire
              ? <> × 母父 {horse.damsire}</>
              : (horse.dam ? <> × 母 {horse.dam}</> : null)
            }
          </span>
        </div>
        {horse.femaleLine && (
          <div className="hd-meta-item"><span className="hd-k">牝系</span><span className="hd-v">{horse.femaleLine}</span></div>
        )}
        <div className="hd-meta-item"><span className="hd-k">調教師</span><span className="hd-v">{horse.trainer}</span></div>
        {horse.prefCourses?.length > 0 && (
          <div className="hd-meta-item"><span className="hd-k">得意</span><span className="hd-v">{horse.prefCourses.join("、 ")}</span></div>
        )}
      </section>

      {horse.currentOpinion && (
        <section className="hd-callout hd-opinion">
          <div className="hd-callout-head">
            <h2>現時点の見解</h2>
            {horse.currentOpinionUpdatedAt && (
              <span className="hd-note">更新: {horse.currentOpinionUpdatedAt}</span>
            )}
          </div>
          <p className="hd-callout-body">{horse.currentOpinion}</p>
        </section>
      )}

      {horse.history?.length > 0 && (
        <section className="hd-sec">
          <h2 className="hd-sec-title">過去の成績</h2>
          <div className="hd-races">
            {horse.history.map((r, i) => (
              <article key={i} className="hd-race">
                <header className="hd-race-head">
                  <h3 className="hd-race-title">{r.race}</h3>
                  <span className="hd-date">{r.date}</span>
                </header>
                <div className="hd-badges">
                  {r.pos && <span className="badge badge-pos">{r.pos}</span>}
                  {r.track && <span className="badge">{r.track}</span>}
                  {(r.surface || r.distance) && (
                    <span className="badge">{r.surface ?? ''}{r.distance ? `${r.distance}m` : ''}</span>
                  )}
                  {r.going && <span className="badge">{r.going}</span>}
                  {typeof r.draw !== "undefined" && <span className="badge">枠 {r.draw}</span>}
                  {r.time && <span className="badge">{r.time}</span>}
                  {r.pace && <span className="badge">{r.pace}</span>}
                  {r.margin && <span className="badge">着差 {r.margin}</span>}
                </div>
                <div className="hd-race-body">
                  {r.cause && <p className="hd-race-cause"><span className="hd-k">レース内容</span><span className="hd-v">{r.cause}</span></p>}
                  {r.comment && <p className="hd-race-comment"><span className="hd-k">メモ</span><span className="hd-v">{r.comment}</span></p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
