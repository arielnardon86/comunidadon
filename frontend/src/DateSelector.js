import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const DateSelector = ({ selectedDate, setSelectedDate }) => {
  const formatDate = (date) => {
    return `Hoy ${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center gap-4 p-4">
      <IoIosArrowBack className="text-gray-500 cursor-pointer" onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))} />

      <div className="relative flex items-center gap-2 text-lg font-bold text-gray-800">
        <FaCalendarAlt className="text-gray-500" />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          customInput={<span className="cursor-pointer">{formatDate(selectedDate)}</span>}
        />
      </div>

      <IoIosArrowForward className="text-gray-500 cursor-pointer" onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))} />
    </div>
  );
};

export default DateSelector;
