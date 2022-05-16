import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import TokenContext from "../../contexts/TokenContext.js";
import { BookData, Container, Footer, Title } from "./style.jsx";
import Header from "./../Header/index.jsx";
import axios from "axios";
import { IoMdTrash } from "react-icons/io";


export default function ShoppingCart(){
    const navigate = useNavigate();
    const {token} = useContext(TokenContext);
    const [ shoppingCart, setShoppingCart ] = useState({});

    useEffect(() => !token && navigate("/"), [token, navigate]);

    useEffect(() => {
        if (token === "") return;

        const URL_SHOPPINGCART = `${process.env.REACT_APP_URL_API}/user/shoppingCart`;
        const config = {headers: { Authorization: `Bearer ${token}`}};
        const request = axios.get(URL_SHOPPINGCART, config);
        request.then(response => {setShoppingCart(response.data);
            console.log(response.data.total)});
        request.catch(error => console.log(error));
    },[token]);

    function attShoppingCart() {
        (token === "") && navigate("/")

        const URL_SHOPPINGCART = `${process.env.REACT_APP_URL_API}/user/shoppingCart`;
        const config = {headers: { Authorization: `Bearer ${token}`}};
        const request = axios.get(URL_SHOPPINGCART, config);
        request.then(response => {setShoppingCart(response.data);
                                    console.log(response.data)});
        request.catch(error => console.log(error));
    }

    function deleteBook(id) {
        const URL_DELETE = `${process.env.REACT_APP_URL_API}/user/deleteBook/${id}`;
        const config = {headers: { Authorization: `Bearer ${token}`}};
        const request = axios.delete(URL_DELETE, config);
        request.then(() => attShoppingCart());
        request.catch(error => console.log(error));
    }

    return (
        <>
            <Header />
            <Container>
                <Title>CONFIRA O SEU CARRINHO</Title>

                {shoppingCart.shoppingCart?.map( (book, key) =>
                    <BookData key={key}>
                        <img src={book.urlImagem} alt={book.titulo}/>
                        <section>
                            <h1>{book.titulo}</h1>
                            <h2>{book.autor}</h2>
                            <h3>{book.preco}</h3>
                        </section>
                        <IoMdTrash size={30} color={"#00265d"} onClick={() => deleteBook(book._id)} cursor={"pointer"}/>
                    </BookData>
                )}
                <Footer>
                    <h1>Total: ${parseFloat(shoppingCart?.total).toFixed(2).replace(".", ",")}</h1>
                    <button onClick={() => navigate("/checkout")}> Finalizar a compra</button>
                </Footer>
            </Container>
        </>
    );
}