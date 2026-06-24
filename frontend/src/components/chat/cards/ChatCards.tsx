import { VStack } from '@chakra-ui/react';
import { CARD_KIND, type ChatCard } from '@shared';
import { SummaryCard } from './SummaryCard';
// import { ActionsFallback } from './ActionsFallback';

interface ChatCardsProps {
  cards: ChatCard[];
}

export function ChatCards({ cards }: ChatCardsProps) {
  if (!cards.length) return null;
  return (
    <VStack align="stretch" spacing={3} mt={2}>
      {cards.map((card, i) => {
        switch (card.kind) {
          case CARD_KIND.SUMMARY:  return <SummaryCard key={i} card={card} />;
          default:         
            return null;
        }
      })}
    </VStack>
  );
}