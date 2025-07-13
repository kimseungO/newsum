// src/components/SubscriptionModal.jsx

import React, { useState } from "react";
import "./SubscriptionModal.css"; // CSS 따로 분리

export default function SubscriptionModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    emailDomain: "",
    newsCategory: [],
    topicCategory: [],
  });

  const [topicEnabled, setTopicEnabled] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "news_category") {
        setFormData((prev) => {
          const exists = prev.newsCategory.includes(value);
          const updated = exists
            ? prev.newsCategory.filter((v) => v !== value)
            : [...prev.newsCategory, value];
          return {
            ...prev,
            newsCategory: updated,
          };
        });

        if (value === "topic") {
          setTopicEnabled(checked);
          if (!checked) {
            setFormData((prev) => ({
              ...prev,
              topicCategory: [],
            }));
          }
        }
      }

      if (name === "topic_detail") {
        if (value === "전체") {
          const all = [
            "전체",
            "정치",
            "경제",
            "사회",
            "문화",
            "국제",
            "지역",
            "스포츠",
            "IT/과학",
          ];
          setFormData((prev) => ({
            ...prev,
            topicCategory: checked ? all : [],
          }));
        } else {
          setFormData((prev) => {
            const updated = checked
              ? [...prev.topicCategory, value]
              : prev.topicCategory.filter((v) => v !== value);

            const allTopics = [
              "정치",
              "경제",
              "사회",
              "문화",
              "국제",
              "지역",
              "스포츠",
              "IT/과학",
            ];
            const isAllChecked = allTopics.every((t) => updated.includes(t));
            const final = isAllChecked
              ? ["전체", ...allTopics]
              : updated.filter((v) => v !== "전체");

            return {
              ...prev,
              topicCategory: final,
            };
          });
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, emailDomain, newsCategory, topicCategory } = formData;

    if (!name.trim()) return alert("이름을 입력해주세요.");
    if (!email.trim() || !emailDomain.trim())
      return alert("이메일을 입력해주세요.");
    if (newsCategory.length === 0)
      return alert("뉴스 카테고리를 선택해주세요.");

    const fullEmail = `${email}@${emailDomain}`;

    try {
      const res = await fetch("http://localhost:3001/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: fullEmail,
          gender: formData.gender,
          age: formData.age,
          newsCategory,
          topicCategory,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("신청이 완료되었습니다.");
        onClose();
      } else {
        alert("에러 발생: " + data.message);
      }
    } catch (err) {
      alert("서버 통신 오류");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">뉴스 구독 신청</h2>
        <p>AI로 요약된 최신 뉴스를 원하는 시간에 받아보세요!</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              이름<span style={{ color: "red", marginLeft: "2px" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              이메일<span style={{ color: "red", marginLeft: "2px" }}>*</span>
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                name="email"
                placeholder="example"
                value={formData.email}
                onChange={handleChange}
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <p>@</p>
              <select
                name="emailDomain"
                value={formData.emailDomain}
                onChange={handleChange}
                style={{
                  width: "40%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              >
                <option value="">직접 입력</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
                <option value="hanmail.net">hanmail.net</option>
                <option value="nate.com">nate.com</option>
                <option value="icloud.com">icloud.com</option>
                <option value="outlook.com">outlook.com</option>
              </select>

              <button
                type="button"
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                인증 받기
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              성별
            </label>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="남성"
                  checked={formData.gender === "남성"}
                  onChange={handleChange}
                />{" "}
                남성
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="여성"
                  checked={formData.gender === "여성"}
                  onChange={handleChange}
                />{" "}
                여성
              </label>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              나이
            </label>
            <select
              name="age"
              value={formData.age}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            >
              <option value="">나이대를 선택하세요</option>
              <option value="10">10대</option>
              <option value="20">20대</option>
              <option value="30">30대</option>
              <option value="40">40대</option>
              <option value="50">50대</option>
              <option value="60">60대</option>
              <option value="70">70대</option>
              <option value="80">80대 이상</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              받을 기사 (중복 선택 가능)
              <span style={{ color: "red", marginLeft: "2px" }}>*</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="news_category"
                value="top10"
                checked={formData.newsCategory.includes("top10")}
                onChange={handleChange}
              />
              TOP 10 뉴스
            </label>
            <label>
              <input
                type="checkbox"
                name="news_category"
                value="breaking"
                checked={formData.newsCategory.includes("breaking")}
                onChange={handleChange}
              />
              긴급/재난 속보
            </label>
            <label>
              <input
                type="checkbox"
                name="news_category"
                value="topic"
                checked={formData.newsCategory.includes("topic")}
                onChange={handleChange}
              />
              주제별 뉴스
            </label>
          </div>

          {/* 주제별 세부 항목 */}
          <div
            style={{
              marginTop: "12px",
              paddingLeft: "16px",
              borderLeft: "2px solid #eee",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <label style={{ color: topicEnabled ? "#000" : "#aaa" }}>
                <input
                  type="checkbox"
                  name="topic_detail"
                  value="전체"
                  disabled={!topicEnabled}
                  checked={formData.topicCategory.includes("전체")}
                  onChange={handleChange}
                  style={{ marginRight: "6px" }}
                />
                전체
              </label>
            </div>

            <div
              className="topic-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px 20px",
              }}
            >
              {[
                "정치",
                "경제",
                "사회",
                "문화",
                "국제",
                "지역",
                "스포츠",
                "IT/과학",
              ].map((cat) => (
                <label
                  key={cat}
                  style={{ color: topicEnabled ? "#000" : "#aaa" }}
                >
                  <input
                    type="checkbox"
                    name="topic_detail"
                    value={cat}
                    disabled={!topicEnabled}
                    checked={formData.topicCategory.includes(cat)}
                    onChange={handleChange}
                    style={{ marginRight: "6px" }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="button-group">
            <button type="button" onClick={onClose}>
              닫기
            </button>
            <button type="submit">신청하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}
