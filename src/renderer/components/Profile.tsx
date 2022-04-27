import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useState } from 'react';
import { actionCreators } from '../state/actionCreators';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '60vh',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflowWrap: 'break-word',
  },
};

Modal.setAppElement('#root');

const Profile = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  const dispatch = useDispatch();
  const { setProfile } = bindActionCreators(actionCreators, dispatch);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Profile</h2>

        <form>
          <div className="profile-pic">
            <img
              id="pfp"
              src="https://ipfs.io/ipfs/bafybeiepwqesubkeths5n3uinxrq2ngulbdbsqrxxo33uiludsnbwten6y/milady.jpeg"
              alt="pfp"
            />
            <button type="button">upload new pic</button>
          </div>
          <input value={value} onChange={(evt) => setValue(evt.target.value)} />

          <button
            type="button"
            onClick={() => {
              setProfile({
                imageHash: hash,
                username: value,
              });
            }}
          >
            set profile
          </button>

          <button type="button" onClick={closeModal}>
            close
          </button>
        </form>
      </Modal>

      <div>
        <img
          id="pfp"
          src="https://ipfs.io/ipfs/bafybeiepwqesubkeths5n3uinxrq2ngulbdbsqrxxo33uiludsnbwten6y/milady.jpeg"
          alt="pfp"
        />
        <button id="key" type="button" onClick={openModal}>
          Set profile
        </button>
      </div>
    </>
  );
};

export default Profile;
