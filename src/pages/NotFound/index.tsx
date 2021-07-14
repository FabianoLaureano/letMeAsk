import { useHistory } from "react-router-dom";

import { Button } from "../../components/Button";
import { useTheme } from "../../hooks/useTheme";
import "./styles.scss";

export function NotFound() {
  const history = useHistory();
  const {theme} = useTheme()

  return (
    <div id="page-notfound" className={theme}>
      <main>
        <div className="container">
          <h2>Error 404: Page not found!</h2>
          <Button type="submit" onClick={() => history.push("/")}>
            Voltar
          </Button>
        </div>
      </main>
    </div>
  );
}