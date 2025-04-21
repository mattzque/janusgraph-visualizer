import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';
import { ACTIONS } from '@/constants';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export function ThemeToggle() {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  useEffect(() => {
    dispatch({ type: ACTIONS.SET_THEME, payload: theme });
  }, [theme]);

  return (
    <Button variant='outline' size='icon' onClick={toggleTheme}>
      {theme === 'dark' ? (
        <Sun className='h-[1.2rem] w-[1.2rem]' />
      ) : (
        <Moon className='h-[1.2rem] w-[1.2rem]' />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
