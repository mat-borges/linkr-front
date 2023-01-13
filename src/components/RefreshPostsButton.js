import styled from 'styled-components';
import { buttonsColor } from '../constants/colors';

export default function RefreshPostsButton({children,AddNewPostsToPostsList}){
    return(
        <RefreshButtonContainer onClick={AddNewPostsToPostsList}>
            {children}
        </RefreshButtonContainer>
    )
}


const RefreshButtonContainer = styled.div`
  max-width: 100vw;
  height: fit-content;
  background-color: ${buttonsColor};
  display: flex;
  justify-content: center;
  padding: 10px 18px 15px 15px;
  margin-top: 19px;
  position: relative;
  z-index: 4;

  @media (min-width: 660px) {
    width: 611px;
    height: 61px;
    background: ${buttonsColor};
    border-radius: 16px;
    justify-content: center;
    align-items: center;
    padding: 19px 23px 20px 18px;
  }
`;