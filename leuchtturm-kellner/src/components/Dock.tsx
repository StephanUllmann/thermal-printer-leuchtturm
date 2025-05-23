import { NavLink } from 'react-router-dom';
import LighthouseIcon from './icons/LighthouseIcon';
import EditIcon from './icons/EditIcon';
import SettingsIcon from './icons/SettingsIcon';

const Dock = () => {
  return (
    <footer>
      <div className='dock dock-lg'>
        <NavLink to={'hinzufuegen'} className={({ isActive }) => (isActive ? 'dock-active' : '')}>
          <EditIcon />
        </NavLink>

        <NavLink to={'/'} className={({ isActive }) => (isActive ? 'dock-active' : '')}>
          <LighthouseIcon />
        </NavLink>

        <button>
          <SettingsIcon />
        </button>
      </div>
    </footer>
  );
};

export default Dock;
