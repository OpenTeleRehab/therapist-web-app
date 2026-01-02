import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import List from './list';

type sectionProps = {
  eventKey: string;
  title: string;
  appointments: any[];
  handleEdit: (appointment: any) => void;
  filter: object;
  isOpen: boolean;
  onToggle: (key: string) => void;
};

const AppointmentSection = ({
  title,
  appointments,
  handleEdit,
  filter,
  isOpen,
  onToggle,
  eventKey
}: sectionProps) => {
  return (
    <Accordion activeKey={isOpen ? eventKey : undefined}>
      <Card className="mb-1 border-0 shadow-0 px-0">
        <Card.Header
          onClick={() => onToggle(eventKey)}
          className="d-flex justify-content-between align-items-center p-2 bg-transparent border-bottom-0"
          style={{ cursor: 'pointer' }}
        >
          <h4 className='text-primary font-weight-bold'>{title}</h4>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </Card.Header>

        <Accordion.Collapse eventKey={eventKey}>
          <Card.Body className="py-2 px-0">
            <List
              appointments={appointments}
              handleEdit={handleEdit}
              filter={filter}
            />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default AppointmentSection;
