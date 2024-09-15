export interface Bridge {
  id: number;
  statuses: BridgeStatuses;
  firmware2: string;
  pairedDevices: 0;
}

export interface BridgeStatuses {
  isConnected: boolean;
  deviceSoftwareUpdateAvailable: false;
  wiFiSoftwareUpdateAvailable: false;
}

export interface UpdateBridgeName {
  id: number;
  name: string;
}
