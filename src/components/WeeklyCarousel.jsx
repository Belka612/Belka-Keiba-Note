import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./WeeklyCarousel.css";

// JST（日本時間）で週次抽出するユーティリティ
const tz = "+09:00";
const toJstDate = (yyyyMmDd) => new Date(`${yyyyMmDd}T00:00:00${tz}`);
const todayJstDate = () => {
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const jst = new Date(utc.getTime() + 9 * 3600 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(jst.getUTCDate()).padStart(2, "0");
  return new Date(`${y}-${m}-${d}T00:00:00${tz}`);
};
const startOfWeekJst = (d) => {
  const day = (d.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  const s = new Date(d);
  s.setUTCDate(d.getUTCDate() - day);
  const y = s.getUTCFullYear();
  const m = String(s.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(s.getUTCDate()).padStart(2, "0");
  return new Date(`${y}-${m}-${dd}T00:00:00${tz}`);
};
const endOfWeekJst = (d) => {
  const s = startOfWeekJst(d);
  const e = new Date(s.getTime() + 6 * 86400000);
  const y = e.getUTCFullYear();
  const m = String(e.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(e.getUTCDate()).padStart(2, "0");
  return new Date(`${y}-${m}-${dd}T23:59:59${tz}`);
};

export default function WeeklyCarousel({
  src = "/races.json",
  autoIntervalMs = 4500,
  fallbackDays = 14
}) {
  const [all, setAll] = useState([]);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch(src)
      .then((r) => r.json())
      .then(setAll)
      .catch((e) => console.error("races.json load error", e));
  }, [src]);

  const slides = useMemo(() => {
    const today = todayJstDate();
    const start = startOfWeekJst(today);
    const end = endOfWeekJst(today);

    const parsed = (all || [])
      .map((r) => ({ ...r, d: toJstDate(r.date) }))
      .sort((a, b) => a.d - b.d);

    const inWeek = parsed.filter((r) => r.d >= start && r.d <= end);
    if (inWeek.length > 0) return inWeek;

    // 今週に無ければ、直近の先行開催（最大fallbackDays）を案内
    const horizon = new Date(end.getTime() + fallbackDays * 86400000);
    return parsed.filter((r) => r.d > end && r.d <= horizon);
  }, [all, fallbackDays]);

  // 自動スライド
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      autoIntervalMs
    );
    return () => clearInterval(timerRef.current);
  }, [slides, autoIntervalMs]);

  if (!slides || slides.length === 0) {
    return (
      <div className="wc empty">
        <div className="wc-inner">
          <h3>今週の重賞は未登録です</h3>
          <p>public/races.json を更新してください。</p>
        </div>
      </div>
    );
  }

  const active = slides[idx];

  return (
    <div className="wc" aria-roledescription="carousel">
      <Link to={`/weekly/${encodeURIComponent(active.id)}`} className="wc-slide" style={{ "--bg": `url(${active.image})` }}>
        <div className="wc-overlay">
          <div className="wc-meta">
            <div className="wc-badge">今週の重賞</div>
            <h2 className="wc-title">{active.title}</h2>
            {active.course && (
              <p className="wc-sub">{active.date} ・ {active.course}</p>
            )}
          </div>
        </div>
      </Link>

      {slides.length > 1 && (
        <div className="wc-dots" role="tablist" aria-label="今週の重賞一覧">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === idx}
              className={"wc-dot" + (i === idx ? " is-active" : "")}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
