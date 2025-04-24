import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Divider,
  Breadcrumbs,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  AvatarGroup,
  Avatar,
  Badge,
  Button,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  CalendarMonth as CalendarIcon,
  List as ListIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Work as WorkIcon,
  HealthAndSafety as HealthIcon,
  Event as EventIcon,
  Restaurant as RestaurantIcon,
  Business as BusinessIcon,
  MoreHoriz as MoreIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addDays, subDays, startOfWeek, endOfWeek, parseISO, isSameMonth } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
}));

const SidebarPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
}));

const CompactCalendar = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '2px',
}));

const CalendarDay = styled(Box)(({ theme, isToday, isSelected, hasEvents }) => ({
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  cursor: 'pointer',
  borderRadius: '4px',
  backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
  color: isToday ? '#1976d2' : 'inherit',
  fontWeight: isToday ? 'bold' : 'normal',
  position: 'relative',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  '&::after': hasEvents ? {
    content: '""',
    position: 'absolute',
    bottom: '2px',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#1976d2',
  } : {},
}));

const CategoryItem = styled(ListItem)(({ theme, color }) => ({
  borderRadius: '6px',
  marginBottom: '4px',
  '&:hover': {
    backgroundColor: `${color}10`,
  },
}));

const TimeColumn = styled(Box)(({ theme }) => ({
  width: '80px',
  position: 'sticky',
  left: 0,
  backgroundColor: '#fff',
  zIndex: 2,
  borderRight: '1px solid #edf2f7',
  '& .time-slot': {
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    color: '#718096',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
}));

const EventCard = styled(Box)(({ color = '#E3F2FD' }) => ({
  backgroundColor: color,
  borderRadius: '8px',
  padding: '8px 12px',
  marginBottom: '4px',
  position: 'relative',
  minHeight: '60px',
  fontSize: '0.75rem',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    backgroundColor: color === '#FFE0E0' ? '#FF5252' : 
                    color === '#E8F5E9' ? '#4CAF50' :
                    color === '#E3F2FD' ? '#2196F3' :
                    color === '#FFF3E0' ? '#FFC107' : '#FF5252',
    borderRadius: '4px 0 0 4px',
  },
}));

const EventTitle = styled(Typography)({
  fontSize: '0.875rem',
  fontWeight: 500,
  marginBottom: '4px',
  color: '#2D3748',
});

const EventTime = styled(Typography)({
  fontSize: '0.75rem',
  color: '#718096',
  marginBottom: '2px',
});

const EventLocation = styled(Typography)({
  fontSize: '0.75rem',
  color: '#718096',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginBottom: '4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const EventOrganizer = styled(Typography)({
  fontSize: '0.75rem',
  color: '#718096',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

const StyledAvatarGroup = styled(AvatarGroup)({
  '& .MuiAvatar-root': {
    width: 24,
    height: 24,
    fontSize: '0.75rem',
    border: '2px solid #fff',
  },
});

const HeaderBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderBottom: '1px solid #edf2f7',
  padding: theme.spacing(2, 3),
  borderRadius: '12px 12px 0 0',
}));

const ViewToggle = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  '& .MuiToggleButton-root': {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#718096',
    fontSize: '0.875rem',
    padding: theme.spacing(0.5, 2),
    '&.Mui-selected': {
      backgroundColor: '#fff',
      color: '#1976d2',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
  },
}));

const EventCount = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#E3F2FD',
    color: '#1976d2',
    fontSize: '0.75rem',
    padding: theme.spacing(0, 1),
    height: '20px',
    minWidth: '20px',
    borderRadius: '10px',
  },
}));

const MonthViewContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '1px',
  backgroundColor: '#edf2f7',
  borderRadius: '0 0 12px 12px',
  height: 'calc(100vh - 250px)',
  minHeight: '700px',
}));

const MonthDayCell = styled(Box)(({ theme, isToday }) => ({
  backgroundColor: '#ffffff',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  position: 'relative',
  ...(isToday && {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      backgroundColor: '#1976d2',
    },
  }),
}));

const MonthDayHeader = styled(Box)(({ theme, isToday }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& .date': {
    fontWeight: isToday ? 600 : 400,
    color: isToday ? '#1976d2' : '#2D3748',
  },
}));

const MonthEventChip = styled(Box)(({ color = '#E3F2FD' }) => ({
  backgroundColor: color,
  borderRadius: '4px',
  padding: '2px 8px',
  fontSize: '0.75rem',
  marginBottom: '2px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '&:hover': {
    filter: 'brightness(0.95)',
  },
}));

const MoreEventsButton = styled(Button)(({ theme }) => ({
  fontSize: '0.75rem',
  padding: '2px 8px',
  minWidth: 'unset',
  color: '#718096',
  '&:hover': {
    backgroundColor: '#f7fafc',
  },
}));

const MiniCalendarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const DayHeader = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: '#718096',
  fontSize: '0.75rem',
  fontWeight: 500,
  padding: theme.spacing(0.5),
}));

const EmptyDay = styled(Box)(({ theme }) => ({
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  color: 'transparent',
}));

const DayCell = styled(Box)(({ theme, isCurrentMonth, isToday }) => ({
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  cursor: 'pointer',
  borderRadius: '4px',
  backgroundColor: isToday ? '#e3f2fd' : 'transparent',
  color: isCurrentMonth ? 'text.primary' : 'text.disabled',
  fontWeight: isToday ? 'bold' : 'normal',
  position: 'relative',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const TimelineContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  backgroundColor: '#ffffff',
  borderRadius: '0 0 12px 12px',
  overflow: 'hidden',
}));

const TimeSlot = styled(Box)(({ theme }) => ({
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  color: '#718096',
  fontSize: '0.75rem',
  fontWeight: 500,
  borderBottom: '1px solid #edf2f7',
}));

const DayColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  borderRight: '1px solid #edf2f7',
  '&:last-child': {
    borderRight: 'none',
  },
}));

const EventsContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 'calc(100% - 50px)',
  overflow: 'hidden',
}));

const RecruiterTimeline = () => {
  const { token } = useAuth();
  const [selectedView, setSelectedView] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visibleDates, setVisibleDates] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    dailyStandup: true,
    weeklyReview: true,
    teamMeeting: true,
    lunchBreak: true,
    clientMeeting: true,
    other: true,
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { name: 'Work', color: '#FF5252', count: 0, icon: <WorkIcon />, filter: ['dailyStandup', 'weeklyReview'] },
    { name: 'Health', color: '#4CAF50', count: 0, icon: <HealthIcon />, filter: ['other'] },
    { name: 'Personal', color: '#2196F3', count: 0, icon: <EventIcon />, filter: ['other'] },
    { name: 'Meeting', color: '#FFC107', count: 0, icon: <BusinessIcon />, filter: ['teamMeeting', 'clientMeeting'] },
  ];

  useEffect(() => {
    if (token) {
      console.log('Initial fetch for current date:', new Date().toISOString());
      const initializeData = async () => {
        await fetchEvents();
        await fetchAvailableSlots(new Date());
      };
      initializeData();
    }
  }, [token]);

  useEffect(() => {
    if (token && selectedDate) {
      console.log('Fetching events for date/view change:', {
        date: selectedDate.toISOString(),
        view: selectedView
      });
      fetchEvents();
    }
  }, [selectedDate, selectedView, token]);

  useEffect(() => {
    updateVisibleDates();
  }, [selectedDate, selectedView]);

  useEffect(() => {
    updateFilteredEvents();
  }, [filters, visibleDates, events]);

  const updateVisibleDates = () => {
    let dates = [];
    if (selectedView === 'day') {
      dates = [selectedDate];
    } else if (selectedView === 'week') {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      for (let i = 0; i < 7; i++) {
        dates.push(addDays(start, i));
      }
    } else {
      // Month view
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);
      dates = eachDayOfInterval({ start, end });
    }
    setVisibleDates(dates);
  };

  const updateFilteredEvents = () => {
    if (!Array.isArray(events)) return;
    
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const filtered = events.filter(event => {
      try {
        if (!event.start_time || typeof event.start_time !== 'string') {
          console.warn('Invalid event start_time:', event);
          return false;
        }

        const eventDate = new Date(event.start_time);
        if (isNaN(eventDate.getTime())) {
          console.warn('Invalid date:', event.start_time);
          return false;
        }

        const isDateVisible = visibleDates.some(date => isSameDay(date, eventDate));
        const eventCategory = categories.find(cat => 
          cat.filter.some(f => event.title.toLowerCase().includes(f.toLowerCase()))
        );
        return isDateVisible && (eventCategory ? activeFilters.includes(eventCategory.filter[0]) : true);
      } catch (error) {
        console.warn('Error filtering event:', error, event);
        return false;
      }
    });

    // Update category counts
    const updatedCategories = categories.map(category => ({
      ...category,
      count: filtered.filter(event => 
        category.filter.some(f => event.title.toLowerCase().includes(f.toLowerCase()))
      ).length
    }));

    setFilteredEvents(filtered);
  };

  const handleViewChange = (event, newValue) => {
    if (newValue !== null) {
      console.log('View changed to:', newValue);
      setSelectedView(newValue);
      // Force a refresh of events when view changes
      fetchEvents();
    }
  };

  const handleFilterChange = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handlePrevPeriod = () => {
    if (selectedView === 'day') {
      setSelectedDate(subDays(selectedDate, 1));
    } else if (selectedView === 'week') {
      setSelectedDate(subDays(selectedDate, 7));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const handleNextPeriod = () => {
    if (selectedView === 'day') {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (selectedView === 'week') {
      setSelectedDate(addDays(selectedDate, 7));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  const handleToday = () => {
    console.log('Today button clicked, setting date to:', new Date().toISOString());
    setSelectedDate(new Date());
    // Force a refresh of events when returning to today
    fetchEvents();
  };

  const getHeaderTitle = () => {
    if (selectedView === 'day') {
      return format(selectedDate, 'MMMM d, yyyy');
    } else if (selectedView === 'week') {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    return format(selectedDate, 'MMMM yyyy');
  };

  const renderTimeColumn = () => {
    const hours = Array.from({ length: 10 }, (_, i) => i + 13); // 1 PM (13:00) to 10 PM (22:00)
    return (
      <TimeColumn>
        <Box sx={{ height: '50px' }}>UTC +1</Box>
        {hours.map((hour) => {
          // Create a date at the specific hour with minutes set to 00
          const timeString = hour === 13 ? '1:00 PM' :
                           hour === 14 ? '2:00 PM' :
                           hour === 15 ? '3:00 PM' :
                           hour === 16 ? '4:00 PM' :
                           hour === 17 ? '5:00 PM' :
                           hour === 18 ? '6:00 PM' :
                           hour === 19 ? '7:00 PM' :
                           hour === 20 ? '8:00 PM' :
                           hour === 21 ? '9:00 PM' :
                           '10:00 PM';
          return (
            <Box key={hour} className="time-slot">
              {timeString}
            </Box>
          );
        })}
      </TimeColumn>
    );
  };

  const renderDayColumn = (day, date) => {
    const dayEvents = events.filter(event => {
      try {
        if (!event.start_time || typeof event.start_time !== 'string') {
          console.warn('Invalid event start_time:', event);
          return false;
        }

        const eventDate = new Date(event.start_time);
        if (isNaN(eventDate.getTime())) {
          console.warn('Invalid date:', event.start_time);
          return false;
        }

        return format(eventDate, 'EEEE') === day;
      } catch (error) {
        console.warn('Error parsing event date:', error, event);
        return false;
      }
    });

    // Calculate the total height of the timeline (10 hours from 1 PM to 10 PM)
    const timelineHeight = 10 * 60; // 10 hours in minutes
    const startHour = 13; // 1 PM

    return (
      <Box 
        key={`day-${date}`} 
        sx={{ 
          flex: 1, 
          minWidth: '200px',
          p: 1,
          position: 'relative',
          height: '100%'
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#718096' }}>
          {day}
        </Typography>
        <Box sx={{ 
          position: 'relative',
          height: 'calc(108vh - 3px)',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
        }}>
          {dayEvents.map((event) => {
            try {
              const startTime = new Date(event.start_time);
              const endTime = new Date(event.end_time);
              
              // Calculate position and height based on time (adjusted for 1 PM start)
              const startMinutes = (startTime.getHours() - startHour) * 60 + startTime.getMinutes();
              const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
              
              const topPosition = (startMinutes / timelineHeight) * 100;
              const height = Math.max((durationMinutes / timelineHeight) * 100, 10);

              return (
                <EventCard 
                  key={`event-${event.id}`}
                  color={getEventColor(event.title)}
                  sx={{
                    position: 'absolute',
                    top: `${topPosition}%`,
                    left: '4px',
                    right: '4px',
                    height: `${height}%`,
                    minHeight: '40px',
                    zIndex: 1,
                  }}
                >
                  <EventTime>
                    {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                  </EventTime>
                  <EventTitle>{event.title}</EventTitle>
                  {event.organizer && (
                    <EventOrganizer>
                      <PersonIcon sx={{ fontSize: '0.875rem' }} />
                      {event.organizer}
                    </EventOrganizer>
                  )}
                </EventCard>
              );
            } catch (error) {
              console.warn('Error rendering event:', error, event);
              return null;
            }
          })}
        </Box>
      </Box>
    );
  };

  const getEventColor = (title) => {
    if (title.toLowerCase().includes('daily') || title.toLowerCase().includes('weekly')) {
      return '#FFE0E0';
    } else if (title.toLowerCase().includes('health') || title.toLowerCase().includes('checkup')) {
      return '#E8F5E9';
    } else if (title.toLowerCase().includes('meeting')) {
      return '#FFF3E0';
    }
    return '#E3F2FD';
  };

  const renderMonthView = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });

    return (
      <Box sx={{ 
        display: 'flex',
        height: 'calc(100vh - 200px)',
        backgroundColor: '#ffffff',
        borderRadius: '0 0 12px 12px',
        overflow: 'auto'
      }}>
        {renderTimeColumn()}
        <Box sx={{ 
          display: 'flex',
          flex: 1,
          minWidth: 0,
          // overflowX: 'auto'
        }}>
          {days.map((date) => {
            const dayEvents = events.filter(event => {
              try {
                const eventDate = new Date(event.start_time);
                return isSameDay(eventDate, date);
              } catch (error) {
                console.warn('Error filtering events for day:', error);
                return false;
              }
            });

            return (
              <Box 
                key={`month-day-${date.toISOString()}`}
                sx={{ 
                  flex: '0 0 250px',
                  minWidth: '250px',
                  p: 2,
                  borderRight: '1px solid #edf2f7',
                  backgroundColor: isToday(date) ? '#f8fafc' : 'transparent',
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 2, 
                    color: '#718096',
                    fontWeight: isToday(date) ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    position: 'sticky',
                    top: 0,
                    backgroundColor: isToday(date) ? '#f8fafc' : '#ffffff',
                    zIndex: 1,
                    py: 1
                  }}
                >
                  <span>{format(date, 'EEE')}</span>
                  <span style={{ 
                    color: isToday(date) ? '#1976d2' : '#2D3748',
                    fontWeight: isToday(date) ? 600 : 500
                  }}>
                    {format(date, 'd')}
                  </span>
                </Typography>
                
                <Box sx={{ position: 'relative' }}>
                  {Array.from({ length: 10 }, (_, i) => i + 13).map((hour) => (
                    <Box
                      key={`hour-${hour}`}
                      sx={{
                        height: '80px',
                        borderTop: '1px solid #edf2f7',
                        position: 'relative'
                      }}
                    >
                      {dayEvents
                        .filter(event => {
                          const eventDate = new Date(event.start_time);
                          return eventDate.getHours() === hour;
                        })
                        .map((event) => {
                          const startTime = new Date(event.start_time);
                          const endTime = new Date(event.end_time);
                          const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // duration in minutes
                          const height = Math.max((duration / 60) * 40, 40); // 40px per hour

                          return (
                            <EventCard 
                              key={`event-${event.id}`}
                              color={getEventColor(event.title)}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: `${height}px`,
                                minHeight: '40px',
                                zIndex: 2
                              }}
                            >
                              <EventTime>
                                {format(startTime, 'h:mm a')}
                              </EventTime>
                              <EventTitle>{event.title}</EventTitle>
                            </EventCard>
                          );
                        })}
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '';
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const date = format(selectedDate, 'yyyy-MM-dd');
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const baseUrl = 'http://localhost:8000';

      if (selectedView === 'day') {
        url = `${baseUrl}/api/calendar/events/day?date=${date}&timezone=${timezone}`;
        console.log('=== DAY VIEW API REQUEST ===');
      } else if (selectedView === 'week') {
        const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const endOfWeekDate = endOfWeek(selectedDate, { weekStartsOn: 1 });
        url = `${baseUrl}/api/calendar/events/week?start_date=${format(startOfWeekDate, 'yyyy-MM-dd')}&end_date=${format(endOfWeekDate, 'yyyy-MM-dd')}&timezone=${timezone}`;
        console.log('=== WEEK VIEW API REQUEST ===');
      } else if (selectedView === 'month') {
        url = `${baseUrl}/api/calendar/events/month?year=${year}&month=${month}&timezone=${timezone}`;
        console.log('=== MONTH VIEW API REQUEST ===');
      }

      console.log('Request Parameters:', {
        selectedView,
        selectedDate: selectedDate.toISOString(),
        url,
        timezone,
        year,
        month,
        date
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server Error Response:', errorText);
        throw new Error(`Failed to fetch events: ${errorText}`);
      }

      const data = await response.json();
      console.log('Raw API Response:', data);
      
      if (data.status === 'success') {
        if (!data.events || !Array.isArray(data.events)) {
          console.log('No events array in response, initializing empty array');
          setEvents([]);
          return;
        }

        console.log('Number of Events Received:', data.events.length);

        const transformedEvents = data.events.map(event => {
          try {
            let startTime, endTime;
            
            if (selectedView === 'day') {
              console.log('Processing Day View Event:', event);
              if (!event.start?.dateTime || !event.end?.dateTime) {
                console.warn('Event missing start or end dateTime:', event);
                return null;
              }
              startTime = event.start.dateTime;
              endTime = event.end.dateTime;
            } else {
              console.log('Processing Week/Month View Event:', event);
              if (!event.start || !event.end) {
                console.warn('Event missing start or end date:', event);
                return null;
              }
              startTime = event.start;
              endTime = event.end;
            }

            const transformedEvent = {
              id: event.id,
              title: event.title || event.subject || 'Untitled Meeting',
              start_time: startTime,
              end_time: endTime,
              location: typeof event.location === 'object' ? event.location.displayName : event.location || 'No Location',
              description: event.description || '',
              organizer: typeof event.organizer === 'object' ? event.organizer.emailAddress?.name || event.organizer.emailAddress?.address : event.organizer || 'Unknown Organizer'
            };

            console.log('Transformed Event:', transformedEvent);
            return transformedEvent;
          } catch (error) {
            console.warn('Error Transforming Event:', error, event);
            return null;
          }
        }).filter(Boolean);

        console.log('Final Transformed Events:', transformedEvents);
        setEvents(transformedEvents);
        
        // Update filtered events after setting events
        updateFilteredEvents();
      } else {
        console.error('Invalid API Response Structure:', data);
        setEvents([]);
      }
    } catch (err) {
      console.error('Error in fetchEvents:', err);
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const params = new URLSearchParams({
        date: formattedDate,
        duration_minutes: '30',
        working_hours_start: '09:00',
        working_hours_end: '17:00',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      const response = await fetch(`http://localhost:8000/api/calendar/available-slots?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }

      const data = await response.json();
      setAvailableSlots(data);
    } catch (err) {
      console.error('Error fetching available slots:', err);
    }
  };

  const handleDateClick = (date) => {
    console.log('Date clicked:', date.toISOString());
    setSelectedDate(date);
    fetchAvailableSlots(date);
  };

  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const getEventsForDay = (date) => {
    if (!Array.isArray(events)) return [];
    return events.filter(event => {
      try {
        if (!event.start_time || typeof event.start_time !== 'string') {
          console.warn('Invalid event start_time:', event);
          return false;
        }

        // Parse the date and validate it
        const eventDate = new Date(event.start_time);
        if (isNaN(eventDate.getTime())) {
          console.warn('Invalid date:', event.start_time);
          return false;
        }

        return isSameDay(eventDate, date);
      } catch (error) {
        console.warn('Error parsing event date:', error, event);
        return false;
      }
    });
  };

  const renderMiniCalendar = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <MiniCalendarContainer>
        <CalendarHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">
              {format(selectedDate, 'MMMM yyyy')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Previous Month">
                <IconButton size="small" onClick={handlePrevMonth}>
                  <ChevronLeftIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Today">
                <IconButton size="small" onClick={handleToday}>
                  <TodayIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Next Month">
                <IconButton size="small" onClick={handleNextMonth}>
                  <ChevronRightIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CalendarHeader>
        <CalendarGrid>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <EmptyDay key={`empty-${index}`} />
          ))}
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const hasEvents = dayEvents.length > 0;
            
            return (
              <DayCell
                key={index}
                isCurrentMonth={isSameMonth(day, selectedDate)}
                isToday={isToday(day)}
                onClick={() => handleDateClick(day)}
              >
                <Badge
                  badgeContent={hasEvents ? dayEvents.length : 0}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#2f2f2f',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: isSameMonth(day, selectedDate) ? 'text.primary' : 'text.disabled',
                      fontWeight: isToday(day) ? 'bold' : 'normal',
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>
                </Badge>
              </DayCell>
            );
          })}
        </CalendarGrid>
      </MiniCalendarContainer>
    );
  };

  const renderTimelineView = () => {
    const selectedDayEvents = getEventsForDay(selectedDate);
    
    return (
      <TimelineContainer>
        <TimeColumn>
          {Array.from({ length: 14 }, (_, i) => i + 9).map(hour => (
            <TimeSlot key={hour}>
              {format(new Date().setHours(hour), 'h a')}
            </TimeSlot>
          ))}
        </TimeColumn>
        <DayColumn>
          <DayHeader>
            {format(selectedDate, 'EEEE, MMMM d')}
          </DayHeader>
          <EventsContainer>
            {selectedDayEvents.map(event => (
              <EventCard
                key={event.id}
                style={{
                  top: `${((new Date(event.start_time).getHours() - 9) * 60 + new Date(event.start_time).getMinutes()) * (100 / 840)}%`,
                  height: `${((new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / (1000 * 60)) * (100 / 840)}%`,
                }}
              >
                <EventTime>
                  {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                </EventTime>
                <EventTitle>{event.title}</EventTitle>
                {event.organizer && (
                  <EventOrganizer>
                    <PersonIcon sx={{ fontSize: '0.875rem' }} />
                    {event.organizer}
                  </EventOrganizer>
                )}
              </EventCard>
            ))}
          </EventsContainer>
        </DayColumn>
      </TimelineContainer>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <SidebarPaper>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Teams Calendar</Typography>
              </Box>
              
              {renderMiniCalendar()}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
              Schedule Filters
            </Typography>
            <List dense>
              {Object.entries(filters).map(([key, value]) => (
                <ListItem key={key} dense sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      edge="start"
                      checked={value}
                      onChange={() => handleFilterChange(key)}
                      size="small"
                      sx={{ p: 0 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
              Categories
            </Typography>
            <List dense>
              {categories.map((category) => (
                <CategoryItem key={category.name} color={category.color}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {React.cloneElement(category.icon, { sx: { color: category.color } })}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">{category.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {category.count}
                        </Typography>
                      </Box>
                    }
                  />
                </CategoryItem>
              ))}
            </List>
          </SidebarPaper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9} height="fit-content">
          <StyledPaper sx={{ p: 0 }}>
            <HeaderBox>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Breadcrumbs sx={{ mb: 1 }}>
                    <Link 
                      color="inherit" 
                      href="#"
                      sx={{ 
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Calendar
                    </Link>
                    <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
                      Teams Calendar
                    </Typography>
                  </Breadcrumbs>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#2D3748' }}>
                    {getHeaderTitle()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EventCount badgeContent={filteredEvents.length} max={99}>
                    <Typography variant="body2" sx={{ color: '#718096', mr: 1 }}>
                      events
                    </Typography>
                  </EventCount>
                  <ViewToggle
                    value={selectedView}
                    exclusive
                    onChange={handleViewChange}
                    size="small"
                  >
                    <ToggleButton value="day">Day</ToggleButton>
                    <ToggleButton value="week">Week</ToggleButton>
                    <ToggleButton value="month">Month</ToggleButton>
                  </ViewToggle>
                  <Box>
                    <Tooltip title="Previous">
                      <IconButton size="small" onClick={handlePrevPeriod}>
                        <ChevronLeftIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Today">
                      <IconButton size="small" onClick={handleToday}>
                        <TodayIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Next">
                      <IconButton size="small" onClick={handleNextPeriod}>
                        <ChevronRightIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </HeaderBox>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 250px)' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 250px)' }}>
                <Typography color="error">{error}</Typography>
              </Box>
            ) : selectedView === 'month' ? (
              renderMonthView()
            ) : (
              <Box sx={{ 
                display: 'flex',
                height: 'calc(100% - 100px)',
                overflowX: 'auto',
                overflowY: 'auto',
                backgroundColor: '#ffffff',
                borderRadius: '0 0 12px 12px',
              }}>
                {renderTimeColumn()}
                {visibleDates.map((date) => renderDayColumn(
                  format(date, 'EEEE'),
                  format(date, 'yyyy-MM-dd')
                ))}
              </Box>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecruiterTimeline; 