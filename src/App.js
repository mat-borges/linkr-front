import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CustomerProvider } from './components/context/customer.js';
import GlobalStyle from './assets/styles/GlobalStyle.js';
import Hashtag from './pages/HashtagPage/HashtagPage.js';
import Header from './components/Header/Header.js';
import SignIn from './pages/SignInPage/SignInPage.js';
import SignUp from './pages/SignUpPage/SignUpPage.js';
import Timeline from './pages/TimelinePage/TimelinePage.js';
import UserPostPage from './pages/UserPostsPage.js/UserPostsPage.js';

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
          <Route exact path='/user/:id' element={<UserPostPage />} />
        </Routes>
      </CustomerProvider>
    </BrowserRouter>
  );
}

export default App;
