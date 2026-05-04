import { useQuery } from '@tanstack/react-query';

const fetchPurpleAir = async () => {
    const response = await fetch('/air/purpleair');
    if (!response.ok) {
        throw new Error('Failed to fetch PurpleAir data');
    }
    return response.json();
};

export const useGetPurpleAirData = () => {
    return useQuery({
        queryKey: ['purpleAir'],
        queryFn: fetchPurpleAir,
        refetchInterval: 15 * 60 * 1000,
    });
};
