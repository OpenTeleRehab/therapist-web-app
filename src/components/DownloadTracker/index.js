import React, { useCallback, useEffect } from 'react';
import { Button, ListGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getTranslate, Translate } from 'react-localize-redux';
import { BsCloudDownload, BsFileBreak, BsFillTrashFill } from 'react-icons/bs';
import { clearDownloadTrackers, getDownloadTrackers, removeDownloadPending } from '../../store/downloadTracker/actions';
import { downloadFile } from '../../utils/file';
import Spinner from 'react-bootstrap/Spinner';
import { ExportStatus } from '../../variables/exportStatus';
import moment from 'moment';
import settings from '../../settings';

const DownloadTracker = ({ showDownloadTrackers, setShowDownloadTrackers }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const { downloadPendings, downloadTrackers } = useSelector((state) => state.downloadTracker);
  const translate = getTranslate(localize);

  const handleDownload = useCallback((downloadTracker) => {
    downloadFile(downloadTracker.file_path);
    dispatch(removeDownloadPending(downloadTracker.job_id));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDownloadTrackers());

    const interval = setInterval(() => {
      dispatch(getDownloadTrackers());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, showDownloadTrackers]);

  useEffect(() => {
    if (downloadTrackers && downloadTrackers.length && downloadPendings.length) {
      const downloadables = downloadTrackers.filter(
        downloadTracker =>
          downloadTracker.status === ExportStatus.SUCCESS &&
          downloadPendings.includes(downloadTracker.job_id)
      );
      downloadables.forEach(downloadable => handleDownload(downloadable));
    }
  }, [downloadTrackers, downloadPendings, handleDownload]);

  const handleClearHistory = async () => {
    dispatch(clearDownloadTrackers())
      .then(res => {
        if (res) {
          setShowDownloadTrackers(false);
        }
      });
  };

  return (
    <Modal show={showDownloadTrackers} size="xl" onHide={() => setShowDownloadTrackers(false)}>
      <Modal.Header closeButton>
        <div className="d-flex justify-content-between align-items-center w-100">
          <Modal.Title>{ translate('common.download.history') }</Modal.Title>
          <Button aria-label="Clear history" variant="primary" className="mr-3" onClick={handleClearHistory}>
            <BsFillTrashFill size={20} className="mr-2" />
            { translate('common.download.history.clear') }
          </Button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <>{ translate('common.download.history.message') }</>
        {downloadTrackers.length ? (
          <ListGroup className="mt-3">
            {downloadTrackers.map((downloadTracker, index) => (
              <ListGroup.Item
                key={index}
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  <div className="font-weight-bold">{translate('export.name.' + downloadTracker.type)}</div>
                  {moment(downloadTracker.created_at).local().format(settings.date_format + ' HH:mm:ss')}
                </div>
                {downloadTracker.status === ExportStatus.SUCCESS ? (
                  <OverlayTrigger
                    overlay={<Tooltip><Translate id="common.download" /></Tooltip>}
                  >
                    <Button aria-label="Download" variant="link" className="p-0" onClick={() => handleDownload(downloadTracker)}>
                      <BsCloudDownload size={20} />
                    </Button>
                  </OverlayTrigger>
                ) : downloadTracker.status === ExportStatus.IN_PROGRESS ? (
                  <Spinner size="sm" animation="border" variant="primary"/>
                ) : (
                  <OverlayTrigger
                    overlay={<Tooltip><Translate id="common.download.failed" /></Tooltip>}
                  >
                    <Button aria-label="Download" variant="link" className="p-0">
                      <BsFileBreak size={20} />
                    </Button>
                  </OverlayTrigger>
                )
                }
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="d-flex justify-content-center mt-3">{ translate('common.no_data') }</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

DownloadTracker.propTypes = {
  showDownloadTrackers: PropTypes.bool,
  setShowDownloadTrackers: PropTypes.func
};

export default DownloadTracker;
