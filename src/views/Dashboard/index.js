import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { IoPerson } from 'react-icons/all';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { getPatients } from '../../store/patient/actions';
import _ from 'lodash';
import { AgeInYear } from '../../utils/age';
import settings from 'settings';
import { FaNotesMedical } from 'react-icons/fa';

const Dashboard = ({ translate }) => {
  const dispatch = useDispatch();
  const patients = useSelector(state => state.patient.patients);
  const { profile } = useSelector((state) => state.auth);
  const [totalPatient, setTotalPatient] = useState(0);
  const [totalOngoingTreatment, setTotalOngoingTreatment] = useState(0);
  const [totalOngoingByGender, setTotalOngoingByGender] = useState([]);
  const [totalPatientByGender, setTotalPatientByGender] = useState([]);
  const [totalPatientByAge, setTotalPatientByAge] = useState([]);
  const [totalOngoingByAge, setTotalOngoingByAge] = useState([]);
  const [ageLabel, setAgeLabel] = useState([]);

  useEffect(() => {
    dispatch(getPatients({
      therapist_id: profile.id
    }));
  }, [profile, dispatch]);

  useEffect(() => {
    if (patients && patients.length) {
      const ongoingTreatment = patients.filter(p => !_.isEmpty(p.ongoingTreatmentPlan));
      const malePatients = patients.filter(p => p.gender === settings.male);
      const femalePatients = patients.filter(p => p.gender === settings.female);
      const otherPatients = patients.filter(p => p.gender === settings.other);
      const ongoingMale = patients.filter(p => p.gender === settings.male && !_.isEmpty(p.ongoingTreatmentPlan));
      const ongoingFemale = patients.filter(p => p.gender === settings.female && !_.isEmpty(p.ongoingTreatmentPlan));
      const ongoingOther = patients.filter(p => p.gender === settings.other && !_.isEmpty(p.ongoingTreatmentPlan));
      const ageLabel = [];
      const patientByAge = [];
      const ongoingByAge = [];
      let patientData = null;
      let ongoingData = null;
      for (let i = settings.minAge; i <= settings.maxAge; i += settings.ageGap) {
        if (i === settings.maxAge) {
          ageLabel.push('>= ' + settings.maxAge + translate('common.year'));
          patientData = patients.filter(p => p.date_of_birth !== null && AgeInYear(p.date_of_birth) >= i);
          ongoingData = patientData.filter(p => !_.isEmpty(p.ongoingTreatmentPlan));
        } else {
          if (i === settings.minAge) {
            ageLabel.push('< ' + settings.ageGap + ' ' + translate('common.year'));
          } else {
            ageLabel.push((i) + '-' + (i + settings.ageGap) + ' ' + translate('common.year'));
          }
          patientData = patients.filter(p => p.date_of_birth !== null && AgeInYear(p.date_of_birth) >= i && AgeInYear(p.date_of_birth) < i + settings.ageGap);
          ongoingData = patientData.filter(p => !_.isEmpty(p.ongoingTreatmentPlan));
        }
        patientByAge.push(patientData.length);
        ongoingByAge.push(ongoingData.length);
      }
      setTotalOngoingTreatment(ongoingTreatment.length);
      setTotalPatient(patients.length);
      setTotalPatientByGender([malePatients.length, femalePatients.length, otherPatients.length]);
      setTotalOngoingByGender([ongoingMale.length, ongoingFemale.length, ongoingOther.length]);
      setAgeLabel(ageLabel);
      setTotalPatientByAge(patientByAge);
      setTotalOngoingByAge(ongoingByAge);
    }
  }, [patients, translate]);

  const chartOptions = {
    legend: {
      labels: {
        boxWidth: 10,
        fontColor: '#000000'
      }
    }
  };

  const patientByGenderData = {
    labels: [translate('common.male'), translate('common.female'), translate('common.other')],
    datasets: [
      {
        data: totalPatientByGender,
        backgroundColor: ['#64CCC9', '#E35205', '#827717'],
        borderColor: ['#64CCC9', '#E35205', '#827717'],
        borderWidth: 1
      }
    ]
  };

  const patientByAgeData = {
    labels: ageLabel,
    datasets: [
      {
        data: totalPatientByAge,
        backgroundColor: ['#06038D', '#5BC2E7', '#eb1515', '#B71C1C', '#FFD100', '#6A2A5B', '#07823a', '#74bd08', '#d90fa6', '#827717'],
        borderColor: ['#06038D', '#5BC2E7', '#eb1515', '#B71C1C', '#FFD100', '#6A2A5B', '#07823a', '#74bd08', '#d90fa6', '#827717'],
        borderWidth: 1
      }
    ]
  };

  const ongoingByGenderData = {
    labels: [translate('common.male'), translate('common.female'), translate('common.other')],
    datasets: [
      {
        data: totalOngoingByGender,
        backgroundColor: ['#64CCC9', '#E35205', '#827717'],
        borderColor: ['#64CCC9', '#E35205', '#827717'],
        borderWidth: 1
      }
    ]
  };

  const ongoingByAgeData = {
    labels: ageLabel,
    datasets: [
      {
        data: totalOngoingByAge,
        backgroundColor: ['#06038D', '#5BC2E7', '#eb1515', '#B71C1C', '#FFD100', '#6A2A5B', '#07823a', '#74bd08', '#d90fa6', '#827717'],
        borderColor: ['#06038D', '#5BC2E7', '#eb1515', '#B71C1C', '#FFD100', '#6A2A5B', '#07823a', '#74bd08', '#d90fa6', '#827717'],
        borderWidth: 1
      }
    ]
  };

  return (
    <>
      <Row className="top-card-container">
        <Col sm={5} md={4} lg={3}>
          <Card className="dashboard-top-card">
            <Card.Body>
              <Row>
                <Col sm={5} md={4} lg={3}>
                  <IoPerson size={45} color="#0077C8"/>
                </Col>
                <Col sm={7} md={8} lg={9}>
                  <h6 className="card-text">{translate('common.total_patient')}</h6>
                  <h5 className="card-number">{ totalPatient }</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={5} md={4} lg={3}>
          <Card className="dashboard-top-card">
            <Card.Body>
              <Row>
                <Col sm={5} md={4} lg={3}>
                  <FaNotesMedical size={45} color="#0077C8"/>
                </Col>
                <Col sm={7} md={8} lg={9}>
                  <h6 className="card-text">{translate('common.ongoing_treatment')}</h6>
                  <h5 className="card-number">{totalOngoingTreatment}</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="top-card-container">
        <Col className="container-fluid content-row">
          <Card className="h-100">
            <Card.Header as="h5" className="chart-header">{translate('dashboard.total_patient_by_gender')}</Card.Header>
            <Card.Body>
              {
                totalPatient > 0 ? (
                  <Pie data={patientByGenderData} options={chartOptions} />
                ) : (
                  <Card.Text className="card-text-center">{translate('common.no_data')}</Card.Text>
                )
              }
            </Card.Body>
          </Card>
        </Col>
        <Col className="container-fluid content-row">
          <Card className="h-100">
            <Card.Header as="h5" className="chart-header">{translate('dashboard.total_patient_by_age')}</Card.Header>
            <Card.Body>
              {
                totalPatient > 0 ? (
                  <Pie data={patientByAgeData} options={chartOptions} />
                ) : (
                  <Card.Text className="card-text-center">{translate('common.no_data')}</Card.Text>
                )
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="top-card-container">
        <Col className="container-fluid content-row">
          <Card className="h-100">
            <Card.Header as="h5" className="chart-header">{translate('dashboard.total_ongoing_treatment_by_gender')}</Card.Header>
            <Card.Body>
              {
                totalOngoingTreatment > 0 ? (
                  <Pie data={ongoingByGenderData} options={chartOptions} />
                ) : (
                  <Card.Text className="card-text-center">{translate('common.no_data')}</Card.Text>
                )
              }
            </Card.Body>
          </Card>
        </Col>
        <Col className="container-fluid content-row">
          <Card className="h-100">
            <Card.Header as="h5" className="chart-header">{translate('dashboard.total_ongoing_treatment_by_age')}</Card.Header>
            <Card.Body>
              {
                totalOngoingTreatment > 0 ? (
                  <Pie data={ongoingByAgeData} options={chartOptions} />
                ) : (
                  <Card.Text className="card-text-center">{translate('common.no_data')}</Card.Text>
                )
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

Dashboard.propTypes = {
  translate: PropTypes.func
};

export default Dashboard;
