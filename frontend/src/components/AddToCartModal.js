import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

import "../styling/AddToCartModal.css";

const MAX_QUANTITY = 1000;
const penniesConversion = 100;

const AddToCartModal = (props) => {
    const [quantity, setQuantity] = useState('');
    const [amountDisplay, setAmountDisplay] = useState("$0.00");

    const setValidQuantityForDisplay = (value) => {
        let quantity = value;
        if (containsOnlyDigits(quantity) 
            && Number(quantity) <= MAX_QUANTITY
            && quantity > 0)
        {
                setQuantity(Number(quantity));
                handleDisplay(quantity, true);
        }
        else if (quantity === '')
        {
            setQuantity('');
            handleDisplay(quantity, false);
        }
    }

    const containsOnlyDigits = (value) => {
        return /^[0-9]+$/.test(value);
    }

    const handleDisplay = (quantity, isValidQuantity) => {
        if (isValidQuantity)
        {
            setAmountDisplay("$" + roundedAmount(Number(quantity) * props.productPrice));
            document.getElementById("add-to-cart-button").disabled = false;
        }
       else
       {
            setAmountDisplay("$0.00");
            document.getElementById("add-to-cart-button").disabled = true;
       }            
    } 

    const roundedAmount = (value) => {
        let roundedVal = Number(Math.round(value + 'e2')+'e-2');
        return roundedVal.toFixed(2);
    }

    const handleClose = () => {
        props.setShowAddToCart(false);
    }

    const showSuccessModal = () => {
        props.setShowSuccess(true);
    }

    const handleAddToCart = async () => {
        const priceInPennies = props.productPrice *  penniesConversion;
        let searchData = {name: props.productName, price: priceInPennies, quantity: quantity}
        let response = await fetch(`/shop/add/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:8000/',
                'X-CSRFToken': getCookie(),
            },
            body: JSON.stringify(searchData)
        });

        let data = await response.json();

        handleClose();
        if (!data?.hasOwnProperty("error"))
        {
            props.setCartItemsCount(Number(document.getElementById("cart-items-count").innerHTML)+quantity);
            showSuccessModal();
        }
    }

    const getCookie = () => {
        return document.cookie.split('=')[1];
    }

    const clearInputAndDisable = () => {
        setQuantity('');
        setAmountDisplay("$0.00");
        document.getElementById("enter-quantity").value = '';
        document.getElementById("add-to-cart-button").disabled = true;
    }

    const displayModal = () => {
        if (!props.show)
            return;

        return (
            <Modal show={props.show} onShow={clearInputAndDisable} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add To Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        How many do you want to buy (limit: 1000)?
                    </p>
                    <InputGroup>
                        <span className="product-title">{props.productName}</span>
                        <Form.Control id="enter-quantity" aria-label="Dollar amount" value={quantity} onChange={e=> setValidQuantityForDisplay(e.target.value)} />
                        <InputGroup.Text>{amountDisplay}</InputGroup.Text>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button id="add-to-cart-button" variant="primary" onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        displayModal()
    );
}

export default AddToCartModal;