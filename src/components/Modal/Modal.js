import axios from "axios";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import ReactModal from "react-modal";
import styled from "styled-components";
import Swal from 'sweetalert2'

export default function Modal({ setModalIsOpen, modalIsOpen, posts_id, setRefreshPage, refreshPage, token, action, userId }) {
    const [loading, setLoading] = useState(false)

    function actionPost(posts_id) {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        setLoading(true)
        if (action === 'deleting') {
            axios.delete(`${process.env.REACT_APP_API_BASE_URL}/timeline/${posts_id}`, config)
                .then(() => {
                    setModalIsOpen(false)
                    setLoading(false)
                    setRefreshPage(!refreshPage)
                })
                .catch(() => {
                    setLoading(false)
                    setModalIsOpen(false)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    })
                })
        } else {
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/timeline/${posts_id}`, userId, config)
                .then(() => {
                    setModalIsOpen(false)
                    setLoading(false)
                    setRefreshPage(!refreshPage)
                })
                .catch((err) => {
                    setLoading(false)
                    setModalIsOpen(false)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.response.data,
                    })
                })
        }
    }
    return (
        <ReactModal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            style={{
                overlay: {
                    position: 'fixed',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 5,
                },
                content: {
                    position: 'relative',
                    width: '597px',
                    height: '262px',
                    background: '#333333',
                    borderRadius: '50px',
                    fontFamily: 'Lato',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    fontSize: '34px',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    lineHeight: '41px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }}>
            {action === 'deleting' ?
                <h1>Are you sure you want <br />to delete this post?</h1>
                :
                <h1>D you want to re-post <br />this link?</h1>
            }
            <ButtonContainer>
                <NoButton onClick={() => setModalIsOpen(false)}>{action === 'deleting' ? 'No, go back' : 'No, cancel'}</NoButton>
                <YesButton onClick={() => actionPost(posts_id)}>{loading ?
                    <ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#4fa94d"
                        ariaLabel="three-dots-loading"
                    /> : action === 'deleting' ? "Yes, delete it" : 'Yes, share!'}</YesButton>
            </ButtonContainer>
        </ReactModal>
    )
}

const ButtonContainer = styled.div`
display: flex;
margin-top: 40px;
button{
    width: 134px;
height: 37px;
border-radius: 5px;
font-family: 'Lato';
font-style: normal;
font-weight: 700;
font-size: 18px;
line-height: 22px;
text-align: center;
border: none;
box-shadow: none;
}
`

const NoButton = styled.button`
background: #FFFFFF;
color: #1877F2;
margin-right: 27px;
`

const YesButton = styled.button`
background: #1877F2;
color: #FFFFFF;
display: flex;
align-items: center;
justify-content: center;
`