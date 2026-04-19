import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Card } from "../components/Card";
import * as api from "../services/api";
import "react-day-picker/dist/style.css";

export function Calendar() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date());
  const [daysWithNotes, setDaysWithNotes] = useState<Date[]>([]);
  const [daysWithPhotos, setDaysWithPhotos] = useState<Date[]>([]);
  const [daysWithCheckins, setDaysWithCheckins] = useState<Date[]>([]);

  useEffect(() => {
    loadCalendarData(month);
  }, [month]);

  async function loadCalendarData(date: Date) {
    try {
      const data = await api.getCalendarData(date.getFullYear(), date.getMonth() + 1);
      setDaysWithNotes(data.daysWithNotes.map((d) => new Date(d + "T00:00:00")));
      setDaysWithPhotos(data.daysWithPhotos.map((d) => new Date(d + "T00:00:00")));
      setDaysWithCheckins(data.daysWithCheckins.map((d) => new Date(d + "T00:00:00")));
    } catch {
      // ignore
    }
  }

  function handleDayClick(day: Date) {
    navigate(`/day/${format(day, "yyyy-MM-dd")}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calendar</h1>

      <Card className="max-w-2xl mx-auto">
        <style>{`
          .rdp {
            --rdp-accent-color: #3b82f6;
            --rdp-background-color: rgba(59, 130, 246, 0.1);
            margin: 0;
          }
          .rdp-day {
            color: white;
          }
          .rdp-day_button:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          .rdp-day_button:focus {
            background-color: rgba(59, 130, 246, 0.2);
          }
          .rdp-caption_label {
            color: white;
            font-size: 1.125rem;
            font-weight: 600;
          }
          .rdp-nav button {
            color: white;
          }
          .rdp-chevron {
            fill: white;
          }
          .rdp-weekday {
            color: #9ca3af;
            font-weight: 500;
          }
          .rdp-day_outside {
            color: #4b5563;
          }
          .day-has-note {
            border: 2px solid #3b82f6;
            border-radius: 4px;
          }
          .day-has-photo {
            box-shadow: 0 4px 0 -2px #8b5cf6;
          }
          .day-has-checkin {
            background-color: rgba(34, 197, 94, 0.1);
          }
        `}</style>
        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
          onDayClick={handleDayClick}
          modifiers={{
            hasNote: daysWithNotes,
            hasPhoto: daysWithPhotos,
            hasCheckin: daysWithCheckins,
          }}
          modifiersClassNames={{
            hasNote: "day-has-note",
            hasPhoto: "day-has-photo",
            hasCheckin: "day-has-checkin",
          }}
        />
      </Card>

      <Card className="max-w-2xl mx-auto">
        <h3 className="font-semibold mb-3">Legend</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-500 rounded"></div>
            <span>Has note</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ boxShadow: "0 4px 0 -2px #8b5cf6" }}></div>
            <span>Has photo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500/10 rounded"></div>
            <span>Has check-in</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
