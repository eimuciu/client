import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function ModalPop({ showModal, handleClose, logUserIn }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="text"
              onChange={handleInputChange}
              value={inputValue}
              placeholder="Your nickname"
              autoFocus
            />
          </Form.Group>
        </Form>
        <button
          className="bg-[grey] p-2 text-[white] rounded-md"
          onClick={() => {
            logUserIn(inputValue);
          }}
        >
          Connect
        </button>
      </Modal.Body>
    </Modal>
  );
}

export default ModalPop;
