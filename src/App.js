import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GlobalStyle from './assets/styles/GlobalStyle.js';
import Header from './components/Header/Header.js';
import Timeline from './pages/Timeline.js';
import SignIn from './components/SignInPage.js';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      {<Header />}
      <Routes>
        <Route path='/' exact element={<SignIn/>} />
        <Route path='/signup' exact element={<></>} />
        <Route path='/timeline' element={<Timeline/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
