import React, { Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import PageLayout from 'layout/layout';
import PrivateRoute from 'routes/privateRoute';

import DashboardPage from 'views/Dashboard';
import Patient from 'views/Patient';
import Transfer from 'views/Patient/Transfer';
import Library from 'views/Library';
import Appointment from 'views/Appointment';
import Profile from 'views/Profile';
import CreatePresetTreatment from 'views/Library/PresetTreatment/create';
import CreateTreatmentPlan from 'views/TreatmentPlan/create';
import ViewPatient from 'views/Patient/viewPatient';
import ViewTreatmentPlan from 'views/TreatmentPlan/detail';
import NotFoundPage from 'views/NotFound';
import ChatOrCall from 'views/ChatOrCall';
import faqPage from 'views/Faq';
import TermConditionPage from 'views/TermCondition';
import PrivacyPolicyPage from 'views/PrivacyPolicy';

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
    title: 'patient.transfer',
    path: ROUTES.PATIENT_TRANSFER,
    component: Transfer,
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
    title: 'exercise.edit',
    path: ROUTES.EXERCISE_EDIT,
    component: CreateExercise,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'exercise.copy',
    path: ROUTES.EXERCISE_COPY,
    component: CreateExercise,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'exercise.translate',
    path: ROUTES.EXERCISE_TRANSLATE,
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
    title: 'education_material.translate',
    path: ROUTES.EDUCATION_MATERIAL_TRANSLATE,
    component: CreateEducationMaterial,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'education_material.edit',
    path: ROUTES.EDUCATION_MATERIAL_EDIT,
    component: CreateEducationMaterial,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'education_material.copy',
    path: ROUTES.EDUCATION_MATERIAL_COPY,
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
    title: 'questionnaire.edit',
    path: ROUTES.QUESTIONNAIRE_EDIT,
    component: CreateQuestionnaire,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'questionnaire.copy',
    path: ROUTES.QUESTIONNAIRE_COPY,
    component: CreateQuestionnaire,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'questionnaire.translate',
    path: ROUTES.QUESTIONNAIRE_TRANSLATE,
    component: CreateQuestionnaire,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'chat_or_call',
    path: ROUTES.CHAT_OR_CALL,
    component: ChatOrCall,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'appointment',
    path: ROUTES.APPOINTMENT,
    component: Appointment,
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
    title: 'faq',
    path: ROUTES.FAQ,
    component: faqPage,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'term-condition',
    path: ROUTES.TC,
    component: TermConditionPage,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'privacy-policy',
    path: ROUTES.PP,
    component: PrivacyPolicyPage,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'treatment_plan.preset',
    path: ROUTES.LIBRARY_PRESET_TREATMENT_PLAN_CREATE,
    component: CreatePresetTreatment,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'treatment_plan.preset',
    path: ROUTES.LIBRARY_TREATMENT_PLAN_EDIT,
    component: CreatePresetTreatment,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'treatment_plan.create',
    path: ROUTES.LIBRARY_TREATMENT_PLAN_CREATE,
    component: CreateTreatmentPlan,
    exact: true,
    type: PRIVATE
  },
  {
    title: 'treatment_plan.create_for_patient',
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
    path: ROUTES.LIBRARY_TREATMENT_PLAN_DETAIL,
    component: ViewTreatmentPlan,
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
        <PrivateRoute exact path="/" key="redirect-route">
          <Redirect to={ROUTES.PATIENT} />
        </PrivateRoute>
        {routeComponents}
      </Switch>
    </Suspense>
  );
};

export default RouteSwitch;
