"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  FiCalendar,
  FiClock,
  FiMic,
  FiMapPin,
  FiTruck,
  FiUser,
  FiMessageSquare,
} from "react-icons/fi";
import { format } from "date-fns";
import { showToast } from "@/lib/toast";
import { Office, Category } from "@/types/type";
import CustomSelect from "@/components/ui/CustomSelect";
import TimePickerInput from "@/components/ui/TimePickerInput";

interface ReservationFormProps {
  isModal?: boolean;
  isInline?: boolean;
  onClose?: () => void;
}

export default function ReservationForm({
  isModal = false,
  isInline = false,
  onClose,
}: ReservationFormProps) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offices, setOffices] = useState<Office[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      key: "selection",
    },
  ]);

  const [formData, setFormData] = useState({
    office: "",
    category: "",
    pickupTime: "10:00",
    returnTime: "10:00",
    driverAge: "",
    message: "",
    name: "",
    email: "",
    phoneNumber: "",
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offRes, catRes] = await Promise.all([
          fetch("/api/offices"),
          fetch("/api/categories"),
        ]);
        const offData = await offRes.json();
        const catData = await catRes.json();
        setOffices(offData.data || []);
        setCategories(catData.data || []);
      } catch (error) {
        console.log("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleGlobalVoice = async () => {
    if (!("webkitSpeechRecognition" in window)) {
      showToast.error("Speech Recognition not supported");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    setIsListening(true);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);

      try {
        const response = await fetch("/api/parse-voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        });

        const data = await response.json();

        setFormData((prev) => ({
          ...prev,
          office: data.office || prev.office,
          pickupTime: data.pickupTime || prev.pickupTime,
          returnTime: data.returnTime || prev.returnTime,
          category: data.category || prev.category,
          driverAge: data.driverAge || prev.driverAge,
        }));

        if (data.pickupDate && data.returnDate) {
          setDateRange([
            {
              startDate: new Date(data.pickupDate),
              endDate: new Date(data.returnDate),
              key: "selection",
            },
          ]);
        }
      } catch (error) {
        console.log("Error parsing voice:", error);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeChange = (name: string, time: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: time,
    }));
  };

  const getSelectedOffice = () => {
    return offices.find((o) => o._id === formData.office);
  };

  const isDateDisabled = (date: Date) => {
    const office = getSelectedOffice();
    if (!office) return false;

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][date.getDay()];

    // Check special days first
    const specialDay = office.specialDays?.find(
      (sd) => sd.month === month && sd.day === day
    );
    if (specialDay && !specialDay.isOpen) return true;

    // Check working hours
    const workingDay = office.workingTime?.find((w) => w.day === dayName);
    if (workingDay && !workingDay.isOpen) return true;

    return false;
  };

  const getAvailableTimeSlots = (date: Date) => {
    const office = getSelectedOffice();
    if (!office) return { start: "00:00", end: "23:59", info: "" };

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][date.getDay()];

    // Check special days first
    const specialDay = office.specialDays?.find(
      (sd) => sd.month === month && sd.day === day
    );
    if (specialDay && specialDay.isOpen) {
      return {
        start: specialDay.startTime,
        end: specialDay.endTime,
        info: `Special day: ${specialDay.reason} (${specialDay.startTime} - ${specialDay.endTime})`,
      };
    }

    // Use working hours
    const workingDay = office.workingTime?.find((w) => w.day === dayName);
    if (workingDay && workingDay.isOpen) {
      return {
        start: workingDay.startTime,
        end: workingDay.endTime,
        info: `${workingDay.day}: ${workingDay.startTime} - ${workingDay.endTime}`,
      };
    }

    return { start: "00:00", end: "23:59", info: "" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Store rental details in sessionStorage with time included
      const pickupDateTime = new Date(dateRange[0].startDate || new Date());
      const [pickupHour, pickupMinute] = formData.pickupTime.split(":");
      pickupDateTime.setHours(
        parseInt(pickupHour),
        parseInt(pickupMinute),
        0,
        0
      );

      const returnDateTime = new Date(dateRange[0].endDate || new Date());
      const [returnHour, returnMinute] = formData.returnTime.split(":");
      returnDateTime.setHours(
        parseInt(returnHour),
        parseInt(returnMinute),
        0,
        0
      );

      const rentalDetails = {
        office: formData.office,
        pickupDate: pickupDateTime.toISOString(),
        returnDate: returnDateTime.toISOString(),
        pickupTime: formData.pickupTime,
        returnTime: formData.returnTime,
        pickupLocation:
          offices.find((o) => o._id === formData.office)?.name || "",
        driverAge: formData.driverAge,
        message: formData.message,
      };
      sessionStorage.setItem("rentalDetails", JSON.stringify(rentalDetails));

      const url = `/reservation?category=${formData.category}&office=${formData.office}&age=${formData.driverAge}`;
      router.push(url);
    } catch (error) {
      showToast.error("Reservation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        isInline
          ? "space-y-0 bg-white/5 py-8 px-4 rounded-xl backdrop-blur-lg border border-gray-500/50"
          : "space-y-6"
      }
    >
      <div
        className={
          isInline
            ? "grid grid-cols-8 gap-1 mx-auto justify-center items-end"
            : "hidden md:grid grid-cols-2 gap-4"
        }
      >
        {/* Office */}
        <div>
          <label
            className={`text-white font-semibold mb-2 flex items-center gap-2 ${
              isInline ? "text-xs mb-1" : "text-sm"
            }`}
          >
            <FiMapPin className="text-amber-400 text-lg" /> Office
          </label>
          <CustomSelect
            options={offices}
            value={formData.office}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, office: val }))
            }
            placeholder="Select Office"
            isInline={isInline}
          />
        </div>

        {/* Category */}
        <div>
          <label
            className={`text-white font-semibold mb-2 flex items-center gap-2 ${
              isInline ? "text-xs mb-1" : "text-sm"
            }`}
          >
            <FiTruck className="text-amber-400 text-lg relative" /> Category
          </label>
          <CustomSelect
            options={categories}
            value={formData.category}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, category: val }))
            }
            placeholder="Select Category"
            isInline={isInline}
          />
        </div>

        {/* Date Range */}
        <div>
          <label
            className={`text-white font-semibold mb-2 flex items-center gap-2 ${
              isInline ? "text-xs mb-1" : "text-sm"
            }`}
          >
            <FiCalendar className="text-amber-400 text-lg" /> Dates
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDateRange(!showDateRange)}
              className={`w-full bg-white/10 border border-white/20 rounded-lg text-white text-left focus:outline-none focus:border-amber-400 transition-colors ${
                isInline ? "px-2 py-2 text-xs" : "px-4 py-3 text-sm"
              }`}
            >
              {isInline ? (
                <>
                  {format(dateRange[0].startDate || new Date(), "dd/MM")} -{" "}
                  {format(dateRange[0].endDate || new Date(), "dd/MM")}
                </>
              ) : (
                <>
                  {format(dateRange[0].startDate || new Date(), "dd/MM/yyyy")} -{" "}
                  {format(dateRange[0].endDate || new Date(), "dd/MM/yyyy")}
                </>
              )}
            </button>
            {showDateRange && (
              <div
                className={`absolute left-0 mt-2 z-50 bg-slate-800 backdrop-blur-xl border border-white/20 rounded-lg p-4 ${
                  isInline ? "-top-72" : "-top-64"
                }`}
              >
                <DateRange
                  ranges={dateRange}
                  onChange={(item) => {
                    const { startDate, endDate } = item.selection;
                    setDateRange([
                      {
                        startDate: startDate || new Date(),
                        endDate: endDate || new Date(),
                        key: "selection",
                      },
                    ]);
                  }}
                  minDate={new Date()}
                  rangeColors={["#fbbf24"]}
                  disabledDates={
                    formData.office
                      ? (Array.from({ length: 365 }, (_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() + i);
                          return isDateDisabled(date) ? date : null;
                        }).filter(Boolean) as Date[])
                      : []
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowDateRange(false)}
                  className="w-full mt-3 px-4 py-2 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors text-sm"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pickup Time */}
        <div>
          {dateRange[0].startDate && (
            <p className="text-amber-300 text-[10px] mb-1">
              {getAvailableTimeSlots(dateRange[0].startDate).info}
            </p>
          )}
          <label
            className={`text-white font-semibold mb-2 flex items-center gap-2 ${
              isInline ? "text-xs mb-1" : "text-sm"
            }`}
          >
            <FiClock className="text-amber-400 text-lg" /> From
          </label>

          {dateRange[0].startDate && (
            <TimePickerInput
              key={`pickup-${
                formData.office
              }-${dateRange[0].startDate.toDateString()}`}
              value={formData.pickupTime}
              onChange={(time) => handleTimeChange("pickupTime", time)}
              minTime={
                getAvailableTimeSlots(dateRange[0].startDate).start || "00:00"
              }
              maxTime={
                getAvailableTimeSlots(dateRange[0].startDate).end || "23:59"
              }
              isInline={isInline}
            />
          )}
        </div>

        {/* Return Time */}
        <div>
          {dateRange[0].endDate && (
            <p className="text-amber-300 text-[10px] mb-1">
              {getAvailableTimeSlots(dateRange[0].endDate).info}
            </p>
          )}
          <label
            className={`text-white font-semibold mb-2 flex items-center gap-2 ${
              isInline ? "text-xs mb-1" : "text-sm"
            }`}
          >
            <FiClock className="text-amber-400 text-lg" /> To
          </label>
          {dateRange[0].endDate && (
            <TimePickerInput
              key={`return-${
                formData.office
              }-${dateRange[0].endDate.toDateString()}`}
              value={formData.returnTime}
              onChange={(time) => handleTimeChange("returnTime", time)}
              minTime={
                getAvailableTimeSlots(dateRange[0].endDate).start || "00:00"
              }
              maxTime={
                getAvailableTimeSlots(dateRange[0].endDate).end || "23:59"
              }
              isInline={isInline}
            />
          )}
        </div>

        {/* Driver Age */}
        <div>
          <label
            className={`text-white font-semibold mb-2 flex items-center gap-2 ${
              isInline ? "text-xs mb-1" : "text-sm"
            }`}
          >
            <FiUser className="text-amber-400 text-lg" /> Age
          </label>
          <input
            type="number"
            name="driverAge"
            value={formData.driverAge}
            onChange={handleInputChange}
            required
            className={`w-full bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors ${
              isInline ? "px-2 py-2 text-xs" : "px-4 py-3 text-sm"
            }`}
            placeholder="18+"
            min="18"
          />
        </div>

        {/* Buttons Row */}
        <div className={isInline ? "flex gap-2" : "col-span-2 flex gap-3"}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-linear-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 ${
              isInline ? "px-4 py-1 text-xs" : "flex-1 px-8 py-2 text-sm"
            }`}
          >
            {isSubmitting ? "Booking..." : isInline ? "BOOK" : "RESERVE NOW"}
          </button>

          <div className="relative group">
            <button
              type="button"
              onClick={handleGlobalVoice}
              className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all text-sm ${
                isListening
                  ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50"
                  : "bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/50"
              }`}
            >
              <FiMic className="text-lg" />
              {isListening ? "Listening" : "Voice"}
            </button>
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-amber-300 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-amber-400/30">
              Say: "London, tomorrow 10am to next day 5pm, van, 25"
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Flex Col */}
      <div className="md:hidden space-y-3">
        <div>
          <label className="text-white text-xs font-semibold mb-1 flex items-center gap-1">
            <FiMapPin className="text-amber-400" /> Office
          </label>
          <CustomSelect
            options={offices}
            value={formData.office}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, office: val }))
            }
            placeholder="Select Office"
            isInline={true}
          />
        </div>

        <div>
          <label className="text-white text-xs font-semibold mb-1 flex items-center gap-1">
            <FiTruck className="text-amber-400" /> Category
          </label>
          <CustomSelect
            options={categories}
            value={formData.category}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, category: val }))
            }
            placeholder="Select Category"
            isInline={true}
          />
        </div>

        <div>
          <label className="text-white text-xs font-semibold mb-1 flex items-center gap-1">
            <FiCalendar className="text-amber-400" /> Select Dates
          </label>
          <button
            type="button"
            onClick={() => setShowDateRange(!showDateRange)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs text-left focus:outline-none focus:border-amber-400 transition-colors"
          >
            {format(dateRange[0].startDate || new Date(), "dd/MM")} -{" "}
            {format(dateRange[0].endDate || new Date(), "dd/MM")}
          </button>
          {showDateRange && (
            <div className="mt-2 bg-slate-800 backdrop-blur-xl border border-white/20 rounded-lg p-2 overflow-x-auto">
              <DateRange
                ranges={dateRange}
                onChange={(item) => {
                  const { startDate, endDate } = item.selection;
                  setDateRange([
                    {
                      startDate: startDate || new Date(),
                      endDate: endDate || new Date(),
                      key: "selection",
                    },
                  ]);
                }}
                minDate={new Date()}
                rangeColors={["#fbbf24"]}
              />
              <button
                type="button"
                onClick={() => setShowDateRange(false)}
                className="w-full mt-2 px-3 py-1.5 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors text-xs"
              >
                Done
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-white text-xs font-semibold mb-1">
              Pickup Time
            </label>
            {dateRange[0].startDate && (
              <TimePickerInput
                key={`mobile-pickup-${
                  formData.office
                }-${dateRange[0].startDate.toDateString()}`}
                value={formData.pickupTime}
                onChange={(time) => handleTimeChange("pickupTime", time)}
                minTime={
                  getAvailableTimeSlots(dateRange[0].startDate).start || "00:00"
                }
                maxTime={
                  getAvailableTimeSlots(dateRange[0].startDate).end || "23:59"
                }
                isInline={true}
              />
            )}
            {dateRange[0].startDate && (
              <p className="text-amber-300 text-[10px] mt-0.5">
                {getAvailableTimeSlots(dateRange[0].startDate).info}
              </p>
            )}
          </div>
          <div>
            <label className="block text-white text-xs font-semibold mb-1">
              Return Time
            </label>
            {dateRange[0].endDate && (
              <TimePickerInput
                key={`mobile-return-${
                  formData.office
                }-${dateRange[0].endDate.toDateString()}`}
                value={formData.returnTime}
                onChange={(time) => handleTimeChange("returnTime", time)}
                minTime={
                  getAvailableTimeSlots(dateRange[0].endDate).start || "00:00"
                }
                maxTime={
                  getAvailableTimeSlots(dateRange[0].endDate).end || "23:59"
                }
                isInline={true}
              />
            )}
            {dateRange[0].endDate && (
              <p className="text-amber-300 text-[10px] mt-0.5">
                {getAvailableTimeSlots(dateRange[0].endDate).info}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-white text-xs font-semibold mb-1 flex items-center gap-1">
              <FiUser className="text-amber-400" /> Age
            </label>
            <input
              type="number"
              name="driverAge"
              value={formData.driverAge}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="18+"
              min="18"
            />
          </div>
          <div>
            <label className="text-white text-xs font-semibold mb-1 flex items-center gap-1">
              <FiMessageSquare className="text-amber-400" /> Message
            </label>
            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 col-span-9 bg-linear-to-r from-amber-500 to-amber-600 text-slate-900 font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-amber-500/50 text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Booking..." : "RESERVE"}
          </button>
          <button
            type="button"
            onClick={handleGlobalVoice}
            className={`w-full py-2.5 px-4 col-span-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-xs ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500"
            }`}
          >
            <FiMic className="text-base" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .rdrCalendarWrapper {
          background-color: transparent !important;
          border: none !important;
        }
        .rdrDayDisabled .rdrDayNumber span {
          color: black !important;
          border-radius: 8px !important;
        }
        .rdrMonth {
          width: 100%;
        }
        .rdrMonthAndYearPickers {
          color: black !important;
        }
        .rdrMonthAndYearPickers select {
          color: black !important;
        }
        .rdrMonthPicker select,
        .rdrYearPicker select {
          background-color: rgba(255, 255, 255, 0.95) !important;
          color: black !important;
          border: 1px solid rgba(0, 0, 0, 0.2) !important;
          border-radius: 0.5rem !important;
        }
        .rdrDayNumber span {
          color: white !important;
        }
        .rdrDayPassive .rdrDayNumber span {
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .rdrDayToday .rdrDayNumber span {
          color: #fbbf24 !important;
          font-weight: bold;
        }
        .rdrDayInRange {
          background-color: rgba(251, 191, 36, 0.2) !important;
        }
        .rdrDayStartPreview,
        .rdrDayInPreview,
        .rdrDayEndPreview {
          background-color: rgba(251, 191, 36, 0.1) !important;
        }
        .rdrDayStartOfMonth,
        .rdrDayEndOfMonth {
          background-color: rgba(251, 191, 36, 0.3) !important;
        }
        .rdrDayStartOfMonth .rdrDayNumber span,
        .rdrDayEndOfMonth .rdrDayNumber span {
          color: white !important;
          font-weight: bold;
        }
        .rdrDayHovered {
          background-color: rgba(251, 191, 36, 0.3) !important;
        }
        .rdrWeekDay {
          color: #fbbf24 !important;
        }
      `}</style>
    </form>
  );
}
