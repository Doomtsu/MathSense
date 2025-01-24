import { create } from 'zustand';

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  isDarkMode: false,
  toggleTheme: () => set((state) => {
    const newDarkMode = !state.isDarkMode;
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: newDarkMode };
  }),
}));