import { useState, useEffect } from 'react';

function base64ToUtf8(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
}

export const useRigvedaData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/data/rigveda-encoded.txt');
                if (!response.ok) throw new Error('Failed to load data');
                const encoded = await response.text();
                // Properly decode base64 UTF-8 string
                const jsonString = base64ToUtf8(encoded);
                const rigvedaData = JSON.parse(jsonString);
                setData(rigvedaData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return { data, loading, error };
};
