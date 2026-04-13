import { createServer } from "http";
import { Server } from "socket.io";

// Création du serveur HTTP et du serveur Socket.IO par-dessus
// cors: "*" autorise toutes les origines (utile en développement)
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

// Chaque fois qu'un utilisateur se connecte, on reçoit son socket (son tuyau de communication)
// On écoute ses messages et on les redistribue à tous les utilisateurs connectés via io.emit
io.on('connection', (socket) => {
    console.log('Un utilisateur vient de se connecter');

    socket.on('chat message', (data) => {
        if (data.pseudo && data.message) {
            console.log(data);
            io.emit('chat message', data);
        }
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});

// Démarrage du serveur sur le port 3000 (ou celui défini dans les variables d'environnement)
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
