import React from 'react';
import { Card } from 'react-bootstrap';
import { BsHeart } from 'react-icons/bs';

const CardPlaceholder = () => {
  return (
    <Card className="exercise-card shadow-sm mb-4">
      <div className="top-bar">
        <div className="favorite-btn">
          <BsHeart size={20} />
        </div>
      </div>
      <div className="card-container">
        <div className="card-img bg-light"></div>
        <Card.Body className="d-flex flex-column justify-content-between">
          <Card.Title>
            <h5 className="card-title placeholder-glow">
              <span className="placeholder col-8"></span>
            </h5>
          </Card.Title>
        </Card.Body>
      </div>
    </Card>
  );
};

export default CardPlaceholder;
