// Office ----------------------------------------------
export interface WorkingTime {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  isOpen: boolean;
  startTime?: string;
  endTime?: string;
}

export interface SpecialDay {
  date: Date;
  isOpen: boolean;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface Vehicle {
  vehicle: string;
  inventory: number;
}

export interface Office {
  _id?: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  phone: string;
  workingTime: WorkingTime[];
  specialDays: SpecialDay[];
  vehicles: Vehicle[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Vehicle -------------------------------------------------------
export interface ServiceHistory {
  tire: Date;
  oil: Date;
  battery: Date;
  air: Date;
  service: Date;
}

export interface Property {
  name: string;
  value: string;
}

export interface Vehicle {
  _id?: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  pricePerHour: number;
  fuel: "gas" | "diesel" | "electric" | "hybrid";
  gear: "automatic" | "manual" | "manual,automatic";
  seats: number;
  doors: number;
  properties: Property[];
  serviceHistory: ServiceHistory;
  needsService: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Category --------------------------------------------------------------------------
export interface ServicesPeriod {
  tire: number;
  oil: number;
  battery: number;
  air: number;
  service: number;
}

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  type: "van" | "minBus";
  servicesPeriod: ServicesPeriod;
  createdAt?: Date;
  updatedAt?: Date;
}
