import styled from "styled-components";
import logo from '../assets/images/linkr.png'
import description from '../assets/images/description.png'

export default function SignIn () {
    return(
        <Main>
            <Logo>
                <Logo1 src={logo} />
                <Logo2 src={description} />
            </Logo>
            <LoginPage>

            </LoginPage>
        </Main>
    )
}

const Main = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
`;
const Logo = styled.div`
height: 1024px;
width: 60%;
flex-direction: column;
display: flex;
background-color: black;
box-sizing: border-box;
padding: 100px;
align-items: flex-start;

`;
const LoginPage = styled.div`
height: 100%;
width: 40%;
`;
const Logo1 = styled.img`
    margin-top: 50px;
    width: 233px;
    height: 65px;
`;
const Logo2 = styled.img`
    width: 442px;
    height: 100px;
    margin-top: 20px;
`;