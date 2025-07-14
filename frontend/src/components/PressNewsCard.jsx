import React from "react";
import defaultImage from "../assets/logo.png";

export default function PressNewsCard({
  press,
  image,
  count,
  titles = [],
  onTitleClick,
}) {
  function decodeHtmlEntities(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        minWidth: "280px",
        maxWidth: "280px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* 언론사 + 건수 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1rem", color: "#000" }}>
          {press}
        </div>
        <div
          style={{ fontSize: "0.85rem", color: "#007bff", fontWeight: "bold" }}
        >
          {count}건
        </div>
      </div>

      {/* 이미지 */}
      <div style={{ height: "160px", overflow: "hidden" }}>
        <img
          src={image && image.trim() !== "" ? image : defaultImage}
          alt="뉴스 이미지"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
          style={{
            width: "95%",
            height: "140px",
            objectFit: "cover",
            borderRadius: "8px",
            margin: "0.5rem",
          }}
        />
      </div>

      {/* 뉴스 리스트 */}
      <div style={{ padding: "0.2rem" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {titles?.slice(0, 3).map((item, index) => (
            <li key={index} style={{ margin: "1rem" }}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "#000",
                  textDecoration: "none",
                }}
                title={item.title}
              >
                {decodeHtmlEntities(item.title)}
              </a>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#000",
                  whiteSpace: "nowrap",
                  fontWeight: "bold",
                }}
              >
                {item.press}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #eee",
          marginTop: "1rem",
        }}
      >
        <button style={{ ...btnStyle, borderRadius: "0 0 0 10px" }}>
          전체 뉴스보기
        </button>
      </div>
    </div>
  );
}
const btnStyle = {
  background: "#fff",
  border: "1px solid #ddd",
  borderTop: "none",
  fontSize: "0.8rem",
  padding: "0.7rem 0",
  width: "100%",
  cursor: "pointer",
};
