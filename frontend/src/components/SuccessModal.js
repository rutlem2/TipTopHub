import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SuccessModal = (props) => {
    const handleClose = () => {
        props.setShowSuccess(false);
    }

    const getMessage = () => {
        if (props.type === "add_item")
            return `Successfully added ${props.productName} to your cart.`;
        else if (props.type === "submit_cart")
            return "Your order has been submitted! We'll take it from here.";
    }

    const displayModal = () => {
        if (!props.show)
            return;

        return (
            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Great!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        {getMessage()}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="add-to-cart-button" variant="success" onClick={handleClose}>
                        Okay
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return ( 
        displayModal()
    );
}

export default SuccessModal;