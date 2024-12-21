import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EnterName: React.FC = () => {
  const { roomCode } = useParams();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Por favor, ingresa tu nombre");
      return;
    }

    navigate(`/room/${roomCode}`, { state: { name } });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Unirte a la Sala: {roomCode}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none text-black"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Unirme a la Sala
        </button>
      </div>
    </div>
  );
};

export default EnterName;
