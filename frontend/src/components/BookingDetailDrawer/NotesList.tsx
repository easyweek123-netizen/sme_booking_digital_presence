import { useState } from 'react';
import {
  Box,
  VStack,
  Textarea,
  Button,
  Text,
  HStack,
  IconButton,
  useToast,
  Spinner,
  Flex,
  Link,
} from '@chakra-ui/react';
import { EditIcon, TrashIcon } from '../icons';
import {
  useGetNotesQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '../../store/api';
import type { Note } from '../../types';

interface NotesListProps {
  customerId?: number;
  bookingId?: number;
}

const TRUNCATE_LINES = 3;

export function NotesList({ customerId, bookingId }: NotesListProps) {
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());
  const toast = useToast();

  const { data: notes = [], isLoading } = useGetNotesQuery({
    customerId,
    bookingId,
  });

  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const toggleExpanded = (noteId: number) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }
      return next;
    });
  };

  const handleUpdate = async (noteId: number) => {
    if (!editContent.trim()) {
      toast({
        title: 'Note content is required',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      await updateNote({
        id: noteId,
        data: { content: editContent },
      }).unwrap();

      setEditingNoteId(null);
      setEditContent('');
      toast({
        title: 'Note updated',
        status: 'success',
        duration: 2000,
      });
    } catch {
      toast({
        title: 'Failed to update note',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await deleteNote(noteId).unwrap();
      toast({
        title: 'Note deleted',
        status: 'success',
        duration: 2000,
      });
    } catch {
      toast({
        title: 'Failed to delete note',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditContent('');
  };

  if (isLoading) {
    return (
      <Flex justify="center" py={4}>
        <Spinner size="sm" />
      </Flex>
    );
  }

  if (notes.length === 0) {
    return (
      <Text fontSize="sm" color="gray.500" py={2}>
        No notes yet
      </Text>
    );
  }

  return (
    <VStack spacing={3} align="stretch">
      {notes.map((note) => {
        const needsTruncation = note.content.split('\n').length > TRUNCATE_LINES || 
          note.content.length > 150;
        const isExpanded = expandedNotes.has(note.id);

        return (
          <Box
            key={note.id}
            p={3}
            bg="gray.50"
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
          >
            {editingNoteId === note.id ? (
              <VStack spacing={2} align="stretch">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  size="sm"
                />
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleUpdate(note.id)}
                    isLoading={isUpdating}
                  >
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEditing}>
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <>
                <Flex justify="space-between" align="start" mb={1}>
                  <Text fontSize="xs" color="gray.400">
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  <HStack spacing={0}>
                    <IconButton
                      aria-label="Edit note"
                      icon={<EditIcon size={14} />}
                      size="xs"
                      variant="ghost"
                      minW="auto"
                      h="auto"
                      p={1}
                      onClick={() => startEditing(note)}
                    />
                    <IconButton
                      aria-label="Delete note"
                      icon={<TrashIcon size={14} />}
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      minW="auto"
                      h="auto"
                      p={1}
                      onClick={() => handleDelete(note.id)}
                    />
                  </HStack>
                </Flex>
                <Box>
                  <Text
                    fontSize="sm"
                    whiteSpace="pre-wrap"
                    noOfLines={!isExpanded && needsTruncation ? TRUNCATE_LINES : undefined}
                    overflow="hidden"
                  >
                    {note.content}
                  </Text>
                  {needsTruncation && (
                    <Link
                      as="button"
                      fontSize="xs"
                      color="blue.500"
                      mt={1}
                      onClick={() => toggleExpanded(note.id)}
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </Link>
                  )}
                </Box>
              </>
            )}
          </Box>
        );
      })}
    </VStack>
  );
}

