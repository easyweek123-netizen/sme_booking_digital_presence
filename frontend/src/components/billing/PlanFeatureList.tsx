import { HStack, List, ListItem, Text } from '@chakra-ui/react';
import { CheckIcon } from '../icons';

interface PlanFeatureListProps {
  features: string[];
  size?: 'sm' | 'md';
}

export function PlanFeatureList({ features, size = 'md' }: PlanFeatureListProps) {
  return (
    <List spacing={size === 'sm' ? 2 : 3}>
      {features.map((feature) => (
        <ListItem key={feature}>
          <HStack align="start" spacing={3}>
            <Text color="brand.600" mt="2px" flexShrink={0}>
              <CheckIcon size={18} />
            </Text>
            <Text
              color="text.secondary"
              fontSize={size === 'sm' ? 'sm' : 'md'}
              lineHeight="1.4"
            >
              {feature}
            </Text>
          </HStack>
        </ListItem>
      ))}
    </List>
  );
}

