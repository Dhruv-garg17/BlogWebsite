import React, { useState } from 'react';
import { verifyEmail } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [form, setForm] = useState({ email: '', otp: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await verifyEmail(form);
      setMessage(res.data.msg);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Verification failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Verify Email</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="otp" placeholder="OTP" onChange={handleChange} />
      <button type="submit">Verify</button>
      <p>{message}</p>
    </form>
  );
}
