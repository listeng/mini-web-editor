import React from 'react';
import { Routes, Route } from "react-router-dom";

import { create } from '@dtinsight/molecule';
import '@dtinsight/molecule/esm/style/mo.css';

import extensions from './extensions';
import MyWorkbench from './views/myWorkbench';
import './App.css';

(window as any).__DEVELOPMENT__ = false;

function NotFound() {
  return (
    <main style={{ padding: "1rem" }}>
      <p>There's nothing here!</p>
    </main>
  )
}

const moleculeInst = create({
  extensions,
  defaultLocale: 'ide-zh-CN',
})

const CustomWorkbench = () => moleculeInst.render(<MyWorkbench />)

function App() {
  return (
    <div className="App">
          <Routes>
            <Route path="/" element={<CustomWorkbench />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
    </div>
  );
}

export default App;
