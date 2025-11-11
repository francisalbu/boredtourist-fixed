import { Settings, Award, TrendingUp, MapPin, Star } from 'lucide-react-native';
import React from 'react';
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
import { USER_PROFILE, type Badge } from '@/constants/profile';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const progressPercentage =
    (USER_PROFILE.currentXP / USER_PROFILE.nextLevelXP) * 100;
  const earnedBadges = USER_PROFILE.badges.filter((badge) => badge.earned);
  const lockedBadges = USER_PROFILE.badges.filter((badge) => !badge.earned);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable style={styles.settingsButton}>
          <Settings size={24} color={colors.dark.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Image
            source={{ uri: USER_PROFILE.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <Text style={styles.name}>{USER_PROFILE.name}</Text>
          <Text style={styles.username}>{USER_PROFILE.username}</Text>

          <View style={styles.levelContainer}>
            <View style={styles.levelBadge}>
              <Award size={16} color={colors.dark.primary} />
              <Text style={styles.levelText}>Level {USER_PROFILE.level}</Text>
            </View>
            <Text style={styles.title}>{USER_PROFILE.title}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {USER_PROFILE.currentXP} / {USER_PROFILE.nextLevelXP} XP
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {USER_PROFILE.experiencesCompleted}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{USER_PROFILE.citiesVisited}</Text>
            <Text style={styles.statLabel}>Cities</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{USER_PROFILE.reviewsWritten}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{earnedBadges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={colors.dark.primary} />
            <Text style={styles.sectionTitle}>Earned Badges</Text>
          </View>
          <View style={styles.badgesGrid}>
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} earned />
            ))}
          </View>
        </View>

        {lockedBadges.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color={colors.dark.textSecondary} />
              <Text style={[styles.sectionTitle, { color: colors.dark.textSecondary }]}>
                Locked Badges
              </Text>
            </View>
            <View style={styles.badgesGrid}>
              {lockedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} earned={false} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={20} color={colors.dark.accent} />
            <Text style={styles.sectionTitle}>Adventure Stats</Text>
          </View>
          <View style={styles.statsListContainer}>
            <StatRow
              icon={<MapPin size={18} color={colors.dark.primary} />}
              label="Total Experiences Booked"
              value={USER_PROFILE.experiencesBooked.toString()}
            />
            <StatRow
              icon={<TrendingUp size={18} color={colors.dark.primary} />}
              label="Experiences Completed"
              value={USER_PROFILE.experiencesCompleted.toString()}
            />
            <StatRow
              icon={<Award size={18} color={colors.dark.primary} />}
              label="Current Level"
              value={USER_PROFILE.level.toString()}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
}

function BadgeCard({ badge, earned }: BadgeCardProps) {
  return (
    <View style={[styles.badgeCard, !earned && styles.badgeCardLocked]}>
      <Text style={[styles.badgeIcon, !earned && styles.badgeIconLocked]}>
        {badge.icon}
      </Text>
      <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>
        {badge.name}
      </Text>
      <Text
        style={[styles.badgeDescription, !earned && styles.badgeDescriptionLocked]}
        numberOfLines={2}
      >
        {badge.description}
      </Text>
      {earned && badge.earnedDate && (
        <Text style={styles.badgeDate}>
          {new Date(badge.earnedDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      )}
    </View>
  );
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatRow({ icon, label, value }: StatRowProps) {
  return (
    <View style={styles.statRow}>
      <View style={styles.statRowLeft}>
        <View>{icon}</View>
        <Text style={styles.statRowLabel}>{label}</Text>
      </View>
      <Text style={styles.statRowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.dark.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 16,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 255, 140, 0.15)',
    borderWidth: 1,
    borderColor: colors.dark.primary,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.dark.primary,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.dark.accent,
  },
  progressContainer: {
    width: '100%',
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.dark.backgroundTertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.dark.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    textAlign: 'center' as const,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.dark.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.dark.text,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.dark.primary,
  },
  badgeCardLocked: {
    backgroundColor: colors.dark.backgroundTertiary,
    borderColor: colors.dark.border,
  },
  badgeIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  badgeIconLocked: {
    opacity: 0.3,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.dark.text,
    marginBottom: 4,
    textAlign: 'center' as const,
  },
  badgeNameLocked: {
    color: colors.dark.textTertiary,
  },
  badgeDescription: {
    fontSize: 11,
    color: colors.dark.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 14,
  },
  badgeDescriptionLocked: {
    color: colors.dark.textTertiary,
  },
  badgeDate: {
    fontSize: 10,
    color: colors.dark.textTertiary,
    marginTop: 4,
  },
  statsListContainer: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  statRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statRowLabel: {
    fontSize: 14,
    color: colors.dark.text,
  },
  statRowValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.dark.primary,
  },
});
