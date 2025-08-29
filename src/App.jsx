import WeeklyCarousel from "./components/WeeklyCarousel.jsx";
import LinksGrid from "./components/LinksGrid.jsx";
import { Link } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <div className="brand">BELKA KEIBA NOTE</div>
        <nav className="nav">
          <Link to="/horse-analysis">各馬評価</Link>
          <Link to="/race-results">レース結果</Link>
          <Link to="/course-analysis">場別見解</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <WeeklyCarousel />
        </div>
      </section>

      {/* ↓ ここにカード群を表示 */}
      <LinksGrid />

      <footer className="footer">
        <small>© {new Date().getFullYear()} BELKA KEIBA NOTE</small>
      </footer>
    </div>
  );
}
