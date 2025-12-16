import useSWR from "swr";

interface FleetStatus {
  available: number;
  inUse: number;
  maintenance: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch fleet status");
  return res.json();
};

export function useFleetStatus() {
  const { data, isLoading } = useSWR<{ data: FleetStatus }>(
    "/api/fleet-status",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  return {
    fleetStatus: data?.data || { available: 0, inUse: 0, maintenance: 0 },
    isLoading,
  };
}
