import { ListNotesTool } from './list.tool';
import { CreateNoteTool } from './create.tool';
import { UpdateNoteTool } from './update.tool';
import { DeleteNoteTool } from './delete.tool';

export { ListNotesTool } from './list.tool';
export { CreateNoteTool } from './create.tool';
export { UpdateNoteTool } from './update.tool';
export { DeleteNoteTool } from './delete.tool';

/** All note tool handlers for module registration */
export const NoteToolHandlers = [
  ListNotesTool,
  CreateNoteTool,
  UpdateNoteTool,
  DeleteNoteTool,
];
