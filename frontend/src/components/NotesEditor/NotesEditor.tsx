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
import { EditIcon, TrashIcon, PlusIcon } from '../icons';
import {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '../../store/api';
import type { Note } from '../../types';

interface NotesEditorProps {
  customerId?: number;
  bookingId?: number;
  compact?: boolean;
}

const TRUNCATE_LINES = 3;
const LINE_HEIGHT = 20; // approx px per line
const MAX_HEIGHT = TRUNCATE_LINES * LINE_HEIGHT;

export function NotesEditor({ customerId, bookingId, compact = false }: NotesEditorProps) {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const toast = useToast();

  const { data: notes = [], isLoading } = useGetNotesQuery({
    customerId,
    bookingId,
  });

  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
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

  const handleCreate = async () => {
    if (!newNoteContent.trim()) {
      toast({
        title: 'Note content is required',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      await createNote({
        content: newNoteContent,
        customerId,
        bookingId,
      }).unwrap();

      setNewNoteContent('');
      setShowAddForm(false);
      toast({
        title: 'Note added',
        status: 'success',
        duration: 2000,
      });
    } catch {
      toast({
        title: 'Failed to create note',
        status: 'error',
        duration: 3000,
      });
    }
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
      <Flex justify="center" py={compact ? 4 : 8}>
        <Spinner size={compact ? 'sm' : 'md'} />
      </Flex>
    );
  }

  // Compact mode: streamlined UI for inline use
  if (compact) {
    return (
      <VStack spacing={2} align="stretch">
        {/* Add note button / form */}
        {!showAddForm ? (
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<PlusIcon size={12} />}
            color="gray.500"
            justifyContent="flex-start"
            px={0}
            _hover={{ color: 'blue.500' }}
            onClick={() => setShowAddForm(true)}
          >
            Add note
          </Button>
        ) : (
          <Box>
            <Textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write a note..."
              size="sm"
              rows={2}
              mb={2}
              autoFocus
            />
            <HStack spacing={2}>
              <Button
                size="xs"
                colorScheme="blue"
                onClick={handleCreate}
                isLoading={isCreating}
                isDisabled={!newNoteContent.trim()}
              >
                Save
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  setShowAddForm(false);
                  setNewNoteContent('');
                }}
              >
                Cancel
              </Button>
            </HStack>
          </Box>
        )}

        {/* Notes list */}
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            isEditing={editingNoteId === note.id}
            editContent={editContent}
            isUpdating={isUpdating}
            isExpanded={expandedNotes.has(note.id)}
            compact
            onEdit={() => startEditing(note)}
            onDelete={() => handleDelete(note.id)}
            onSave={() => handleUpdate(note.id)}
            onCancel={cancelEditing}
            onEditContentChange={setEditContent}
            onToggleExpand={() => toggleExpanded(note.id)}
          />
        ))}

        {notes.length === 0 && !showAddForm && (
          <Text fontSize="xs" color="gray.400" py={1}>
            No notes
          </Text>
        )}
      </VStack>
    );
  }

  // Full mode: standard editor for drawer sections
  return (
    <VStack spacing={4} align="stretch">
      {/* Create new note */}
      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={2}>
          Add Note
        </Text>
        <Textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="Write a note..."
          rows={3}
          mb={2}
        />
        <Button
          colorScheme="blue"
          size="sm"
          onClick={handleCreate}
          isLoading={isCreating}
          isDisabled={!newNoteContent.trim()}
        >
          Add Note
        </Button>
      </Box>

      {/* Existing notes */}
      {notes.length > 0 && (
        <VStack spacing={3} align="stretch">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              isEditing={editingNoteId === note.id}
              editContent={editContent}
              isUpdating={isUpdating}
              isExpanded={expandedNotes.has(note.id)}
              compact={false}
              onEdit={() => startEditing(note)}
              onDelete={() => handleDelete(note.id)}
              onSave={() => handleUpdate(note.id)}
              onCancel={cancelEditing}
              onEditContentChange={setEditContent}
              onToggleExpand={() => toggleExpanded(note.id)}
            />
          ))}
        </VStack>
      )}

      {notes.length === 0 && (
        <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
          No notes yet
        </Text>
      )}
    </VStack>
  );
}

interface NoteItemProps {
  note: Note;
  isEditing: boolean;
  editContent: string;
  isUpdating: boolean;
  isExpanded: boolean;
  compact: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onEditContentChange: (content: string) => void;
  onToggleExpand: () => void;
}

function NoteItem({
  note,
  isEditing,
  editContent,
  isUpdating,
  isExpanded,
  compact,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onEditContentChange,
  onToggleExpand,
}: NoteItemProps) {
  // Check if content is long enough to need truncation
  const needsTruncation = note.content.split('\n').length > TRUNCATE_LINES || 
    note.content.length > 150;

  const padding = compact ? 2 : 3;
  const fontSize = compact ? 'xs' : 'sm';

  return (
    <Box
      p={padding}
      bg="gray.50"
      borderRadius="md"
      border="1px"
      borderColor="gray.200"
    >
      {isEditing ? (
        // Edit mode
        <VStack spacing={2} align="stretch">
          <Textarea
            value={editContent}
            onChange={(e) => onEditContentChange(e.target.value)}
            rows={compact ? 2 : 3}
            size={compact ? 'sm' : 'md'}
          />
          <HStack spacing={2}>
            <Button
              size={compact ? 'xs' : 'sm'}
              colorScheme="blue"
              onClick={onSave}
              isLoading={isUpdating}
            >
              Save
            </Button>
            <Button size={compact ? 'xs' : 'sm'} variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </HStack>
        </VStack>
      ) : (
        // View mode
        <>
          <Flex justify="space-between" align="start" mb={1}>
            <Text fontSize={compact ? '2xs' : 'xs'} color="gray.400">
              {new Date(note.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                ...(compact ? {} : { year: 'numeric', hour: '2-digit', minute: '2-digit' }),
              })}
            </Text>
            <HStack spacing={0}>
              <IconButton
                aria-label="Edit note"
                icon={<EditIcon size={compact ? 12 : 14} />}
                size="xs"
                variant="ghost"
                minW="auto"
                h="auto"
                p={1}
                onClick={onEdit}
              />
              <IconButton
                aria-label="Delete note"
                icon={<TrashIcon size={compact ? 12 : 14} />}
                size="xs"
                variant="ghost"
                colorScheme="red"
                minW="auto"
                h="auto"
                p={1}
                onClick={onDelete}
              />
            </HStack>
          </Flex>
          <Box>
            <Text
              fontSize={fontSize}
              whiteSpace="pre-wrap"
              noOfLines={!isExpanded && needsTruncation ? TRUNCATE_LINES : undefined}
              maxH={!isExpanded && needsTruncation ? `${MAX_HEIGHT}px` : undefined}
              overflow="hidden"
            >
              {note.content}
            </Text>
            {needsTruncation && (
              <Link
                as="button"
                fontSize={compact ? '2xs' : 'xs'}
                color="blue.500"
                mt={1}
                onClick={onToggleExpand}
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
}
