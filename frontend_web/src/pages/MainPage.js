import React, { useEffect, useState } from "react";
import HomeContent from "./main/HomeContent";
import CategoryContent from "./main/CategoryContent";

function MainPage(props) {
  const tabs = [
    {
      name: "home",
      label: "Home",
      content: () => <HomeContent />,
    },
    {
      name: "category",
      label: "Category",
      content: () => <CategoryContent />,
    },
  ];
  const [tab, setTab] = useState(tabs[0]);
  useEffect(() => {}, []);
  return (
    <div className="tabs main-page">
      <div className="buttons">
        {tabs.map((t) => (
          <button
            key={t.name}
            className={"tab" + (t.name === tab.name ? " active" : "")}
            onClick={() => setTab(t)}
          >
            <span className="label">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="content">{<tab.content />}</div>
    </div>
  );
}

export default MainPage;
