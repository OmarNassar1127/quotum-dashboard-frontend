import React, { useState, useEffect } from "react";
import {
  Info,
  Smartphone,
  Laptop,
  Monitor,
  Trash2,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import axios from "../../lib/axios";

// Custom Modal Component
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

// Device Limit Dialog Component
export const DeviceLimitDialog = ({ open, onClose }) => {
  const handleEmailClick = () => {
    window.location.href = "mailto:quotum.consulting@gmail.com";
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">
            Device Limit Reached
          </h2>
        </div>
        <div className="text-gray-400 space-y-4">
          <p>
            To enhance security and prevent account sharing, we limit each
            account to 2 devices.
          </p>
          <p>
            If you need to use this device, please email us at{" "}
            <button
              onClick={handleEmailClick}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              quotum.consulting@gmail.com
            </button>{" "}
            and we'll help you manage your devices.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-[#333] text-white rounded-md hover:bg-[#333]"
        >
          Cancel
        </button>
        <button
          onClick={handleEmailClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Contact Support
        </button>
      </div>
    </Modal>
  );
};

// Device Card Component
const DeviceCard = ({ device, onRemove }) => {
  const getDeviceIcon = (userAgent) => {
    if (userAgent.toLowerCase().includes("mobile")) return Smartphone;
    if (userAgent.toLowerCase().includes("tablet")) return Monitor;
    return Laptop;
  };

  const DeviceIcon = getDeviceIcon(device.user_agent);

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <DeviceIcon className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-white mb-1">
              {device.user_agent.split(" ")[0]}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{device.ip_address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <Clock className="h-4 w-4" />
              <span>
                Last active:{" "}
                {new Date(device.last_login_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onRemove(device.id)}
          className="p-2 hover:bg-red-500/10 rounded-lg group transition-colors"
        >
          <Trash2 className="h-5 w-5 text-gray-400 group-hover:text-red-400" />
        </button>
      </div>
    </div>
  );
};

// Remove Device Dialog Component
const RemoveDeviceDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Remove Device?
        </h2>
        <p className="text-gray-400">
          This will remove the device from your account. You'll need to log in
          again if you want to use this device.
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-[#333] text-white rounded-md hover:bg-[#333]"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Remove Device
        </button>
      </div>
    </Modal>
  );
};

// Main Device Management Page Component
export const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await axios.get("/devices");
      setDevices(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load devices");
      setLoading(false);
    }
  };

  const handleRemoveDevice = async () => {
    try {
      await axios.delete(`/devices/${selectedDeviceId}`);
      setDevices(devices.filter((device) => device.id !== selectedDeviceId));
      setRemoveDialogOpen(false);
    } catch (err) {
      setError("Failed to remove device");
    }
  };

  const initiateRemoveDevice = (deviceId) => {
    setSelectedDeviceId(deviceId);
    setRemoveDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[#333] rounded w-1/4"></div>
          <div className="h-32 bg-[#333] rounded"></div>
          <div className="h-32 bg-[#333] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">
          Device Management
        </h2>
        <p className="text-gray-400 mb-6">
          You can connect up to 2 devices to your account
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-300/10 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onRemove={initiateRemoveDevice}
            />
          ))}
        </div>

        {devices.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No devices connected yet</p>
          </div>
        )}

        <RemoveDeviceDialog
          open={removeDialogOpen}
          onClose={() => setRemoveDialogOpen(false)}
          onConfirm={handleRemoveDevice}
        />
      </div>
    </div>
  );
};

export default DeviceManagement;
