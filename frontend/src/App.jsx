import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import SpotDetails from './components/SpotDetails/SpotDetails';
import ShowImages from './components/ShowImages/ShowImages';
import CreateForm from './components/CreateSpot/SpotForm';
import ManageSpot from './components/ManageSpot/ManageSpot';
import DeleteSpot from './components/ManageSpot/DeleteSpot';
// import ShowImages from './components/ShowImages/ShowImages';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />


      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <SpotDetails />,
      },
      {
        path: "/spots/:spotId",
        element: <ShowImages />,
      },
      {
        path: "/spots/new",
        element: <CreateForm />,
      },
      {
        path: "/spots/current",
        element: <ManageSpot />,
      },
      {
        path: "/spots/:spotId/edit",
        element: <CreateForm />,
      },
      {
        path: "/spots/:spotId/delete",
        element: <DeleteSpot />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
