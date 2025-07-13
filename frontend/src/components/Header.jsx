// src/components/Header.jsx

import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./Header.css";
import SubscriptionModal from "./SubscriptionModal"; // ✅ 모달 컴포넌트 import

export default function Header() {
  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태

  return (
    <>
      <header className="header">
        <div className="header-container">
          <img src={logo} alt="NewSum 로고" className="header-logo" />
          <button
            className="subscribe-button"
            onClick={() => setShowModal(true)} // ✅ 클릭 시 모달 열기
          >
            구독 신청
          </button>
        </div>
      </header>

      {/* ✅ 모달 컴포넌트 렌더링 */}
      {showModal && <SubscriptionModal onClose={() => setShowModal(false)} />}
    </>
  );
}
