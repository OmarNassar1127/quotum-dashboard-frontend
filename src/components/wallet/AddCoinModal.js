import React, { useState, useEffect } from "react";
import { Loader, X } from "lucide-react";
import axios from "../../lib/axios";

const AddCoinModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    coingecko_link: "",
    coingecko_id: "",
    name: "",
    symbol: "",
    image: "",
  });
  const [smartContracts, setSmartContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  // Debug log whenever smartContracts changes
  useEffect(() => {
    console.log("Smart Contracts Updated:", smartContracts);
  }, [smartContracts]);

  const chainConfig = {
    ethereum: 1,
    bsc: 56,
    polygon: 137,
  };

  const getChainId = (chainName) => {
    return chainConfig[chainName] || null;
  };

  const platformMapping = {
    ethereum: { chain: "ethereum", chain_id: 1 },
    "binance-smart-chain": { chain: "bsc", chain_id: 56 },
    "polygon-pos": { chain: "polygon", chain_id: 137 },
  };

  const chains = [
    { chain: "ethereum", chain_id: 1 },
    { chain: "bsc", chain_id: 56 },
    { chain: "polygon", chain_id: 137 },
  ];

  const fetchCoinData = async () => {
    const coingeckoId = formData.coingecko_link
      .split("/")
      .filter((part) => part)
      .pop();
    setFetching(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coingeckoId}`
      );
      const { name, symbol, image, id, platforms } = response.data;
      console.log("Fetched platforms:", platforms);

      const prepopulatedContracts = Object.entries(platforms)
        .map(([platform, contractAddress]) => {
          const chainData = platformMapping[platform];
          if (chainData) {
            const contract = {
              chain: chainData.chain,
              chain_id: chainData.chain_id,
              contract_address: contractAddress,
            };
            console.log("Created contract:", contract);
            return contract;
          }
          return null;
        })
        .filter((contract) => contract !== null);

      console.log("Prepopulated contracts:", prepopulatedContracts);

      setFormData({
        ...formData,
        name,
        symbol: symbol.toUpperCase(),
        image: image.large,
        coingecko_id: id,
      });

      setSmartContracts(prepopulatedContracts);
      setError(null);
    } catch (err) {
      console.error("Error fetching coin data:", err);
      setError("Failed to fetch coin data. Please check the CoinGecko link.");
    } finally {
      setFetching(false);
    }
  };

  const handleAddContract = () => {
    const newContract = {
      chain: "ethereum",
      chain_id: 1,
      contract_address: "",
    };
    console.log("Adding new contract:", newContract);
    setSmartContracts((prevContracts) => [...prevContracts, newContract]);
  };

  const handleRemoveContract = (index) => {
    setSmartContracts((prevContracts) =>
      prevContracts.filter((_, i) => i !== index)
    );
  };

  const handleContractChange = (index, field, value) => {
    console.log(`Changing contract ${index}, field: ${field}, value: ${value}`);

    setSmartContracts((prevContracts) => {
      const updatedContracts = [...prevContracts];

      if (field === "chain") {
        const chain_id = getChainId(value);
        console.log(`Found chain_id for ${value}:`, chain_id);

        updatedContracts[index] = {
          ...updatedContracts[index],
          chain: value,
          chain_id: chain_id,
        };
      } else {
        updatedContracts[index] = {
          ...updatedContracts[index],
          [field]: value,
        };
      }

      console.log("Updated contract:", updatedContracts[index]);
      return updatedContracts;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem("user_id");

    // Ensure chain_ids are present and are integers
    const formattedContracts = smartContracts.map((contract) => {
      const chain_id =
        typeof contract.chain_id === "number"
          ? contract.chain_id
          : getChainId(contract.chain);

      return {
        ...contract,
        chain_id,
      };
    });

    console.log("Submitting contracts:", formattedContracts);

    try {
      const payload = {
        user_id: userId,
        coin_id: formData.coingecko_id,
        name: formData.name,
        symbol: formData.symbol,
        image_url: formData.image,
        coingecko_link: formData.coingecko_link,
        smart_contracts: formattedContracts,
      };

      console.log("Final payload:", payload);

      const response = await axios.post("/user/coins/add", payload);
      onSuccess(response.data);
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        err.response?.data?.message || "Failed to add coin. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#222] border border-[#333] rounded-xl p-6 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-gray-100"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-100">Add New Coin</h2>
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-300 mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">
              CoinGecko Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={formData.coingecko_link}
                onChange={(e) =>
                  setFormData({ ...formData, coingecko_link: e.target.value })
                }
                className="w-full bg-[#333] border border-[#444] rounded-lg p-2 text-gray-100"
                placeholder="Enter CoinGecko Link"
                required
              />
              <button
                type="button"
                onClick={fetchCoinData}
                className="bg-blue-500 text-gray-100 px-4 py-2 rounded-lg hover:bg-blue-600"
                disabled={fetching}
              >
                {fetching ? (
                  <Loader className="animate-spin w-5 h-5" />
                ) : (
                  "Fetch"
                )}
              </button>
            </div>
          </div>
          {formData.name && (
            <>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  readOnly
                  className="w-full bg-[#333] border border-[#444] rounded-lg p-2 text-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Symbol
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  readOnly
                  className="w-full bg-[#333] border border-[#444] rounded-lg p-2 text-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Image
                </label>
                <img
                  src={formData.image}
                  alt="Coin"
                  className="h-16 w-16 rounded-full border border-[#444]"
                />
              </div>
            </>
          )}
          {smartContracts.map((contract, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">
                Smart Contract {index + 1}
              </label>
              <div className="flex gap-2">
                <select
                  value={contract.chain}
                  onChange={(e) =>
                    handleContractChange(index, "chain", e.target.value)
                  }
                  className="w-1/3 bg-[#333] border border-[#444] rounded-lg p-2 text-gray-100"
                >
                  {chains.map((chain) => (
                    <option key={chain.chain_id} value={chain.chain}>
                      {chain.chain}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={contract.contract_address}
                  onChange={(e) =>
                    handleContractChange(
                      index,
                      "contract_address",
                      e.target.value
                    )
                  }
                  className="w-2/3 bg-[#333] border border-[#444] rounded-lg p-2 text-gray-100"
                  placeholder="Enter Contract Address"
                  required
                />
                {smartContracts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveContract(index)}
                    className="text-red-500 border border-red-500 rounded-lg px-2 hover:bg-red-500/20"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddContract}
            className="text-blue-500 border border-blue-500 rounded-lg px-4 py-1 hover:bg-blue-500/20 mb-4"
          >
            Add Another Contract
          </button>
          <button
            type="submit"
            className="w-full bg-blue-500 text-gray-100 py-2 rounded-lg mt-2"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin w-5 h-5" /> : "Add Coin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCoinModal;
