import React, { useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDashboardStats } from '../api/hook/useAdmin';

// --- Constants ---
const COLORS = {
  background: '#F4F6F9',
  cardBg: '#FFFFFF',
  textDark: '#1A1D1E',
  textGray: '#6B7280',
  primaryBlue: '#4F46E5',
  chartLightBlue: '#DDE1F9',
  successGreen: '#10B981',
  warningOrange: '#F59E0B',
  dangerRed: '#EF4444',
  iconBgGray: '#F3F4F6',
  borderGray: '#E5E7EB',
};

const API_BASE_URL = 'http://10.0.2.2:5000/api/v1';

// --- Reusable Components ---

const SectionHeader = ({title, rightLink, iconName}: {title: string, rightLink?: string, iconName?: string}) => (
  <View style={styles.sectionHeaderContainer}>
    <View style={styles.sectionHeaderLeft}>
      {iconName && (
        <MaterialCommunityIcons
          name={iconName}
          size={20}
          color={COLORS.primaryBlue}
          style={{marginRight: 8}}
        />
      )}
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
    </View>
    {rightLink && (
      <TouchableOpacity>
        <Text style={styles.sectionHeaderLink}>{rightLink}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const TrendIndicator = ({type, value}: {type: 'up' | 'down' | 'stable', value: string}) => {
  let iconName: any, color;
  switch (type) {
    case 'up':
      iconName = 'trending-up';
      color = COLORS.successGreen;
      break;
    case 'down':
      iconName = 'trending-down';
      color = COLORS.dangerRed;
      break;
    default:
      iconName = 'minus';
      color = COLORS.textGray;
  }

  return (
    <View style={styles.trendContainer}>
      <Feather name={iconName} size={16} color={color} />
      <Text style={[styles.trendText, {color: color}]}>{value}</Text>
    </View>
  );
};

const StatCard = ({title, value, iconName, iconLib, trendType, trendValue}: any) => {
  const IconComponent = iconLib === 'Feather' ? Feather : MaterialCommunityIcons;
  return (
    <View style={styles.card}>
      <View style={styles.statCardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <IconComponent
          name={iconName}
          size={20}
          color={COLORS.primaryBlue}
          style={{opacity: 0.7}}
        />
      </View>
      <Text style={styles.statCardValue}>{value}</Text>
      <TrendIndicator type={trendType} value={trendValue} />
    </View>
  );
};

const ProgressBar = ({percentage, color}: {percentage: number, color: string}) => (
  <View style={styles.progressBarBackground}>
    <View
      style={[
        styles.progressBarFill,
        {width: `${percentage}%`, backgroundColor: color},
      ]}
    />
  </View>
);

const ProjectHealthItem = ({title, percentage, status, color}: any) => (
  <View style={styles.card}>
    <View style={styles.healthItemHeader}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8}}>
        <View style={[styles.healthDot, {backgroundColor: color}]} />
        <Text style={styles.healthTitle} numberOfLines={1}>{title}</Text>
      </View>
      <Text style={styles.healthPercentage}>{percentage}%</Text>
    </View>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{flex: 1, marginRight: 12}}>
        <ProgressBar percentage={percentage} color={color} />
      </View>
      <View style={[styles.statusBadge, {backgroundColor: color + '20'}]}>
        <Text style={[styles.statusText, {color: color}]}>{status}</Text>
      </View>
    </View>
  </View>
);

const ActivityItem = ({icon, iconBg, content}: any) => (
  <View style={styles.card}>
    <View style={styles.activityContainer}>
      <View style={[styles.activityIconContainer, {backgroundColor: iconBg}]}>
        {icon}
      </View>
      <View style={styles.activityContent}>{content}</View>
    </View>
  </View>
);

const Dashboard = () => {
  const { data: statsData, isLoading, isError, refetch } = useDashboardStats();
  const [refreshing, setRefreshing] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'Weekly' | 'Monthly'>('Weekly');

  const stats = statsData || {
    totalRevenue: 0,
    activeCompanies: 0,
    totalEmployees: 0,
    attendanceToday: 0,
    recentActivities: []
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{fontFamily: 'serif'}}>Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: COLORS.dangerRed, fontFamily: 'serif' }}>Error loading dashboard stats.</Text>
          <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 10 }}>
            <Text style={{ color: COLORS.primaryBlue, fontFamily: 'serif' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }


  // Dummy data for chart
  const chartData = [
    {day: 'MON', value: 30},
    {day: 'TUE', value: 55},
    {day: 'WED', value: 40},
    {day: 'THU', value: 70, active: true},
    {day: 'FRI', value: 50},
    {day: 'SAT', value: 25},
    {day: 'SUN', value: 20},
  ];
  const maxChartValue = 70;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primaryBlue]} />
          }
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={{flex: 1, marginRight: 16}}>
              <Text style={styles.headerTitle}>Boss Portal</Text>
              <Text style={styles.headerSubtitle}>{new Date().toDateString()}</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={COLORS.textDark}
                />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons
                  name="person-circle-outline"
                  size={26}
                  color={COLORS.primaryBlue}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Top Stats Row */}
          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
              <StatCard
                title="Total Revenue"
                value={`$${stats.totalRevenue}`}
                iconName="cash-multiple"
                trendType="up"
                trendValue="+12.5%"
              />
            </View>
            <View style={{flex: 1, marginLeft: 8}}>
              <StatCard
                title="Active Companies"
                value={stats.activeCompanies.toString()}
                iconName="office-building"
                trendType="stable"
                trendValue="Stable"
              />
            </View>
          </View>

          {/* Productivity Card */}
          <StatCard
            title="Attendance Today"
            value={stats.attendanceToday.toString()}
            iconName="account-check"
            trendType="up"
            trendValue="+5.2%"
          />

          {/* Weekly Progress Chart Card */}
          <View style={styles.card}>
            <View style={styles.chartHeader}>
              <View style={{flex: 1, marginRight: 12}}>
                <Text style={styles.cardTitleBold} numberOfLines={1}>Weekly Progress</Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>Tasks completed per day</Text>
              </View>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={chartPeriod === 'Weekly' ? styles.toggleActive : styles.toggleInactive}
                  onPress={() => setChartPeriod('Weekly')}
                >
                  <Text style={chartPeriod === 'Weekly' ? styles.toggleTextActive : styles.toggleTextInactive}>Weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={chartPeriod === 'Monthly' ? styles.toggleActive : styles.toggleInactive}
                  onPress={() => setChartPeriod('Monthly')}
                >
                  <Text style={chartPeriod === 'Monthly' ? styles.toggleTextActive : styles.toggleTextInactive}>Monthly</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
              <Text style={styles.chartTotalValue}>452</Text>
              <Text style={styles.chartTotalLabel}>Tasks</Text>
            </View>

            <View style={styles.chartContainer}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.chartColumn}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: (item.value / maxChartValue) * 100,
                        backgroundColor: item.active
                          ? COLORS.primaryBlue
                          : COLORS.chartLightBlue,
                      },
                    ]}
                  />
                  <Text style={styles.chartLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Project Health Section */}
          <SectionHeader
            title="Project Health"
            iconName="chart-bar-stacked"
          />
          <ProjectHealthItem
            title="SaaS Redesign"
            percentage={85}
            status="On Track"
            color={COLORS.successGreen}
          />
          <ProjectHealthItem
            title="API Integration"
            percentage={42}
            status="At Risk"
            color={COLORS.warningOrange}
          />
          <ProjectHealthItem
            title="Security Audit"
            percentage={12}
            status="Delayed"
            color={COLORS.dangerRed}
          />

          {/* Recent Activities Section */}
          <SectionHeader
            title="Recent Activities"
            rightLink="View All"
            iconName="history"
          />
          {stats.recentActivities.map((activity: any) => (
            <ActivityItem
              key={activity.id}
              iconBg={
                activity.type === 'COMPANY' 
                  ? COLORS.primaryBlue + '20' 
                  : activity.type === 'TASK' 
                    ? COLORS.successGreen + '20' 
                    : COLORS.warningOrange + '20'
              }
              icon={
                <Ionicons
                  name={
                    activity.type === 'COMPANY' 
                      ? 'business' 
                      : activity.type === 'TASK' 
                        ? 'checkmark-circle' 
                        : 'time'
                  }
                  size={20}
                  color={
                    activity.type === 'COMPANY' 
                      ? COLORS.primaryBlue 
                      : activity.type === 'TASK' 
                        ? COLORS.successGreen 
                        : COLORS.warningOrange
                  }
                />
              }
              content={
                <View>
                  <Text style={styles.activityText}>{activity.content}</Text>
                  <Text style={styles.activityTime}>{new Date(activity.time).toLocaleString()}</Text>
                </View>
              }
            />
          ))}
          {stats.recentActivities.length === 0 && (
            <Text style={{ textAlign: 'center', color: COLORS.textGray, marginTop: 20, fontFamily: 'serif' }}>No recent activities</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for bottom tab
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Shadow props for depth
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textGray,
    marginTop: 4,
    fontFamily: 'serif',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.dangerRed,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  // Stat Card Styles
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: COLORS.textGray,
    fontFamily: 'serif',
    flex: 1,
    marginRight: 8,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
    fontFamily: 'serif',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'serif',
  },
  // Chart Card Styles
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textGray,
    marginTop: 2,
    fontFamily: 'serif',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.iconBgGray,
    borderRadius: 8,
    padding: 2,
    flexShrink: 0,
  },
  toggleActive: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle shadow for active toggle
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  toggleInactive: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTextActive: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primaryBlue,
    fontFamily: 'serif',
  },
  toggleTextInactive: {
    fontSize: 10,
    color: COLORS.textGray,
    fontFamily: 'serif',
  },
  chartTotalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginRight: 8,
    fontFamily: 'serif',
  },
  chartTotalLabel: {
    fontSize: 16,
    color: COLORS.textGray,
    marginBottom: 6,
    fontFamily: 'serif',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginTop: 24,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 24,
    borderRadius: 6,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 11,
    color: COLORS.textGray,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  // Section Header Styles
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    fontFamily: 'serif',
    flex: 1,
  },
  sectionHeaderLink: {
    fontSize: 14,
    color: COLORS.primaryBlue,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  // Project Health Styles
  healthItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  healthPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: COLORS.iconBgGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  // Activity Items Styles
  activityContainer: {
    flexDirection: 'row',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
    justifyContent: 'center',
  },
  activityText: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
    fontFamily: 'serif',
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 4,
    fontFamily: 'serif',
  },
  // Bottom Tab Nav Styles
  bottomTabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    color: COLORS.textGray,
    marginTop: 4,
    fontWeight: '500',
    fontFamily: 'serif',
  },
});

export default Dashboard;
