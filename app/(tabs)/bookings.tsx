import { Calendar, Clock, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import colors from '@/constants/colors';
import { BOOKINGS, type Booking } from '@/constants/bookings';

type BookingFilter = 'upcoming' | 'completed';

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<BookingFilter>('upcoming');

  const filteredBookings = BOOKINGS.filter(
    (booking) =>
      (filter === 'upcoming' && booking.status === 'upcoming') ||
      (filter === 'completed' && booking.status === 'completed')
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.filterContainer}>
          <Pressable
            style={[
              styles.filterButton,
              filter === 'upcoming' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('upcoming')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'upcoming' && styles.filterTextActive,
              ]}
            >
              Upcoming
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterButton,
              filter === 'completed' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('completed')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'completed' && styles.filterTextActive,
              ]}
            >
              Past
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No {filter} bookings</Text>
            <Text style={styles.emptyText}>
              {filter === 'upcoming'
                ? 'Start exploring and book your next adventure!'
                : 'Your completed experiences will appear here'}
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

interface BookingCardProps {
  booking: Booking;
}

function BookingCard({ booking }: BookingCardProps) {
  const bookingDate = new Date(booking.date);
  const formattedDate = bookingDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Pressable style={styles.card}>
      <Image
        source={{ uri: booking.experienceImage }}
        style={styles.cardImage}
        contentFit="cover"
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {booking.status === 'upcoming' ? '⏱️ Upcoming' : '✅ Completed'}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{booking.experienceTitle}</Text>
        <Text style={styles.cardProvider}>{booking.provider}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Calendar size={16} color={colors.dark.textSecondary} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={16} color={colors.dark.textSecondary} />
            <Text style={styles.detailText}>{booking.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={16} color={colors.dark.textSecondary} />
            <Text style={styles.detailText}>{booking.location}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.referenceLabel}>Booking Reference</Text>
            <Text style={styles.referenceText}>{booking.bookingReference}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.price}>
              {booking.currency}
              {booking.price * booking.guests}
            </Text>
          </View>
        </View>

        {booking.status === 'upcoming' && (
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Details</Text>
          </Pressable>
        )}

        {booking.status === 'completed' && (
          <Pressable style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>Write a Review</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.dark.backgroundTertiary,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.dark.border,
  },
  filterButtonActive: {
    backgroundColor: colors.dark.primary,
    borderColor: colors.dark.primary,
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
  },
  filterTextActive: {
    color: colors.dark.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center' as const,
    maxWidth: 250,
  },
  card: {
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.dark.backgroundTertiary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.dark.text,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  cardProvider: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 10,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  referenceLabel: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    marginBottom: 2,
  },
  referenceText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.dark.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: colors.dark.textTertiary,
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.dark.primary,
  },
  actionButton: {
    backgroundColor: colors.dark.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.dark.background,
  },
  reviewButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.dark.primary,
  },
  reviewButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.dark.primary,
  },
});
