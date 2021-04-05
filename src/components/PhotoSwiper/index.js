// @see https://photoswipe.com/documentation/getting-started.html
// @see https://pantaley.com/blog/Create-React-wrapper-for-PhotoSwipe/
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import PhotoSwipe from 'photoswipe/dist/photoswipe.min';
import PhotoSwipeDefaultUI from 'photoswipe/dist/photoswipe-ui-default.min';
import { BsDownload } from 'react-icons/bs';

const PhotoSwiper = (props) => {
  let photoSwipeRef = useRef(null);
  let downloadRef = useRef(null);
  const activeIndexRef = useRef(props.activeIndex);

  const options = {
    index: props.activeIndex || 0
  };

  useEffect(() => {
    const photoSwipe = new PhotoSwipe(photoSwipeRef, PhotoSwipeDefaultUI, props.items, options);
    if (photoSwipe) {
      if (props.isOpen) {
        photoSwipe.init();
        photoSwipe.listen('afterChange', () => {
          activeIndexRef.current = photoSwipe.getCurrentIndex();
        });
        photoSwipe.listen('destroy', () => { props.onClose(); });
        photoSwipe.listen('close', () => { props.onClose(); });
      } else {
        props.onClose();
      }
    }
  }, [props, options]);

  const downloadImage = () => {
    const currentItem = props.items[activeIndexRef.current];
    downloadRef.href = `${currentItem.src}?download`;
    downloadRef.download = currentItem.name;
    downloadRef.click();
  };

  return (
    <div
      className="pswp"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
      ref={(node) => { photoSwipeRef = node; }}
    >
      <div className="pswp__bg" />
      <div className="pswp__scroll-wrap">
        <div className="pswp__container">
          <div className="pswp__item" />
          <div className="pswp__item" />
          <div className="pswp__item" />
        </div>
        <div className="pswp__ui pswp__ui--hidden">
          <div className="pswp__top-bar">
            <div className="pswp__counter" />
            <button className="pswp__button pswp__button--close" title={`${props.closeLabel} (Esc)`} />
            <a href={process.env.REACT_APP_ROCKET_CHAT_BASE_URL} className="d-none" ref={(node) => { downloadRef = node; }}>Download</a>
            <button className="pswp__button pswp__button--download" onClick={() => downloadImage()} title={props.downloadLabel}>
              <BsDownload size={20} color="#F0F0F0" />
            </button>
            <button className="pswp__button pswp__button--fs" title={props.fullScreenLabel} />
            <button className="pswp__button pswp__button--zoom" title={props.zoomLabel} />
            <div className="pswp__preloader">
              <div className="pswp__preloader__icn">
                <div className="pswp__preloader__cut">
                  <div className="pswp__preloader__donut" />
                </div>
              </div>
            </div>
          </div>
          <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div className="pswp__share-tooltip" />
          </div>
          <button className="pswp__button pswp__button--arrow--left" title="" />
          <button className="pswp__button pswp__button--arrow--right" title="" />
          <div className="pswp__caption">
            <div className="pswp__caption__center" />
          </div>
        </div>
      </div>
    </div>
  );
};

PhotoSwiper.propTypes = {
  activeIndex: PropTypes.number,
  items: PropTypes.array,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  closeLabel: PropTypes.string,
  fullScreenLabel: PropTypes.string,
  zoomLabel: PropTypes.string,
  downloadLabel: PropTypes.string
};

export default PhotoSwiper;
