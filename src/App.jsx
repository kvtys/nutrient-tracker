import { useState, useMemo } from "react";

const FOODS = ["Almond","Buckwheat","Broccoli","Cashew","Chia","Banana","Hemp Seeds","Kale","Spinach","Avocado","Carrot","Beet","Tomato","Blueberries","Strawberries"];

const FOOD_EMOJIS = {
  Almond:"🌰", Buckwheat:"🌾", Broccoli:"🥦", Cashew:"🥜", Chia:"🫙",
  Banana:"🍌", "Hemp Seeds":"🌿", Kale:"🥬", Spinach:"🍃", Avocado:"🥑",
  Carrot:"🥕", Beet:"🫚", Tomato:"🍅", Blueberries:"🫐", Strawberries:"🍓"
};

const CATEGORIES = [
  { label: "Macros", color: "#e8c547", rows: [
    { key: "calories", label: "Calories", unit: "kcal" },
    { key: "carbs", label: "Carbs", unit: "g" },
    { key: "fiber", label: "Fiber", unit: "g" },
    { key: "sugar", label: "Sugar", unit: "g" },
    { key: "protein", label: "Protein", unit: "g" },
    { key: "satFat", label: "Sat. Fat", unit: "g" },
    { key: "monoFat", label: "Mono Fat", unit: "g" },
    { key: "polyFat", label: "Poly Fat", unit: "g" },
  ]},
  { label: "Vitamins", color: "#6ec97f", rows: [
    { key: "vitC", label: "Vitamin C", unit: "mg" },
    { key: "vitA", label: "Vitamin A", unit: "µg" },
    { key: "vitE", label: "Vitamin E", unit: "mg" },
    { key: "vitK", label: "Vitamin K", unit: "µg" },
    { key: "thiamin", label: "Thiamin (B1)", unit: "mg" },
    { key: "riboflavin", label: "Riboflavin (B2)", unit: "mg" },
    { key: "niacin", label: "Niacin (B3)", unit: "mg" },
    { key: "b6", label: "Vitamin B6", unit: "mg" },
    { key: "folate", label: "Folate (B9)", unit: "µg" },
    { key: "choline", label: "Choline", unit: "mg" },
  ]},
  { label: "Minerals", color: "#7ab8e8", rows: [
    { key: "calcium", label: "Calcium", unit: "mg" },
    { key: "iron", label: "Iron", unit: "mg" },
    { key: "magnesium", label: "Magnesium", unit: "mg" },
    { key: "phosphorus", label: "Phosphorus", unit: "mg" },
    { key: "potassium", label: "Potassium", unit: "mg" },
    { key: "zinc", label: "Zinc", unit: "mg" },
    { key: "copper", label: "Copper", unit: "mg" },
    { key: "manganese", label: "Manganese", unit: "mg" },
    { key: "selenium", label: "Selenium", unit: "µg" },
  ]},
];

const PER_100G = {
  Almond:     { calories:579, carbs:21.6, fiber:12.5, sugar:null, protein:21.2, cholesterol:null, satFat:null, monoFat:null, polyFat:null, vitC:null, thiamin:null, riboflavin:1.14, niacin:null, pantothenic:null, b6:null, folate:null, choline:null, vitB12:null, vitA:null, vitE:25.63, vitD:null, vitK:null, biotin:null, calcium:269, iron:3.71, magnesium:270, phosphorus:481, potassium:733, sodium:null, zinc:3.12, copper:1.03, manganese:2.18, selenium:null, iodine:null },
  Buckwheat:  { calories:343, carbs:null, fiber:null, sugar:null, protein:null, cholesterol:null, satFat:null, monoFat:null, polyFat:null, vitC:null, thiamin:null, riboflavin:0.43, niacin:7.02, pantothenic:null, b6:null, folate:null, choline:null, vitB12:null, vitA:null, vitE:null, vitD:null, vitK:null, biotin:null, calcium:null, iron:null, magnesium:231, phosphorus:347, potassium:null, sodium:null, zinc:null, copper:1.1, manganese:1.3, selenium:null, iodine:null },
  Broccoli:   { calories:31, carbs:6.64, fiber:2.6, sugar:null, protein:null, cholesterol:null, satFat:null, monoFat:null, polyFat:null, vitC:91.3, thiamin:null, riboflavin:null, niacin:null, pantothenic:null, b6:null, folate:null, choline:null, vitB12:null, vitA:240, vitE:null, vitD:null, vitK:102, biotin:null, calcium:null, iron:null, magnesium:null, phosphorus:null, potassium:null, sodium:null, zinc:null, copper:null, manganese:null, selenium:null, iodine:null },
  Cashew:     { calories:553, carbs:null, fiber:null, sugar:null, protein:18.22, cholesterol:null, satFat:null, monoFat:null, polyFat:null, vitC:null, thiamin:0.42, riboflavin:null, niacin:null, pantothenic:null, b6:0.42, folate:null, choline:null, vitB12:null, vitA:null, vitE:null, vitD:null, vitK:34.1, biotin:null, calcium:null, iron:6.68, magnesium:292, phosphorus:593, potassium:null, sodium:null, zinc:5.78, copper:2.2, manganese:1.66, selenium:19.9, iodine:null },
  Chia:       { calories:486, carbs:42.1, fiber:34.4, sugar:null, protein:17, cholesterol:null, satFat:null, monoFat:null, polyFat:null, vitC:null, thiamin:0.62, riboflavin:null, niacin:8.83, pantothenic:null, b6:null, folate:null, choline:null, vitB12:null, vitA:null, vitE:null, vitD:null, vitK:null, biotin:null, calcium:631, iron:7.72, magnesium:335, phosphorus:860, potassium:null, sodium:null, zinc:4.58, copper:0.92, manganese:2.72, selenium:55.2, iodine:null },
  Banana:     { calories:89, carbs:22.84, fiber:2.6, sugar:12.23, protein:1.09, cholesterol:0, satFat:0.11, monoFat:0.03, polyFat:0.07, vitC:8.7, thiamin:0.03, riboflavin:0.07, niacin:0.67, pantothenic:0.33, b6:0.37, folate:20, choline:9.8, vitB12:0, vitA:3.21, vitE:0.1, vitD:0, vitK:0.5, biotin:0, calcium:5, iron:0.26, magnesium:27, phosphorus:22, potassium:358, sodium:1, zinc:0.15, copper:0.08, manganese:0.27, selenium:1, iodine:0 },
  "Hemp Seeds":{ calories:553, carbs:8.67, fiber:4, sugar:1.5, protein:31.56, cholesterol:0, satFat:4.6, monoFat:5.4, polyFat:38.1, vitC:0.5, thiamin:1.28, riboflavin:0.28, niacin:9.2, pantothenic:0, b6:0.6, folate:110, choline:0, vitB12:0, vitA:0.58, vitE:0.8, vitD:0, vitK:0, biotin:0, calcium:70, iron:7.95, magnesium:700, phosphorus:1650, potassium:1200, sodium:5, zinc:9.9, copper:1.6, manganese:7.6, selenium:0, iodine:0 },
  Kale:       { calories:35, carbs:4.42, fiber:4.1, sugar:0.99, protein:4.1, cholesterol:0, satFat:0.18, monoFat:0.1, polyFat:0.67, vitC:93.4, thiamin:0.11, riboflavin:0.35, niacin:1.18, pantothenic:0.37, b6:0.15, folate:62, choline:0.5, vitB12:0, vitA:469, vitE:0.66, vitD:0, vitK:389.6, biotin:0, calcium:254, iron:1.6, magnesium:33, phosphorus:55, potassium:348, sodium:53, zinc:0.39, copper:0.05, manganese:0.92, selenium:0.9, iodine:0 },
  Spinach:    { calories:23, carbs:3.63, fiber:2.2, sugar:0.42, protein:2.2, cholesterol:0, satFat:0.06, monoFat:0.01, polyFat:0.17, vitC:28.1, thiamin:0.08, riboflavin:0.19, niacin:0.72, pantothenic:0.07, b6:0.2, folate:194, choline:19.3, vitB12:0, vitA:469, vitE:2.03, vitD:0, vitK:482.9, biotin:0, calcium:99, iron:2.71, magnesium:79, phosphorus:49, potassium:558, sodium:79, zinc:0.53, copper:0.13, manganese:0.9, selenium:1, iodine:0 },
  Avocado:    { calories:167, carbs:8.64, fiber:6.8, sugar:0.3, protein:1.96, cholesterol:0, satFat:2.13, monoFat:9.8, polyFat:1.82, vitC:8.8, thiamin:0.07, riboflavin:0.14, niacin:1.91, pantothenic:1.46, b6:0.29, folate:89, choline:14, vitB12:0, vitA:7.37, vitE:1.97, vitD:0, vitK:21, biotin:0, calcium:13, iron:0.61, magnesium:29, phosphorus:54, potassium:507, sodium:8, zinc:0.68, copper:0.17, manganese:0.15, selenium:0.4, iodine:0 },
  Carrot:     { calories:41, carbs:9.58, fiber:2.8, sugar:4.74, protein:0.93, cholesterol:0, satFat:0.03, monoFat:0.01, polyFat:0.1, vitC:5.9, thiamin:0.07, riboflavin:0.06, niacin:0.98, pantothenic:0.27, b6:0.14, folate:19, choline:8.8, vitB12:0, vitA:835, vitE:0.66, vitD:0, vitK:13.2, biotin:0, calcium:33, iron:0.3, magnesium:12, phosphorus:35, potassium:320, sodium:69, zinc:0.24, copper:0.04, manganese:0.14, selenium:0.1, iodine:0 },
  Beet:       { calories:43, carbs:9.56, fiber:2.8, sugar:6.76, protein:1.61, cholesterol:0, satFat:0.03, monoFat:0.03, polyFat:0.06, vitC:4.9, thiamin:0.03, riboflavin:0.04, niacin:0.33, pantothenic:0.15, b6:0.07, folate:109, choline:6, vitB12:0, vitA:1.67, vitE:0.04, vitD:0, vitK:0.2, biotin:0, calcium:16, iron:0.8, magnesium:23, phosphorus:40, potassium:325, sodium:78, zinc:0.35, copper:0.07, manganese:0.33, selenium:0.7, iodine:0 },
  Tomato:     { calories:18, carbs:3.89, fiber:1.2, sugar:2.63, protein:0.88, cholesterol:0, satFat:0.03, monoFat:0.03, polyFat:0.08, vitC:13.7, thiamin:0.04, riboflavin:0.02, niacin:0.59, pantothenic:0.09, b6:0.08, folate:15, choline:6.7, vitB12:0, vitA:41.62, vitE:0.54, vitD:0, vitK:7.9, biotin:0, calcium:10, iron:0.27, magnesium:11, phosphorus:24, potassium:237, sodium:5, zinc:0.17, copper:0.06, manganese:0.11, selenium:0, iodine:0 },
  Blueberries:{ calories:57, carbs:14.49, fiber:2.4, sugar:9.96, protein:0.74, cholesterol:0, satFat:0.03, monoFat:0.05, polyFat:0.15, vitC:9.7, thiamin:0.04, riboflavin:0.04, niacin:0.42, pantothenic:0.12, b6:0.05, folate:6, choline:6, vitB12:0, vitA:2.67, vitE:0.57, vitD:0, vitK:19.3, biotin:0, calcium:6, iron:0.28, magnesium:6, phosphorus:12, potassium:77, sodium:1, zinc:0.16, copper:0.06, manganese:0.34, selenium:0.1, iodine:0 },
  Strawberries:{ calories:32, carbs:7.68, fiber:2, sugar:4.89, protein:0.67, cholesterol:0, satFat:0.01, monoFat:0.04, polyFat:0.15, vitC:58.8, thiamin:0.02, riboflavin:0.02, niacin:0.39, pantothenic:0.12, b6:0.05, folate:24, choline:5.7, vitB12:0, vitA:0.58, vitE:0.29, vitD:0, vitK:2.2, biotin:0, calcium:16, iron:0.41, magnesium:13, phosphorus:24, potassium:153, sodium:1, zinc:0.14, copper:0.05, manganese:0.39, selenium:0.4, iodine:0 },
};

const RDA = {
  calories: { min: 2000, max: 2500 },
  protein: { min: 132, max: 165 },
  fiber: { min: 38 },
  vitC: { min: 90, max: 2000 },
  vitA: { min: 900, max: 3000 },
  vitE: { min: 15, max: 1000 },
  vitK: { min: 120 },
  calcium: { min: 1000, max: 2500 },
  iron: { min: 8, max: 45 },
  magnesium: { min: 400, max: 350 },
  potassium: { min: 3400 },
  zinc: { min: 11, max: 40 },
};

function fmt(val) {
  if (val === null || val === undefined) return "—";
  if (val === 0) return "0";
  return val % 1 === 0 ? val.toString() : parseFloat(val.toFixed(2)).toString();
}

export default function NutrientTracker() {
  const [grams, setGrams] = useState(() => Object.fromEntries(FOODS.map(f => [f, 100])));
  const [checked, setChecked] = useState(() => Object.fromEntries(FOODS.map(f => [f, false])));
  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredFood, setHoveredFood] = useState(null);

  const scale = (food, key) => {
    const base = PER_100G[food][key];
    if (base === null || base === undefined) return null;
    return (base * grams[food]) / 100;
  };

  const totals = useMemo(() => {
    const t = {};
    CATEGORIES.forEach(cat => {
      cat.rows.forEach(row => {
        let sum = 0;
        let hasAny = false;
        FOODS.forEach(food => {
          if (checked[food]) {
            const v = scale(food, row.key);
            if (v !== null) { sum += v; hasAny = true; }
          }
        });
        t[row.key] = hasAny ? sum : null;
      });
    });
    return t;
  }, [checked, grams]);

  const checkedCount = FOODS.filter(f => checked[f]).length;

  const cat = CATEGORIES[activeCategory];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0e0e0f",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#e8e4d9",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #1a1a1c; }
        ::-webkit-scrollbar-thumb { background: #3a3a3c; border-radius: 2px; }
        .food-card { transition: all 0.18s ease; cursor: pointer; }
        .food-card:hover { transform: translateY(-2px); }
        .food-card.checked { border-color: var(--accent) !important; background: rgba(232,197,71,0.06) !important; }
        .gram-input { background: transparent; border: none; border-bottom: 1px solid #3a3a3c;
          color: #e8e4d9; font-family: inherit; font-size: 13px; width: 52px; text-align: center;
          outline: none; padding: 2px 0; transition: border-color 0.15s; }
        .gram-input:focus { border-bottom-color: #e8c547; }
        .cat-tab { cursor: pointer; padding: 6px 18px; border-radius: 2px;
          font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
          transition: all 0.15s; border: 1px solid transparent; }
        .cat-tab.active { border-color: var(--cat-color); color: var(--cat-color); }
        .cat-tab:not(.active) { color: #555; }
        .cat-tab:not(.active):hover { color: #888; }
        .nutrient-row { display: grid; grid-template-columns: 140px repeat(15, 72px) 80px;
          align-items: center; border-bottom: 1px solid #1e1e20; }
        .nutrient-row:hover { background: rgba(255,255,255,0.02); }
        .rda-bar { height: 3px; background: #222; border-radius: 2px; overflow: hidden; margin-top: 3px; }
        .rda-fill { height: 100%; border-radius: 2px; transition: width 0.3s ease; }
        .total-col { background: rgba(232,197,71,0.04); border-left: 1px solid #2a2a2c; }
        input[type=range] { -webkit-appearance:none; width:100%; height:2px; background:#2a2a2c;
          border-radius:1px; outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:12px; height:12px;
          border-radius:50%; background:#e8c547; cursor:pointer; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
      
      <div style={{ "--accent": "#e8c547" }}>
        {/* Header */}
        <div style={{ padding: "32px 40px 20px", borderBottom: "1px solid #1e1e20" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 4 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "#e8c547" }}>
              NUTRIENT TRACKER
            </h1>
            <span style={{ fontSize: 11, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase" }}>per serving</span>
          </div>
          <p style={{ fontSize: 12, color: "#555", letterSpacing: "0.04em" }}>
            Adjust grams · Select items · View totals
          </p>
        </div>

        {/* Food Cards */}
        <div style={{ padding: "24px 40px 16px", borderBottom: "1px solid #1e1e20" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {FOODS.map(food => (
              <div
                key={food}
                className={`food-card${checked[food] ? " checked" : ""}`}
                style={{
                  border: `1px solid ${checked[food] ? "#e8c547" : "#252527"}`,
                  borderRadius: 4,
                  padding: "10px 14px",
                  background: checked[food] ? "rgba(232,197,71,0.06)" : "#141415",
                  minWidth: 120,
                }}
              >
                <div
                  onClick={() => setChecked(p => ({ ...p, [food]: !p[food] }))}
                  style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, userSelect: "none" }}
                >
                  <div style={{
                    width: 14, height: 14, border: `1px solid ${checked[food] ? "#e8c547" : "#3a3a3c"}`,
                    borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
                    background: checked[food] ? "#e8c547" : "transparent", flexShrink: 0,
                    transition: "all 0.15s",
                  }}>
                    {checked[food] && <span style={{ fontSize: 9, color: "#0e0e0f", lineHeight: 1 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 11, color: checked[food] ? "#e8c547" : "#aaa", letterSpacing: "0.04em" }}>
                    {FOOD_EMOJIS[food]} {food}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="range" min={1} max={500} value={grams[food]}
                    onChange={e => setGrams(p => ({ ...p, [food]: +e.target.value }))}
                    style={{ flex: 1 }}
                    onClick={e => e.stopPropagation()}
                  />
                  <input
                    className="gram-input"
                    type="number" min={1} max={999} value={grams[food]}
                    onChange={e => setGrams(p => ({ ...p, [food]: Math.max(1, +e.target.value || 1) }))}
                    onClick={e => e.stopPropagation()}
                  />
                  <span style={{ fontSize: 10, color: "#444" }}>g</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ padding: "16px 40px 0", display: "flex", gap: 8 }}>
          {CATEGORIES.map((c, i) => (
            <div
              key={c.label}
              className={`cat-tab${activeCategory === i ? " active" : ""}`}
              style={{ "--cat-color": c.color }}
              onClick={() => setActiveCategory(i)}
            >
              {c.label}
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto", padding: "0 40px 40px" }}>
          <div style={{ minWidth: 1300 }}>
            {/* Column headers */}
            <div className="nutrient-row" style={{ borderBottom: "1px solid #2a2a2c", marginTop: 16 }}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 0" }}>Nutrient</div>
              {FOODS.map(food => (
                <div key={food} style={{ padding: "8px 4px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: checked[food] ? "#e8c547" : "#555", letterSpacing: "0.04em", lineHeight: 1.4 }}>
                    {FOOD_EMOJIS[food]}<br/>{food.length > 9 ? food.slice(0, 8) + "…" : food}
                  </div>
                  <div style={{ fontSize: 9, color: "#333", marginTop: 2 }}>{grams[food]}g</div>
                </div>
              ))}
              <div className="total-col" style={{ padding: "8px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: checkedCount > 0 ? "#e8c547" : "#444", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {checkedCount > 0 ? `Total (${checkedCount})` : "Total"}
                </div>
              </div>
            </div>

            {/* Nutrient rows */}
            {cat.rows.map(row => {
              const total = totals[row.key];
              const rda = RDA[row.key];
              const totalPct = rda && total !== null ? Math.min((total / rda.min) * 100, 100) : null;
              return (
                <div key={row.key} className="nutrient-row">
                  <div style={{ padding: "10px 0", fontSize: 11, color: "#888" }}>
                    <div>{row.label}</div>
                    <div style={{ fontSize: 9, color: "#444", marginTop: 1 }}>{row.unit}</div>
                  </div>
                  {FOODS.map(food => {
                    const val = scale(food, row.key);
                    return (
                      <div key={food} style={{ padding: "10px 4px", textAlign: "center" }}>
                        <span style={{
                          fontSize: 12,
                          color: val === null ? "#2a2a2c" : checked[food] ? cat.color : "#666",
                          fontWeight: checked[food] && val !== null ? 500 : 300,
                        }}>
                          {fmt(val)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="total-col" style={{ padding: "10px 8px", textAlign: "center" }}>
                    <span style={{
                      fontSize: 13,
                      color: total !== null ? "#e8c547" : "#2a2a2c",
                      fontWeight: 500,
                    }}>
                      {fmt(total)}
                    </span>
                    {rda && total !== null && totalPct !== null && (
                      <div className="rda-bar" style={{ marginTop: 4 }}>
                        <div className="rda-fill" style={{
                          width: `${totalPct}%`,
                          background: totalPct >= 100 ? "#6ec97f" : totalPct >= 50 ? "#e8c547" : "#7ab8e8",
                        }} />
                      </div>
                    )}
                    {rda && total !== null && (
                      <div style={{ fontSize: 9, color: "#444", marginTop: 2 }}>
                        {Math.round((total / rda.min) * 100)}% RDA
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}