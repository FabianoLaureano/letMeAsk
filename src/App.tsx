import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';
import { RoomsList } from './pages/RoomsList';
import { NotFound } from './pages/NotFound/index';

import { AuthContextProvider } from './contexts/AuthContext';
import { ThemeContextProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
      <AuthContextProvider>
        <Switch>          
          <Route path="/" exact component={Home} />

          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />

          <Route path="/admin/rooms/:id" component={AdminRoom} />

          <Route path="/rooms" component={RoomsList} />

          <Route path="*" component={NotFound} />
        </Switch>
      </AuthContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  );
}

export default App;