export const renderLeadAndSupplementPhcWorkers = (profileId: number, leadAndSupplementPhcWorkers: any[], translate: any) =>
  leadAndSupplementPhcWorkers
    .map((phcWorker) =>
      phcWorker.id === profileId
        ? `<b>${translate('common.user.full_name', { lastName: phcWorker.last_name, firstName: phcWorker.first_name })}</b>`
        : `${translate('common.user.full_name', { lastName: phcWorker.last_name, firstName: phcWorker.first_name })}`
    )
    .join(', ');
