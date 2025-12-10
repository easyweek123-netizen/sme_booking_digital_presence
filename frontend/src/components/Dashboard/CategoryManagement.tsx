import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  IconButton,
  Collapse,
  Flex,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  CloseIcon,
  TagIcon,
  ChevronDownIcon,
} from '../icons';
import {
  useGetServiceCategoriesQuery,
  useCreateServiceCategoryMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
} from '../../store/api/servicesApi';
import { TOAST_DURATION } from '../../constants';
import type { ServiceCategory } from '../../types';

const MotionBox = motion.create(Box);

interface CategoryManagementProps {
  businessId: number;
}

export function CategoryManagement({ businessId }: CategoryManagementProps) {
  const toast = useToast();
  const { data: categories = [], isLoading } = useGetServiceCategoriesQuery(businessId);
  const [createCategory] = useCreateServiceCategoryMutation();
  const [updateCategory] = useUpdateServiceCategoryMutation();
  const [deleteCategory] = useDeleteServiceCategoryMutation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await createCategory({
        businessId,
        name: newCategoryName.trim(),
        displayOrder: categories.length,
      }).unwrap();
      toast({
        title: 'Category created',
        status: 'success',
        duration: TOAST_DURATION.SHORT,
      });
      setNewCategoryName('');
      setIsAdding(false);
    } catch {
      toast({
        title: 'Error creating category',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  const handleUpdate = async (category: ServiceCategory) => {
    if (!editingName.trim() || editingName.trim() === category.name) {
      setEditingId(null);
      return;
    }

    try {
      await updateCategory({
        id: category.id,
        name: editingName.trim(),
      }).unwrap();
      toast({
        title: 'Category updated',
        status: 'success',
        duration: TOAST_DURATION.SHORT,
      });
      setEditingId(null);
    } catch {
      toast({
        title: 'Error updating category',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      toast({
        title: 'Category deleted',
        description: 'Services have been moved to uncategorized.',
        status: 'success',
        duration: TOAST_DURATION.MEDIUM,
      });
    } catch {
      toast({
        title: 'Error deleting category',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  const startEdit = (category: ServiceCategory) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  if (isLoading) {
    return (
      <Box bg="white" borderRadius="xl" border="1px" borderColor="gray.100" p={4}>
        <Flex justify="center" py={4}>
          <Spinner size="sm" color="brand.500" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="xl" border="1px" borderColor="gray.100" overflow="hidden">
      {/* Header - Collapsible Toggle */}
      <Button
        variant="ghost"
        w="100%"
        justifyContent="space-between"
        px={5}
        py={4}
        h="auto"
        borderRadius={0}
        onClick={() => setIsExpanded(!isExpanded)}
        _hover={{ bg: 'gray.50' }}
      >
        <HStack spacing={3}>
          <Box color="brand.500">
            <TagIcon size={18} />
          </Box>
          <Text fontWeight="600" color="gray.800">
            Service Categories
          </Text>
          <Text fontSize="sm" color="gray.400">
            ({categories.length})
          </Text>
        </HStack>
        <Box
          transform={isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}
          transition="transform 0.2s"
          color="gray.400"
        >
          <ChevronDownIcon size={20} />
        </Box>
      </Button>

      {/* Expanded Content */}
      <Collapse in={isExpanded}>
        <Box px={5} pb={4} borderTop="1px" borderColor="gray.100">
          <VStack spacing={2} align="stretch" mt={3}>
            <AnimatePresence mode="popLayout">
              {categories.map((category) => (
                <MotionBox
                  key={category.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {editingId === category.id ? (
                    <HStack spacing={2}>
                      <Input
                        size="sm"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        placeholder="Category name"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdate(category);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        borderRadius="md"
                      />
                      <IconButton
                        aria-label="Save"
                        icon={<CheckIcon size={14} />}
                        size="sm"
                        colorScheme="green"
                        variant="ghost"
                        onClick={() => handleUpdate(category)}
                      />
                      <IconButton
                        aria-label="Cancel"
                        icon={<CloseIcon size={14} />}
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      />
                    </HStack>
                  ) : (
                    <Flex
                      align="center"
                      justify="space-between"
                      py={2}
                      px={3}
                      bg="gray.50"
                      borderRadius="md"
                      _hover={{ bg: 'gray.100' }}
                      transition="background 0.2s"
                    >
                      <Text fontSize="sm" color="gray.700">
                        {category.name}
                      </Text>
                      <HStack spacing={0}>
                        <IconButton
                          aria-label="Edit category"
                          icon={<EditIcon size={14} />}
                          size="xs"
                          variant="ghost"
                          colorScheme="gray"
                          onClick={() => startEdit(category)}
                        />
                        <IconButton
                          aria-label="Delete category"
                          icon={<TrashIcon size={14} />}
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(category.id)}
                        />
                      </HStack>
                    </Flex>
                  )}
                </MotionBox>
              ))}
            </AnimatePresence>

            {/* Add New Category */}
            {isAdding ? (
              <HStack spacing={2}>
                <Input
                  size="sm"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') {
                      setIsAdding(false);
                      setNewCategoryName('');
                    }
                  }}
                  autoFocus
                  borderRadius="md"
                />
                <IconButton
                  aria-label="Create category"
                  icon={<CheckIcon size={14} />}
                  size="sm"
                  colorScheme="green"
                  variant="ghost"
                  onClick={handleCreate}
                  isDisabled={!newCategoryName.trim()}
                />
                <IconButton
                  aria-label="Cancel"
                  icon={<CloseIcon size={14} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false);
                    setNewCategoryName('');
                  }}
                />
              </HStack>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<PlusIcon size={14} />}
                onClick={() => setIsAdding(true)}
                colorScheme="brand"
                justifyContent="flex-start"
                fontWeight="500"
              >
                Add Category
              </Button>
            )}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
}

