import { createSlice } from '@reduxjs/toolkit';

const initKanbanState = {
	tasks: {
		'task-1': {
			id: 'task-1',
			taskName: 'Take out the garbage',
			description: '',
		},
		'task-2': {
			id: 'task-2',
			taskName: 'Watch my favorite show',
			description: 'My favorite show is Attack on Titan',
		},
		'task-3': {
			id: 'task-3',
			taskName: 'Charge my phone',
			description: '',
		},
		'task-4': {
			id: 'task-4',
			taskName: 'Cook dinner',
			description: 'Find recipes for pizza',
		},
	},
	columns: {
		'column-1': {
			id: 'column-1',
			title: 'To do',
			taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
		},
		'column-2': {
			id: 'column-2',
			title: 'In progress',
			taskIds: [],
		},
		'column-3': {
			id: 'column-3',
			title: 'Done',
			taskIds: [],
		},
	},
	// Facilitate reordering of the columns
	columnOrder: ['column-1', 'column-2', 'column-3'],
};

const kanbanSlice = createSlice({
	name: 'kanban',
	initialState: initKanbanState,
	reducers: {
		addTask(state, action) {
			// Add new task
			const newTaskId = `task-${Object.keys(state.tasks).length + 1}`;
			const newTasks = {
				...state.tasks,
				[newTaskId]: {
					id: newTaskId,
					taskName: action.payload.taskName,
					description: action.payload.description,
				},
			};

			// Adding the new Task into a column
			const firstColumn = state.columnOrder[0];
			const column = state.columns[firstColumn];
			const newColumnTasks = [...column.taskIds];
			newColumnTasks.splice(newColumnTasks.length, 0, newTaskId);

			// Update columns
			const newColumns = {
				...state.columns,
				[column.id]: { ...column, taskIds: newColumnTasks },
			};

			state.tasks = newTasks;
			state.columns = newColumns;
		},
		deleteTask(state, action) {
			const taskId = action.payload.taskId;
			const newTasks = { ...state.tasks };
			delete newTasks[taskId];

			const columnId = action.payload.columnId;
			let newColumn = { ...state.columns[columnId] };
			const columnTasks = [...newColumn.taskIds];
			columnTasks.splice(action.payload.index, 1);
			newColumn = { ...newColumn, taskIds: columnTasks };
			state.columns = { ...state.columns, [columnId]: newColumn };
		},
		addColumn(state, action) {
			// Updating columns
			const newColumnId = `column-${
				Object.keys(state.columns).length + 1
			}`;
			const newColumn = {
				id: newColumnId,
				title: action.payload.columnName,
				taskIds: [],
			};
			const newColumns = { ...state.columns, [newColumnId]: newColumn };

			// Updating columnOrder
			const newColumnOrder = [...state.columnOrder];
			newColumnOrder.splice(0, 0, newColumnId);
			console.log(newColumns);
			console.log(newColumnOrder);

			state.columns = newColumns;
			state.columnOrder = newColumnOrder;
		},
		taskReorder(state, action) {
			const newColumns = action.payload.newColumns;
			state.columns = newColumns;
		},
		columnReorder(state, action) {
			state.columnOrder = action.payload.newColOrder;
		},
	},
});

export const kanbanActions = kanbanSlice.actions;

export default kanbanSlice.reducer;
