import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { isStepDone, isStepId, type Wizard } from '@shared';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useSendActionResultMutation } from '../../../store/api';
import { setActiveWizard } from '../../../store/slices/chatSlice';
import { useBusiness } from '../../../contexts/business';
import { WizardHeader } from './WizardHeader';
import { Checklist } from './Checklist';
import { StepForm } from './StepForm';

export function WorkflowExecutionWizard({ wizard }: { wizard: Wizard }) {
  const dispatch = useAppDispatch();
  const business = useBusiness();
  const conversationId = useAppSelector((s) => s.chat.activeTabId);
  const [sendActionResult, { isLoading: isSubmittingAction }] = useSendActionResultMutation();
  const [collapsed, setCollapsed] = useState(false);
  const [openStepId, setOpenStepId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const steps = wizard.steps.map((s) => ({
    ...s,
    done: (isStepId(s.id) && isStepDone(s.id, business)) || s.done,
  }));
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;
  const openStep = openStepId ? steps.find((s) => s.id === openStepId) : undefined;

  const pages = openStep?.fields ?? [];
  const page = Math.min(pageIndex, Math.max(pages.length - 1, 0));
  const fields = pages[page] ?? [];
  const isLast = page >= pages.length - 1;

  const openStepById = (id: string) => { setOpenStepId(id); setPageIndex(0); };
  const backToList = () => { setOpenStepId(null); setPageIndex(0); };

  const submitStep = async (stepId: string) => {
    if (conversationId == null) return;
    await sendActionResult({
      conversationId,
      proposalId: wizard.proposalId,
      status: 'confirmed',
      wizard: { stepId },
    }).unwrap();
  };

  const cancel = () => {
    dispatch(setActiveWizard(null));
    if (conversationId != null) {
      sendActionResult({ conversationId, proposalId: wizard.proposalId, status: 'cancelled', wizard: {} })
        .unwrap()
        .catch((error) => console.error('cancel failed', error));
    }
  };

  useEffect(() => {
    if (allDone) dispatch(setActiveWizard(null));
  }, [allDone, dispatch]);

  return (
    <Box alignSelf="stretch" bg="surface.card" border="1px" borderColor="border.accent"
      borderRadius="lg" boxShadow="sm" overflow="auto">
      <WizardHeader
        openStep={openStep}
        pageIndex={page}
        doneCount={doneCount}
        totalSteps={steps.length}
        workflowLabel={wizard.label}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onClose={cancel}
      />
      {!collapsed && (openStep
        ? 
        <StepForm
          key={openStep.id}
          step={openStep}
          fields={fields}
          isLast={isLast}
          onPrev={() => (page === 0 ? backToList() : setPageIndex(page - 1))}
          onNext={() => setPageIndex(page + 1)}
          onDone={backToList}
          onSaved={submitStep}
          isSubmittingAction={isSubmittingAction}
        />
        : <Checklist steps={steps} onPick={openStepById} />)}
    </Box>
  );
}