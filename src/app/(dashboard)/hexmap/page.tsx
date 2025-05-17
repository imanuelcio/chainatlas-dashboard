"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
// import { hexmapAPI } from "@/lib/api";
import { HexLocation } from "@/types/hexmap";
import toast from "react-hot-toast";

// Define Hex grid constants
const HEX_SIZE = 40; // Size of hexagons
const HEX_SPACING = 4; // Spacing between hexagons
const GRID_WIDTH = 10; // Number of hexagons in a row
const GRID_HEIGHT = 10; // Number of hexagons in a column

export default function HexMapPage() {
  const [locations, setLocations] = useState<HexLocation[]>([]);
  const [userLocations, setUserLocations] = useState<HexLocation[]>([]);
  const [selectedHex, setSelectedHex] = useState<{
    q: number;
    r: number;
    s: number;
  } | null>(null);
  const [hexName, setHexName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     setIsLoading(true);
  //     try {
  //       // Fetch all hex locations
  //       const allLocationsResponse = await hexmapAPI.getAllHexLocations();
  //       setLocations(allLocationsResponse.locations);

  //       // Fetch user's hex locations
  //       const userLocationsResponse = await hexmapAPI.getUserHexLocations();
  //       setUserLocations(userLocationsResponse.locations);
  //     } catch (error) {
  //       console.error("Error fetching hex locations:", error);
  //       toast.error("Failed to load hex map data");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchLocations();
  // }, []);

  // Generate cube coordinates for hex grid
  const generateHexGrid = () => {
    const grid = [];

    for (
      let q = -Math.floor(GRID_WIDTH / 2);
      q <= Math.floor(GRID_WIDTH / 2);
      q++
    ) {
      for (
        let r = -Math.floor(GRID_HEIGHT / 2);
        r <= Math.floor(GRID_HEIGHT / 2);
        r++
      ) {
        const s = -q - r;

        // Limit to a circular/hexagonal shape rather than a rectangle
        if (Math.abs(q) + Math.abs(r) + Math.abs(s) <= GRID_WIDTH) {
          grid.push({ q, r, s });
        }
      }
    }

    return grid;
  };

  // Convert cube coordinates to screen coordinates
  const hexToPixel = (q: number, r: number) => {
    const x = HEX_SIZE * ((3 / 2) * q);
    const y = HEX_SIZE * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
    return { x, y };
  };

  // Get the points for drawing a hexagon
  const getHexPoints = (centerX: number, centerY: number) => {
    const points = [];

    for (let i = 0; i < 6; i++) {
      const angleDeg = 60 * i - 30;
      const angleRad = (Math.PI / 180) * angleDeg;
      const x = centerX + (HEX_SIZE - HEX_SPACING) * Math.cos(angleRad);
      const y = centerY + (HEX_SIZE - HEX_SPACING) * Math.sin(angleRad);
      points.push(`${x},${y}`);
    }

    return points.join(" ");
  };

  // Check if a hex is claimed
  const isHexClaimed = (q: number, r: number, s: number) => {
    return locations.some(
      (loc) =>
        loc.coordinates.q === q &&
        loc.coordinates.r === r &&
        loc.coordinates.s === s
    );
  };

  // Get owner of a hex
  const getHexOwner = (q: number, r: number, s: number) => {
    return locations.find(
      (loc) =>
        loc.coordinates.q === q &&
        loc.coordinates.r === r &&
        loc.coordinates.s === s
    )?.owner;
  };

  // Get hex name if it has one
  const getHexName = (q: number, r: number, s: number) => {
    return locations.find(
      (loc) =>
        loc.coordinates.q === q &&
        loc.coordinates.r === r &&
        loc.coordinates.s === s
    )?.name;
  };

  // Check if a hex is owned by current user
  const isHexOwnedByUser = (q: number, r: number, s: number) => {
    return userLocations.some(
      (loc) =>
        loc.coordinates.q === q &&
        loc.coordinates.r === r &&
        loc.coordinates.s === s
    );
  };

  // Get color for hex based on ownership
  const getHexColor = (q: number, r: number, s: number) => {
    if (
      selectedHex &&
      selectedHex.q === q &&
      selectedHex.r === r &&
      selectedHex.s === s
    ) {
      return "stroke-blue-500 fill-blue-200 dark:fill-blue-900";
    }

    if (isHexOwnedByUser(q, r, s)) {
      return "stroke-blue-500 fill-blue-800 fill-opacity-60";
    }

    if (isHexClaimed(q, r, s)) {
      return "stroke-purple-500 fill-purple-800 fill-opacity-40";
    }

    return "stroke-gray-400 fill-gray-200 dark:fill-gray-700 hover:fill-gray-400 dark:hover:fill-gray-600 hover:fill-opacity-20";
  };

  // Handle hex click
  const handleHexClick = (q: number, r: number, s: number) => {
    if (isHexClaimed(q, r, s)) {
      // If already claimed, show info
      const owner = getHexOwner(q, r, s);
      const name = getHexName(q, r, s);

      if (owner) {
        toast.success(
          `${name || "This hex"} is claimed by ${owner.username || "Unknown"}`
        );
      }
    } else {
      // If not claimed, select for claiming
      setSelectedHex({ q, r, s });
      setHexName("");
      setShowModal(true);
    }
  };

  // Handle claim submission
  // const handleClaimHex = async () => {
  //   if (!selectedHex) return;

  //   setIsClaiming(true);
  //   try {
  //     const hexId = `Q${selectedHex.q}R${selectedHex.r}S${selectedHex.s}`;

  //     await hexmapAPI.claimHexLocation({
  //       hex_id: hexId,
  //       coordinates: selectedHex,
  //       name: hexName.trim() || `Hex ${hexId}`,
  //     });

  //     toast.success("Hex claimed successfully!");

  //     // Refresh data
  //     const allLocationsResponse = await hexmapAPI.getAllHexLocations();
  //     setLocations(allLocationsResponse.locations);

  //     const userLocationsResponse = await hexmapAPI.getUserHexLocations();
  //     setUserLocations(userLocationsResponse.locations);

  //     // Close modal
  //     setShowModal(false);
  //     setSelectedHex(null);
  //   } catch (error) {
  //     console.error("Error claiming hex:", error);
  //     toast.error("Failed to claim hex");
  //   } finally {
  //     setIsClaiming(false);
  //   }
  // };

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  // Handle map dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Hex Map</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Claim your space in our community map and connect with others
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
        <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Hex Map</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              disabled={zoomLevel <= 0.5}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              disabled={zoomLevel >= 2}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="relative overflow-hidden" style={{ height: "600px" }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2">Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-blue-800 bg-opacity-60 border border-blue-500 mr-2"></div>
                    <span className="text-sm">Your claimed hex</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-purple-800 bg-opacity-40 border border-purple-500 mr-2"></div>
                    <span className="text-sm">Claimed by others</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 border border-gray-400 mr-2"></div>
                    <span className="text-sm">Unclaimed hex</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>Click on an unclaimed hex to claim it.</p>
                  <p>Click on a claimed hex to see owner info.</p>
                </div>
              </div>

              <div
                ref={mapRef}
                className="absolute inset-0 cursor-grab overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="-600 -600 1200 1200"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                    transformOrigin: "center",
                    transition: isDragging ? "none" : "transform 0.3s ease",
                  }}
                >
                  <g>
                    {generateHexGrid().map(({ q, r, s }) => {
                      const { x, y } = hexToPixel(q, r);
                      const points = getHexPoints(x, y);
                      const hexColor = getHexColor(q, r, s);
                      const owner = getHexOwner(q, r, s);
                      const name = getHexName(q, r, s);

                      return (
                        <g
                          key={`${q},${r},${s}`}
                          onClick={() => handleHexClick(q, r, s)}
                          className="cursor-pointer transition-colors duration-300"
                        >
                          <polygon points={points} className={hexColor} />

                          {/* Display hex coordinates or name */}
                          {isHexClaimed(q, r, s) && name ? (
                            <text
                              x={x}
                              y={y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-xs font-medium fill-white pointer-events-none"
                              style={{ fontSize: "8px" }}
                            >
                              {name}
                            </text>
                          ) : (
                            <text
                              x={x}
                              y={y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-xs fill-gray-500 opacity-50 pointer-events-none"
                              style={{ fontSize: "6px" }}
                            >
                              {q},{r}
                            </text>
                          )}

                          {/* Add avatar or initials for claimed hexes */}
                          {owner && (
                            <g>
                              <circle
                                cx={x}
                                cy={y - 15}
                                r={7}
                                className="fill-blue-500 stroke-white"
                              />
                              <text
                                x={x}
                                y={y - 13}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xs font-bold fill-white pointer-events-none"
                                style={{ fontSize: "8px" }}
                              >
                                {owner.username
                                  ? owner.username[0].toUpperCase()
                                  : "?"}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Your claimed hexes */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Your Claimed Hexes</h2>

        {userLocations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-blue-800 bg-opacity-60 border border-blue-500 rounded-md flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {location.name || `Hex ${location.hex_id}`}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Coordinates: {location.coordinates.q},{" "}
                      {location.coordinates.r}, {location.coordinates.s}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    Claimed on:{" "}
                    {new Date(location.claimed_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      // Find this hex on the map
                      setPosition({ x: 0, y: 0 }); // Reset position
                      setZoomLevel(1.5); // Zoom in

                      // Highlight this hex
                      setSelectedHex({
                        q: location.coordinates.q,
                        r: location.coordinates.r,
                        s: location.coordinates.s,
                      });

                      // Scroll to map
                      mapRef.current?.scrollIntoView({ behavior: "smooth" });

                      // After a delay, clear the selection
                      setTimeout(() => {
                        setSelectedHex(null);
                      }, 2000);
                    }}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Find on Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="inline-flex rounded-full p-6 mb-6 bg-white dark:bg-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">No claimed hexes yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Claim a hex on the map above to stake your place in our community!
            </p>
          </div>
        )}
      </div>

      {/* Claim Hex Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Claim Hex</h3>

            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You are about to claim a hex at coordinates {selectedHex?.q},{" "}
              {selectedHex?.r}, {selectedHex?.s}.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="hexName"
                  className="block text-sm font-medium mb-1"
                >
                  Hex Name (optional)
                </label>
                <input
                  type="text"
                  id="hexName"
                  placeholder="Enter a name for your hex"
                  value={hexName}
                  onChange={(e) => setHexName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={50}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedHex(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isClaiming}
                >
                  Cancel
                </button>
                <button
                  // onClick={handleClaimHex}
                  disabled={isClaiming}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                >
                  {isClaiming ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Claiming...
                    </div>
                  ) : (
                    "Claim Hex"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
