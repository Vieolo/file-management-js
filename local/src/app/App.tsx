import React from 'react';
import '../style/global.scss';

// Vieolo UI
import VieoloApp from '@vieolo/vieolo-ui/dist/VieoloApp'
import HomePage from './home';

function App() {  

  return <VieoloApp 
    navbar={{
      title: "File Management JS"
    }}
    routes={[
      {path: "/", page: <HomePage />}
    ]}
  />

}

export default App;
