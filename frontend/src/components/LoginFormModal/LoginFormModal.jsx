import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const isButtonDisabled = credential.length < 4 || password.length < 6;


  return (
    <div className="form">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label className="labels">
          Username or Email
          <input
            className="newInput"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='labels'>
          Password
          <input
            className="newInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button className='btn' type="submit" disabled={isButtonDisabled}>
          Log In
        </button>
        <button className='btn'
          type="submit"
          onClick={() => {
            setCredential("demo@user.io");
            setPassword("password");
          }}
        >
          {" "}
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
