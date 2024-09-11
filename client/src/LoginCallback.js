import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      localStorage.setItem('jwtToken', token);
      navigate('/');
    } else {
      console.error('Failed to receive token');
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default LoginCallback;
