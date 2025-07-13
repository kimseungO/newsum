import React, { useState } from "react";
import Header from "../components/Header";
import TopNewsBar from "../components/TopNewsBar";
import TopicNews from "../components/TopicNews";
import PressNews from "../components/PressNews";
import SummaryModal from "../components/SummaryModal";

export default function Home() {
  const [selectedNews, setSelectedNews] = useState(null);

  const handleTitleClick = (news) => {
    if (!news) return;
    const {
      title,
      link,
      press_name,
      press,
      upload_date,
      summary,
      relatedWords,
      relatedNews,
    } = news;

    setSelectedNews({
      title,
      link,
      press: press_name || press?.press_name || "언론사 미표시",
      upload_date,
      summary: summary ?? "AI 요약 내용이 여기에 들어갑니다.",
      relatedWords: relatedWords ?? [],
      relatedNews: relatedNews ?? [],
    });
  };

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      {/* 전체를 감싸는 중앙 정렬 컨테이너 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
          maxWidth: "12000px",
          margin: "0 auto",
          paddingBottom: "1rem",
        }}
      >
        <Header />
        <TopNewsBar onTitleClick={handleTitleClick} />

        {/* 주제별 + 언론사별 레이아웃 */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "2rem",
            width: "95%",
          }}
        >
          {/* 왼쪽: 주제별 */}
          <div
            className="news-section topic"
            style={{ flex: "1 1 48%", minWidth: "370px" }}
          >
            <TopicNews key="topic-news" onTitleClick={handleTitleClick} />
          </div>

          {/* 오른쪽: 언론사별 */}
          <div
            className="news-section press"
            style={{ flex: "1 1 48%", minWidth: "370px" }}
          >
            <PressNews key="press-news" onTitleClick={handleTitleClick} />
          </div>
        </div>
      </div>

      {/* 팝업창 */}
      {selectedNews && (
        <SummaryModal
          title={selectedNews.title}
          link={selectedNews.link}
          press={selectedNews.press}
          upload_date={selectedNews.upload_date}
          summary={selectedNews.summary}
          relatedWords={selectedNews.relatedWords}
          relatedNews={selectedNews.relatedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}
    </div>
  );
}
