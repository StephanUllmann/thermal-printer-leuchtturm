import { NavLink } from 'react-router-dom';
import LighthouseIcon from './icons/LighthouseIcon';
import EditIcon from './icons/EditIcon';
import SettingsIcon from './icons/SettingsIcon';
import LightModeIcon from './icons/LightModeIcon';
import DarkModeIcon from './icons/DarkModeIcon';

const Dock = ({ setTheme }: { setTheme: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <footer>
      <div className='dock dock-lg'>
        <NavLink to={'hinzufuegen'} className={({ isActive }) => (isActive ? 'dock-active' : '')}>
          <EditIcon />
        </NavLink>

        <NavLink to={'/'} className={({ isActive }) => (isActive ? 'dock-active' : '')}>
          <LighthouseIcon />
        </NavLink>

        <div className='dropdown dropdown-top items-center hover:opacity-100'>
          {/* <div tabIndex={0} role='button' className='btn m-1'>
            Click ⬆️
          </div> */}
          <button className='block mx-auto h-full'>
            <SettingsIcon />
          </button>
          <ul tabIndex={0} className='dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm'>
            <li>
              <div className='dropdown dropdown-left dropdown-end '>
                <button className=''>Modus</button>
                <ul tabIndex={0} className='dropdown-content menu bg-base-100 rounded-box z-1 w-20 p-2 shadow-sm '>
                  <li>
                    <button onClick={() => setTheme('light')} className='flex justify-center'>
                      <LightModeIcon />
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setTheme('dark')} className='flex justify-center'>
                      <DarkModeIcon />
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Dock;
