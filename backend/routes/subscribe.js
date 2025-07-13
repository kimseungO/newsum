// subscribes.js (ESM 버전)
import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, gender, age, newsCategory, topicCategory } = req.body;

  if (!name || !email || newsCategory.length === 0) {
    return res.status(400).json({ message: "필수 항목 누락" });
  }

  const subFlag = newsCategory.length > 0 ? 1 : 0;
  const categoryBit = topicCategory.length > 0 ? 1 : 0;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      await db.execute(
        `UPDATE users 
         SET name = ?, sex = ?, age = ?, sub_flag = ?, category_bit = ?
         WHERE email = ?`,
        [
          name,
          gender === "남성" ? 0 : 1,
          age || null,
          subFlag,
          categoryBit,
          email,
        ]
      );
    } else {
      await db.execute(
        `INSERT INTO users (name, email, sex, age, sub_flag, category_bit)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          name,
          email,
          gender === "남성" ? 0 : 1,
          age || null,
          subFlag,
          categoryBit,
        ]
      );
    }

    res.status(200).json({ message: "구독 정보 저장 성공" });
  } catch (err) {
    console.error("❌ 구독 저장 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

export default router;
