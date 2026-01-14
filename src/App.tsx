import { useState } from 'react';
import { AppMode, ShapeType, APP_MODE_LABELS } from './types';
import { Button } from './components/Button';
import { FractionSimulator } from './features/fraction/FractionSimulator';
import { QuizMode } from './features/fraction/components/QuizMode';
import './App.css';

function App() {
  const [appMode, setAppMode] = useState<AppMode>('visualizer');
  const [shapeType, setShapeType] = useState<ShapeType>('circle');

  return (
    <div className="app">
      <header className="header">
        <h1 className="appTitle">分数シミュレーター</h1>
        <p className="appSubtitle">仮分数と帯分数の可視化と相互変換</p>
      </header>

      <nav className="modeSelector">
        {Object.entries(APP_MODE_LABELS).map(([mode, label]) => (
          <Button
            key={mode}
            variant={appMode === mode ? 'primary' : 'secondary'}
            onClick={() => setAppMode(mode as AppMode)}
          >
            {label}
          </Button>
        ))}
      </nav>

      <main className="mainContent">
        {appMode === 'visualizer' ? (
          <FractionSimulator
            shapeType={shapeType}
            onShapeTypeChange={setShapeType}
          />
        ) : (
          <QuizMode
            shapeType={shapeType}
            onShapeTypeChange={setShapeType}
          />
        )}
      </main>

      <footer className="footer">
        <p>分数の理解を深めよう</p>
      </footer>
    </div>
  );
}

export default App;
