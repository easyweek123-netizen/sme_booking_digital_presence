import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useCreateBookingMutation } from '../../../../store/api/bookingsApi';
import { getTodayString } from '../../../../utils/format';
import { TOAST_DURATION } from '../../../../constants';
import type { Service, BusinessWithServices, Booking } from '../../../../types';
import type { User } from '../../../../lib/firebase';

export type BookingWizardStep = 1 | 2 | 3 | 4;

export interface BookingWizardState {
  // raw state
  step: BookingWizardStep;
  selectedService: Service | null;
  selectedCategoryId: number | null;
  selectedDate: string;
  selectedTime: string | null;
  customerName: string;
  customerEmail: string;
  createdBooking: Booking | null;
  isCreating: boolean;
  // computed
  canContinue: boolean;
  continueLabel: string;
  canGoTo: (n: BookingWizardStep) => boolean;
  // handlers
  setStep: (n: BookingWizardStep) => void;
  setSelectedCategoryId: (id: number | null) => void;
  handleSelectService: (s: Service) => void;
  handleDateChange: (d: string) => void;
  handleSelectTime: (t: string) => void;
  handleContinue: () => void;
  handleVerified: (u: User, name: string) => Promise<void>;
  handleVerificationError: (err: Error) => void;
  handleBookAnother: () => void;
}

export function useBookingWizard(business: BusinessWithServices): BookingWizardState {
  const toast = useToast();

  const [step, setStep] = useState<BookingWizardStep>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  const canGoTo = (n: BookingWizardStep) => {
    if (n === 1) return true;
    if (n === 2) return !!selectedService;
    if (n === 3) return !!selectedService && !!selectedTime;
    if (n === 4) return !!createdBooking;
    return false;
  };

  const canContinue =
    (step === 1 && !!selectedService) ||
    (step === 2 && !!selectedTime) ||
    (step === 3 && false);

  const continueLabel =
    step === 1
      ? 'Continue to date & time  →'
      : step === 2
        ? 'Continue to your details  →'
        : 'Confirm';

  const handleContinue = () => {
    if (step === 1 && selectedService) setStep(2);
    else if (step === 2 && selectedTime) setStep(3);
  };

  const handleSelectService = (s: Service) => {
    setSelectedService(s);
    setSelectedTime(null);
  };

  const handleDateChange = (d: string) => {
    setSelectedDate(d);
    setSelectedTime(null);
  };

  const handleSelectTime = (t: string) => {
    setSelectedTime(t);
    setStep(3);
  };

  const handleVerified = async (u: User, name: string) => {
    if (!selectedService || !selectedTime) return;
    setCustomerName(name);
    setCustomerEmail(u.email || '');
    try {
      const booking = await createBooking({
        businessId: business.id,
        serviceId: selectedService.id,
        date: selectedDate,
        startTime: selectedTime,
        customerName: name,
        customerEmail: u.email || '',
      }).unwrap();
      setCreatedBooking(booking);
      setStep(4);
    } catch (e) {
      const apiErr = e as { data?: { message?: string } };
      toast({
        title: 'Booking Failed',
        description: apiErr.data?.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.LONG,
        isClosable: true,
      });
    }
  };

  const handleVerificationError = (err: Error) => {
    toast({
      title: 'Verification Failed',
      description: err.message || 'Could not verify. Please try again.',
      status: 'error',
      duration: TOAST_DURATION.LONG,
      isClosable: true,
    });
  };

  const handleBookAnother = () => {
    setCreatedBooking(null);
    setSelectedTime(null);
    setStep(1);
  };

  return {
    step,
    selectedService,
    selectedCategoryId,
    selectedDate,
    selectedTime,
    customerName,
    customerEmail,
    createdBooking,
    isCreating,
    canContinue,
    continueLabel,
    canGoTo,
    setStep,
    setSelectedCategoryId,
    handleSelectService,
    handleDateChange,
    handleSelectTime,
    handleContinue,
    handleVerified,
    handleVerificationError,
    handleBookAnother,
  };
}
