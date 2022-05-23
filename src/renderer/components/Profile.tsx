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

const { ipc } = window.electron;

const Profile = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const profile = useSelector((state) => state.profile);

  const { username, imageHash } = profile;

  const [value, setValue] = useState(username || '');
  const [imageLink, setImageLink] = useState(
    imageHash ||
      'bafybeib4sa3coc325mb2zmhpxbvphbjqhvwxn7jl3g26m3ha5l2t54mxme/mamimi.jpeg'
  );

  const dispatch = useDispatch();
  const { setProfile } = bindActionCreators(actionCreators, dispatch);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleUpload = (event) => {
    try {
      const hash = ipc.sendSync('upload_pfp');
      if (hash == -1) {
        throw new Error('Something went wrong. try again later');
      }
      setImageLink(hash);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h2>Profile</h2>

        <input
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          placeholder="input your username"
        />

        <div className="profile-pic">
          <img
            className="pfp"
            src={`https://ipfs.io/ipfs/${imageLink}`}
            alt="pfp"
          />
          <button type="button" onClick={handleUpload}>
            upload new pic
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setProfile({
              imageHash: imageLink,
              username: value,
            });
          }}
        >
          set profile
        </button>
        <button type="button" onClick={closeModal}>
          close
        </button>
      </Modal>

      <div className="pfp-container">
        <div className="pfp">
          <img
            id="picture"
            src={`https://ipfs.io/ipfs/${
              imageHash ||
              'bafybeib4sa3coc325mb2zmhpxbvphbjqhvwxn7jl3g26m3ha5l2t54mxme/mamimi.jpeg'
            }`}
            alt="pfp"
          />
        </div>
        <div className="centered" onClick={openModal}>
          Set profile
        </div>
      </div>
    </>
  );
};

export default Profile;
