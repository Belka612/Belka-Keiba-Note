import "./LinksGrid.css";
import { Link } from "react-router-dom";

const Card = ({ title, desc, href, img }) => (
  <Link
    className="lg-card"
    to={href}
    // img を渡したい時だけ CSS 変数を指定。無ければCSS側のダミーが使われます。
    style={img ? { "--card-img": `url(${img})` } : undefined}
  >
    <div className="lg-overlay">
      <h3>{title}</h3>
      {desc && <p>{desc}</p>}
    </div>
  </Link>
);

export default function LinksGrid() {
  return (
    <section className="lg-wrap">
      <Card title="各馬の評価" desc="指数・ラップ・脚質から総合評価。" href="/horse-analysis" img="images/cards/horse-eval.jpg" />
      <Card title="過去レース結果" desc="回顧・次走注目馬を一覧化。" href="/race-results" img="images/cards/results.jpg" />
      <Card title="レース場別見解" desc="コース形状・バイアス・枠有利。" href="/course-analysis" img="images/cards/course.jpg" />
    </section>
  );
}
