import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// --- Colors ---
const COLORS = {
  background: '#FFFFFF', // Clean white background
  white: '#FFFFFF',
  surface: '#F8FAFC',    // Subtle surface color
  primary: '#4F46E5',    // Indigo
  primaryLight: '#EEF2FF',
  textDark: '#0F172A',   // Slate 900
  textGray: '#64748B',   // Slate 500
  success: '#10B981',    // Emerald 500
  warning: '#F59E0B',
  danger: '#EF4444',
  border: '#F1F5F9',     // Slate 100
  secondary: '#1E293B',  // Slate 800
};

// --- Types ---
interface Subscription {
  id: string;
  companyName: string;
  purchaseDate: string;
  expiryDate: string;
  amount: string;
  transactionId: string;
  upiId: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

type RootStackParamList = {
  InvoiceDetails: { subscription: Subscription };
};

type InvoiceDetailsRouteProp = RouteProp<RootStackParamList, 'InvoiceDetails'>;

const InvoiceDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<InvoiceDetailsRouteProp>();
  const { subscription } = route.params;

  const isExpired = subscription.status === 'Expired' || subscription.id === '4';

  const InfoRow = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrapper}>
        <Feather name={icon} size={16} color={COLORS.textGray} />
      </View>
      <View style={styles.infoTextWrapper}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.navButton}
        >
          <Ionicons name="close" size={26} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Subscription Invoice</Text>
        <TouchableOpacity style={styles.navButton}>
          <Feather name="share" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Hero Section: Status & Amount */}
        <View style={styles.heroSection}>
          <View style={[styles.statusTag, { backgroundColor: isExpired ? COLORS.danger + '10' : COLORS.success + '10' }]}>
            <View style={[styles.statusDot, { backgroundColor: isExpired ? COLORS.danger : COLORS.success }]} />
            <Text style={[styles.statusTagText, { color: isExpired ? COLORS.danger : COLORS.success }]}>
              {isExpired ? 'Payment Expired' : 'Payment Successful'}
            </Text>
          </View>

          <Text style={styles.heroAmount}>{subscription.amount}</Text>
          <Text style={styles.heroDate}>Paid on {subscription.purchaseDate}</Text>
          
          <View style={styles.transactionChip}>
            <Text style={styles.transactionChipText}>TXN: {subscription.transactionId}</Text>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.fullDivider} />

        {/* Main Details Section */}
        <View style={styles.detailsContainer}>
          
          {/* Billed From & To */}
          <View style={styles.entryRow}>
            <View style={styles.entryColumn}>
              <Text style={styles.entryLabel}>Billed From</Text>
              <Text style={styles.entryValueMain}>Symbosys Attendence</Text>
              <Text style={styles.entrySubText}>Official Product Suite</Text>
            </View>
            <View style={[styles.entryColumn, { alignItems: 'flex-end' }]}>
              <Text style={styles.entryLabel}>Billed To</Text>
              <Text style={styles.entryValueMain}>{subscription.companyName}</Text>
              <Text style={styles.entrySubText}>ID: #SYM-{subscription.id}024</Text>
            </View>
          </View>

          {/* Plan Summary */}
          <View style={styles.planSection}>
            <View style={styles.planIconBox}>
              <Feather name="package" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.planTextContent}>
              <Text style={styles.planName}>Premium Enterprise Plan</Text>
              <Text style={styles.planDuration}>Annual Subscription • Full Access</Text>
            </View>
            <View style={styles.planPriceBox}>
               <Text style={styles.planPriceText}>{subscription.amount}</Text>
            </View>
          </View>

          {/* Payment List Details */}
          <View style={styles.subDetailsSection}>
            <InfoRow label="Purchase Date" value={subscription.purchaseDate} icon="calendar" />
            <InfoRow label="Expiry Date" value={subscription.expiryDate} icon="clock" />
            <InfoRow label="Payment Method" value={subscription.upiId} icon="credit-card" />
            <InfoRow label="Invoice Number" value={`INV-${subscription.transactionId.slice(-6)}`} icon="file-text" />
          </View>

          {/* Pricing Table */}
          <View style={styles.priceTable}>
             <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Base Amount</Text>
                <Text style={styles.priceValue}>{subscription.amount}</Text>
             </View>
             <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount</Text>
                <Text style={[styles.priceValue, { color: COLORS.success }]}>-₹0.00</Text>
             </View>
             <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Taxes (18% GST)</Text>
                <Text style={styles.priceValue}>Included</Text>
             </View>
             <View style={styles.totalDivider} />
             <View style={styles.priceRow}>
                <Text style={styles.totalLabelText}>Total Paid</Text>
                <Text style={styles.totalValueText}>{subscription.amount}</Text>
             </View>
          </View>

          {/* Note */}
          <View style={styles.noteSection}>
             <Feather name="info" size={14} color={COLORS.textGray} />
             <Text style={styles.noteText}>
               This is a computer-generated invoice and doesn't require a physical signature.
             </Text>
          </View>

        </View>

        {/* Action Buttons */}
        <View style={styles.footer}>
           <TouchableOpacity style={styles.primaryButton}>
              <Feather name="download" size={20} color={COLORS.white} />
              <Text style={styles.primaryButtonText}>Download Invoice</Text>
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.secondaryButton}>
              <Feather name="mail" size={18} color={COLORS.textDark} />
              <Text style={styles.secondaryButtonText}>Email Copy</Text>
           </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'serif',
  },
  heroAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 4,
    fontFamily: 'serif',
  },
  heroDate: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 24,
    fontFamily: 'serif',
  },
  transactionChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  transactionChipText: {
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  fullDivider: {
    height: 8,
    backgroundColor: COLORS.surface,
    width: '100%',
  },
  detailsContainer: {
    padding: 24,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  entryColumn: {
    flex: 1,
  },
  entryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: 'serif',
  },
  entryValueMain: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  entrySubText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
    fontFamily: 'serif',
  },
  planSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 32,
  },
  planIconBox: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  planTextContent: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  planDuration: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
    fontFamily: 'serif',
  },
  planPriceBox: {
    alignItems: 'flex-end',
  },
  planPriceText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'serif',
  },
  subDetailsSection: {
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textGray,
    marginBottom: 2,
    fontFamily: 'serif',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  priceTable: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textGray,
    fontFamily: 'serif',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  totalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalLabelText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  totalValueText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    fontFamily: 'serif',
  },
  noteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 8,
  },
  noteText: {
    fontSize: 11,
    color: COLORS.textGray,
    fontStyle: 'italic',
    marginLeft: 8,
    flex: 1,
    fontFamily: 'serif',
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.textDark,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  secondaryButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'serif',
  },
});

export default InvoiceDetailsScreen;
