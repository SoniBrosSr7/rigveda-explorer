import { useState, useEffect } from 'react';

export const useRigvedaData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/data/rigveda_with_translation.json');
                if (!response.ok) throw new Error('Failed to load data');
                const rigvedaData = await response.json();
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
