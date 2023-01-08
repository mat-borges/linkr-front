import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GlobalStyle from './assets/styles/GlobalStyle.js';
import Header from './components/Header/Header.js';
import SignIn from './components/SignInPage.js';
import SignUp from './components/SignUpPage.js';
import Timeline from './pages/Timeline.js';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route exact path='/' element={<SignIn />} />
        <Route exact path='/signup' element={<SignUp />} />
        <Route exact path='/timeline' element={<Timeline />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
