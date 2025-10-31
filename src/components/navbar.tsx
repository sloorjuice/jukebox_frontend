'use client';

import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('Select Device');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const devices = ['Built-in Speaker', 'Bluetooth Headphones', 'USB Audio'];

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    return (
        <nav className="w-full py-4 bg-white dark:bg-gray-900 border-b sticky top-0 z-50">
            <div className="max-w-auto mx-auto px-4 relative h-16 flex items-center">
                {/* Left: sound device + dropdown + refresh */}
                <div className="absolute left-4 flex items-end gap-2">
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">sound device</div>
                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-between w-48 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <span>{selected}</span>
                                <span className="ml-2">▼</span>
                            </button>
                            {isOpen && (
                                <div className="absolute mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                                    {devices.map((device) => (
                                        <button
                                            key={device}
                                            onClick={() => {
                                                setSelected(device);
                                                setIsOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {device}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Refresh devices"
                    >
                        <svg
                            className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                </div>

                {/* Center: title */}
                <div className="mx-auto text-center">
                    <span className="text-5xl font-semibold">Jukebox</span>
                </div>
            </div>
        </nav>
    );
}