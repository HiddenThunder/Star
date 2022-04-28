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

const Key = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  const key: string | null = useSelector((state) => state.channel.key);
  const channel = useSelector((state) => state.channel);

  const dispatch = useDispatch();
  const { setChannel, setChannelKey } = bindActionCreators(
    actionCreators,
    dispatch
  );

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
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>

        {key ? <h3>Key: {key} </h3> : <h3>key is not setted</h3>}
        {!channel.p2p ? (
          <>
            <div className="overflow">Insert private key here</div>
            <form>
              <input
                value={value}
                onChange={(evt) => setValue(evt.target.value)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    if (value.length) {
                      setChannelKey(
                        {
                          topic: channel.topic,
                          key: value,
                        },
                        channel.topic
                      );
                      setChannel({ topic: channel.topic, key: value });
                      setValue('');
                    }
                  }
                }}
              />

              <button
                type="button"
                onClick={() => {
                  setChannelKey(
                    {
                      topic: channel.topic,
                      key: value,
                    },
                    channel.topic
                  );
                  setChannel({ topic: channel.topic, key: value });
                  setValue('');
                }}
              >
                set
              </button>

              <button type="button" onClick={closeModal}>
                close
              </button>
            </form>
          </>
        ) : (
          <button type="button" onClick={closeModal}>
            close
          </button>
        )}
      </Modal>

      <button id="key" type="button" onClick={openModal}>
        Set key
      </button>
    </>
  );
};

export default Key;
