import React from "react";
import { AdminIcon } from "./AdminIcons.jsx";

const iconName = {
  image: "Image",
  banner: "Banner",
  notice: "Megaphone",
  clock: "Clock",
};

export function SummaryCards({ cards }) {
  return (
    <section className="dk-summary-grid" aria-label="관리 요약">
      {cards.map((card) => (
        <article className={`dk-summary-card ${card.color}`} key={card.id}>
          <div className="dk-summary-icon">
            <AdminIcon name={iconName[card.icon]} size={24} />
          </div>
          <div className="dk-summary-body">
            <span>{card.label}</span>
            <strong>
              {card.value}
              <small>{card.unit}</small>
            </strong>
            <p>{card.description}</p>
            <button type="button">자세히 보기 &gt;</button>
          </div>
        </article>
      ))}
    </section>
  );
}
