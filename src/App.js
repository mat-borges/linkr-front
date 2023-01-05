import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GlobalStyle from './assets/styles/GlobalStyle.js';
import Header from './components/Header/Header.js';
import Timeline from './pages/Timeline.js';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path='/' element={<></>} />
        <Route path='/timeline' element={<Timeline/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
