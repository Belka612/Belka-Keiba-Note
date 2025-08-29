import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { parseCourseMarkdown } from "../utils/markdownCourse";
import "./CoursePage.css";

export default function CourseDetail(){
  const { id } = useParams();
  const [md, setMd] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setMd(null); setErr(null);
    fetch(`/courses/${id}.md`).then(r => r.ok ? r.text() : Promise.reject()).then(setMd).catch(setErr);
  }, [id]);

  const parsed = useMemo(() => (md ? parseCourseMarkdown(md) : null), [md]);

  const title = parsed?.meta?.title || "競馬場見解";
  const img = parsed?.meta?.image || null;

  return (
    <main className="cp-wrap">
      <header className="cp-head">
        <div>
          <h1 className="cp-title">{title}</h1>
          <div className="cp-sub">{parsed?.meta?.subtitle || "芝・ダート別に距離/コースで見解"}</div>
        </div>
      </header>

      <section>
        <div className="cd-hero" style={img ? {"--img": `url(${img})`} : undefined} />
        <div className="cd-meta">画像は <code>/public{img || "/images/courses/xxx.png"}</code> に配置してください。</div>
      </section>

      {!parsed && (
        <section className="cd-sec">
          <div className="cp-sub">Markdown テンプレートを作成すると本文が表示されます。</div>
          <div>ファイル: <code>/public/courses/{id}.md</code></div>
        </section>
      )}

      {parsed && (
        <section className="cd-sec">
          {parsed.nodes.map((n, i) => {
            if (n.type === 'h2') return <h2 key={i} className="cd-h2">{n.text}</h2>;
            if (n.type === 'h3') return <h3 key={i} className="cd-h3">{n.text}</h3>;
            if (n.type === 'h4') return <h4 key={i} className="cd-h4">{n.text}</h4>;
            if (n.type === 'ul') return (
              <ul key={i} className="cd-ul">{n.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
            );
            return <p key={i} className="cd-p">{n.text}</p>;
          })}
        </section>
      )}
    </main>
  );
}

