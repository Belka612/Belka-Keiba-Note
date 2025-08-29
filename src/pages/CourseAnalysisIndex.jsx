import { Link } from "react-router-dom";
import "./CoursePage.css";

const courses = [
  { id: "tokyo", name: "東京競馬場", desc: "直線長く高速決着も。芝・ダートともに傾向差あり。", img: "/images/courses/tokyo.jpg" },
  { id: "nakayama", name: "中山競馬場", desc: "小回り・急坂。先行有利になりやすい傾向。", img: "/images/courses/nakayama.jpg" },
  { id: "kyoto", name: "京都競馬場", desc: "内回り/外回りで性格が変わる。", img: "/images/courses/kyoto.jpg" },
  { id: "hanshin", name: "阪神競馬場", desc: "直線急坂。持続力が問われがち。", img: "/images/courses/hanshin.jpg" },
  { id: "sapporo", name: "札幌競馬場", desc: "洋芝でパワー要求。", img: "/images/courses/sapporo.jpg" },
  { id: "hakodate", name: "函館競馬場", desc: "洋芝・時計かかる傾向。", img: "/images/courses/hakodate.jpg" },
  { id: "niigata", name: "新潟競馬場", desc: "直線長い・外回りで瞬発戦。", img: "/images/courses/niigata.jpg" },
  { id: "chukyo", name: "中京競馬場", desc: "直線急坂・持続力勝負。", img: "/images/courses/chukyo.jpg" },
  { id: "kokura", name: "小倉競馬場", desc: "小回り・平坦。前が止まりにくい。", img: "/images/courses/kokura.jpg" },
  { id: "fukushima", name: "福島競馬場", desc: "小回り・機動力。先行有利。", img: "/images/courses/fukushima.jpg" },
];

export default function CourseAnalysisIndex(){
  return (
    <main className="cp-wrap">
      <header className="cp-head">
        <div>
          <h1 className="cp-title">レース場別見解</h1>
          <div className="cp-sub">コース形状・バイアス・枠有利などを整理</div>
        </div>
      </header>

      <section>
        <div className="cp-grid">
          {courses.map((c) => (
            <Link key={c.id} to={`/course-analysis/${c.id}`} className="cp-card" style={{"--hero": `url(${c.img})`}}>
              <div className="cp-card-hero" />
              <div className="cp-card-body">
                <h2 className="cp-card-title">{c.name}</h2>
                <p className="cp-card-desc">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

