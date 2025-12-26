import React, { useEffect, useMemo, useRef } from 'react';
import useTranslate from 'hooks/useTranslate';
import useDialog from 'components/V2/Dialog';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'react-bootstrap';
import { IReferralForm, IReferralRequest } from 'interfaces/IReferral';
import CustomSelect from 'components/V2/Form/Select';
import { getCountryName } from 'utils/country';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { useList } from 'hooks/useList';
import { END_POINTS } from 'variables/endPoint';
import { IProvinceResource } from 'interfaces/IProvince';
import { IRegionResource } from 'interfaces/IRegion';
import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import { useCreate } from 'hooks/useCreate';
import useToast from 'components/V2/Toast';
import { useInvalidate } from 'hooks/useInvalidate';

type ReferralPatientProps = {
  patientId: number;
}

const ReferralPatient = ({ patientId }: ReferralPatientProps) => {
  const t = useTranslate() as any;
  const invalidate = useInvalidate();
  const profile = useSelector((state: any) => state.auth.profile);
  const countries = useSelector((state: any) => state.country.countries);
  const { closeDialog } = useDialog();
  const { showToast } = useToast();
  const { data: clinics } = useList<IProvinceResource>(END_POINTS.CLINIC_BY_USER_COUNTRY);
  const { data: provinces } = useList<IProvinceResource>(END_POINTS.PROVINCE_BY_USER_COUNTRY);
  const { data: regions } = useList<IRegionResource>(END_POINTS.REGION);
  const { mutate: createReferral } = useCreate<IReferralRequest>(END_POINTS.PATIENT_REFERRAL);
  const { control, handleSubmit, watch, setValue } = useForm<IReferralForm>({
    defaultValues: {
      patient_id: patientId,
      region_id: profile.region_id,
      province_id: profile.province_id,
    }
  });
  const prevRegionId = useRef<number | null>(null);
  const regionId = watch('region_id');
  const provinceId = watch('province_id');

  const provinceOptions = useMemo(() => {
    return (provinces?.data ?? []).filter((p) => p.region_id === regionId).map((p) => ({ label: p.name, value: p.id }));
  }, [provinces, regionId]);

  const regionOptions = useMemo(() => {
    return (regions?.data ?? []).map((p) => ({ label: p.name, value: p.id }));
  }, [regions]);

  const clinicOptions = useMemo(() => {
    return (clinics?.data ?? []).filter((c: any) => c.province.id === provinceId).map((c: any) => ({ label: c.name, value: c.id }));
  }, [clinics, provinceId]);

  useEffect(() => {
    if (prevRegionId.current === null) {
      prevRegionId.current = regionId;
      return;
    }

    if (prevRegionId.current !== regionId) {
      setValue('province_id', 0);
      setValue('to_clinic_id', 0);
    }

    prevRegionId.current = regionId;
  }, [regionId, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const payload: IReferralRequest = {
      patient_id: data.patient_id,
      to_clinic_id: data.to_clinic_id,
    };

    createReferral(payload, {
      onSuccess: (res) => {
        showToast({
          title: t('patient.referral.title'),
          message: t(res.message || ''),
        });
        invalidate(END_POINTS.PATIENT);
        closeDialog();
      }
    });
  });

  return (
    <Form onSubmit={onSubmit}>
      <DialogBody>
        <Form.Group controlId="formCountry">
          <Form.Label>{t('common.country')}</Form.Label>
          <Select
            value={profile.country_id}
            placeholder={getCountryName(profile.country_id, countries)}
            classNamePrefix="filter"
            isDisabled
            aria-label="Country"
          />
        </Form.Group>
        <Form.Group controlId="formRegion">
          <CustomSelect
            control={control}
            name='region_id'
            label={t('common.region')}
            options={regionOptions}
            rules={{ required: t('common.required') }}
          />
        </Form.Group>
        <Form.Group controlId="formProvince">
          <CustomSelect
            control={control}
            name='province_id'
            label={t('common.province')}
            options={provinceOptions}
            placeholder={t('placeholder.province')}
            rules={{
              required: t('error.province'),
              validate: (value) => {
                if (value) {
                  return true;
                }

                return t('error.province');
              }
            }}
          />
        </Form.Group>
        <Form.Group controlId="formClinic">
          <CustomSelect
            control={control}
            name='to_clinic_id'
            label={t('common.clinic')}
            placeholder={t('placeholder.clinic')}
            options={clinicOptions}
            isDisabled={!provinceId}
            rules={{
              required: t('error.clinic'),
              validate: (value) => {
                if (value) {
                  return true;
                }

                return t('error.clinic');
              }
            }}
          />
        </Form.Group>
      </DialogBody>
      <DialogFooter>
        <Button variant="primary" type='submit'>
          {t('common.save')}
        </Button>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
      </DialogFooter>
    </Form>
  );
};

export default ReferralPatient;
