import React, { useState, useEffect, useRef } from "react";

const availableDigits = [2, 4, 6, 8];

const getRandomFromArray = (arr, count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(arr[Math.floor(Math.random() * arr.length)]);
  }
  return result;
};

const getRandomTargetByDigitCount = (digitCount) => {
  if (digitCount === 5) {
    return Math.floor(Math.random() * 900) + 100;
  } else {
    return Math.floor(Math.random() * 90) + 10;
  }
};

export default function MathSpeedApp() {
  const [digits, setDigits] = useState([]);
  const [target, setTarget] = useState(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [digitCount, setDigitCount] = useState(4);

  const [rollingDigits, setRollingDigits] = useState(false);
  const [rollingTarget, setRollingTarget] = useState(false);

  const rollingDigitsInterval = useRef(null);
  const rollingTargetInterval = useRef(null);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startRollingDigits = () => {
    if (rollingDigits) return;
    setRollingDigits(true);
    rollingDigitsInterval.current = setInterval(() => {
      setDigits(getRandomFromArray(availableDigits, digitCount));
    }, 60);
  };
  const stopRollingDigits = () => {
    if (!rollingDigits) return;
    clearInterval(rollingDigitsInterval.current);
    rollingDigitsInterval.current = null;
    setRollingDigits(false);
  };
  const startRollingTarget = () => {
    if (rollingTarget) return;
    setRollingTarget(true);
    rollingTargetInterval.current = setInterval(() => {
      setTarget(getRandomTargetByDigitCount(digitCount));
    }, 60);
  };
  const stopRollingTarget = () => {
    if (!rollingTarget) return;
    clearInterval(rollingTargetInterval.current);
    rollingTargetInterval.current = null;
    setRollingTarget(false);
  };
  const startTimer = () => {
    setTimeLeft(initialTime);
    setIsRunning(true);
  };
  const stopTimer = () => {
    setIsRunning(false);
  };

  return (
    <div style={styles.container}>
      {/* Background math pattern */}
      <svg
        style={styles.backgroundPattern}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {[...Array(11)].map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 10}
            y1="0"
            x2={i * 10}
            y2="100"
            stroke="#d7e8f7"
            strokeWidth="0.5"
          />
        ))}
        {[...Array(11)].map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 10}
            x2="100"
            y2={i * 10}
            stroke="#d7e8f7"
            strokeWidth="0.5"
          />
        ))}

        <text
          x="20"
          y="20"
          fill="#a1c9f1"
          fontSize="10"
          fontWeight="700"
          opacity="0.3"
        >
          ∑
        </text>
        <text
          x="70"
          y="30"
          fill="#f7b2ad"
          fontSize="10"
          fontWeight="700"
          opacity="0.3"
        >
          π
        </text>
        <text
          x="50"
          y="75"
          fill="#f7e3a4"
          fontSize="12"
          fontWeight="700"
          opacity="0.25"
        >
          ∞
        </text>
      </svg>

      <h1 style={styles.title}>
        🧮 แข่งขันคณิตคิดเร็ว 🧮
        <br />
        โรงเรียนอัสสัมชัญนครราชสีมา
      </h1>

      <div style={styles.controlsRow}>
        <label style={styles.label}>
          เวลา (วินาที):{" "}
          <select
            value={initialTime}
            onChange={(e) => setInitialTime(Number(e.target.value))}
            style={styles.select}
            disabled={rollingDigits || rollingTarget || isRunning}
          >
            <option value={30}>30</option>
            <option value={60}>60</option>
            <option value={90}>90</option>
          </select>
        </label>

        <label style={styles.label}>
          จำนวนหลัก:{" "}
          <select
            value={digitCount}
            onChange={(e) => setDigitCount(Number(e.target.value))}
            style={styles.select}
            disabled={rollingDigits || rollingTarget || isRunning}
          >
            <option value={4}>4 หลัก</option>
            <option value={5}>5 หลัก</option>
          </select>
        </label>
      </div>

      <div style={styles.buttonsRow}>
        {!rollingDigits ? (
          <button
            onClick={startRollingDigits}
            style={{ ...styles.button, ...styles.buttonPrimary }}
            disabled={rollingTarget || isRunning}
            title="เริ่มหมุนตัวเลข"
          >
            🔢 เริ่มหมุนตัวเลข
          </button>
        ) : (
          <button
            onClick={stopRollingDigits}
            style={{ ...styles.button, ...styles.buttonStop }}
            title="หยุดหมุนตัวเลข"
          >
            ✋ หยุดหมุนตัวเลข
          </button>
        )}

        {!rollingTarget ? (
          <button
            onClick={startRollingTarget}
            style={{ ...styles.button, ...styles.buttonPrimary }}
            disabled={rollingDigits || isRunning}
            title="เริ่มหมุนคำตอบ"
          >
            🎯 เริ่มหมุนคำตอบ
          </button>
        ) : (
          <button
            onClick={stopRollingTarget}
            style={{ ...styles.button, ...styles.buttonStop }}
            title="หยุดหมุนคำตอบ"
          >
            ✋ หยุดหมุนคำตอบ
          </button>
        )}

        {!isRunning ? (
          <button
            onClick={startTimer}
            style={{ ...styles.button, ...styles.buttonPrimary }}
            disabled={rollingDigits || rollingTarget}
            title="เริ่มจับเวลา"
          >
            ⏳ เริ่มจับเวลา
          </button>
        ) : (
          <button
            onClick={stopTimer}
            style={{ ...styles.button, ...styles.buttonStop }}
            title="หยุดจับเวลา"
          >
            🛑 หยุดเวลา
          </button>
        )}
      </div>

      <div style={styles.outputSection}>
        <div style={styles.numbersContainer}>
          <div style={styles.digits}>
            <div style={styles.labelOutput}>ตัวเลขที่ใช้</div>
            {digits.length > 0 ? digits.join(" ") : "-"}
          </div>

          <div style={styles.target}>
            <div style={styles.labelOutput}>ผลลัพธ์ที่ต้องได้</div>
            {target !== null ? target : "-"}
          </div>
        </div>

        <div style={styles.timer}>เวลา: {timeLeft} วินาที</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "3rem auto",
    padding: 30,
    position: "relative",
    backgroundColor: "#fffaf0",
    borderRadius: 18,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#344055",
    boxShadow:
      "0 10px 30px rgba(100, 100, 150, 0.15), inset 0 0 60px #f7e9d7",
    overflow: "hidden",
    userSelect: "none",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
  title: {
    position: "relative",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 30,
    zIndex: 1,
    color: "#555a75",
    textShadow:
      "1px 1px 2px #d7e8f7, 0 0 4px #f7b2ad",
    textAlign: "center", // แก้ตรงนี้ให้หัวข้ออยู่กลาง
  },
  controlsRow: {
    position: "relative",
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 30,
    flexWrap: "wrap",
    gap: 24,
    zIndex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#556677",
  },
  select: {
    fontSize: 18,
    padding: "7px 15px",
    borderRadius: 8,
    border: "2px solid #f7b2ad",
    color: "#556677",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: 110,
    backgroundColor: "#fff",
    transition: "all 0.3s ease",
    boxShadow:
      "0 0 6px rgba(247, 178, 173, 0.6)",
  },
  buttonsRow: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 40,
    zIndex: 1,
  },
  button: {
    border: "none",
    padding: "15px 32px",
    borderRadius: 14,
    cursor: "pointer",
    fontSize: 20,
    fontWeight: "700",
    minWidth: 170,
    userSelect: "none",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  buttonPrimary: {
    backgroundColor: "#f7b2ad",
    color: "#5a506b",
    boxShadow:
      "0 8px 18px rgba(247, 178, 173, 0.6), inset 0 0 8px #f7b2ad",
  },
  buttonStop: {
    backgroundColor: "#f7e3a4",
    color: "#5a506b",
    boxShadow:
      "0 8px 18px rgba(247, 227, 164, 0.7), inset 0 0 10px #f7e3a4",
  },
  outputSection: {
    position: "relative",
    zIndex: 1,
  },
  numbersContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 60,
    marginBottom: 40,
    flexWrap: "wrap",
  },
  labelOutput: {
    fontSize: 18,
    fontWeight: "700",
    color: "#556677",
    marginBottom: 6,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  digits: {
    fontSize: 60,
    fontWeight: "900",
    color: "#556677",
    textShadow:
      "2px 2px 6px rgba(247, 178, 173, 0.7)",
    textAlign: "center",
    minWidth: 250,
  },
  target: {
    fontSize: 60,
    fontWeight: "900",
    color: "#f7b2ad",
    textShadow:
      "3px 3px 8px rgba(247, 178, 173, 0.7)",
    textAlign: "center",
    minWidth: 250,
  },
  timer: {
    fontSize: 32,
    fontWeight: "800",
    color: "#556677",
    textShadow:
      "1px 1px 3px rgba(247, 227, 164, 0.8)",
    textAlign: "center",
  },
};
