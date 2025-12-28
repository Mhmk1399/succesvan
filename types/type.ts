// Office ----------------------------------------------------------------------------
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
  pickupExtension?: {
    hoursBefore: number;
    hoursAfter: number;
    flatPrice: number;
  };
  returnExtension?: {
    hoursBefore: number;
    hoursAfter: number;
    flatPrice: number;
  };
}

export interface SpecialDay {
  month: number;
  day: number;
  isOpen: boolean;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

// export interface Vehicle {
//   vehicle: string;
//   inventory: number;
// }

export interface Office {
  _id?: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  categories: string[];
  address: string;
  phone: string;
  workingTime: WorkingTime[];
  specialDays: SpecialDay[];
  vehicles: Vehicle[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Vehicle --------------------------------------------------------------------------------
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
  category: string;
  pricePerHour: number;
  fuel: "gas" | "diesel" | "electric" | "hybrid";
  gear: "automatic" | "manual" | "manual,automatic";
  seats: number;
  doors: number;
  properties: Property[];
  serviceHistory: ServiceHistory;
  needsService: boolean;
  available: boolean;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
  number: number;
}

// Category -----------------------------------------------------------------------------------
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
  video?: string;
  purpose?: string;
  expert: string;
  type: string | Type;
  showPrice: number;
  selloffer?: number;
  status: "active" | "inactive";
  properties: {
    key: string;
    value: string;
  }[];
  requiredLicense: string;
  pricingTiers: {
    minDays: number;
    maxDays: number;
    pricePerDay: number;
  }[];
  extrahoursRate: number;
  fuel: "gas" | "diesel" | "electric" | "hybrid";
  gear: {
    availableTypes: string[];
    automaticExtraCost: number;
  };
  seats: number;
  doors: number;
  servicesPeriod: ServicesPeriod;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type -------------------------------------------------------------------------------------------

export interface Type {
  _id?: string;
  name: string;
  description?: string;
  offices: string[] | Office[];
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

// dashboard
export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export interface Stats {
  vehicles: number;
  offices: number;
  reservations: number;
  categories: number;
}

// AddOn ------------------------------------------------------------------------------------------
export interface AddOn {
  _id?: string;
  name: string;
  description?: string;
  pricingType: "flat" | "tiered";
  flatPrice?: number;
  tiers?: Array<{
    minDays: number;
    maxDays: number;
    price: number;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Reservation ------------------------------------------------------------------------------------------
export interface Reservation {
  _id?: string;

  user?: any;
  office?: any;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "canceled" | "completed" | "delivered";
  driverAge: number;
  messege?: string;
  addOns?: Array<{
    addOn?: AddOn;
    quantity: number;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
  vehicle: Vehicle;
}

// Table ------------------------------------------------------------------------------------
export interface DynamicTableViewProps<T> {
  apiEndpoint: string;
  title: string;
  columns: {
    key: keyof T;
    label: string;
    render?: (value: any, item?: T) => React.ReactNode;
  }[];
  onEdit?: (item: T) => void;
  onMutate?: (mutate: () => Promise<any>) => void;
  itemsPerPage?: number;
  hideDelete?: boolean;
  onDuplicate?: (item: T) => void;
  onStatusToggle?: (item: T) => void;
  hiddenColumns?: (keyof T)[];
  filters?: Array<{
    key: string;
    label: string;
    type: "text" | "date" | "select";
    options?: Array<{ _id: string; name: string }>;
  }>;
}

// custom Select -------------------------------------------------------------------
interface Option {
  _id?: string;
  name: string;
}

export interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  isInline?: boolean;
}

// Testimonial -------------------------------------------------------------------------------
export interface Testimonial {
  id: number;
  name: string;
  role?: string;
  company?: string;
  message: string;
  rating: number;
  image?: string;
  date?: string;
  location?: string;
}

export interface TestimonialsProps {
  testimonials?: Testimonial[];
  layout?: "carousel" | "grid" | "masonry";
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showRating?: boolean;
  accentColor?: string;
}

// User -----------------------------------------------------------------------------------------
export interface User {
  _id: string;
  name: string;
  lastName: string;
  address?: string;
  emaildata: {
    emailAddress: string;
    isVerified: boolean;
  };
  phoneData: {
    phoneNumber: string;
    isVerified: boolean;
  };
  role?: string;
  createdAt: Date;
}

// van --------------------------------------------------------------------------------------------
// Van data type
export interface VanData {
  _id?: string;
  name: string;
  description?: string;
  image: string;
  type?: string;
  servicesPeriod?: {
    tire: number;
    oil: number;
    battery: number;
    air: number;
    service: number;
  };
  pricePerHour: number;
  fuel: "gas" | "diesel" | "electric" | "hybrid";
  gear: "automatic" | "manual" | "manual,automatic";
  seats: number;
  doors: number;
  id?: number;
  category: Category;
  transmission?: "Manual" | "Automatic";
  cargo?: string;
  features?: string[];
  popular?: boolean;
  available?: boolean;
  deposit?: number;
  mileage?: string;
  priceUnit?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
