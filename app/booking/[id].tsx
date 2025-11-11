import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Minus, Plus, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import colors from '@/constants/colors';
import { EXPERIENCES } from '@/constants/experiences';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TimeSlot {
  time: string;
  price: number;
  spotsAvailable: number;
}

interface DaySchedule {
  date: Date;
  dayName: string;
  slots: TimeSlot[];
}

// Generate mock availability data for the next 6 days
const generateAvailability = (startDate: Date, experienceId: string): DaySchedule[] => {
  const schedules: DaySchedule[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (let i = 0; i < 6; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const slots: TimeSlot[] = [
      {
        time: '10:30 AM – 2:15 PM',
        price: experienceId === '0' ? 94 : 85,
        spotsAvailable: Math.floor(Math.random() * 10) + 1,
      },
      {
        time: '4:30 – 8:15 PM',
        price: experienceId === '0' ? 90 : 80,
        spotsAvailable: Math.floor(Math.random() * 8) + 1,
      },
    ];
    
    schedules.push({
      date,
      dayName: dayNames[date.getDay()],
      slots,
    });
  }
  
  return schedules;
};

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [adults, setAdults] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [availability, setAvailability] = useState<DaySchedule[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ schedule: DaySchedule; slot: TimeSlot } | null>(null);

  const experience = EXPERIENCES.find((exp) => exp.id === id);

  if (!experience) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Experience not found</Text>
      </View>
    );
  }

  const handleCheckAvailability = () => {
    if (selectedDate) {
      const schedules = generateAvailability(selectedDate, experience.id);
      setAvailability(schedules);
      setShowCalendar(false);
    }
  };

  const handleSelectSlot = (schedule: DaySchedule, slot: TimeSlot) => {
    setSelectedSlot({ schedule, slot });
  };

  const handleBook = () => {
    if (selectedSlot) {
      router.push({
        pathname: '/booking/confirm',
        params: {
          experienceId: experience.id,
          date: selectedSlot.schedule.date.toISOString(),
          time: selectedSlot.slot.time,
          adults: adults.toString(),
          price: selectedSlot.slot.price.toString(),
        },
      });
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isDateToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isPastDate = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return checkDate < today;
  };

  const handleDateSelect = (day: number) => {
    if (isPastDate(day)) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Select a time</Text>
        {!showCalendar && (
          <Pressable onPress={() => setShowCalendar(true)} style={styles.closeButton}>
            <X size={24} color={colors.dark.text} />
          </Pressable>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showCalendar ? (
          <>
            {/* Adults Counter */}
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <View>
                  <Text style={styles.adultsLabel}>1 adult</Text>
                  <Pressable>
                    <Text style={styles.addChildren}>Add children</Text>
                  </Pressable>
                </View>
                <View style={styles.counter}>
                  <Pressable
                    onPress={() => setAdults(Math.max(1, adults - 1))}
                    style={styles.counterButton}
                  >
                    <Minus size={20} color={colors.dark.text} />
                  </Pressable>
                  <Text style={styles.counterValue}>{adults}</Text>
                  <Pressable
                    onPress={() => setAdults(Math.min(experience.maxGroupSize || 10, adults + 1))}
                    style={styles.counterButton}
                  >
                    <Plus size={20} color={colors.dark.text} />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Calendar */}
            <View style={styles.section}>
              <View style={styles.calendarHeader}>
                <Text style={styles.monthLabel}>{formatMonth(currentMonth)}</Text>
                <Pressable style={styles.calendarIconButton}>
                  <CalendarIcon size={20} color={colors.dark.text} />
                </Pressable>
              </View>

              <View style={styles.calendarNavigation}>
                <Pressable onPress={handlePreviousMonth} style={styles.navButton}>
                  <ChevronLeft size={24} color={colors.dark.text} />
                </Pressable>
                <Text style={styles.monthText}>{formatMonth(currentMonth)}</Text>
                <Pressable onPress={handleNextMonth} style={styles.navButton}>
                  <ChevronRight size={24} color={colors.dark.text} />
                </Pressable>
              </View>

              <View style={styles.calendar}>
                <View style={styles.weekDays}>
                  {weekDays.map((day) => (
                    <Text key={day} style={styles.weekDay}>
                      {day}
                    </Text>
                  ))}
                </View>
                <View style={styles.daysGrid}>
                  {days.map((day, index) => (
                    <Pressable
                      key={index}
                      style={[
                        styles.dayCell,
                        day === null && styles.dayCellEmpty,
                        day !== null && isDateSelected(day) && styles.dayCellSelected,
                        day !== null && isDateToday(day) && !isDateSelected(day) && styles.dayCellToday,
                        day !== null && isPastDate(day) && styles.dayCellPast,
                      ]}
                      onPress={() => day && handleDateSelect(day)}
                      disabled={!day || isPastDate(day)}
                    >
                      {day && (
                        <Text
                          style={[
                            styles.dayText,
                            isDateSelected(day) && styles.dayTextSelected,
                            isPastDate(day) && styles.dayTextPast,
                          ]}
                        >
                          {day}
                        </Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* Check Availability Button */}
            <Pressable
              style={[styles.checkButton, !selectedDate && styles.checkButtonDisabled]}
              onPress={handleCheckAvailability}
              disabled={!selectedDate}
            >
              <Text style={styles.checkButtonText}>Check availability</Text>
            </Pressable>
          </>
        ) : (
          <>
            {/* Selected Info */}
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedInfoText}>{adults} adult{adults > 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedInfoText}>
                {selectedDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
            </View>

            {/* Availability List */}
            {availability.map((schedule, scheduleIndex) => (
              <View key={scheduleIndex} style={styles.daySection}>
                <Text style={styles.dayTitle}>
                  {schedule.dayName}, {schedule.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </Text>
                {schedule.slots.map((slot, slotIndex) => (
                  <Pressable
                    key={slotIndex}
                    style={[
                      styles.slotCard,
                      selectedSlot?.schedule === schedule &&
                        selectedSlot?.slot === slot &&
                        styles.slotCardSelected,
                    ]}
                    onPress={() => handleSelectSlot(schedule, slot)}
                  >
                    <View style={styles.slotInfo}>
                      <Text style={styles.slotTime}>{slot.time}</Text>
                      <Text style={styles.slotPrice}>
                        €{slot.price} / guest
                      </Text>
                    </View>
                    <Text style={styles.slotSpots}>
                      {slot.spotsAvailable} spot{slot.spotsAvailable > 1 ? 's' : ''} available
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
            
            {/* Spacer for fixed button */}
            {selectedSlot && <View style={{ height: 100 }} />}
          </>
        )}
      </ScrollView>

      {/* Fixed Book Button */}
      {!showCalendar && selectedSlot && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable style={styles.bookButton} onPress={handleBook}>
            <Text style={styles.bookButtonText}>Book</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.text,
    flex: 1,
    textAlign: 'center' as const,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adultsLabel: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  addChildren: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textDecorationLine: 'underline' as const,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.dark.text,
    minWidth: 40,
    textAlign: 'center' as const,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  calendarIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  calendar: {
    backgroundColor: colors.dark.backgroundTertiary,
    borderRadius: 12,
    padding: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weekDay: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
    width: (SCREEN_WIDTH - 96) / 7,
    textAlign: 'center' as const,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (SCREEN_WIDTH - 96) / 7,
    height: (SCREEN_WIDTH - 96) / 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dayCellEmpty: {
    backgroundColor: 'transparent',
  },
  dayCellSelected: {
    backgroundColor: colors.dark.primary,
    borderRadius: ((SCREEN_WIDTH - 96) / 7) / 2,
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: colors.dark.primary,
    borderRadius: ((SCREEN_WIDTH - 96) / 7) / 2,
  },
  dayCellPast: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.dark.text,
  },
  dayTextSelected: {
    color: colors.dark.background,
    fontWeight: '700' as const,
  },
  dayTextPast: {
    color: colors.dark.textTertiary,
  },
  checkButton: {
    margin: 16,
    backgroundColor: colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkButtonDisabled: {
    backgroundColor: colors.dark.backgroundTertiary,
    opacity: 0.5,
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.background,
  },
  selectedInfo: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  selectedInfoText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  daySection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 16,
  },
  slotCard: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  slotCardSelected: {
    borderColor: colors.dark.primary,
  },
  slotInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  slotTime: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  slotPrice: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  slotSpots: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },
  bottomBar: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  bookButton: {
    backgroundColor: colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center' as const,
    marginTop: 32,
  },
});
