import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGetInfiniteCompanies } from '../../api/hook/useAdmin';
import { useDebounce } from '../../api/hook/useDebounce';

import { Company } from '../../types/admin.type';


// --- Constants ---
const COLORS = {
  primary: '#5A4FF3',
  background: '#F8F9FD',
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6E727D',
  inputBg: '#EFF1F5',
  iconGray: '#9A9EA7',
};


const API_BASE_URL = 'http://10.0.2.2:5000/api/v1'; // Using Android Emulator localhost


// --- Helper Function ---
const hexToRgba = (hex: string, opacity: number) => {
  if (!hex || hex.length < 7) return `rgba(90, 79, 243, ${opacity})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// --- Child Components ---

const Header = () => (
  <View style={styles.header}>
    <View style={styles.headerIconContainer}>
      <FontAwesome5 name="briefcase" size={20} color={COLORS.primary} />
    </View>
    <View style={styles.headerTextContainer}>
      <Text style={styles.headerTitle}>Company Directory</Text>
      <Text style={styles.headerSubtitle}>ADMINISTRATION PANEL</Text>
    </View>
    <TouchableOpacity>
      <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textDark} />
    </TouchableOpacity>
  </View>
);

const CompanyCard = ({ item }: { item: Company }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const themeColor = COLORS.primary;
  const lightThemeColor = hexToRgba(themeColor, 0.1);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconContainer, { backgroundColor: lightThemeColor }]}>
          <MaterialCommunityIcons name="office-building" size={24} color={themeColor} />
        </View>
        <View style={[styles.tagContainer, { backgroundColor: lightThemeColor }]}>
          <Text style={[styles.tagText, { color: themeColor }]}>
            {item.code} • {item._count?.employees || 0} EMPLOYEES
          </Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.address || 'No address provided.'}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={14} color={COLORS.textGray} />
          <Text style={styles.footerText}>{item.email || 'N/A'}</Text>
        </View>

        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => {
            const companyName = item.name || 'Unknown Company';
            const safeUpiId = (item.name || 'company').toLowerCase().replace(/\s/g, '');
            
            navigation.navigate('InvoiceDetails', { 
              subscription: {
                id: item.id,
                companyName: companyName,
                purchaseDate: '2024-02-14',
                expiryDate: '2025-02-14',
                amount: '₹12,499',
                transactionId: `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                upiId: `${safeUpiId}@okaxis`,
                status: 'Active'
              } 
            });
          }}
        >
          <Text style={styles.viewButtonText}>Details</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


// --- Main Component ---
const CompanyScreen = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetInfiniteCompanies({
    limit: 10,
    search: debouncedSearch,
  });

  const [refreshing, setRefreshing] = useState(false);

  // Flatten the pages into a single companies array
  const companies = data?.pages.flatMap(page => page.companies) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CompanyCard item={item} />}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Header />
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color={COLORS.iconGray} style={styles.searchIcon} />
                <TextInput
                  placeholder="Search by company name..."
                  placeholderTextColor={COLORS.textGray}
                  style={styles.searchInput}
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </>
          }
          ListFooterComponent={
            isLoading && !refreshing ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />
            ) : null
          }

          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="business-outline" size={60} color={COLORS.iconGray} />
                <Text style={styles.emptyText}>No companies found</Text>
              </View>
            ) : null
          }

        />
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // Space for bottom nav
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#EBEBFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textGray,
    letterSpacing: 0.5,
  },
  // Search Bar Styles
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
  },
  // Filter Styles
  filterContainer: {
    marginBottom: 20,
    flexGrow: 0,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
  },
  inactiveFilterChip: {
    backgroundColor: COLORS.inputBg,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  inactiveFilterText: {
    color: COLORS.textDark,
  },
  // Client Card Styles
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2, // For Android shadow
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: COLORS.textGray,
    lineHeight: 22,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.cardBg,
  },
  extraAvatar: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraAvatarText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textGray,
    fontWeight: '600',
    marginTop: 12,
  },
});

export default CompanyScreen;