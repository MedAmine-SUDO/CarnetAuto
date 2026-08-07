import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { App } from '@capacitor/app';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';

export type Tab = 'home' | 'maintenance' | 'fuel' | 'settings';
export type SettingsScreen = 'main' | 'notifications' | 'specs' | 'country';

interface NavApi {
  tab: Tab;
  settingsScreen: SettingsScreen;
  setTab: (tab: Tab) => void;
  setSettingsScreen: (screen: SettingsScreen) => void;
  /** Handles the back action. Returns true if the back was consumed by the app. */
  goBack: () => boolean;
}

const NavContext = createContext<NavApi | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [tab, setTabState] = useState<Tab>('home');
  const [settingsScreen, setSettingsScreen] = useState<SettingsScreen>('main');

  const stateRef = useRef({ tab, settingsScreen });
  stateRef.current = { tab, settingsScreen };

  const setTab = (next: Tab) => {
    setTabState(next);
    setSettingsScreen('main');
  };

  const goBack = (): boolean => {
    const { tab: curTab, settingsScreen: curScreen } = stateRef.current;
    if (curScreen !== 'main') {
      setSettingsScreen('main');
      return true;
    }
    if (curTab !== 'home') {
      setTab('home');
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let handle: PluginListenerHandle | undefined;
    try {
      const p = App.addListener('backButton', () => {
        if (!goBack()) {
          void App.exitApp();
        }
      });
      if (typeof (p as { then?: unknown }).then === 'function') {
        void (p as Promise<PluginListenerHandle>).then((h) => {
          handle = h;
        });
      } else {
        handle = p as unknown as PluginListenerHandle;
      }
    } catch {
      // plugin unavailable — ignore
    }
    return () => {
      try {
        handle?.remove();
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <NavContext.Provider value={{ tab, settingsScreen, setTab, setSettingsScreen, goBack }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav(): NavApi {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used inside NavProvider');
  return ctx;
}
