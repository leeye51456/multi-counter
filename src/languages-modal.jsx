import React from 'react';
import ReactModal from 'react-modal';
import { withTranslation } from 'react-i18next';
import { setLanguage } from './local-storage-manager';
import languages from './locales/supported.json';
import icons from './icons';

class LanguagesModal extends React.Component {
  handleLanguageButtonClick = (event) => {
    event.preventDefault();

    if (event.target.hasAttribute('data-lang')) {
      setLanguage(event.target.getAttribute('data-lang'));
      this.props.onCancel();
      window.location.reload();
    } else {
      window.alert(this.props.t('modal.languages-error'));
      this.props.onCancel();
    }
  }

  handleCancelClick = (event) => {
    event.preventDefault();
    this.props.onCancel();
  }

  render = () => {
    const { t } = this.props;
    const modalTitle = t('modal.title.languages');

    const languageListElements = languages.map((lang) => (
      <li
        key={lang.code}
        className="language-list"
      >
        <button
          type="button"
          data-lang={lang.code}
          onClick={this.handleLanguageButtonClick}
          className="language-button"
        >
          {
            lang.name.english === lang.name.native
              ? lang.name.english
              : `${lang.name.english} (${lang.name.native})`
          }
        </button>
      </li>
    ));

    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onCancel}
        contentLabel={modalTitle}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h1>
          {modalTitle}
        </h1>

        <hr />

        <ul>
          {languageListElements}
        </ul>

        <hr />

        <ul className="modal-actions">
          <li>
            <button
              type="button"
              onClick={this.handleCancelClick}
              className="action-button button-negative"
            >
              <img
                src={icons.close}
                alt={t('modal.cancel')}
                width={24}
                height={24}
              />
            </button>
          </li>
        </ul>

      </ReactModal>
    );
  }
}

export default withTranslation()(LanguagesModal);
