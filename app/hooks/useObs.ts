import { createModel } from 'hox';
import OBSWebSocket from 'obs-websocket-js';

function useObs() {
  const obs = new OBSWebSocket();
  return {
    obs,
  };
}

export default createModel(useObs);
