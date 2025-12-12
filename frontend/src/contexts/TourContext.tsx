import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TOUR_STEPS, type TourStep } from '../config/tourSteps';

const TOUR_STORAGE_KEY = 'bookeasy_tour_completed';
const MOBILE_BREAKPOINT = 768;

interface TourContextValue {
  // State
  isActive: boolean;
  showIntro: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  totalSteps: number;
  isMobile: boolean;
  businessSlug: string | null;
  
  // Target element
  targetElement: HTMLElement | null;
  
  // Actions
  startTour: (slug?: string) => void;
  beginSpotlight: () => void;
  visitPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  
  // For checking if tour should auto-start
  hasCompletedTour: boolean;
}

const TourContext = createContext<TourContextValue | null>(null);

interface TourProviderProps {
  children: ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showIntro, setShowIntro] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [businessSlug, setBusinessSlug] = useState<string | null>(null);
  const [hasCompletedTour, setHasCompletedTour] = useState(() => {
    return localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
  });
  
  // Detect mobile viewport
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  );

  // Listen for window resize to update mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter steps based on viewport - mobile only gets booking-link step
  const activeSteps = useMemo(() => {
    if (isMobile) {
      return TOUR_STEPS.filter(s => s.id === 'booking-link');
    }
    return TOUR_STEPS;
  }, [isMobile]);
  
  const currentStep = isActive ? activeSteps[currentStepIndex] : null;
  const totalSteps = activeSteps.length;

  // Find and set target element when step changes
  useEffect(() => {
    if (!isActive || !currentStep) {
      setTargetElement(null);
      return;
    }

    const findTarget = () => {
      const element = document.querySelector(
        `[data-tour-id="${currentStep.targetId}"]`
      ) as HTMLElement | null;
      
      setTargetElement(element);
    };

    const timer = setTimeout(findTarget, 10);
    return () => clearTimeout(timer);
  }, [isActive, currentStep, location.pathname]);

  // Navigate to step's route if different from current
  useEffect(() => {
    if (!isActive || !currentStep?.route) return;
    
    if (location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }
  }, [isActive, currentStep, location.pathname, navigate]);

  // Start tour - shows intro
  const startTour = useCallback((slug?: string) => {
    if (slug) setBusinessSlug(slug);
    setShowIntro(true);
    setCurrentStepIndex(0);
    window.history.replaceState({}, document.title);
  }, []);

  // Begin spotlight tour (after intro)
  const beginSpotlight = useCallback(() => {
    setShowIntro(false);
    setIsActive(true);
  }, []);

  // Visit the booking page
  const visitPage = useCallback(() => {
    if (businessSlug) {
      window.open(`/book/${businessSlug}`, '_blank');
    }
  }, [businessSlug]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsActive(false);
      setHasCompletedTour(true);
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    }
  }, [currentStepIndex, activeSteps.length]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    setShowIntro(false);
    setIsActive(false);
    setHasCompletedTour(true);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    navigate('/dashboard');
  }, [navigate]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        showIntro,
        currentStepIndex,
        currentStep,
        totalSteps,
        isMobile,
        businessSlug,
        targetElement,
        startTour,
        beginSpotlight,
        visitPage,
        nextStep,
        prevStep,
        skipTour,
        hasCompletedTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour(): TourContextValue {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
