export const connectToRoom = (
    roomCode: string,
    onMessage: (data: any) => void
  ): WebSocket => {
    const socket = new WebSocket(`ws://localhost:3000/cable`);
  
    socket.onopen = () => {
      console.log("Conexión establecida con el WebSocket");
      const message = {
        command: "subscribe",
        identifier: JSON.stringify({
          channel: "RoomChannel",
          room_code: roomCode,
        }),
      };
      socket.send(JSON.stringify(message));
    };
  
    socket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
  
      if (!parsedData.identifier || !parsedData.message) return;
  
      onMessage(parsedData.message); 
    };
  
    socket.onerror = (error) => {
      console.error("Error en el WebSocket:", error);
    };
  
    return socket;
  };
  