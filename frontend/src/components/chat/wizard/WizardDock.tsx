import { WIZARD_TYPE, type Wizard } from '@shared';
import { QuestionTilesWizard } from './QuestionTilesWizard';
import { SetupFieldsWizard } from './SetupFieldsWizard';

const WIZARD_REGISTRY = {
  [WIZARD_TYPE.QUESTION_TILES]: QuestionTilesWizard,
  [WIZARD_TYPE.SETUP_FIELDS]: SetupFieldsWizard,
};

export function WizardDock({ wizard, onSend }: { wizard: Wizard; onSend: (t: string) => void }) {
  const Component = WIZARD_REGISTRY[wizard.type];
  return <Component wizard={wizard} onSend={onSend} />;
}