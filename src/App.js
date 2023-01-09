import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GlobalStyle from './assets/styles/GlobalStyle.js';
import Hashtag from './pages/Hashtag.js';
import Header from './components/Header/Header.js';
import SignIn from './pages/SignInPage/SignInPage.js';
import SignUp from './pages/SignUpPage/SignUpPage.js';
import Timeline from './pages/TimelinePage/TimelinePage.js';
import { CustomerProvider } from "./components/context/customer.js";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <CustomerProvider>
        <Header />
        <Routes>
          <Route exact path='/' element={<SignIn />} />
          <Route exact path='/signup' element={<SignUp />} />
          <Route exact path='/timeline' element={<Timeline />} />
          <Route exact path='/hashtag/:hashtag' element={<Hashtag />} />
        </Routes>
      </CustomerProvider>
    </BrowserRouter>
  );
}

export default App;
