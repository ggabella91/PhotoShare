import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from '../button/button.component';

interface Props {
  header: string;
  subheader: string;
  bodytext: string;
  show: boolean;
  onHide: () => void;
  handleConfirm: () => void;
  actionLabel: string;
}

const CustomModal: React.FC<Props> = (props) => (
  <Modal {...props} dialogClassName='custom-modal' centered>
    <Modal.Header closeButton>
      <Modal.Title id='contained-modal-title-vcenter'>
        {props.header}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className='body-text'>
      <h4>{props.subheader}</h4>
      <p>{props.bodytext}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button className='button modal-button' onSubmit={props.onHide}>
        Cancel
      </Button>
      <Button
        className='button modal-button delete-button'
        onSubmit={props.handleConfirm}
      >
        {props.actionLabel}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default CustomModal;
