export const createRoom = async (): Promise<string> => {
    const response = await fetch("http://localhost:3000/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Error al crear la sala");
    }
  
    const { room_code } = await response.json();

    if (!/^[a-z0-9]{6}$/.test(room_code)) {
      throw new Error("Room code inválido recibido del servidor");
    }
  
    return room_code;
  };
  
  