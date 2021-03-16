import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import PageLayout from 'layout/layout';
import PrivateRoute from 'routes/privateRoute';

import DashboardPage from 'views/Dashboard';
import Patient from 'views/Patient';
import Library from 'views/Library';
import Profile from 'views/Profile';
import CreateTreatmentPlan from 'views/TreatmentPlan/create';
import ViewPatient from 'views/Patient/viewPatient';
import ViewTreatmentPlan from 'views/TreatmentPlan/detail';
import NotFoundPage from 'views/NotFound';

import CreateExercise from 'views/Library/Exercise/create';
import CreateEducationMaterial from 'views/Library/EducationMaterial/create';
import CreateQuestionnaire from 'views/Library/Questionnaire/create';

import * as ROUTES from 'variables/routes';
const PRIVATE = 'private';
const PUBLIC = 'public';

const routes = [
  {
    title: 'dashboard',
    path: ROUTES.DASHBOARD,
    component: DashboardPage,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'patient',
    path: ROUTES.PATIENT,
    component: Patient,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'library',
    path: ROUTES.LIBRARY,
    component: Library,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'exercise.create',
    path: ROUTES.EXERCISE_CREATE,
    component: CreateExercise,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'education_material.create',
    path: ROUTES.EDUCATION_MATERIAL_CREATE,
    component: CreateEducationMaterial,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'questionnaire.create',
    path: ROUTES.QUESTIONNAIRE_CREATE,
    component: CreateQuestionnaire,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'profile',
    path: ROUTES.PROFILE,
    component: Profile,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'treatment_plan.create',
    path: ROUTES.TREATMENT_PLAN_CREATE_FOR_PATIENT,
    component: CreateTreatmentPlan,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'treatment_plan.edit',
    path: ROUTES.TREATMENT_PLAN_EDIT,
    component: CreateTreatmentPlan,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'treatment_plan.detail',
    path: ROUTES.VIEW_TREATMENT_PLAN_DETAIL,
    component: ViewTreatmentPlan,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'patient.detail',
    path: ROUTES.VIEW_PATIENT_DETAIL,
    component: ViewPatient,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'not_found_page',
    path: '*',
    component: NotFoundPage,
    type: PUBLIC
  }
];

const RouteSwitch = () => {
  const routeComponents = routes.map(({ path, component, exact, type, title }, key) => {
    return type === PUBLIC ? (
      <Route exact={!!exact} path={path} key={key}>
        <PageLayout component={component} title={title} />
      </Route>
    ) : (
      <PrivateRoute exact={!!exact} path={path} key={key}>
        <PageLayout component={component} title={title} />
      </PrivateRoute>
    );
  });

  return (
    <Suspense fallback={<Spinner animation="border" />}>
      <Switch>
        {routeComponents}
      </Switch>
    </Suspense>
  );
};

export default RouteSwitch;
