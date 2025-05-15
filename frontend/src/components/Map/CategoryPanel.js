// components/Map/CategoryPanel.js
import React, { useState, useEffect } from 'react';
import styles from '../../css/MapScreen.module.css';

const CategoryPanel = ({ onSelectRegion }) => {
  const [data, setData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/data/seoul_areas_by_category.json')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  const filtered = Object.entries(data).reduce((acc, [category, areas]) => {
    const matches = areas.filter(area =>
      area.AREA_NM.includes(searchTerm) ||
      area.ENG_NM.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matches.length) acc[category] = matches;
    return acc;
  }, {});

  return (
    <div className={styles.categoryPanel}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="지역명을 검색하세요"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className={styles.categoryList}>
        {Object.entries(filtered).map(([category, areas]) => (
          <div key={category} className={styles.categoryGroup}>
            <h4>{category}</h4>
            <ul>
              {areas.map(area => (
                <li
                  key={area.AREA_CD}
                  onClick={() => onSelectRegion({ name: area.AREA_NM })}
                >
                  {area.AREA_NM} <span className={styles.eng}>{area.ENG_NM}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPanel;
