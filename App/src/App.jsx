import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// Remplace cette adresse par l'IP de ta machine serveur (ou localhost si même machine)
const SERVER_URL = 'http://localhost:3000';

function App() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(true);
    const [pseudo, setPseudo] = useState('');
    const pseudoInputRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(SERVER_URL);

        const handleMessage = (data) => {
            setMessages((prevMessages) => [...prevMessages, { pseudo: data.pseudo, message: data.message }]);
        };

        socketRef.current.on('chat message', handleMessage);

        return () => {
            socketRef.current.off('chat message', handleMessage);
            socketRef.current.disconnect();
        };
    }, []);

    function sendMessage(e) {
        e.preventDefault();
        if (message.trim() !== '') {
            socketRef.current.emit('chat message', { pseudo, message });
            setMessage('');
        }
    }

    const closePopup = () => {
        const pseudoValue = pseudoInputRef.current.value.trim();
        if (pseudoValue) {
            setPseudo(pseudoValue);
            setIsPopupOpen(false);
        } else {
            alert('Veuillez entrer un pseudo valide.');
        }
    };

    const Popup = ({ onClose }) => (
        <div style={popupOverlayStyles}>
            <div style={popupContentStyles}>
                <h2>Entrez votre pseudo</h2>
                <input
                    type="text"
                    ref={pseudoInputRef}
                    placeholder="Votre pseudo"
                    style={inputStyles}
                />
                <div style={buttonContainerStyles}>
                    <button onClick={onClose} style={buttonStyles}>Confirmer</button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {isPopupOpen && <Popup onClose={closePopup} />}
            {pseudo && <div style={pseudoStyles}>Pseudo : {pseudo}</div>}

            <ul style={messageListStyles}>
                {messages.map((msg, index) => (
                    <li key={index} style={messageItemStyles}>
                        <strong>{msg.pseudo} :</strong> {msg.message}
                    </li>
                ))}
            </ul>

            <form onSubmit={sendMessage} style={formStyles}>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    autoComplete="off"
                    placeholder="Votre message..."
                    style={inputStyles}
                />
                <button type="submit" style={buttonStyles}>Envoyer</button>
            </form>
        </div>
    );
}

const popupOverlayStyles = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const popupContentStyles = {
    backgroundColor: '#fff', padding: '30px 40px', borderRadius: '8px',
    textAlign: 'center', width: '300px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    color: '#333'
};

const inputStyles = {
    width: '100%', padding: '10px', marginTop: '20px',
    border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px',
    boxSizing: 'border-box', color: '#333'
};

const buttonStyles = {
    backgroundColor: '#6c63ff', color: '#fff', padding: '10px 20px',
    border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer',
    marginTop: '10px'
};

const buttonContainerStyles = { marginTop: '20px' };

const pseudoStyles = {
    position: 'fixed', top: '10px', left: '10px',
    fontSize: '18px', fontWeight: 'bold', color: '#D3D3D3'
};

const messageListStyles = {
    listStyle: 'none', padding: '20px', margin: 0,
    maxHeight: '80vh', overflowY: 'auto'
};

const messageItemStyles = {
    padding: '8px 12px', marginBottom: '8px',
    backgroundColor: '#f0f0f0', borderRadius: '8px', color: '#333'
};

const formStyles = {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    display: 'flex', gap: '10px', padding: '15px',
    backgroundColor: '#fff', borderTop: '1px solid #ddd', color: '#333'
};

export default App;