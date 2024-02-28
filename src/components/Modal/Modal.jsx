import React from 'react';
import './Modal.css';

const Modal = ({ modalInfo}) => {
  return (
    <div className="modal">
    <div className="modal-content">
      <h6><span style={{fontWeight:"bold"}}>Member Type:</span> {modalInfo?.member_type}</h6>
      <h6><span style={{fontWeight:"bold"}}>Portfolio Name:</span> {modalInfo?.portfolio_name}</h6>
      <h6><span style={{fontWeight:"bold"}}>Username:</span> {modalInfo?.username[0]}</h6>
      <h6><span style={{fontWeight:"bold"}}>Data Type:</span> {modalInfo?.data_type}</h6>
      <h6><span style={{fontWeight:"bold"}}>Operational Rights:</span> {modalInfo?.operations_right}</h6>
      <h6><span style={{fontWeight:"bold"}}>Role:</span> {modalInfo?.role}</h6>
      <h6><span style={{fontWeight:"bold"}}>Organization Name:</span> {modalInfo?.org_name}</h6>
    </div>
  
    </div>
  );
};

export default Modal;
