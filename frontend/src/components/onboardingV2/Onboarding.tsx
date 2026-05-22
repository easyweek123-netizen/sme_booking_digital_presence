import { OnboardingShell } from './OnboardingShell';
import { OnboardingActions } from './OnboardingActions';
import type { OnboardingFlow } from './hooks/useOnboardingFlow';
import type { OnboardingStep } from './types';

interface Props {
  flow: OnboardingFlow;
  steps: OnboardingStep[];
}

export function Onboarding({ flow, steps }: Props) {
  const stepIndex = Math.min(flow.state.stepIndex, steps.length - 1);
  const step = steps[stepIndex];
  const { Component } = step;

  const canContinue = step.isComplete(flow.state);
  const canSkip = Boolean(step.skipPatch);

  const actions = step.hideActions ? null : (
    <OnboardingActions
      canContinue={canContinue}
      onContinue={flow.next}
      onSkip={() => step.skipPatch && flow.skipWith(step.skipPatch)}
      skipDisabled={!canSkip}
    />
  );

  return (
    <OnboardingShell
      activeStep={stepIndex}
      totalSteps={steps.length}
      title={step.title}
      hint={step.hint}
      onBack={flow.back}
      actions={actions}
      isSubmitting={flow.isSubmitting}
      errorMessage={
        flow.isError ? 'Something went wrong creating your business. Please try again.' : undefined
      }
    >
      <Component flow={flow} />
    </OnboardingShell>
  );
}
