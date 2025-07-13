// NewsCardList.jsx
import React, { useEffect, useState } from "react";
import NewsCard from "./NewsCard";

export default function NewsCardList() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(
          collection(db, "news"),
          orderBy("upload_date", "desc"),
          limit(6) // 원하는 개수 조절 가능
        );
        const snapshot = await getDocs(q);
        const newsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(newsData);
      } catch (error) {
        console.error("🔥 뉴스 카드 로딩 실패:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "16px",
        padding: "1rem",
      }}
    >
      {cards.map((card, idx) => (
        <NewsCard
          key={card.id}
          category={card.category?.category_name}
          title={card.title}
          count={card.count}
          image={card.photo_link}
          sources={[card.press?.press_name ?? "언론사 미표시"]}
        />
      ))}
    </div>
  );
}
