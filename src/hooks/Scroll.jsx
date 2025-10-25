import { useEffect } from 'react';

const Scroll = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};

export default Scroll;