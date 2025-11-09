import React, { useState } from 'react';
import { Popup } from './components/Popup';

const App: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center justify-center text-gray-800 font-sans p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">Benvenuto nella mia App!</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          Questa è una semplice applicazione di test. Se hai chiuso il popup, puoi ricaricare la pagina per vederlo di nuovo o cliccare il bottone qui sotto.
        </p>
        {!isPopupOpen && (
          <button
            onClick={() => setIsPopupOpen(true)}
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
          >
            Apri di Nuovo il Popup
          </button>
        )}
      </div>

      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title="Ciao!"
      >
        <p>Questo è un popup che appare all'apertura dell'applicazione.</p>
        <p className="mt-4">Clicca sulla X o fuori da questo riquadro per chiuderlo.</p>
      </Popup>
    </main>
  );
};

export default App;