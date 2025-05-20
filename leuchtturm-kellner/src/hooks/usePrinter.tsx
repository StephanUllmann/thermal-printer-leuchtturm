import { useState } from 'react';
import { toast } from 'react-toastify';

const BASE_API_URL = 'http://localhost:3000';

const usePrinter = () => {
  const [status, setStatus] = useState<'unset' | 'success' | 'error'>('unset');

  async function sendMessageToPrinter(text: string) {
    setStatus('unset');
    try {
      const res = await fetch(`${BASE_API_URL}/print`, {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Res not ok', { cause: res });
      // const data = await res.json();
      // console.log(data);
      setStatus('success');
      toast('✅', {
        autoClose: 200,
        pauseOnHover: false,
        className: '!w-16 p-0 m-0',
        closeButton: false,
      });
    } catch (error: unknown) {
      console.dir(error);
      toast.error('Senden fehlgeschlagen');
      setStatus('error');
    }
  }

  return { sendMessageToPrinter, status };
};

export default usePrinter;
