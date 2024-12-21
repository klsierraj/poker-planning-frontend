import ActionCable from "actioncable";

const CableApp = {
  cable: ActionCable.createConsumer("ws://localhost:3000/cable"),
};

export default CableApp;
