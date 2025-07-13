import React from "react";
import PressNewsCard from "./PressNewsCard";

export default function PressGroupCard({ pressName, articles, onTitleClick }) {
  return (
    <div style={{ width: "100%", maxWidth: "280px", flex: "1 1 30%" }}>
      <PressNewsCard
        key={pressName}
        press={pressName}
        image={articles[0]?.photo_link}
        count={articles.length}
        titles={articles.map((a) => ({
          title: a.title,
          press: a.press_name || "기타 언론사",
          link: a.link,
          upload_date: a.upload_date,
        }))}
        onTitleClick={onTitleClick} // ✅ 클릭 핸들러 전달
      />
    </div>
  );
}
