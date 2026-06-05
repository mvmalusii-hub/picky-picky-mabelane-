import React from 'react';
import Modal from '../Common/Modal';

const PurchaseModal = ({ isOpen, onClose, item, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Buy ${item?.name}`}>
      <p>Are you sure you want to buy <strong>{item?.name}</strong> for <strong>R{item?.price}</strong>?</p>
      <p>{item?.description}</p>
      <div className="modal-actions">
        <button onClick={onConfirm} className="primary">Confirm</button>
        <button onClick={onClose} className="secondary">Cancel</button>
      </div>
    </Modal>
  );
};

export default PurchaseModal;
