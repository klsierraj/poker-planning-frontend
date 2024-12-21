import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

interface Participant {
  name: string;
  voted: boolean;
  vote?: string; 
}

const Room: React.FC = () => {
  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const userName = location.state?.name; 
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [voted, setVoted] = useState(false);
  const [votesRevealed, setVotesRevealed] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);


  const sendMessage = (message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket no está listo para enviar mensajes.");
    }
  };

  useEffect(() => {
    if (!userName) {
      navigate(`/enter-name/${roomCode}`);
      return;
    }

    if (!roomCode) return;

    const socket = new WebSocket("ws://localhost:3000/cable");

    socket.onopen = () => {
      console.log("WebSocket conectado.");

      sendMessage({
        command: "subscribe",
        identifier: JSON.stringify({
          channel: "RoomChannel",
          room_code: roomCode,
        }),
      });

      sendMessage({
        command: "message",
        identifier: JSON.stringify({
          channel: "RoomChannel",
          room_code: roomCode,
        }),
        data: JSON.stringify({ action: "join_room", user: userName }),
      });
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === "ping" || response.type === "welcome") return;

      const message = response.message;
      console.log("Mensaje recibido:", message);

      if (message?.action === "user_joined") {
        setParticipants(message.users || []); 
      } else if (message?.action === "user_voted") {
        setParticipants(message.users || []); 
      } else if (message?.action === "reveal_votes") {
        setParticipants(message.users || []);
        setVotesRevealed(true); 
      } else if (message?.action === "reset_votes") {
        setParticipants(message.users || []); 
        setVoted(false); 
        setVotesRevealed(false); 
      } else if (message?.action === "user_left") {
        console.log("Usuario desconectado, actualizando lista...");
        setParticipants(message.users || []);
      }
    };

    socket.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    socketRef.current = socket;

    return () => {
      socket.close(); // Close WS Unmounting
    };
  }, [roomCode, userName, navigate]);

  // Manejar voto del usuario
  const handleVote = (vote: string) => {
    sendMessage({
      command: "message",
      identifier: JSON.stringify({
        channel: "RoomChannel",
        room_code: roomCode,
      }),
      data: JSON.stringify({ action: "send_vote", user: userName, vote }),
    });
    setVoted(true);
  };

  // Reveal votes of user
  const handleRevealVotes = () => {
    sendMessage({
      command: "message",
      identifier: JSON.stringify({
        channel: "RoomChannel",
        room_code: roomCode,
      }),
      data: JSON.stringify({ action: "reveal_votes" }),
    });
  };

  // Restart votes
  const handleResetVotes = () => {
    sendMessage({
      command: "message",
      identifier: JSON.stringify({
        channel: "RoomChannel",
        room_code: roomCode,
      }),
      data: JSON.stringify({ action: "reset_votes" }),
    });
  };

  const allVoted = participants.length > 0 && participants.every((p) => p.voted);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Sala: {roomCode}</h1>
      <h2 className="text-lg text-gray-700 mb-4">Participantes</h2>
      <ul className="grid grid-cols-3 gap-4 w-full max-w-xl">
        {participants.map((participant, index) => (
          <li
            key={index}
            className={`p-4 rounded-lg shadow-md ${
              participant.voted ? "bg-green-200" : "bg-gray-200"
            }`}
          >
            <p className="font-bold text-center">{participant.name}</p>
            {votesRevealed && participant.vote && (
              <p className="text-center text-blue-500 mt-2">Voto: {participant.vote}</p>
            )}
          </li>
        ))}
      </ul>

      {/* Cartas para votar */}
      <div className="mt-8">
        {!voted && (
          <div className="flex space-x-2">
            {["1", "2", "3", "5", "8", "13", "?"].map((card) => (
              <button
                key={card}
                onClick={() => handleVote(card)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {card}
              </button>
            ))}
          </div>
        )}
        {voted && <p className="text-gray-500 mt-4">Has votado</p>}
      </div>

      {/* Botones de control */}
      <div className="flex space-x-4 mt-8">
        {allVoted && !votesRevealed && (
          <button
            onClick={handleRevealVotes}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Reveal Votes
          </button>
        )}
        <button
          onClick={handleResetVotes}
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
        >
          Start New Voting
        </button>
      </div>
    </div>
  );
};

export default Room;
