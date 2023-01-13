import styled from 'styled-components';
import { accentColor, commentColor, textAccentColor, textBaseColor,buttonsCollor } from '../constants/colors';

export default function RefreshPostsButton({children}){
    return(
        <RefreshButtonContainer>
            {children}
        </RefreshButtonContainer>
    )
}


const RefreshButtonContainer = styled.div`
  max-width: 100vw;
  height: fit-content;
  background-color: ${buttonsCollor};
  display: flex;
  justify-content: center;
  padding: 10px 18px 15px 15px;
  margin-top: 19px;
  position: relative;
  z-index: 4;

  @media (min-width: 660px) {
    width: 611px;
    height: 61px;
    background: ${buttonsCollor};
    border-radius: 16px;
    justify-content: center;
    align-items: center;
    padding: 19px 23px 20px 18px;
  }
`;