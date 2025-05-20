import { useEffect, useRef, useState } from 'react';
import usePrinter from '../hooks/usePrinter';

const DirectMessage = () => {
  const [message, setMessage] = useState('');
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const { sendMessageToPrinter, status } = usePrinter();

  useEffect(() => {
    if (status === 'success') setMessage('');
  }, [status]);

  return (
    <>
      <button className='' onClick={() => modalRef.current?.showModal()}>
        Direktnachricht
      </button>
      <dialog
        ref={modalRef}
        className='top-[50vh] left-[50vw] -translate-1/2 min-w-1/2 px-3 py-2 border rounded bg-transparent backdrop-blur-3xl'
      >
        <div className=' '>
          <h3 className='font-bold text-lg'>Direktnachricht an die Küche</h3>
          <textarea
            placeholder=''
            className='textarea textarea-lg w-full min-h-[5lh]'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          {/* <button
            onClick={() =>
              toast('✅', {
                autoClose: 200,
                pauseOnHover: false,
                className: '!w-16 p-0 m-0',
                closeButton: false,
              })
            }
          >
            Toast
          </button> */}
          <div className='modal-action'>
            <form method='dialog' onSubmit={() => sendMessageToPrinter(message)}>
              <button className='btn-success btn'>Senden</button>
            </form>
            <form method='dialog' onSubmit={() => setMessage('')}>
              <button className='btn-warning btn'>Schließen</button>
            </form>
          </div>
        </div>
        {/* <div>
          <button className='modal-backdrop' onClick={() => modalRef.current?.close()}>
            Close
          </button>
        </div> */}
      </dialog>
    </>
  );
};

export default DirectMessage;
