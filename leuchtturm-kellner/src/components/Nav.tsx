import { Link, NavLink } from 'react-router-dom';
import DirectMessage from './DirectMessage';

const Nav = () => {
  return (
    <header className='fixed w-screen z-50'>
      <nav>
        <div className='navbar bg-base-100 shadow-sm'>
          <div className='navbar-start'>
            <div className='dropdown'>
              <div tabIndex={0} role='button' className='btn btn-ghost btn-circle'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  {' '}
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h7' />{' '}
                </svg>
              </div>
              <ul
                tabIndex={0}
                className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'
              >
                <li>
                  <NavLink to={'/'}>Leuchtturm</NavLink>
                </li>
                <li>
                  <NavLink to={'/hinzufuegen'}>Eintrag Hinzufügen</NavLink>
                </li>
                <li></li>
                <li>
                  <NavLink to={'/'}>About</NavLink>
                </li>
              </ul>
            </div>
            <DirectMessage />
          </div>
          <div className='navbar-center'>
            <Link to={'/'} className='btn btn-ghost text-xl capitalize'>
              Leuchtturm
            </Link>
          </div>
          <div className='navbar-end'></div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
