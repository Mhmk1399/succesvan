# Development Guidelines

## Code Quality Standards

### File Organization
- **Client Components**: Mark with `"use client"` directive at the top for interactive components
- **Imports**: Group imports logically - external libraries first, then internal modules, then types
- **Component Structure**: Single responsibility - one main component per file with helper components below

### Naming Conventions
- **Components**: PascalCase (e.g., `VanListing`, `ReservationForm`, `CustomerDashboard`)
- **Files**: Match component names - `VanListing.tsx`, `ReservationForm.tsx`
- **Hooks**: Prefix with `use` - `usePriceCalculation`, `useFleetStatus`, `useVoiceRecording`
- **Interfaces**: PascalCase matching domain - `VanData`, `Office`, `Reservation`, `AddOn`
- **Props Interfaces**: Component name + `Props` suffix - `VanListingProps`, `ReservationFormProps`
- **API Routes**: Lowercase with hyphens - `/api/reservations`, `/api/fleet-status`, `/api/ai-agent`
- **State Variables**: camelCase descriptive names - `isSubmitting`, `showDateRange`, `selectedCategory`
- **Boolean States**: Prefix with `is`, `has`, `show` - `isAuthenticated`, `hasLicense`, `showModal`

### TypeScript Standards
- **Strict Typing**: Define interfaces for all data structures
- **Type Safety**: Avoid `any` - use specific types or `unknown` with type guards
- **Optional Properties**: Use `?` for optional fields - `description?: string`
- **Union Types**: For enums - `status: "pending" | "confirmed" | "canceled"`
- **Type Imports**: Import types with `@/types/type` path alias
- **Generic Types**: Use for reusable components - `DynamicTableView<T>`

### Code Formatting
- **Indentation**: 2 spaces (enforced by Prettier/ESLint)
- **Quotes**: Double quotes for strings, single quotes for JSX attributes when needed
- **Semicolons**: Required at end of statements
- **Line Length**: Keep under 100 characters when practical
- **Trailing Commas**: Use in multi-line arrays and objects

## Semantic Patterns

### State Management Pattern
```typescript
// Local state with useState
const [formData, setFormData] = useState({
  office: "",
  type: "",
  pickupTime: "",
  returnTime: "",
  driverAge: "",
  message: "",
});

// Derived state with useMemo
const pickupTimeSlots = useMemo(() => {
  if (!formData.office || !dateRange[0].startDate) return [];
  // Computation logic
  return generateTimeSlots(start, end, 15);
}, [formData.office, dateRange, offices]);

// Side effects with useEffect
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("/api/offices");
      const data = await res.json();
      setOffices(data.data || []);
    } catch (error) {
      console.log("Failed to fetch data:", error);
    }
  };
  fetchData();
}, []);
```

### API Call Pattern
```typescript
// Standard API call with error handling
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Operation failed");

    setIsSuccess(true);
    showToast.success("Operation successful!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    setErrors({ submit: message });
    showToast.error(message);
  } finally {
    setIsSubmitting(false);
  }
};
```

### Form Handling Pattern
```typescript
// Controlled inputs with validation
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;
  const newValue =
    type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

  setFormData((prev) => ({ ...prev, [name]: newValue }));

  // Clear error when user starts typing
  if (errors[name]) {
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }
};

// Validation function
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.name.trim()) newErrors.name = "Name is required";
  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Email is invalid";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Authentication Pattern
```typescript
// Check authentication on mount
useEffect(() => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    try {
      const parsedUser = JSON.parse(user);
      setIsAuthenticated(true);
      setUserData(parsedUser);
      setFormData((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.emaildata?.emailAddress || "",
        phoneNumber: parsedUser.phoneData?.phoneNumber || "",
      }));
    } catch (error) {
      console.log("Failed to parse user data");
    }
  }
}, []);

// Protected API calls
const token = localStorage.getItem("token");
if (!token) {
  setErrors({ submit: "Please login first" });
  return;
}
```

### Modal Pattern
```typescript
// Modal with backdrop and animations
{showModal && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      onClick={onClose}
    />

    {/* Modal Content */}
    <div className="fixed right-0 top-0 h-screen w-full sm:max-w-md bg-[#0f172b] border-l border-white/10 z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Modal content */}
    </div>
  </>
)}

// Lock body scroll when modal opens
useEffect(() => {
  const originalStyle = window.getComputedStyle(document.body).overflow;
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = originalStyle;
  };
}, []);
```

### Custom Hook Pattern
```typescript
// Reusable hook with dependencies
export function usePriceCalculation(
  startDate: string,
  endDate: string,
  pricingTiers: PricingTier[],
  extraHoursRate: number = 0
): PriceCalculationResult | null {
  const [result, setResult] = useState<PriceCalculationResult | null>(null);

  useEffect(() => {
    if (!startDate || !endDate || !pricingTiers || pricingTiers.length === 0) {
      setResult(null);
      return;
    }

    // Calculation logic
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));

    // Build result object
    setResult({
      totalHours,
      totalPrice,
      breakdown,
    });
  }, [startDate, endDate, pricingTiers, extraHoursRate]);

  return result;
}
```

### GSAP Animation Pattern
```typescript
// Scroll-triggered animations
useEffect(() => {
  const ctx = gsap.context(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(
        card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
            once: true,
          },
          delay: index * 0.1,
        }
      );
    });
  }, sectionRef);

  return () => ctx.revert();
}, []);
```

### Date/Time Handling Pattern
```typescript
// Date formatting with date-fns
import { format } from "date-fns";

const formattedDate = format(new Date(dateString), "dd/MM/yyyy");
const formattedTime = format(new Date(dateString), "HH:mm");

// Date range with react-date-range
const [dateRange, setDateRange] = useState<Range[]>([
  {
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    key: "selection",
  },
]);

// Time slot generation
const generateTimeSlots = (start: string, end: string, interval: number) => {
  const slots = [];
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);
  // Generate slots logic
  return slots;
};
```

## Internal API Usage Patterns

### API Response Structure
```typescript
// Success response
{
  success: true,
  data: { /* result data */ },
  message?: "Operation successful"
}

// Error response
{
  success: false,
  error: "Error message",
  message?: "Additional context"
}
```

### Common API Endpoints
```typescript
// Vehicles
GET    /api/vehicles              // List all vehicles
GET    /api/vehicles/:id          // Get vehicle by ID
POST   /api/vehicles              // Create vehicle
PATCH  /api/vehicles/:id          // Update vehicle
DELETE /api/vehicles/:id          // Delete vehicle

// Reservations
GET    /api/reservations          // List reservations (with ?userId=)
POST   /api/reservations          // Create reservation
PATCH  /api/reservations/:id     // Update reservation
DELETE /api/reservations/:id     // Delete reservation

// Authentication
POST   /api/auth                  // Login/register/verify
  body: { action: "send-code" | "verify" | "register", ... }

// Offices
GET    /api/offices               // List offices
GET    /api/offices/:id           // Get office with categories
POST   /api/offices               // Create office
PATCH  /api/offices/:id          // Update office

// Fleet Status
GET    /api/fleet-status          // Real-time availability

// AI Agents
POST   /api/ai-agent              // Conversational AI
POST   /api/fast-agent            // Quick booking AI
POST   /api/parse-voice           // Voice command parsing
```

### Data Fetching with SWR
```typescript
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Component() {
  const { data, error, mutate } = useSWR("/api/vehicles", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{/* Render data */}</div>;
}
```

## Frequently Used Code Idioms

### Conditional Rendering
```typescript
// Short-circuit evaluation
{isLoading && <LoadingSpinner />}
{error && <ErrorMessage message={error} />}
{data && <DataDisplay data={data} />}

// Ternary for either/or
{isAuthenticated ? <Dashboard /> : <Login />}

// Nullish coalescing for defaults
const userName = user?.name ?? "Guest";
const price = vehicle.price ?? 0;
```

### Array Operations
```typescript
// Filter categories by type
const filtered = categories.filter((cat) => {
  const catTypeId = typeof cat.type === 'string' ? cat.type : cat.type?._id;
  return catTypeId === formData.type;
});

// Map for rendering
{vehicles.map((vehicle, index) => (
  <VehicleCard key={vehicle._id} vehicle={vehicle} />
))}

// Find single item
const office = offices.find((o) => o._id === formData.office);

// Reduce for calculations
const total = items.reduce((sum, item) => sum + item.price, 0);
```

### Optional Chaining & Nullish Coalescing
```typescript
// Safe property access
const email = userData?.emaildata?.emailAddress || "";
const phone = userData?.phoneData?.phoneNumber || "";

// Safe method calls
const categories = officeData?.categories?.filter(...) ?? [];

// Nested object access
const pricePerHour = (van as any).pricingTiers?.[0]?.pricePerHour || 0;
```

### Type Assertions & Guards
```typescript
// Type assertion when you know the type
const pricePerHour = (van as any).pricingTiers?.[0]?.pricePerHour || 0;

// Type guard for error handling
catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.log("Error:", message);
}

// Type narrowing with typeof
if (typeof value === 'object' && value?.name) {
  return value.name;
}
```

### Async/Await Error Handling
```typescript
// Try-catch with finally
try {
  const res = await fetch("/api/endpoint");
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  // Success handling
} catch (error) {
  // Error handling
} finally {
  setIsLoading(false);
}

// Promise.all for parallel requests
const [offRes, typeRes] = await Promise.all([
  fetch("/api/offices"),
  fetch("/api/types"),
]);
```

### Console Logging Pattern
```typescript
// Structured logging with context
console.log("=== Price Calculation ===");
console.log("Start Date:", startDate);
console.log("End Date:", endDate);
console.log("Total Price:", `£${totalPrice}`);
console.log("========================");

// Emoji prefixes for visibility
console.log("🎤 [Form] Voice button clicked");
console.log("✅ [Form] Form updated with voice data");
console.log("❌ [Form] Modal closed without confirmation");
```

## Popular Annotations & Comments

### Component Documentation
```typescript
/**
 * VanListing - Displays available vans with filtering and booking
 * @param vans - Array of van data
 * @param addOns - Available add-ons for booking
 */
```

### TODO Comments
```typescript
// TODO: Add pagination for large vehicle lists
// FIXME: Handle timezone conversion for international bookings
// NOTE: This calculation assumes 24-hour days
```

### Section Markers
```typescript
// ============= State Management =============
// ============= API Calls =============
// ============= Event Handlers =============
// ============= Render =============
```

## Best Practices

### Performance
- Use `useMemo` for expensive calculations
- Use `useCallback` for callback refs and event handlers passed to children
- Implement pagination for large data sets
- Lazy load images with Next.js Image component
- Use SWR for automatic caching and revalidation

### Security
- Store JWT tokens in localStorage (consider httpOnly cookies for production)
- Validate all user inputs on both client and server
- Use environment variables for sensitive data
- Sanitize user-generated content before rendering
- Implement rate limiting on API routes

### Accessibility
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation works
- Use ARIA labels where needed
- Maintain sufficient color contrast

### Error Handling
- Always provide user-friendly error messages
- Log errors for debugging but don't expose internals
- Implement fallback UI for error states
- Use try-catch for async operations
- Validate data before processing

### Testing
- Test API endpoints with provided test scripts
- Verify form validation logic
- Test authentication flows
- Check responsive design on multiple devices
- Validate date/time calculations with edge cases
