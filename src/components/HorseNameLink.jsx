import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function HorseNameLink({ name, className }) {
  const [map, setMap] = useState(null);
  useEffect(() => {
    fetch("/horses/index.json").then(r=>r.json()).then((list)=>{
      const m = new Map();
      (list||[]).forEach((h)=> m.set(h.name, h.id));
      setMap(m);
    }).catch(()=>setMap(new Map()));
  }, []);

  const to = useMemo(() => {
    if (!map) return null;
    const id = map.get(name);
    return id ? `/horses/${encodeURIComponent(id)}` : null;
  }, [map, name]);

  if (to) return <Link to={to} className={className}>{name}</Link>;
  return <span className={className}>{name}</span>;
}

