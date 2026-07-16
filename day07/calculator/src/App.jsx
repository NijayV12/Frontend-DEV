import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState('');
  const [currentOperation, setCurrentOperation] = useState(null);
  const [shouldResetScreen, setShouldResetScreen] = useState(false);
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('calc_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  
  // Custom design additions
  const [scientificMode, setScientificMode] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const processInputRef = useRef(null);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  // Keep ref updated with the latest processInput closure
  useEffect(() => {
    processInputRef.current = processInput;
  });

  // Keyboard Event Listener (Registered only once on mount)
  useEffect(() => {
    const handleKeyboardInput = (e) => {
      let keyVal = e.key;

      if (keyVal >= '0' && keyVal <= '9') {
        processInputRef.current(keyVal);
      } else if (keyVal === '.') {
        processInputRef.current('.');
      } else if (keyVal === '+') {
        processInputRef.current('+');
      } else if (keyVal === '-') {
        processInputRef.current('-');
      } else if (keyVal === '*') {
        processInputRef.current('*');
      } else if (keyVal === '/') {
        processInputRef.current('/');
      } else if (keyVal === '^') {
        processInputRef.current('^');
      } else if (keyVal === 'Enter' || keyVal === '=') {
        e.preventDefault();
        processInputRef.current('=');
      } else if (keyVal === 'Backspace') {
        processInputRef.current('Backspace');
      } else if (keyVal === 'Escape') {
        processInputRef.current('Clear');
      } else if (keyVal === '%') {
        processInputRef.current('%');
      }
    };

    window.addEventListener('keydown', handleKeyboardInput);
    return () => {
      window.removeEventListener('keydown', handleKeyboardInput);
    };
  }, []);

  // Handle outside clicks to close the history drawer
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!drawerOpen) return;
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [drawerOpen]);



  // Mouse move glow coordinator
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Visual feedback trigger for button presses
  const triggerButtonFeedback = (keyVal) => {
    setActiveKey(keyVal);
    setTimeout(() => {
      setActiveKey(null);
    }, 100);
  };

  const processInput = (keyVal) => {
    triggerButtonFeedback(keyVal);

    if (keyVal >= '0' && keyVal <= '9') {
      appendNumber(keyVal);
    } else if (keyVal === '.') {
      appendDecimal();
    } else if (keyVal === 'Clear') {
      clearAll();
    } else if (keyVal === 'Backspace') {
      backspace();
    } else if (keyVal === '%') {
      applyPercentage();
    } else if (['+', '-', '*', '/', '^'].includes(keyVal)) {
      setOperator(keyVal);
    } else if (keyVal === '=') {
      evaluate();
    } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'sqr', 'pi', 'e_const'].includes(keyVal)) {
      processScientific(keyVal);
    }
  };

  const appendNumber = (num) => {
    if (currentValue === '0' || shouldResetScreen || currentValue === 'Error') {
      setCurrentValue(num);
      setShouldResetScreen(false);
    } else {
      if (currentValue.replace(/[^0-9]/g, '').length < 15) {
        setCurrentValue(prev => prev + num);
      }
    }
  };

  const appendDecimal = () => {
    if (shouldResetScreen) {
      setCurrentValue('0.');
      setShouldResetScreen(false);
      return;
    }

    if (currentValue === 'Error') {
      setCurrentValue('0.');
      setShouldResetScreen(false);
      return;
    }

    if (!currentValue.includes('.')) {
      setCurrentValue(prev => prev + '.');
    }
  };

  const clearAll = () => {
    setCurrentValue('0');
    setPreviousValue('');
    setCurrentOperation(null);
    setShouldResetScreen(false);
  };

  const backspace = () => {
    if (shouldResetScreen || currentValue === 'Error' || currentValue === 'Infinity') {
      setCurrentValue('0');
      return;
    }

    if (currentValue.length > 1) {
      const sliced = currentValue.slice(0, -1);
      setCurrentValue(sliced === '-' ? '0' : sliced);
    } else {
      setCurrentValue('0');
    }
  };

  const applyPercentage = () => {
    if (currentValue === 'Error') return;

    const value = parseFloat(currentValue);
    if (isNaN(value)) return;

    const result = value / 100;
    setCurrentValue(formatMathResult(result));
    setShouldResetScreen(true);
  };

  // Scientific calculator function processor
  const processScientific = (action) => {
    if (currentValue === 'Error') return;
    const current = parseFloat(currentValue);

    if (action === 'pi') {
      setCurrentValue(Math.PI.toString());
      setShouldResetScreen(false);
      return;
    }

    if (action === 'e_const') {
      setCurrentValue(Math.E.toString());
      setShouldResetScreen(false);
      return;
    }

    if (isNaN(current)) return;

    let result = 0;
    switch (action) {
      case 'sin':
        // sin in degrees
        result = Math.sin(current * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(current * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(current * Math.PI / 180);
        break;
      case 'log':
        if (current <= 0) {
          setCurrentValue('Error');
          setShouldResetScreen(true);
          return;
        }
        result = Math.log10(current);
        break;
      case 'ln':
        if (current <= 0) {
          setCurrentValue('Error');
          setShouldResetScreen(true);
          return;
        }
        result = Math.log(current);
        break;
      case 'sqrt':
        if (current < 0) {
          setCurrentValue('Error');
          setShouldResetScreen(true);
          return;
        }
        result = Math.sqrt(current);
        break;
      case 'sqr':
        result = current * current;
        break;
      default:
        return;
    }

    const formattedResult = formatMathResult(result);
    setCurrentValue(formattedResult);
    setShouldResetScreen(true);

    // Write scientific action to history
    const equationStr = `${action}(${formatDisplayNumber(currentValue)})`;
    addHistoryItem(equationStr, formattedResult);
  };

  const setOperator = (op) => {
    if (currentValue === 'Error') return;

    if (currentOperation !== null && !shouldResetScreen) {
      const prev = parseFloat(previousValue);
      const current = parseFloat(currentValue);
      
      if (!isNaN(prev) && !isNaN(current)) {
        let result = 0;
        let isError = false;

        switch (currentOperation) {
          case '+': result = prev + current; break;
          case '-': result = prev - current; break;
          case '*': result = prev * current; break;
          case '/': 
            if (current === 0) isError = true;
            else result = prev / current; 
            break;
          case '^':
            result = Math.pow(prev, current);
            if (isNaN(result) || !isFinite(result)) isError = true;
            break;
        }

        if (isError) {
          setCurrentValue('Error');
          setPreviousValue('');
          setCurrentOperation(null);
          setShouldResetScreen(true);
          return;
        } else {
          const formattedResult = formatMathResult(result);
          const equationStr = `${formatDisplayNumber(previousValue)} ${getOpChar(currentOperation)} ${formatDisplayNumber(currentValue)}`;
          
          addHistoryItem(equationStr, formattedResult);
          setPreviousValue(formattedResult);
          setCurrentValue(formattedResult);
        }
      }
    } else {
      setPreviousValue(currentValue);
    }

    setCurrentOperation(op);
    setShouldResetScreen(true);
  };

  const evaluate = () => {
    if (currentOperation === null || shouldResetScreen) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    if (isNaN(prev) || isNaN(current)) return;

    let result = 0;
    
    switch (currentOperation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          setCurrentValue('Error');
          setCurrentOperation(null);
          setPreviousValue('');
          setShouldResetScreen(true);
          return;
        }
        result = prev / current;
        break;
      case '^':
        result = Math.pow(prev, current);
        break;
      default:
        return;
    }

    const equationStr = `${formatDisplayNumber(previousValue)} ${getOpChar(currentOperation)} ${formatDisplayNumber(currentValue)}`;
    const formattedResult = formatMathResult(result);

    addHistoryItem(equationStr, formattedResult);

    setCurrentValue(formattedResult);
    setCurrentOperation(null);
    setPreviousValue('');
    setShouldResetScreen(true);
  };

  const addHistoryItem = (equation, result) => {
    setHistory(prev => {
      const updated = [{ equation, result }, ...prev];
      if (updated.length > 30) {
        updated.pop();
      }
      return updated;
    });
  };

  const clearAllHistory = () => {
    setHistory([]);
  };

  const loadFromHistory = (val) => {
    setCurrentValue(val);
    setShouldResetScreen(false);
    setDrawerOpen(false);
  };

  const getOpChar = (op) => {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      case '^': return '^';
      default: return op;
    }
  };

  const formatDisplayNumber = (numStr) => {
    if (numStr === 'Error' || numStr === 'NaN' || numStr.includes('e')) return numStr;

    const parts = numStr.split('.');
    let integerPart = parts[0];
    const hasDecimal = parts.length > 1;
    const decimalPart = hasDecimal ? parts[1] : '';

    if (integerPart !== '' && !isNaN(integerPart)) {
      const value = parseFloat(integerPart);
      integerPart = value.toLocaleString('en-US', { maximumFractionDigits: 0 });
      if (numStr.startsWith('-') && !integerPart.startsWith('-')) {
        integerPart = '-' + integerPart;
      }
    }

    return hasDecimal ? `${integerPart}.${decimalPart}` : integerPart;
  };

  const formatMathResult = (num) => {
    if (isNaN(num)) return 'Error';
    if (!isFinite(num)) return 'Error';

    const rounded = parseFloat(num.toFixed(10));
    const str = rounded.toString();

    if (Math.abs(rounded) > 1e15 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-10)) {
      return rounded.toExponential(7);
    }

    return str;
  };

  // Determine fontSize dynamically
  const getFontSize = () => {
    if (currentValue.length > 12) return '1.8rem';
    if (currentValue.length > 9) return '2.2rem';
    return '2.8rem';
  };

  return (
    <div 
      className={`calculator-container ${scientificMode ? 'scientific-expanded' : ''}`}
      onMouseMove={handleMouseMove}
      ref={containerRef}
      style={{
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`
      }}
    >
      <header className="calc-header">
        <span className="calc-brand">CYBERDYNE</span>
        
        <div className="header-actions">
          {/* Scientific Mode Toggle */}
          <button 
            onClick={() => setScientificMode(!scientificMode)}
            className={`icon-btn mr-8 ${scientificMode ? 'active-toggle' : ''}`}
            title="Scientific Functions"
            aria-label="Toggle Scientific Functions"
          >
            <span className="btn-icon-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>f(x)</span>
          </button>



          {/* History Toggle */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setDrawerOpen(!drawerOpen);
            }} 
            className={`icon-btn ${activeKey === 'HistoryToggle' ? 'key-pressed' : ''}`} 
            aria-label="Toggle History" 
            title="View History"
          >
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </button>
        </div>
      </header>

      {/* Display Area */}
      <div className="display-container">
        <div className="display-history">
          {currentOperation && previousValue ? `${formatDisplayNumber(previousValue)} ${getOpChar(currentOperation)}` : ''}
        </div>
        <div className="display-current-wrapper">
          {currentOperation && (
            <span className="active-op-badge">{getOpChar(currentOperation)}</span>
          )}
          <div className="display-current" style={{ fontSize: getFontSize() }}>
            {formatDisplayNumber(currentValue)}
          </div>
        </div>
      </div>

      {/* Calculator Body - Dual Column Grid for Scientific Expansion */}
      <div className="calc-body-grid">
        {/* Scientific Functions Keypad Column */}
        {scientificMode && (
          <div className="keypad scientific-keypad">
            <button className="key sci-key" onClick={() => processInput('sin')}>sin</button>
            <button className="key sci-key" onClick={() => processInput('cos')}>cos</button>
            <button className="key sci-key" onClick={() => processInput('tan')}>tan</button>
            <button className="key sci-key" onClick={() => processInput('sqrt')}>√</button>
            <button className="key sci-key" onClick={() => processInput('sqr')}>x²</button>
            <button className="key sci-key" onClick={() => processInput('^')}>xʸ</button>
            <button className="key sci-key" onClick={() => processInput('log')}>log</button>
            <button className="key sci-key" onClick={() => processInput('ln')}>ln</button>
            <button className="key sci-key" onClick={() => processInput('pi')}>π</button>
            <button className="key sci-key" onClick={() => processInput('e_const')}>e</button>
          </div>
        )}

        {/* Standard Keypad Column */}
        <div className="keypad standard-keypad">
          {/* Row 1 */}
          <button 
            className={`key action-key ${activeKey === 'Clear' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('Clear')}
          >
            C
          </button>
          <button 
            className={`key action-key ${activeKey === 'Backspace' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('Backspace')}
            aria-label="Backspace"
          >
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
              <line x1="18" y1="9" x2="12" y2="15"></line>
              <line x1="12" y1="9" x2="18" y2="15"></line>
            </svg>
          </button>
          <button 
            className={`key action-key ${activeKey === '%' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('%')}
          >
            %
          </button>
          <button 
            className={`key operator-key ${activeKey === '/' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('/')}
          >
            ÷
          </button>

          {/* Row 2 */}
          <button 
            className={`key number-key ${activeKey === '7' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('7')}
          >
            7
          </button>
          <button 
            className={`key number-key ${activeKey === '8' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('8')}
          >
            8
          </button>
          <button 
            className={`key number-key ${activeKey === '9' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('9')}
          >
            9
          </button>
          <button 
            className={`key operator-key ${activeKey === '*' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('*')}
          >
            ×
          </button>

          {/* Row 3 */}
          <button 
            className={`key number-key ${activeKey === '4' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('4')}
          >
            4
          </button>
          <button 
            className={`key number-key ${activeKey === '5' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('5')}
          >
            5
          </button>
          <button 
            className={`key number-key ${activeKey === '6' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('6')}
          >
            6
          </button>
          <button 
            className={`key operator-key ${activeKey === '-' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('-')}
          >
            −
          </button>

          {/* Row 4 */}
          <button 
            className={`key number-key ${activeKey === '1' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('1')}
          >
            1
          </button>
          <button 
            className={`key number-key ${activeKey === '2' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('2')}
          >
            2
          </button>
          <button 
            className={`key number-key ${activeKey === '3' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('3')}
          >
            3
          </button>
          <button 
            className={`key operator-key ${activeKey === '+' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('+')}
          >
            +
          </button>

          {/* Row 5 */}
          <button 
            className={`key number-key double-width ${activeKey === '0' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('0')}
          >
            0
          </button>
          <button 
            className={`key number-key ${activeKey === '.' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('.')}
          >
            .
          </button>
          <button 
            className={`key equals-key ${activeKey === '=' ? 'key-pressed' : ''}`} 
            onClick={() => processInput('=')}
          >
            =
          </button>
        </div>
      </div>

      {/* History Drawer */}
      <div className={`history-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="history-drawer-header">
          <h3>History</h3>
          <button onClick={clearAllHistory} className="icon-btn text-danger" title="Clear History">
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        <div className="history-list">
          {history.length > 0 ? (
            history.map((item, index) => (
              <div 
                key={index} 
                onClick={() => loadFromHistory(item.result)} 
                className="history-item"
              >
                <div className="history-item-eq">{item.equation} =</div>
                <div className="history-item-res">{item.result}</div>
              </div>
            ))
          ) : (
            <div className="empty-history-msg">No history yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
