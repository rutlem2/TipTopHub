import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, FloatingLabel, Tab, Tabs } from 'react-bootstrap';

import "../styling/OrderModal.css";
import SuccessModal from './SuccessModal';
import UpdateCartModal from './UpdateCartModal';

const ORDER_TAB_ID = "order-tabs-tab-order";
const CONTACT__TAB_ID = "order-tabs-tab-contact";
const CONTACT_BUTTON_ID = "link-continue-button";
const TIP_TOP_FEE = 2.65;
const penniesConversion = 100;

const OrderModal = (props) => {
    const [key, setKey] = useState('cart');
    const [contactValidated, setContactValidated] = useState(false);
    const [orderValidated, setOrderValidated] = useState(false);

    const [invalidExpirationDateMessage, setInvalidExpirationDateMessage] = useState('');
    const [orderName, setOrderName] = useState('');
    const [orderPhoneNumber, setOrderPhoneNumber] = useState('');
    const [orderEmail, setOrderEmail] = useState('');
    const [orderCreditCardNum, setOrderCreditCardNum] = useState('');
    const [orderCvv, setOrderCvv] = useState('');
    const [orderExpDate, setOrderExpDate] = useState('');
    const [orderZipcode, setOrderZipcode] = useState('');
    const [orderCardholderName, setOrderCardholderName] = useState('');

    const [showAddToCart, setShowAddToCart] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [editedCartItemName, setEditedCartItemName] = useState('');
    const [editedCartItemPrice, setEditedCartItemPrice] = useState('');
    const [editedCartItemQuantity, setEditCartItemQuantity] = useState('');

    const [cart, setCart] = useState('');

    useEffect ( () => {
        setCart(props.cart)
    }, [props])

    const handleClose = () => {
        props.handleCloseOrder();
    }

    const showSuccessModal = () => {
        props.setShowSuccess(true);
    }

    const deleteCartItem = async (name, quantity, index) => {
        let searchData = {name: name}
        let response = await fetch(`/shop/delete/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:8000/',
                'X-CSRFToken': getCookie(),
            },
            body: JSON.stringify(searchData)
        });

        let data = await response.json();

        cart.splice(index,1);
        setCart([...cart]);
        props.setCartItemsCount(props.cartItemsCount-quantity)
    
        revertAllModalValidations();
        clearAllFields();
        if (cart.length === 0)
            disableContactAccess();

        return data === "success";
    }

    const submitCart = async () => {
        let response = await fetch(`/shop/submit/`);
        let data = await response.json();
        
        return data === "success";
    }

    const getCookie = () => {
        return document.cookie.split('=')[1];
    }

    const enableOrderTab = () => {
        document.getElementById(ORDER_TAB_ID).disabled = false;
    }

    const disableOrderTab = () => {
        document.getElementById(ORDER_TAB_ID).disabled = true;
    }

    const enableContactAccess = () => {
        document.getElementById(CONTACT__TAB_ID).disabled = false;
        document.getElementById(CONTACT_BUTTON_ID).disabled = false;
    }

    const disableContactAccess = () => {
        document.getElementById(CONTACT__TAB_ID).disabled = true;
        document.getElementById(CONTACT_BUTTON_ID).disabled = true;
    }

    const openOrderModal = () => {
        if (cart.length === 0)
            disableContactAccess();
        else
            enableContactAccess();
        
        if (!contactValidated)
            disableOrderTab();
    }
    
    const revertContactValidation = () => {
        setContactValidated(false);
        disableOrderTab();
    }

    const revertAllModalValidations = () => {
        revertContactValidation()
        setOrderValidated(false);
    }

    const clearAllFields = () => {
        setOrderName('');
        setOrderPhoneNumber('');
        setOrderEmail('');
        setOrderCreditCardNum('');
        setOrderCvv('');
        setOrderExpDate('');
        setOrderZipcode('');
        setOrderCardholderName('');
    }

    const dateIsInFutureOrNow = () => {
        let month = orderExpDate.split("/")[0];
        month = Number(month);
        let year = orderExpDate.split("/")[1];
        year = Number("20"+year);
        let userExpirationDate = new Date(year, month, 0);

        return Date.now() <= userExpirationDate;
    }

    const validateExpirationDate = () => {
        // eslint-disable-next-line
        if (orderExpDate.length > 0 && /^(?![0][0])[0-1][0-9][\/][0-9]{2}$/.test(orderExpDate))
        {
            if (dateIsInFutureOrNow())
                document.getElementById("floatingExpirationDate").setCustomValidity(""); //field becomes valid
            else
            {
                document.getElementById("floatingExpirationDate").setCustomValidity(" invalid "); 
                setInvalidExpirationDateMessage("Card has expired");
            }
        }
        else
        {
            document.getElementById("floatingExpirationDate").setCustomValidity(" invalid "); 
            setInvalidExpirationDateMessage("Please enter a valid expiration date: mm/yy");
        }
    }

    const handleSuccessfulCartSubmission = () => {
        setKey('cart');
        handleClose();
        revertAllModalValidations();
        clearAllFields();
        showSuccessModal();
    }

    const submitContact = (e) => {
        e.preventDefault();
        setContactValidated(true); //show visual display

        const form = e.currentTarget;
        if (form.checkValidity())
        {
            enableOrderTab();
            setKey('order');
        }
        else
            disableOrderTab();
    }

    const placeOrder = async (e) => {
        e.preventDefault();
        setOrderValidated(true); //show visual display

        validateExpirationDate();
        const form = e.currentTarget;
        const verifySubmitCart = await submitCart();
        if (form.checkValidity() && verifySubmitCart)
            handleSuccessfulCartSubmission();
    }


    const isValidInputForName = (name) => {
        return /^[a-zA-Z\s']{0,55}$/.test(name);
    }

    const showName = (name, setter) => {
        if (isValidInputForName(name))
            setter(name);
    }

    const isValidPhoneNumber = (phoneNumber) => {
        return /^[0-9]{0,10}$/.test(phoneNumber);
    }

    const showPhoneNumber = (phoneNumber) => {
        if (isValidPhoneNumber(phoneNumber))
            setOrderPhoneNumber(phoneNumber);
    }

    const isValidEmail = (email) => {
        return /^[a-zA-z]{0,30}[@]{0,1}[a-zA-Z]{0,30}[.]{0,1}[a-z]{0,3}$/.test(email);
    }
    
    const showEmail = (email) => {
        if (isValidEmail(email))
            setOrderEmail(email);
    }

    const isValidIputForCreditCardNumber = (ccn) => {
        return /^[0-9]{0,16}$/.test(ccn);
    }

    const showCreditCardNumber = (ccn) => {
        if (isValidIputForCreditCardNumber(ccn))
            setOrderCreditCardNum(ccn);
    }

    const isValidInputForExpirationDate = (expDate) => {
        // eslint-disable-next-line
        return /^[0-9]{0,2}[/]{0,1}[0-9]{0,2}$/.test(expDate);
    }

    const showExpirationDate = (expDate) => {
        if (isValidInputForExpirationDate(expDate))
            setOrderExpDate(expDate);
    }

    const isValidInputForZipcode = (zipcode) => {
        return /^[0-9]{0,5}$/.test(zipcode);
    }

    const showZipcode = (zipcode) => {
        if (isValidInputForZipcode(zipcode))
            setOrderZipcode(zipcode);
    }

    const isValidInputForCVV = (cvv) => {
        if (/^[0-9]{0,3}$/.test(cvv))
            return true;
    }

    const showCVV = (cvv) => {
        if (isValidInputForCVV(cvv))
            setOrderCvv(cvv);
    }

    const roundedAmount = (value) => {
        let roundedVal = Number(Math.round(value + 'e2')+'e-2');
        return roundedVal;
    }
    
    const getGrossPrice = () => {
        let sum = 0; 
        cart?.map(item=> sum += Number(item["quantity"]) * (Number(item["price_per_each"]) / penniesConversion))
        return sum;
    }

    const getTax = () => {
        if (!cart || cart?.length === 0)
            return 0;
        return roundedAmount(0.08375 * (TIP_TOP_FEE + getGrossPrice()));
    }

    const getTotalPrice = () => {
        return getTax() + getGrossPrice();
    }
    
    const handleUpdateQuantity = (name, price_per_each, quantity) => {
        setEditedCartItemName(name);
        setEditedCartItemPrice(price_per_each);
        setEditCartItemQuantity(quantity);
        setShowAddToCart(true);
    }

    const cartTab = () => {
        return (
            <Tab eventKey="cart" title="Cart">
                <Modal.Header closeButton>
                    <Modal.Title>Review Your Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {displayCart()}
                    {displayUpdateCartModals()}
                    {displayCartSummary()}
                </Modal.Body>
                <Modal.Footer>
                    <Button id="cancel-button" variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button id="link-continue-button" type="submit" variant="info" onClick={()=> setKey("contact")}>
                        Continue
                    </Button>
                </Modal.Footer>
            </Tab>
        );
    }

    const contactTab = () => {
        return (
            <Tab eventKey="contact" title="Contact">
                <Modal.Header closeButton>
                    <Modal.Title>Enter Your Contact Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {contactDetailsForm()}
                </Modal.Body>
            </Tab>
        );
    }

    const orderTab = () => {
        return (
            <Tab eventKey="order" title="Order">
                <Modal.Header closeButton>
                    <Modal.Title>Enter Your Payment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {orderDetailsForm()}
                </Modal.Body>
            </Tab>
        );
    }

    const displayCart = () => {
        let cartDisplay;

        if (cart?.length > 0) {
            cartDisplay = cart.map((cartItem, index) => (
                <div className="cart-item" key={index}>
                    <div className="cart-item-name">
                        {cartItem.name}
                    </div>
                    <span className="cart-item-quantity"> 
                        {cartItem.quantity}
                    </span>
                    <div className="cart-item-price">
                        @ ${(Number(cartItem.price_per_each) / penniesConversion).toFixed(2)}
                    </div>
                    <img className="delete_icon" src="delete.png" alt="Remove" onClick={() => deleteCartItem(cartItem.name, cartItem.quantity, index)} />
                    <img className="edit_icon" src="edit.png" alt="Remove" 
                    onClick={() => handleUpdateQuantity(cartItem.name, cartItem.price_per_each, cartItem.quantity)} />
                </div>
            ))
        }
        else
            cartDisplay = <div className="cart-explainer-text">Your cart's empty. Add an item to get started.</div>

        return cartDisplay;
    }

    const displayUpdateCartModals = () => {
        return (
            <>
                <UpdateCartModal show={showAddToCart} setShowAddToCart={setShowAddToCart} setShowSuccess={setShowSuccess} 
                productName={editedCartItemName} productPrice={editedCartItemPrice/100} productQuantity={editedCartItemQuantity} 
                setCartItemsCount={props.setCartItemsCount}/>
                <SuccessModal show={showSuccess} setShowSuccess={setShowSuccess} productName={editedCartItemName} type={"add_item"} />
            </>
        )
    }

    const displayCartSummary = () => {
        return ( 
            <div className="cart-summary">
                <div id="cart-summary-fees">
                    TipTopFees: ${!cart || cart.length === 0 ? "0.00" : TIP_TOP_FEE}
                </div>
                <div id="cart-summary-taxes">
                    Taxes (NV): ${getTax().toFixed(2)}
                </div>
                <div id="cart-summary-tp">
                    Total Price: ${getTotalPrice().toFixed(2)}
                </div>
            </div>
        );
    }

    const contactDetailsForm = () => {
        return (
            <Form noValidate validated={contactValidated} onChange={revertContactValidation} onSubmit={submitContact}>
                <Form.Group className="mb-3" controlId="validationContact">
                    <FloatingLabel controlId="floatingName" label="Name (First Last)" className="mb-3">
                        <Form.Control placeholder="Name" value={orderName} onChange={e=> showName(e.target.value, setOrderName)} 
                        required pattern="[A-Z](')?[a-zA-Z]{0,25}[\s]{0,1}[A-Z](')?[a-zA-Z]{0,25}"/>
                        <Form.Control.Feedback type="invalid">Please provide a valid name: First Last</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingPhoneNumber" label="Phone number" className="mb-3">
                        <Form.Control placeholder="xxxxxxxxxx" value={orderPhoneNumber} onChange={e=> showPhoneNumber(e.target.value)} 
                        required pattern="[0-9]{10}"/>
                        <Form.Control.Feedback type="invalid">Please provide a valid phone number: 1234567890</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
                        <Form.Control placeholder="name@email.com" value={orderEmail} onChange={e=> showEmail(e.target.value)} 
                        required pattern="[a-zA-z]{1,30}[@][a-zA-z]{1,30}[.][a-z]{3}"/>
                        <Form.Control.Feedback type="invalid">Please provide a valid email: you@email.com</Form.Control.Feedback>
                    </FloatingLabel>
                </Form.Group>
                <Modal.Footer>
                    <Button id="back-button" variant="secondary" onClick={() => setKey("cart")}>
                        Back
                    </Button>
                    <Button id="link-order-button" type="submit" variant="info">
                        Ready to Order
                    </Button>
                </Modal.Footer>
            </Form>
        );
    }

    const orderDetailsForm = () => {
        return (
            <Form noValidate validated={orderValidated} onChange={() => setOrderValidated(false)} onSubmit={placeOrder} >
                <Form.Group className="mb-3" controlId="validationOrder">
                    <FloatingLabel controlId="floatingCC" label="Credit Card #" className="mb-3">
                        <Form.Control placeholder="Credit Card #" value={orderCreditCardNum} onChange={e=> showCreditCardNumber(e.target.value)} 
                        required pattern="[0-9]{16}" />
                        <Form.Control.Feedback type="invalid">Please provide a valid CC#: 1234123412341234</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingCVV" label="CVV" className="mb-3">
                        <Form.Control placeholder="CVV" value={orderCvv} onChange={e=> showCVV(e.target.value)} 
                        required pattern="[0-9]{3}"/>
                        <Form.Control.Feedback type="invalid">Please provide a valid CVV: 123</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingExpirationDate" label="mm/yy" className="mb-3">
                        <Form.Control placeholder="mm/yy" value={orderExpDate} onChange={e=> showExpirationDate(e.target.value)} />
                        <Form.Control.Feedback type="invalid">{invalidExpirationDateMessage}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingZip" label="Zipcode" className="mb-3">
                        <Form.Control placeholder="Zipcode" value={orderZipcode} onChange={e=> showZipcode(e.target.value)} 
                        required pattern="[0-9]{5}"/>
                        <Form.Control.Feedback type="invalid">Please provide a valid zipcode: 12345</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingCardholderName" label="Cardholder Name (First Last)" className="mb-3">
                        <Form.Control placeholder="Cardholder Name" value={orderCardholderName} onChange={e=> showName(e.target.value, setOrderCardholderName)} 
                        required pattern="[A-Z](')?[a-zA-Z]{0,25}[\s]{0,1}[A-Z](')?[a-zA-Z]{0,25}"/>
                        <Form.Control.Feedback type="invalid">Please provide a valid name: First Last</Form.Control.Feedback>
                    </FloatingLabel>
                </Form.Group>
                <Modal.Footer>
                    <Button id="back-button" variant="secondary" onClick={() => setKey("contact")}>
                        Back
                    </Button>
                    <Button id="order-button" type="submit" variant="primary">
                        Place order
                    </Button>
                </Modal.Footer>
            </Form>
        );
    }

    const displayModal = () => {
        if (!props.show)
            return;

        return (
            <Modal show={props.show} onShow={openOrderModal} onHide={handleClose}>
                <Tabs
                    id="order-tabs"
                    activeKey={key}
                    onSelect={k=> setKey(k)}
                    className="mb-3"
                >
                    {cartTab()}
                    {contactTab()}
                    {orderTab()}
                </Tabs>
            </Modal>
        )
    }

    return (
        displayModal()
    );
}

export default OrderModal; 