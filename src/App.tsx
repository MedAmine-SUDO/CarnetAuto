import { StoreProvider, useStore } from './lib/store';
import { NavProvider } from './lib/navigation';
import Onboarding from './pages/Onboarding';
import Main from './pages/Main';

function Root() {
  const { state } = useStore();
  return state.onboarded && state.car ? <Main /> : <Onboarding />;
}

export default function App() {
  return (
    <StoreProvider>
      <NavProvider>
        <Root />
      </NavProvider>
    </StoreProvider>
  );
}
