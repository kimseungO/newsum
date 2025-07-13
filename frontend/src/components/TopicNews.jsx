import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import SummaryModal from "./SummaryModal";

export const categories = [
  "전체",
  "정치",
  "경제",
  "사회",
  "생활/문화",
  "세계",
  "IT/과학",
];

export default function CategoryCards() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [allNews, setAllNews] = useState([]);
  const [categoryPage, setCategoryPage] = useState(0);
  const [summaryModalData, setSummaryModalData] = useState(null);
  const [newsModalData, setNewsModalData] = useState(null);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/news/topic");
        const data = await response.json();

        // ✅ 여기부터 그룹핑 로직 삽입
        const grouped = {};
        for (const news of data) {
          const topicId = news.topic_id;
          if (!grouped[topicId]) {
            grouped[topicId] = {
              topic_id: news.topic_id,
              topic_title: news.topic_title,
              topic_content: news.topic_content,
              keyword: news.keyword,
              upload_date: news.upload_date,
              photo_link: news.photo_link,
              category_name: news.category_name,
              newsList: [],
            };
          }
          grouped[topicId].newsList.push({
            news_title: news.news_title,
            news_link: news.news_link,
            press_name: news.press_name,
            upload_date: news.upload_date,
            category_name: news.category_name,
          });
        }
        const groupedNews = Object.values(grouped);
        setAllNews(groupedNews); // ✅ topic 단위로 묶인 데이터로 교체
      } catch (error) {
        console.error("🔥 뉴스 불러오기 실패:", error);
      }
    };
    fetchNews();
  }, []);

  // ✅ 화면 크기에 따라 cardsPerPage 조절
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };
    handleResize(); // 초기 호출
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredCards =
    selectedCategory === "전체"
      ? allNews
      : allNews.filter((card) => card.category_name === selectedCategory);

  const pagedCards = filteredCards.slice(
    categoryPage,
    categoryPage + cardsPerPage
  );

  const handleCategoryNext = () => {
    if (categoryPage < filteredCards.length - cardsPerPage) {
      setCategoryPage((prev) => prev + 1);
    }
  };

  const handleCategoryPrev = () => {
    if (categoryPage > 0) {
      setCategoryPage((prev) => prev - 1);
    }
  };

  const handleOpenSummaryModal = (news) => {
    const keywords = news.keyword
      ? news.keyword.split(",").map((k) => k.trim())
      : [];

    setSummaryModalData({
      title: news.topic_title || "제목 없음",
      press: news.newsList?.[0]?.press_name ?? "언론사 미표시",
      upload_date: news.upload_date,
      link: news.newsList?.[0]?.news_link,
      summary: news.topic_content ?? "요약 없음",
      relatedWords: keywords,
      relatedNews: news.newsList.map((n) => ({
        title: n.news_title,
        link: n.news_link,
        press: n.press_name,
        upload_date: n.upload_date,
      })),
    });
  };

  const handleOpenNewsModal = (newsItem) => {
    setNewsModalData(newsItem);
  };

  return (
    <div>
      <h2>주제별</h2>
      <div
        style={{
          marginBottom: "1.4rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          padding: "0 1rem",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCategoryPage(0);
            }}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ddd",
              borderRadius: "10px",
              backgroundColor: selectedCategory === cat ? "#f0f0f0" : "white",
              fontWeight: selectedCategory === cat ? "bold" : "normal",
              fontSize: "0.95rem",
              cursor: "pointer",
              maxWidth: "100%",
              whiteSpace: "normal",
              wordBreak: "keep-all",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {pagedCards.map((card, index) => {
          const sameTopicNews = card.newsList.slice(0, 3); // ✅ 바뀐 구조 반영

          return (
            <NewsCard
              key={index}
              title={card.topic_title}
              link={card.news_link}
              image={card.photo_link}
              category={card.newsList?.[0]?.category_name}
              count={card.newsList.length}
              sources={sameTopicNews}
              onTitleClick={() => handleOpenSummaryModal(card)}
              onNewsClick={(newsItem) => handleOpenNewsModal(newsItem)}
              style={{
                width: "100%",
                maxWidth: "360px",
                flex: `1 1 calc(${
                  cardsPerPage === 3 ? "33.333%" : "50%"
                } - 12px)`,
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <button onClick={handleCategoryPrev} disabled={categoryPage === 0}>
          ⬅️
        </button>
        <span style={{ margin: "0 10px" }}>
          {filteredCards.length > 0
            ? `${Math.min(
                categoryPage + 1,
                filteredCards.length - cardsPerPage + 1
              )} / ${Math.max(filteredCards.length - cardsPerPage + 1, 1)}`
            : "0 / 0"}
        </span>
        <button
          onClick={handleCategoryNext}
          disabled={categoryPage >= filteredCards.length - cardsPerPage}
        >
          ➡️
        </button>
      </div>

      {summaryModalData && (
        <SummaryModal
          {...summaryModalData}
          onClose={() => setSummaryModalData(null)}
        />
      )}
    </div>
  );
}
