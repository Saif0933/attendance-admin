import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useCreateSubscriptionPlan,
  useGetAllSubscriptionPlans,
  useUpdateSubscriptionPlan
} from '../../api/hook/useSubscriptionPlan';
import { SubscriptionPlan } from '../../types/admin.type';

// --- Constants & Colors ---
const COLORS = {
  background: '#F0F2F5',
  white: '#FFFFFF',
  primary: '#4F46E5', // Indigo
  textDark: '#1F2937',
  textGray: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  cardBg: '#FFFFFF',
  border: '#E5E7EB',
};

// --- Helper Functions ---
const getStatusColor = (isActive: boolean) => {
  return isActive ? COLORS.success : COLORS.danger;
};

// --- Components ---

const Header = ({ onAdd }: { onAdd: () => void }) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.headerTitle}>Plans</Text>
      <Text style={styles.headerSubtitle}>Manage subscription models</Text>
    </View>
    <TouchableOpacity style={styles.filterButton} onPress={onAdd}>
      <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
);

const SubscriptionCard = ({ 
  item, 
  onEdit 
}: { 
  item: SubscriptionPlan; 
  onEdit: (plan: SubscriptionPlan) => void 
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const statusColor = getStatusColor(item.isActive);

  return (
    <View style={styles.card}>
      {/* Top Section: Plan Name & Status */}
      <View style={styles.cardHeader}>
        <View style={styles.companyInfo}>
          <View style={[styles.iconBox, { backgroundColor: COLORS.primary + '15' }]}>
            <Feather name="package" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.companyName} numberOfLines={1}>{item.name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{item.isActive ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>

      {/* Plan Specifics Section */}
      <View style={styles.expirySection}>
         <Text style={styles.cardSubtitle}>{item.description || 'No description provided'}</Text>
      </View>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Price</Text>
          <Text style={[styles.detailValue, {color: COLORS.primary}]}>₹{item.price.toLocaleString()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Employee Limit</Text>
          <Text style={styles.detailValue}>{item.employeeLimit} Employees</Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{item.durationDays} Days</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Total Subscriptions</Text>
          <Text style={styles.detailValue}>0</Text> 
        </View>
      </View>

      {/* Footer Action */}
      <TouchableOpacity 
        style={styles.detailsButton}
        onPress={() => onEdit(item)}
      >
        <Text style={styles.detailsButtonText}>Edit Plan Details</Text>
        <Ionicons name="create-outline" size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const SubscriptionScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [employeeLimit, setEmployeeLimit] = useState('');
  const [durationDays, setDurationDays] = useState('');

  const { data: plans, isLoading: isFetching, refetch } = useGetAllSubscriptionPlans();
  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setEmployeeLimit('');
    setDurationDays('');
    setEditingPlan(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setDescription(plan.description || '');
    setPrice(plan.price.toString());
    setEmployeeLimit(plan.employeeLimit.toString());
    setDurationDays(plan.durationDays.toString());
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (!name || !price || !employeeLimit || !durationDays) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const payload = {
      name,
      description,
      price: parseFloat(price),
      employeeLimit: parseInt(employeeLimit),
      durationDays: parseInt(durationDays),
      isActive: true,
    };

    if (editingPlan) {
      updateMutation.mutate(
        { id: editingPlan.id, planData: payload },
        {
          onSuccess: () => {
            setIsModalVisible(false);
            resetForm();
          },
          onError: (error: any) => {
            Alert.alert('Error', error?.response?.data?.message || 'Failed to update plan');
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalVisible(false);
          resetForm();
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.response?.data?.message || 'Failed to create plan');
        },
      });
    }
  };

  const filteredData = (plans || []).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <Header onAdd={handleAdd} />
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search plans..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textGray}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textGray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SubscriptionCard item={item} onEdit={handleEdit} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isFetching}
        onRefresh={refetch}
        ListEmptyComponent={
          !isFetching ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={60} color={COLORS.textGray + '50'} />
              <Text style={styles.emptyText}>No subscription plans found</Text>
            </View>
          ) : null
        }
      />

      {/* Plan Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Plan Name *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Basic Plan"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.modalInput, styles.textArea]}
                  placeholder="Plan details..."
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Price (₹) *</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="4000"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Days *</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="30"
                    keyboardType="numeric"
                    value={durationDays}
                    onChangeText={setDurationDays}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Employee Limit *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 4"
                  keyboardType="numeric"
                  value={employeeLimit}
                  onChangeText={setEmployeeLimit}
                />
              </View>

              <TouchableOpacity 
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.saveButtonText}>{editingPlan ? 'Update Plan' : 'Create Plan'}</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textGray,
    marginTop: 2,
    fontFamily: 'serif',
  },
  filterButton: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
    fontFamily: 'serif',
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textGray,
    lineHeight: 20,
    fontFamily: 'serif',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  expirySection: {
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 4,
    fontFamily: 'serif',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    fontFamily: 'serif',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textGray,
    marginTop: 10,
    fontFamily: 'serif',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  modalForm: {
    padding: 24,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
    fontFamily: 'serif',
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontFamily: 'serif',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'serif',
  },
});

export default SubscriptionScreen;