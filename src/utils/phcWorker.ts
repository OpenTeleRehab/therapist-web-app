export const renderLeadAndSupplementPhcWorkers = (profileId: number, leadAndSupplementPhcWorkers: any[]) =>
  leadAndSupplementPhcWorkers
    .map((phcWorker) =>
      phcWorker.id === profileId
        ? `<b>${phcWorker.first_name} ${phcWorker.last_name}</b>`
        : `${phcWorker.first_name} ${phcWorker.last_name}`
    )
    .join(', ');
