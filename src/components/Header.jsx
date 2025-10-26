// src/components/Header.jsx

import React from 'react';

// Bu bileşen 'stateless'tir (kendi state'i yoktur), sadece JSX döndürür.
function Header() {
  return (
    <header>
      <h1>🎮 Mangala Oyunu</h1>
      <p className="tagline">Türk kültürünün en sevilen geleneksel strateji oyunu artık online!</p>
    </header>
  );
}

export default Header;