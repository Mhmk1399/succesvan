export const datePickerStyles = `
  select {
    cursor: pointer;
    max-height: 200px !important;
    overflow-y: auto !important;
  }
  select option:disabled {
    color: #4b5563 !important;
    background-color: #1e293b !important;
  }
  .rdrCalendarWrapper {
    background-color: transparent !important;
    border: none !important;
  }
  .rdrMonth {
    width: 100%;
  }
  .rdrMonthAndYearPickers {
    color: white !important;
    margin-bottom: 12px !important;
  }
  .rdrMonthAndYearPickers select {
    color: white !important;
    background-color: rgba(30, 41, 59, 0.9) !important;
    border: 1px solid rgba(251, 191, 36, 0.3) !important;
    padding: 6px 8px !important;
    border-radius: 4px !important;
  }
  .rdrMonthPicker select,
  .rdrYearPicker select {
    background-color: rgba(30, 41, 59, 0.9) !important;
    color: white !important;
    border: 1px solid rgba(251, 191, 36, 0.3) !important;
    border-radius: 4px !important;
    padding: 6px 8px !important;
  }
  .rdrDayNumber span {
    color: white !important;
    font-weight: 500;
    font-size: 13px !important;
  }
  .rdrDayPassive .rdrDayNumber span {
    color: rgba(255, 255, 255, 0.25) !important;
  }
  .rdrDayToday .rdrDayNumber span {
    color: #fbbf24 !important;
    font-weight: 700 !important;
    background-color: rgba(251, 191, 36, 0.2) !important;
    border-radius: 4px !important;
    padding: 4px 6px !important;
  }
  .rdrDayDisabled {
    background-color: transparent !important;
    cursor: not-allowed !important;
  }
  .rdrDayDisabled .rdrDayNumber span {
    color: #4b5563 !important;
    text-decoration: line-through !important;
    font-weight: 400 !important;
  }
  .rdrDayInRange {
    background-color: rgba(251, 191, 36, 0.15) !important;
  }
  .rdrDayStartPreview,
  .rdrDayInPreview,
  .rdrDayEndPreview {
    background-color: rgba(251, 191, 36, 0.1) !important;
  }
  .rdrDayStartOfMonth,
  .rdrDayEndOfMonth {
    background-color: rgba(251, 191, 36, 0.4) !important;
    border-radius: 4px !important;
  }
  .rdrDayStartOfMonth .rdrDayNumber span,
  .rdrDayEndOfMonth .rdrDayNumber span {
    color: #000 !important;
    font-weight: 700 !important;
  }
  .rdrDayInRange .rdrDayNumber span {
    color: #000 !important;
  }
  .rdrDayHovered {
    background-color: rgba(251, 191, 36, 0.2) !important;
    border-radius: 4px !important;
  }
  .rdrWeekDay {
    color: #fbbf24 !important;
    font-weight: 600 !important;
    font-size: 12px !important;
  }
  .rdrDayStartEdge,
  .rdrDayEndEdge {
    background-color: rgba(251, 191, 36, 0.4) !important;
  }
  .rdrDays {
    padding: 8px 0 !important;
  }
  .rdrDay {
    padding: 2px !important;
  }
`;
