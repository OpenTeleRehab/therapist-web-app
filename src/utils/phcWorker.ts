import _ from 'lodash';

export const getSupplementaryPhcWorker = (profile: any, user: any, phcWorkers: any[]) => {
  let primaryPhcWorkerHTML = '';
  let supplementaryPhcWorkerHTML = '';

  const primaryPhcWorker = phcWorkers.find(item => item.id === user.phc_worker_id);
  const supplementaryPhcWorkers = _.filter(phcWorkers, worker => _.includes(user.supplementary_phc_workers, worker.id));

  if (primaryPhcWorker) {
    if (primaryPhcWorker.id === profile.id) {
      primaryPhcWorkerHTML = `<b>${primaryPhcWorker.first_name} ${primaryPhcWorker.last_name}</b>`;
    } else {
      primaryPhcWorkerHTML = `${primaryPhcWorker.first_name} ${primaryPhcWorker.last_name}`;
    }
  }

  if (supplementaryPhcWorkers.length) {
    const phcWorkersList: any[] = [];

    supplementaryPhcWorkers.forEach(worker => {
      if (worker.id === profile.id) {
        phcWorkersList.push(`<b>${worker.first_name} ${worker.last_name}</b>`);
      } else {
        phcWorkersList.push(`${worker.first_name} ${worker.last_name}`);
      }
    });

    supplementaryPhcWorkerHTML = phcWorkersList.join(', ');
  }

  if (primaryPhcWorkerHTML && supplementaryPhcWorkerHTML) return `${primaryPhcWorkerHTML} / ${supplementaryPhcWorkerHTML}`;
  return primaryPhcWorkerHTML || supplementaryPhcWorkerHTML || '';
};
