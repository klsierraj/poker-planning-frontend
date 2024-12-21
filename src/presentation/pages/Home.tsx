import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!name.trim()) {
      alert("Por favor, ingresa tu nombre");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error al crear la sala");

      const { room_code } = await response.json();
      navigate(`/room/${room_code}`, { state: { name } });
    } catch (error) {
      console.error(error);
      alert("Error al crear la sala. Intenta de nuevo.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Poker Planning</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none text-black"
        />
        <button
          onClick={handleCreateRoom}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Crear Sala
        </button>
      </div>
    </div>
  );
};

export default Home;
