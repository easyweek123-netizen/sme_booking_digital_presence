import { Text, Center, useToast } from '@chakra-ui/react';
import { useAppDispatch } from '../../store/hooks';
import { setActiveTab, clearActions } from '../../store/slices/canvasSlice';
import { useGetMyBusinessQuery } from '../../store/api';
import { useActionMutations } from '../../hooks';
import { actionRegistry } from '../../config/actionRegistry';
import { CanvasActionsContainer } from './CanvasActionsContainer';
import { ServiceForm } from '../onboarding/ServiceForm';
import { ServiceCard } from '../Dashboard/ServiceCard';
import { DeleteConfirmation } from './DeleteConfirmation';
import type { ChatAction } from '../../types/chat.types';
import type { ComponentType } from 'react';

// ─── Component Map ───

// Map action types to actual components (avoids circular imports in registry)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<ChatAction['type'], ComponentType<any>> = {
  'service:create': ServiceForm,
  'service:update': ServiceForm,
  'service:delete': DeleteConfirmation,
  'service:get': ServiceCard,
};

// ─── Props ───

interface ActionsRendererProps {
  actions: ChatAction[];
}

// ─── Component ───

/**
 * Renders actions in the canvas panel.
 * Uses the action registry to determine which component to render
 * and how to wire up props and mutations.
 */
export function ActionsRenderer({ actions }: ActionsRendererProps) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { data: business } = useGetMyBusinessQuery();
  const mutations = useActionMutations();

  // Get first action (can extend for multiple later)
  const action = actions[0];

  if (!action) {
    return (
      <Center h="full" color="gray.400">
        <Text>No active actions. Ask the AI for help!</Text>
      </Center>
    );
  }

  const config = actionRegistry[action.type];
  if (!config) {
    return (
      <Center h="full" color="gray.400">
        <Text>Unknown action: {action.type}</Text>
      </Center>
    );
  }

  // ─── Handlers ───

  const handleComplete = () => {
    dispatch(clearActions());
    dispatch(setActiveTab('preview'));
  };

  const handleCancel = () => {
    dispatch(clearActions());
    dispatch(setActiveTab('preview'));
  };

  // ─── Build Props ───

  const componentProps = config.getProps(action, { business: business ?? undefined });

  // Get mutation function if action has one
  // Pass action to getMutation so it can access IDs (businessId, serviceId, etc.)
  const onSubmit = config.getMutation
    ? async (data: unknown) => {
        try {
          await config.getMutation!(mutations, action)(data);
          toast({ title: 'Success', status: 'success', duration: 2000 });
          handleComplete();
        } catch {
          toast({ title: 'Error', status: 'error', duration: 3000 });
        }
      }
    : undefined;

  // Get component from map
  const Component = componentMap[action.type];

  // ─── Render ───

  return (
    <CanvasActionsContainer title={config.title}>
      <Component {...componentProps} onSubmit={onSubmit} onCancel={handleCancel} />
    </CanvasActionsContainer>
  );
}
