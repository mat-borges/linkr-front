import styled from "styled-components";
import logo from '../assets/images/linkr.png'
import description from '../assets/images/description.png'
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CustomerContext } from "./context/customer.js";
import axios from "axios";

export default function SignIn () {

    const {setToken} = useContext(CustomerContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [clicado, setClicado] = useState(false)

    let key = 'token';

    const navigate = useNavigate();

    function login (e){
        e.preventDefault();

        if(clicado){
            return
        }
        setClicado(!clicado);

        const URL = "http://localhost:4000/signin";

        const body = {
            email,
            password
        }

        const promisse = axios.post(URL, body);

        promisse.then((res) => {
            setToken(res.data.token);
            setClicado(!clicado);
            localStorage.setItem(key, res.data.token);
            navigate("/timeline")
        })
        promisse.catch((err) => {
            console.log(err.message)
            alert(err.message)
        })
    }

    return(
        <Main>
            <Logo>
                <Logo1 src={logo} />
                <Logo2 src={description} />
            </Logo>
            <LoginPage>
                <Formulario clicado={clicado} onSubmit={login}>
                    <input  type="email"  placeholder="e-mail" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input  type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button  type="subimit">Log In</button>
                </Formulario>
            <Link to="/signup">First time? Create an account!</Link>
       
            </LoginPage>
        </Main>
    )
}

const Main = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    @media (max-width: 660px) {
        flex-direction: column;
    }
`;
const Logo = styled.div`
height: 1024px;
width: 60%;
flex-direction: column;
display: flex;
background-color: black;
box-sizing: border-box;
padding-left: 100px;
align-items: flex-start;
    @media (max-width: 660px){
        height: 175px;
        width: 100%;
        padding-left: 0px;
        justify-content: center;
        align-items: center;
    }
`;
const LoginPage = styled.div`
height: 100%;
width: 40%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-end;
a{
    font-size: 15px;
    font-weight: 700;
    color: white;
    line-height: 17.61px;
    margin: 10px auto;
    }
    @media (max-width: 660px){
            width: 100%;
            
        }
`;
const Logo1 = styled.img`
    margin-top: 25%;
    width: 233px;
    height: 65px;
    @media (max-width: 660px){
        margin-top: 0px;
        width: 160px;
        height: 60px;
    }
`;
const Logo2 = styled.img`
    width: 442px;
    height: 100px;
    margin-top: 20px;
    @media (max-width: 660px){
        margin-top: 5px;
        width: 230px;
        height: 70px;
    }
`;
const Formulario = styled.form`
display: flex;
flex-direction: column;
font-family: 'Oswald', sans-serif;
margin-top: 30%;
    input{
        width: 429px;
        height: 65px;
        border-radius: 5px;
        margin: 7px auto;
        border: 1px solid #D4D4D4;
        font-size: 20px;
        color: black;
        box-sizing: border-box;
        padding-left: 10px;
        display: flex;
        align-items: center;
        ::placeholder{
            font-family: 'Oswald', sans-serif;
            color: black;
            font-weight: 400;
            font-size: 20px;
        }
        @media (max-width: 660px){
            width: 330px;
            height: 50px;
        }
    }
    button{
        font-family: 'Oswald', sans-serif;
        width: 429px;
        height: 65px;
        background-color: #1877F2;
        opacity: ${props => props.clicado ? 0.2 : 1};
        font-weight: 700;
        color: white;
        font-size: 21px;
        margin: 7px auto 15px;
        border: none;
        border-radius: 6px;
        
        cursor: pointer;
        @media (max-width: 660px){
            width: 330px;
            height: 60px;
        }
    }
    @media (max-width: 660px){
            width: 400px;
            margin-top: 30px;
        }
`