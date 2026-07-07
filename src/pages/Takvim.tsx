import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  DownloadCloud, 
  SlidersHorizontal, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Edit3,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Link,
  Layers,
  FileSignature,
  Coins,
  Wrench,
  CheckSquare,
  Bookmark,
  MapPin,
  CalendarDays,
  User,
  ShieldAlert
} from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { calendarService } from '@/services/calendarService';
import { companyRepository, spaceRepository, taskRepository, notificationRepository } from '@/repositories';
import { DarkKpiCard } from '@/components/design-system/DarkKpiCard';
import { DarkDashboardCard } from '@/components/design-system/DarkDashboardCard';
import { EntityLink } from '@/components/design-system/EntityLink';
import { Button } from '@/components/design-system/Button';
import { Modal } from '@/components/design-system/Modal';
import { FormGroup, Label, Input, Select } from '@/components/design-system/Form';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { LedReservationForm } from '@/components/design-system/LedReservationForm';
import { Notification } from '@/components/design-system/Notification';

export function Takvim() {
  const { setCurrentRoute } = useApp();
  const { resolvedTheme } = useTheme();
  
  // Date context default: June 2025 (mock data peak)
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed, so 5 is June
  const [selectedDate, setSelectedDate] = useState<string>('2025-06-15'); // Mock standard selected day
  
  // View states: 'day' | 'week' | 'month' | 'timeline' | 'resource'
  const [activeView, setActiveView] = useState<'day' | 'week' | 'month' | 'timeline' | 'resource'>('month');

  // Core data states
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [movingEvent, setMovingEvent] = useState<CalendarEvent | null>(null);
  const [newDates, setNewDates] = useState({ start: '', end: '' });

  // Event inputs
  const [eventInput, setEventInput] = useState({
    title: '',
    description: '',
    type: 'task' as CalendarEvent['type'],
    start: '2025-06-15',
    end: '2025-06-15',
    status: 'Yapılacak',
    priority: 'medium' as CalendarEvent['priority'],
    companyId: '',
    spaceId: '',
    amount: ''
  });

  const [reservationType, setReservationType] = useState<'static' | 'led'>('static');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filterType, setFilterType] = useState<string>('');
  const [filterCompany, setFilterCompany] = useState<string>('');
  const [filterSpace, setFilterSpace] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Fetch reference lists for filters and dropdowns
  const companiesList = companyRepository.getAllSync();
  const spacesList = spaceRepository.getAllSync();

  // Load and refresh events
  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await calendarService.getCalendarEvents();
      setEvents(data);
      if (data.length > 0 && !selectedEventId) {
        // Default select first reservation
        const defaultEv = data.find(e => e.type === 'reservation') || data[0];
        setSelectedEventId(defaultEv.eventId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Filter logic
  const filteredEvents = events.filter(e => {
    const matchesType = !filterType || e.type === filterType;
    const matchesCompany = !filterCompany || e.companyId === filterCompany;
    const matchesSpace = !filterSpace || e.spaceIds?.includes(filterSpace);
    const matchesPriority = !filterPriority || e.priority === filterPriority;
    const matchesStatus = !filterStatus || e.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesType && matchesCompany && matchesSpace && matchesPriority && matchesStatus;
  });

  // Selected event lookup
  const selectedEvent = events.find(e => e.eventId === selectedEventId);

  // Month navigation helpers
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToToday = () => {
    // Standard mock date is June 2025
    setCurrentYear(2025);
    setCurrentMonth(5);
    setSelectedDate('2025-06-15');
  };

  // Add custom event handler
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await calendarService.createCalendarEvent({
        title: eventInput.title,
        description: eventInput.description,
        type: eventInput.type,
        start: eventInput.start,
        end: eventInput.end,
        status: eventInput.status,
        priority: eventInput.priority,
        sourceEntityType: eventInput.type as any,
        sourceEntityId: 'MANUAL-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        companyId: eventInput.companyId || undefined,
        spaceIds: eventInput.spaceId ? [eventInput.spaceId] : [],
        amount: parseFloat(eventInput.amount) || undefined
      });
      
      // Update notifications log automatically
      notificationRepository.getAllSync(); // refresh
      
      setCreateModalOpen(false);
      // Reset input
      setEventInput({
        title: '',
        description: '',
        type: 'task',
        start: '2025-06-15',
        end: '2025-06-15',
        status: 'Yapılacak',
        priority: 'medium',
        companyId: '',
        spaceId: '',
        amount: ''
      });
      await loadEvents();
      setSelectedEventId(created.eventId);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Event deletion
  const handleDeleteEvent = async (id: string) => {
    if (confirm('Bu planlama eylemini takvimden kaldırmak istediğinize emin misiniz?')) {
      await calendarService.deleteCalendarEvent(id);
      setSelectedEventId(null);
      await loadEvents();
    }
  };

  // Drag-and-drop planning action trigger
  const handleOpenMoveModal = (ev: CalendarEvent) => {
    setMovingEvent(ev);
    setNewDates({ start: ev.start, end: ev.end });
    setMoveModalOpen(true);
  };

  const handleMoveEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (movingEvent) {
      await calendarService.moveCalendarEvent(movingEvent.eventId, newDates.start, newDates.end);
      setMoveModalOpen(false);
      setMovingEvent(null);
      await loadEvents();
    }
  };

  const handleMarkAsCompleted = async (ev: CalendarEvent) => {
    await calendarService.updateCalendarEvent(ev.eventId, { status: 'Tamamlandı' });
    await loadEvents();
  };

  // Render icons / badges helper
  const getEventBadgeClass = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'reservation':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'campaign':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'contract_expiry':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'invoice_due':
        return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
      case 'maintenance':
        return 'bg-rose-500/10 text-rose-450 border border-rose-500/20';
      case 'task':
        return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      case 'workflow':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const getEventIcon = (type: CalendarEvent['type'], size = 11) => {
    switch (type) {
      case 'reservation':
        return <CheckSquare size={size} className="text-emerald-400" />;
      case 'campaign':
        return <Layers size={size} className="text-indigo-400" />;
      case 'contract_expiry':
        return <FileSignature size={size} className="text-purple-400" />;
      case 'invoice_due':
        return <Coins size={size} className="text-teal-400" />;
      case 'maintenance':
        return <Wrench size={size} className="text-rose-450" />;
      case 'task':
        return <CheckSquare size={size} className="text-sky-400" />;
      case 'workflow':
        return <Sparkles size={size} className="text-amber-400 animate-pulse" />;
      default:
        return <CalendarIcon size={size} className="text-slate-400" />;
    }
  };

  const getEventTypeName = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'reservation': return 'Rezervasyon';
      case 'campaign': return 'Kampanya';
      case 'contract_expiry': return 'Sözleşme Bitişi';
      case 'invoice_due': return 'Fatura Vadesi';
      case 'maintenance': return 'Bakım Görevi';
      case 'task': return 'Kullanıcı Görevi';
      case 'workflow': return 'İş Akışı';
      default: return 'Plan';
    }
  };

  // Math dates mapping logic
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 is Sunday, so map to European (Monday = 0, Sunday = 6)
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  // Render Month Grid cells
  const renderMonthDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
    const dayCells: React.ReactNode[] = [];

    // Empty offset cells leading to the start of the month
    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(
        <div key={`empty-${i}`} className="bg-transparent border border-slate-100/50 dark:border-white/2 min-h-24 opacity-30 select-none"></div>
      );
    }

    // Actual day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateStr === '2025-06-15'; // Standard mock today date
      const isSelected = dateStr === selectedDate;

      // Filter events on this specific day
      const dayEvents = filteredEvents.filter(e => {
        const evStart = e.start;
        const evEnd = e.end;
        return dateStr >= evStart && dateStr <= evEnd;
      });

      const maxShow = 3;
      const extraCount = dayEvents.length - maxShow;

      dayCells.push(
        <div 
          key={`day-${day}`}
          onClick={() => setSelectedDate(dateStr)}
          className={`min-h-24 p-1.5 border border-slate-200 dark:border-white/5 flex flex-col justify-between transition-all select-none cursor-pointer group text-left ${
            isSelected 
              ? 'bg-blue-500/5 ring-1 ring-blue-500 border-blue-500/40' 
              : isToday
                ? 'bg-emerald-500/5 dark:bg-emerald-500/2 border-emerald-500/30'
                : 'bg-white dark:bg-[#0b0f19]/30 hover:bg-slate-50 dark:hover:bg-white/1'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`text-[10px] font-black ${
              isToday 
                ? 'text-emerald-500 px-1 bg-emerald-500/10 rounded-md'
                : isSelected
                  ? 'text-blue-500 font-black'
                  : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
            }`}>
              {day}
            </span>
            {isToday && <span className="text-[7px] font-black uppercase text-emerald-500 tracking-wider">Bugün</span>}
          </div>

          {/* Events list within the day cell */}
          <div className="flex-1 space-y-0.5 overflow-hidden">
            {dayEvents.slice(0, maxShow).map(e => {
              const hasConflict = e.color === 'red';
              return (
                <div
                  key={e.eventId}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedEventId(e.eventId);
                    setSelectedDate(dateStr);
                  }}
                  className={`text-[8.5px] px-1 py-0.5 rounded truncate font-bold leading-tight flex items-center gap-1 select-none border transition-all ${
                    hasConflict 
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-500'
                      : e.eventId === selectedEventId
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                        : 'bg-slate-100 dark:bg-white/3 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/10'
                  }`}
                  title={`${e.title} (${getEventTypeName(e.type)})`}
                >
                  {getEventIcon(e.type, 9)}
                  <span className="truncate">{e.title}</span>
                </div>
              );
            })}
            
            {extraCount > 0 && (
              <div className="text-[8px] font-black text-blue-500 dark:text-blue-400 pl-1 uppercase tracking-wider">
                +{extraCount} daha
              </div>
            )}
          </div>
        </div>
      );
    }

    return dayCells;
  };

  // Render Daily / Weekly list layout
  const renderWeeklyDailyView = () => {
    // Generate schedule hours list 08:00 to 22:00
    const hours = Array.from({ length: 15 }, (_, i) => i + 8);
    const activeDateObj = new Date(selectedDate);
    
    // If weekly view, render columns for the 7 days of the selected date's week
    const isWeek = activeView === 'week';
    
    const daysToShow: { dateStr: string; label: string }[] = [];
    if (isWeek) {
      // Find Monday of the selected date's week
      const currentDay = activeDateObj.getDay();
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(activeDateObj);
      monday.setDate(activeDateObj.getDate() + distanceToMonday);

      for (let i = 0; i < 7; i++) {
        const nextDay = new Date(monday);
        nextDay.setDate(monday.getDate() + i);
        const dateStr = nextDay.toISOString().split('T')[0];
        const daysLabels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        daysToShow.push({
          dateStr,
          label: `${daysLabels[i]} ${nextDay.getDate()}.${nextDay.getMonth() + 1}`
        });
      }
    } else {
      daysToShow.push({
        dateStr: selectedDate,
        label: `Bugün (${activeDateObj.getDate()} ${monthNames[activeDateObj.getMonth()]})`
      });
    }

    return (
      <div className="overflow-x-auto select-none">
        <table className="w-full border-collapse border border-slate-200 dark:border-white/5 text-xs text-left min-w-[600px]">
          <thead>
            <tr className="bg-slate-100/50 dark:bg-white/2">
              <th className="p-2 border border-slate-200 dark:border-white/5 w-16 text-center text-[10px] font-black uppercase text-slate-400 tracking-wider">Saat</th>
              {daysToShow.map(day => (
                <th 
                  key={day.dateStr}
                  className={`p-2 border border-slate-200 dark:border-white/5 text-center font-black tracking-wide text-[10.5px] ${
                    day.dateStr === selectedDate ? 'text-blue-500 dark:text-blue-400 bg-blue-500/5' : 'text-slate-400'
                  }`}
                >
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => {
              const hourStr = `${String(hour).padStart(2, '0')}:00`;
              return (
                <tr key={hour} className="hover:bg-slate-50/20 dark:hover:bg-white/1">
                  <td className="p-2 border border-slate-200 dark:border-white/5 text-center font-bold text-slate-400 border-r-2 border-r-slate-300 dark:border-r-slate-800">{hourStr}</td>
                  {daysToShow.map(day => {
                    // Match events that are active during this day.
                    // For scheduling, let's distribute hourly. Since our events are day-level in mock, 
                    // we can render them in the 09:00 slot if they start on this day to populate the table nicely!
                    const matchEvents = filteredEvents.filter(e => {
                      const isSameDay = e.start === day.dateStr;
                      if (!isSameDay) return false;
                      // Distribute based on event ID hash or type to look like a realistic schedule calendar
                      const hash = e.eventId.charCodeAt(e.eventId.length - 1) || 0;
                      const mappedHour = 8 + (hash % 10); // distribute between 08:00 and 18:00
                      return mappedHour === hour;
                    });

                    return (
                      <td key={day.dateStr} className={`p-1 border border-slate-200 dark:border-white/5 align-top min-h-12 ${day.dateStr === selectedDate ? 'bg-blue-500/2 dark:bg-blue-500/1' : ''}`}>
                        <div className="space-y-1">
                          {matchEvents.map(e => {
                            const isSelected = e.eventId === selectedEventId;
                            const isConflict = e.color === 'red';
                            return (
                              <div
                                key={e.eventId}
                                onClick={() => setSelectedEventId(e.eventId)}
                                className={`p-2 rounded-xl border cursor-pointer select-none text-[9px] font-bold text-left transition-all duration-150 relative ${
                                  isConflict
                                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-500'
                                    : isSelected
                                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                                      : 'bg-white dark:bg-[#0b0f19]/40 border-slate-250 dark:border-white/5 text-slate-800 dark:text-slate-300 hover:border-slate-400 dark:hover:border-white/15'
                                }`}
                              >
                                <div className="flex justify-between items-start gap-1">
                                  <span className="font-extrabold truncate uppercase">{e.title}</span>
                                  <span className={`text-[7.5px] px-1 rounded font-black ${
                                    isSelected ? 'bg-white/20 text-white' : getEventBadgeClass(e.type)
                                  }`}>
                                    {getEventTypeName(e.type)}
                                  </span>
                                </div>
                                <div className="mt-1 text-[8.5px] opacity-75 font-medium truncate">{e.description}</div>
                                {isConflict && (
                                  <div className="mt-1 text-[7.5px] font-black text-rose-500 flex items-center gap-0.5">
                                    <AlertTriangle size={8} /> Çakışma Riski
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Render Horizontal Timeline view grouped by Module Types
  const renderTimelineView = () => {
    const modules: { type: CalendarEvent['type']; label: string; color: string }[] = [
      { type: 'reservation', label: 'Reklam Alanları', color: 'bg-emerald-500' },
      { type: 'campaign', label: 'Kampanyalar', color: 'bg-indigo-500' },
      { type: 'contract_expiry', label: 'Sözleşmeler', color: 'bg-purple-500' },
      { type: 'invoice_due', label: 'Finans / Fatura', color: 'bg-teal-500' },
      { type: 'maintenance', label: 'Teknik / Bakım', color: 'bg-rose-500' },
      { type: 'task', label: 'Görevler', color: 'bg-sky-500' }
    ];

    // Grid of days from 1 to 30 of active month
    const daysCount = getDaysInMonth(currentYear, currentMonth);
    const dayCols = Array.from({ length: daysCount }, (_, i) => i + 1);

    return (
      <div className="space-y-4 select-none">
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[900px] border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-[#0b0f19]/30">
            {/* Header row: days of month */}
            <div className="flex border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 py-2">
              <div className="w-40 shrink-0 font-black text-[10px] text-slate-400 uppercase tracking-wider pl-4 flex items-center">Modüller</div>
              <div className="flex-1 flex justify-between">
                {dayCols.map(d => (
                  <div key={d} className="flex-1 text-center font-black text-[9px] text-slate-400 select-none border-l border-slate-100 dark:border-white/2">{d}</div>
                ))}
              </div>
            </div>

            {/* Rows by module types */}
            {modules.map(mod => {
              const modEvents = filteredEvents.filter(e => e.type === mod.type);
              return (
                <div key={mod.type} className="flex border-b border-slate-100 dark:border-white/2 min-h-16 items-center">
                  <div className="w-40 shrink-0 font-extrabold text-[11px] text-slate-800 dark:text-slate-300 pl-4 flex items-center gap-1.5 border-r border-slate-200 dark:border-white/5">
                    {getEventIcon(mod.type, 13)}
                    <span>{mod.label}</span>
                  </div>
                  <div className="flex-1 relative h-16 flex items-center select-none">
                    {/* Render day grid background vertical lines */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none">
                      {dayCols.map(d => (
                        <div key={d} className="flex-1 border-l border-slate-100 dark:border-white/2 h-full"></div>
                      ))}
                    </div>

                    {/* Render events as horizontal bars */}
                    {modEvents.map(e => {
                      // Calculate offset percent values based on start & end dates
                      const startDay = new Date(e.start).getDate();
                      const endDay = new Date(e.end).getDate();
                      const startMonth = new Date(e.start).getMonth();
                      
                      // Skip if event lies outside active month display
                      if (startMonth !== currentMonth) return null;

                      const span = Math.max(1, endDay - startDay + 1);
                      const widthPercent = (span / daysCount) * 100;
                      const leftPercent = ((startDay - 1) / daysCount) * 100;

                      const isSelected = e.eventId === selectedEventId;
                      const isConflict = e.color === 'red';

                      return (
                        <div
                          key={e.eventId}
                          onClick={() => setSelectedEventId(e.eventId)}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            position: 'absolute'
                          }}
                          className={`h-9 px-2.5 rounded-full flex items-center justify-between text-[9px] font-black uppercase tracking-wide cursor-pointer transition-all border shadow-sm truncate select-none ${
                            isConflict
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-500 animate-pulse'
                              : isSelected
                                ? 'bg-blue-600 border-blue-600 text-white scale-102 z-20 shadow-md'
                                : 'bg-slate-150 dark:bg-white/4 border-slate-250 dark:border-white/5 text-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/8'
                          }`}
                          title={`${e.title}: ${e.start} - ${e.end}`}
                        >
                          <span className="truncate">{e.title}</span>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOpenMoveModal(e);
                            }}
                            className={`p-1 rounded-full cursor-pointer hover:bg-black/10 text-[7px] leading-none shrink-0 ${
                              isSelected ? 'text-white' : 'text-slate-400'
                            }`}
                            title="Tarihleri Değiştir"
                          >
                            Taşı
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render Resource view (Space codes row mapping with overlap checking)
  const renderResourceView = () => {
    const daysCount = getDaysInMonth(currentYear, currentMonth);
    const dayCols = Array.from({ length: daysCount }, (_, i) => i + 1);
    
    // Filters only reservations and campaigns
    const resourceEvents = filteredEvents.filter(e => e.type === 'reservation' || e.type === 'campaign');

    return (
      <div className="space-y-4 select-none">
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[900px] border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-[#0b0f19]/30">
            {/* Header row */}
            <div className="flex border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 py-2">
              <div className="w-36 shrink-0 font-black text-[10px] text-slate-400 uppercase tracking-wider pl-4 flex items-center">Reklam Üniteleri</div>
              <div className="flex-1 flex justify-between">
                {dayCols.map(d => (
                  <div key={d} className="flex-1 text-center font-black text-[9px] text-slate-400 border-l border-slate-100 dark:border-white/2">{d}</div>
                ))}
              </div>
            </div>

            {/* List by spaces */}
            {spacesList.map(space => {
              // Get events that are bound to this space code or spaceId
              const spaceEvents = resourceEvents.filter(e => e.spaceIds?.includes(space.id) || e.title.includes(space.code));

              return (
                <div key={space.id} className="flex border-b border-slate-100 dark:border-white/2 min-h-14 items-center">
                  <div className="w-36 shrink-0 pl-4 py-2 border-r border-slate-200 dark:border-white/5 bg-slate-50/20 dark:bg-transparent text-left">
                    <div className="font-black text-[11px] text-blue-450 uppercase">{space.code}</div>
                    <div className="text-[8px] text-slate-500 truncate font-bold">{space.name}</div>
                  </div>
                  <div className="flex-1 relative h-14 flex items-center">
                    {/* Grid lines background */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none">
                      {dayCols.map(d => (
                        <div key={d} className="flex-1 border-l border-slate-100 dark:border-white/2 h-full"></div>
                      ))}
                    </div>

                    {/* Space Event bars */}
                    {spaceEvents.map(e => {
                      const startDay = new Date(e.start).getDate();
                      const endDay = new Date(e.end).getDate();
                      const startMonth = new Date(e.start).getMonth();

                      if (startMonth !== currentMonth) return null;

                      const span = Math.max(1, endDay - startDay + 1);
                      const widthPercent = (span / daysCount) * 100;
                      const leftPercent = ((startDay - 1) / daysCount) * 100;

                      const isSelected = e.eventId === selectedEventId;
                      const isConflict = e.color === 'red';

                      return (
                        <div
                          key={e.eventId}
                          onClick={() => setSelectedEventId(e.eventId)}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            position: 'absolute'
                          }}
                          className={`h-8 px-2 rounded-lg flex items-center justify-between text-[8px] font-black uppercase tracking-wide cursor-pointer transition-all border shadow-sm select-none truncate ${
                            isConflict
                              ? 'bg-rose-500/25 border-rose-500/50 text-rose-500'
                              : isSelected
                                ? 'bg-blue-600 border-blue-600 text-white scale-102 z-20'
                                : e.type === 'campaign' 
                                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}
                          title={`${e.title}: ${e.start} - ${e.end}`}
                        >
                          <span className="truncate flex items-center gap-1">
                            {isConflict && <AlertTriangle size={8} />}
                            {e.title.split(' - ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // UI action functions
  const handleCreateTask = (ev: CalendarEvent) => {
    alert(`[Task Engine] "${ev.title}" ile ilgili planlama görevi oluşturuldu ve yetkililere atandı.`);
  };

  const handleCreateNotification = (ev: CalendarEvent) => {
    alert(`[Notification Engine] "${ev.title}" planı hakkında anlık bildirim tüm ilgili departmanlara gönderildi.`);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Takvim & Planlama Merkezi</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rezervasyonları, kampanyaları, sözleşmeleri, tahsilatları, bakım işleri ve görevleri tek merkezden planlayın.</p>
        </div>
        
        {/* Right Controls Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Sparkles size={13} />}
            className="bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 text-white font-black"
            onClick={() => alert('Planlama motoru analizi başlatıldı: Mercedes bakım işinin Samsung kampanyası ile çakışması engellendi.')}
          >
            OutdoorCore AI
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Plus size={13} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Yeni Event
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            leftIcon={<DownloadCloud size={13} />}
            onClick={() => alert('Planlama Takvimi PDF olarak indiriliyor...')}
          >
            PDF
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            onClick={() => alert('Planlama Takvimi Excel olarak dışa aktarılıyor...')}
          >
            Excel
          </Button>

          <Button 
            variant="minimal" 
            size="sm" 
            onClick={handleGoToToday}
          >
            Bugüne Git
          </Button>
        </div>
      </div>

      {error && (
        <Notification
          title="Hata"
          description={error}
          type="alert"
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Notification
          title="Başarılı"
          description={success}
          type="success"
          onClose={() => setSuccess(null)}
        />
      )}

      {/* Upper KPI grid panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DarkKpiCard
          title="Bugünkü Plan"
          value={String(events.filter(e => e.start === '2025-06-15').length)}
          percentage="AKTİF"
          subtext="Bugünkü işler"
          icon={<CalendarIcon size={15} />}
          iconBgColor="bg-blue-500/10 text-blue-400 border border-blue-500/10"
        />
        <DarkKpiCard
          title="Bu Hafta Rezervasyon"
          value={String(events.filter(e => e.type === 'reservation').length)}
          percentage={`${events.filter(e => e.type === 'reservation' && e.status === 'Çakışma Riski').length} Çakışma`}
          subtext="Kiralamalar"
          icon={<CheckSquare size={15} />}
          iconBgColor="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
          glowColor="green"
        />
        <DarkKpiCard
          title="Aktif Kampanya"
          value={String(events.filter(e => e.type === 'campaign' && e.status === 'Aktif').length)}
          percentage="YAYINDA"
          subtext="Görsel gösterimler"
          icon={<Layers size={15} />}
          iconBgColor="bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
          glowColor="blue"
        />
        <DarkKpiCard
          title="Yaklaşan Sözleşme"
          value={String(events.filter(e => e.type === 'contract_expiry').length)}
          percentage="30 GÜN"
          subtext="Yenileme süreçleri"
          icon={<FileSignature size={15} />}
          iconBgColor="bg-purple-500/10 text-purple-400 border border-purple-500/10"
          glowColor="purple"
        />
        <DarkKpiCard
          title="Vadesi Yaklaşan"
          value={String(events.filter(e => e.type === 'invoice_due' && e.status === 'Bekliyor').length)}
          percentage="GEÇİKMİŞ"
          subtext="Fatura tahsilatları"
          icon={<Coins size={15} />}
          iconBgColor="bg-teal-500/10 text-teal-400 border border-teal-500/10"
          glowColor="yellow"
        />
        <DarkKpiCard
          title="Kritik Görev"
          value={String(events.filter(e => e.priority === 'critical').length)}
          percentage="HEMEN"
          subtext="Yüksek öncelikliler"
          icon={<Wrench size={15} />}
          iconBgColor="bg-rose-500/10 text-rose-455 border border-rose-500/10"
          glowColor="red"
        />
      </div>

      {/* Main splits: Left Filters + Center Calendar + Right Detail & AI recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Filter Options Panel */}
        <div className="order-2 lg:order-none lg:col-span-3">
          <DarkDashboardCard className="space-y-4 text-left">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200 dark:border-white/5">
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
                <SlidersHorizontal size={12} />
                Filtreleme Seçenekleri
              </h3>
              <button 
                onClick={() => {
                  setFilterType('');
                  setFilterCompany('');
                  setFilterSpace('');
                  setFilterPriority('');
                  setFilterStatus('');
                }}
                className="text-[8.5px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest cursor-pointer hover:underline"
              >
                Sıfırla
              </button>
            </div>

            <FormGroup>
              <Label htmlFor="f-type">Plan Türü</Label>
              <Select id="f-type" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">Tümü</option>
                <option value="reservation">Rezervasyon</option>
                <option value="campaign">Kampanya</option>
                <option value="contract_expiry">Sözleşme Bitişi</option>
                <option value="invoice_due">Fatura Vadesi</option>
                <option value="maintenance">Teknik & Bakım</option>
                <option value="task">Kullanıcı Görevi</option>
                <option value="workflow">İş Akışı</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="f-company">Firma</Label>
              <Select id="f-company" value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
                <option value="">Tümü</option>
                {companiesList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="f-space">Reklam Ünitesi (Space)</Label>
              <Select id="f-space" value={filterSpace} onChange={e => setFilterSpace(e.target.value)}>
                <option value="">Tümü</option>
                {spacesList.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="f-priority">Öncelik</Label>
              <Select id="f-priority" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                <option value="">Tümü</option>
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
                <option value="critical">Kritik</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="f-status">Durum</Label>
              <Select id="f-status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Tümü</option>
                <option value="aktif">Aktif</option>
                <option value="planlandı">Planlandı</option>
                <option value="tamamlandı">Tamamlandı</option>
                <option value="gecikti">Gecikti / Ödenmedi</option>
                <option value="teklif">Teklif / Opsiyon</option>
                <option value="çakışma">Çakışma / Riskli</option>
              </Select>
            </FormGroup>

            <div className="pt-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              Toplam {filteredEvents.length} eşleşen plan listelendi.
            </div>
          </DarkDashboardCard>
        </div>

        {/* Center: Interactive Main Calendar Component Workspace */}
        <div className="order-1 lg:order-none lg:col-span-6 space-y-4">
          <DarkDashboardCard className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 mb-4 select-none">
              
              {/* Month Selector Title */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-center bg-slate-50 dark:bg-white/2 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer text-slate-500 dark:text-slate-300"
                >
                  <ChevronLeft size={14} />
                </button>
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest min-w-36 text-center leading-none">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <button 
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-center bg-slate-50 dark:bg-white/2 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer text-slate-500 dark:text-slate-300"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex flex-wrap bg-slate-100 dark:bg-white/2 p-0.75 rounded-2xl border border-slate-200 dark:border-white/5 select-none w-full sm:w-auto">
                {(['day', 'week', 'month', 'timeline', 'resource'] as const).map(view => {
                  const viewLabels = {
                    day: 'Günlük',
                    week: 'Haftalık',
                    month: 'Aylık',
                    timeline: 'Timeline',
                    resource: 'Kaynak'
                  };
                  return (
                    <button
                      key={view}
                      onClick={() => setActiveView(view)}
                      className={`flex-1 sm:flex-initial px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        activeView === view
                          ? 'bg-white dark:bg-[#0b0f19] text-blue-500 dark:text-blue-400 shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent'
                      }`}
                    >
                      {viewLabels[view]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display loading state */}
            {loading ? (
              <div className="py-24 text-center font-bold text-slate-500 uppercase tracking-widest text-[10px] animate-pulse">
                Planlama verileri yükleniyor...
              </div>
            ) : (
              <>
                {/* Monthly View Grid */}
                {activeView === 'month' && (
                  <div className="space-y-1">
                    {/* Days of week titles */}
                    <div className="grid grid-cols-7 gap-1 mb-1 text-center font-black text-[9px] uppercase tracking-wider text-slate-400">
                      <div>Pzt</div>
                      <div>Sal</div>
                      <div>Çar</div>
                      <div>Per</div>
                      <div>Cum</div>
                      <div>Cmt</div>
                      <div>Paz</div>
                    </div>
                    {/* Monthly grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {renderMonthDays()}
                    </div>
                  </div>
                )}

                {/* Daily / Weekly hour-grid list */}
                {(activeView === 'day' || activeView === 'week') && renderWeeklyDailyView()}

                {/* Timeline Grid */}
                {activeView === 'timeline' && renderTimelineView()}

                {/* Resource Space Grid */}
                {activeView === 'resource' && renderResourceView()}
              </>
            )}
          </DarkDashboardCard>
        </div>

        {/* Right Side: Detail Actions and AI Recommendations */}
        <div className="order-3 lg:order-none lg:col-span-3 space-y-6 text-left">
          {/* Selected Event Detail Container */}
          {selectedEvent ? (
            <DarkDashboardCard className="space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200 dark:border-white/5">
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
                  {getEventIcon(selectedEvent.type, 13)}
                  <span>Plan Detayı</span>
                </h3>
                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase ${getEventBadgeClass(selectedEvent.type)}`}>
                  {getEventTypeName(selectedEvent.type)}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">{selectedEvent.title}</h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 text-[10px] font-bold border-t border-b border-slate-100 dark:border-white/2 py-3 select-none">
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase tracking-wider">Başlangıç Tarihi</span>
                  <span className="text-slate-800 dark:text-slate-300 font-extrabold">{selectedEvent.start}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase tracking-wider">Bitiş Tarihi</span>
                  <span className="text-slate-800 dark:text-slate-300 font-extrabold">{selectedEvent.end}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase tracking-wider">Durum</span>
                  <span className={`font-black ${
                    selectedEvent.status === 'Çakışma Riski' || selectedEvent.status === 'Gecikti'
                      ? 'text-rose-500'
                      : selectedEvent.status === 'Tamamlandı'
                        ? 'text-emerald-500'
                        : 'text-blue-500'
                  }`}>{selectedEvent.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px] uppercase tracking-wider">Öncelik</span>
                  <span className={`font-black uppercase text-[9px] ${
                    selectedEvent.priority === 'critical' 
                      ? 'text-rose-500' 
                      : selectedEvent.priority === 'high' 
                        ? 'text-amber-500'
                        : 'text-slate-400'
                  }`}>{selectedEvent.priority}</span>
                </div>
              </div>

              {/* Related entities mapped via EntityLink */}
              <div className="space-y-2 select-none">
                <span className="text-slate-400 block text-[8px] uppercase tracking-wider">Bağlantılı Sistem Kartları</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent.companyId && (
                    <EntityLink 
                      type="company" 
                      id={selectedEvent.companyId} 
                      label={companiesList.find(c => c.id === selectedEvent.companyId)?.name || 'Firma Kartı'} 
                    />
                  )}
                  {selectedEvent.spaceIds && selectedEvent.spaceIds.map(sid => (
                    <EntityLink 
                      key={sid}
                      type="space" 
                      id={sid} 
                      label={spacesList.find(s => s.id === sid)?.code || 'Ünite Kartı'} 
                    />
                  ))}
                  {selectedEvent.sourceEntityType === 'contract' && (
                    <EntityLink 
                      type="contract" 
                      id={selectedEvent.sourceEntityId} 
                      label={`Sözleşme #${selectedEvent.sourceEntityId}`} 
                    />
                  )}
                  {selectedEvent.sourceEntityType === 'campaign' && (
                    <EntityLink 
                      type="campaign" 
                      id={selectedEvent.sourceEntityId} 
                      label={`Kampanya #${selectedEvent.sourceEntityId}`} 
                    />
                  )}
                </div>
              </div>

              {/* Conflict Alert Warn Card */}
              {selectedEvent.color === 'red' && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-2 select-none">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider block">Çakışma Riski Tespit Edildi</span>
                    <span className="text-[9px] leading-tight font-semibold block">
                      Aynı tarih aralığında aynı reklam ünitesi için birden fazla aktif rezervasyon yapılmıştır. Lütfen "Taşı" eylemi ile tarihleri kaydırın.
                    </span>
                  </div>
                </div>
              )}

              {/* Actions panel */}
              <div className="space-y-1.5 pt-2">
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full text-[9px] font-black uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white"
                  onClick={() => {
                    // Navigate to source record
                    if (selectedEvent.sourceEntityType === 'company') setCurrentRoute('firmalar-markalar');
                    else if (selectedEvent.sourceEntityType === 'space') setCurrentRoute('reklam-alanlari');
                    else if (selectedEvent.sourceEntityType === 'contract') setCurrentRoute('sozlesmeler');
                    else if (selectedEvent.sourceEntityType === 'campaign') setCurrentRoute('kampanyalar');
                    else if (selectedEvent.sourceEntityType === 'offer') setCurrentRoute('teklifler');
                    else if (selectedEvent.sourceEntityType === 'invoice') setCurrentRoute('finans');
                    else alert(`Bu manual kaydın detay sayfası bulunmuyor.`);
                  }}
                >
                  Kayda Git &rarr;
                </Button>
                
                <div className="grid grid-cols-2 gap-1.5">
                  <Button 
                    variant="outline" 
                    size="xs" 
                    className="text-[8.5px] font-black uppercase"
                    onClick={() => handleCreateTask(selectedEvent)}
                  >
                    Görev Oluştur
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xs" 
                    className="text-[8.5px] font-black uppercase"
                    onClick={() => handleCreateNotification(selectedEvent)}
                  >
                    Bildirim Yap
                  </Button>
                </div>

                {selectedEvent.status !== 'Tamamlandı' && (
                  <Button 
                    variant="ghost" 
                    size="xs" 
                    className="w-full text-[8.5px] font-black uppercase border border-white/5 hover:bg-emerald-500/10 hover:text-emerald-500"
                    onClick={() => handleMarkAsCompleted(selectedEvent)}
                  >
                    ✓ Tamamlandı İşaretle
                  </Button>
                )}

                <Button 
                  variant="minimal" 
                  size="xs" 
                  className="w-full text-[8.5px] font-black uppercase text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20"
                  onClick={() => handleDeleteEvent(selectedEvent.eventId)}
                >
                  Takvimden Sil
                </Button>
              </div>
            </DarkDashboardCard>
          ) : (
            <DarkDashboardCard className="p-4 text-center text-slate-500 text-[10px] font-bold uppercase tracking-wider py-8 select-none">
              Detayları görmek için takvimden bir event seçin.
            </DarkDashboardCard>
          )}

          {/* AI recommendations card */}
          <DarkDashboardCard className="relative overflow-hidden text-left bg-gradient-to-br from-[#09101b] to-[#0f172a] dark:from-[#0a111e] dark:to-[#080d1a] border border-blue-500/20 shadow-md">
            {/* Sparkles background glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="space-y-3 relative z-10 select-none">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-blue-400 animate-pulse" />
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Planlama Önerileri</h4>
              </div>

              <div className="space-y-2.5 text-[9.5px] font-bold leading-normal text-slate-300">
                <div className="p-2 rounded-xl bg-white/2 dark:bg-white/1 border border-white/5">
                  • <span className="text-white">SG-021</span> için 12-18 Ağustos arası yoğunluk yüksek.
                </div>
                <div className="p-2 rounded-xl bg-white/2 dark:bg-white/1 border border-white/5">
                  • <span className="text-amber-400">3 sözleşme</span> 30 gün içinde bitiyor.
                </div>
                <div className="p-2 rounded-xl bg-white/2 dark:bg-white/1 border border-white/5">
                  • <span className="text-amber-400">5 fatura</span> bu hafta vade.
                </div>
                <div className="p-2 rounded-xl bg-white/2 dark:bg-white/1 border border-white/5">
                  • <span className="text-rose-450">Mercedes bakım işi</span> kampanya başlangıcından önce tamamlanmalı.
                </div>
                <div className="p-2 rounded-xl bg-white/2 dark:bg-white/1 border border-white/5">
                  • Samsung için alternatif tarih önerisi: <span className="text-blue-400">20 Ağu - 20 Eyl</span>.
                </div>
              </div>
            </div>
          </DarkDashboardCard>

          {/* Critical tasks checklist widget */}
          <DarkDashboardCard className="space-y-3.5 text-left">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <CheckSquare size={11} /> Yaklaşan Kritik İşler
            </h4>
            <div className="space-y-2 select-none text-[9.5px] font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                <span className="truncate">Samsung görsel revizyonu onayla</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                <span className="truncate">Turkcell vadesi geçmiş tahsilat ihtarı</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span className="truncate">THY sözleşme yenileme teklif onayı</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                <span className="truncate">SG-045 LED ekran modül değişimi testi</span>
              </div>
            </div>
          </DarkDashboardCard>
        </div>
      </div>

      {/* CREATE EVENT MODAL CONTAINER */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={eventInput.type === 'reservation' && reservationType === 'led' ? "LED Video Reklam Rezervasyonu Oluştur" : "Takvime Yeni Event Ekle"}
        footerActions={
          eventInput.type === 'reservation' && reservationType === 'led' ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>İptal</Button>
              <Button
                type="submit"
                form="led-reservation-form"
                variant="primary"
                size="sm"
                className="bg-blue-650 hover:bg-blue-600 text-white font-bold"
                onClick={() => {
                  const formEl = document.getElementById('led-reservation-form') as HTMLFormElement;
                  if (formEl) formEl.requestSubmit();
                }}
              >
                Rezervasyon Oluştur
              </Button>
            </div>
          ) : undefined
        }
      >
        <div className="space-y-4">
          <FormGroup>
            <Label htmlFor="ev-type">Event Türü *</Label>
            <Select
              id="ev-type"
              value={eventInput.type}
              onChange={e => setEventInput(prev => ({ ...prev, type: e.target.value as any }))}
            >
              <option value="reservation">Rezervasyon</option>
              <option value="campaign">Kampanya</option>
              <option value="contract_expiry">Sözleşme Bitişi</option>
              <option value="invoice_due">Fatura Vadesi</option>
              <option value="maintenance">Teknik & Bakım</option>
              <option value="task">Kullanıcı Görevi</option>
              <option value="workflow">İş Akışı</option>
            </Select>
          </FormGroup>

          {eventInput.type === 'reservation' && (
            <FormGroup>
              <Label htmlFor="ev-res-type">Rezervasyon Tipi *</Label>
              <Select
                id="ev-res-type"
                value={reservationType}
                onChange={e => setReservationType(e.target.value as any)}
              >
                <option value="static">Statik Reklam Alanı</option>
                <option value="led">LED Video Reklam</option>
              </Select>
            </FormGroup>
          )}

          {eventInput.type === 'reservation' && reservationType === 'led' ? (
            <LedReservationForm
              onSuccess={() => {
                setCreateModalOpen(false);
                loadEvents();
                setSuccess('LED Playlist Slotu başarıyla oluşturuldu, anlık Proof of Play logları ve workflowlar tetiklendi.');
              }}
              onCancel={() => setCreateModalOpen(false)}
            />
          ) : (
            <form onSubmit={handleCreateEvent} className="space-y-4 text-left">
              <FormGroup>
                <Label htmlFor="ev-title">Event Başlığı *</Label>
                <Input
                  id="ev-title"
                  required
                  placeholder="Firma veya kampanya ismi..."
                  value={eventInput.title}
                  onChange={e => setEventInput(prev => ({ ...prev, title: e.target.value }))}
                />
              </FormGroup>

              <div className="grid grid-cols-2 gap-4">
                <FormGroup>
                  <Label htmlFor="ev-priority">Öncelik *</Label>
                  <Select
                    id="ev-priority"
                    value={eventInput.priority}
                    onChange={e => setEventInput(prev => ({ ...prev, priority: e.target.value as any }))}
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                    <option value="critical">Kritik</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="ev-amount">Parasal Değer (₺ - Opsiyonel)</Label>
                  <Input
                    id="ev-amount"
                    type="number"
                    placeholder="Tutar girin..."
                    value={eventInput.amount}
                    onChange={e => setEventInput(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </FormGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormGroup>
                  <Label htmlFor="ev-start">Başlangıç Tarihi *</Label>
                  <Input
                    id="ev-start"
                    type="date"
                    required
                    value={eventInput.start}
                    onChange={e => setEventInput(prev => ({ ...prev, start: e.target.value }))}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="ev-end">Bitiş Tarihi *</Label>
                  <Input
                    id="ev-end"
                    type="date"
                    required
                    value={eventInput.end}
                    onChange={e => setEventInput(prev => ({ ...prev, end: e.target.value }))}
                  />
                </FormGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormGroup>
                  <Label htmlFor="ev-company">Firma İlişkisi</Label>
                  <Select
                    id="ev-company"
                    value={eventInput.companyId}
                    onChange={e => setEventInput(prev => ({ ...prev, companyId: e.target.value }))}
                  >
                    <option value="">İlişkilendirme Yok</option>
                    {companiesList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="ev-space">Reklam Ünitesi İlişkisi</Label>
                  <Select
                    id="ev-space"
                    value={eventInput.spaceId}
                    onChange={e => setEventInput(prev => ({ ...prev, spaceId: e.target.value }))}
                  >
                    <option value="">İlişkilendirme Yok</option>
                    {spacesList.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </Select>
                </FormGroup>
              </div>

              <FormGroup>
                <Label htmlFor="ev-desc">Plan Açıklaması</Label>
                <textarea
                  id="ev-desc"
                  rows={3}
                  placeholder="Detaylı planlama notlarını ekleyin..."
                  className="w-full text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-white/3 border border-slate-250 dark:border-white/5 rounded-xl p-2.5 text-xs outline-none"
                  value={eventInput.description}
                  onChange={e => setEventInput(prev => ({ ...prev, description: e.target.value }))}
                />
              </FormGroup>

              <div className="flex justify-end gap-2.5 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateModalOpen(false)}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-blue-650 hover:bg-blue-600 text-white"
                >
                  Kaydet
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* MOVE DATES SIMULATION MODAL */}
      <Modal
        isOpen={moveModalOpen}
        onClose={() => setMoveModalOpen(false)}
        title="Tarihleri Yeniden Planla (Taşı)"
      >
        <form onSubmit={handleMoveEventSubmit} className="space-y-4 text-left select-none">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl text-[10px] font-bold mb-2">
            ℹ️ SÜRÜKLE BIRAK / PLANLAMA SİMÜLASYONU: Seçilen planlama eyleminin yayın veya teslim tarihlerini kaydırabilirsiniz. Sistem anlık çakışma kontrolleri yapacaktır.
          </div>

          {movingEvent && (
            <div className="mb-4">
              <span className="text-slate-450 block text-[9px] uppercase tracking-wider mb-1">Seçilen Plan</span>
              <div className="font-extrabold text-xs text-white">{movingEvent.title}</div>
              <div className="text-[9px] text-slate-400 mt-0.5">{getEventTypeName(movingEvent.type)} | {movingEvent.start} - {movingEvent.end}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormGroup>
              <Label htmlFor="m-start">Yeni Başlangıç Tarihi</Label>
              <Input
                id="m-start"
                type="date"
                required
                value={newDates.start}
                onChange={e => setNewDates(prev => ({ ...prev, start: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="m-end">Yeni Bitiş Tarihi</Label>
              <Input
                id="m-end"
                type="date"
                required
                value={newDates.end}
                onChange={e => setNewDates(prev => ({ ...prev, end: e.target.value }))}
              />
            </FormGroup>
          </div>

          <div className="flex justify-end gap-2.5 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMoveModalOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-blue-650 hover:bg-blue-600 text-white font-bold"
            >
              Planlamayı Kaydır
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
