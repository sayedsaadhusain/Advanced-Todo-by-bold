import { useState, useRef, useEffect } from 'react';
import { Plus, Sun, Moon, Edit, Save, Star } from 'lucide-react'; // Import Star icon

interface Todo {
  id: number;
  text: string; // Title
  description: string;
  tags: string[];
  completed: boolean;
  isEditing?: boolean;
  priority: 'Low' | 'Medium' | 'High'; // Add priority field
  createdAt: number; // Add creation timestamp (using number for simplicity)
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingTags, setEditingTags] = useState<string[]>([]);
  const [editingPriority, setEditingPriority] = useState<'Low' | 'Medium' | 'High'>('Low'); // State for editing priority
  const editTitleInputRef = useRef<HTMLInputElement>(null);
  const editDescInputRef = useRef<HTMLTextAreaElement>(null);
  const editTagsInputRef = useRef<HTMLInputElement>(null);
  const editPrioritySelectRef = useRef<HTMLSelectElement>(null); // Ref for priority select

  // Helper to parse comma-separated tags string into an array
  const parseTags = (tagsString: string): string[] => {
    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== ''); // Remove empty tags
  };

  const addTodo = () => {
    if (newTodoText.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now(),
      text: newTodoText,
      description: '',
      tags: [],
      completed: false,
      isEditing: false,
      priority: 'Low', // Default priority for new todos
      createdAt: Date.now(), // Set creation timestamp
    };
    setTodos([...todos, newTodo]);
    setNewTodoText('');
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleAddKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  };

  const startEditing = (id: number, currentTitle: string, currentDescription: string, currentTags: string[], currentPriority: 'Low' | 'Medium' | 'High') => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, isEditing: true } : { ...todo, isEditing: false }
    ));
    setEditingTitle(currentTitle);
    setEditingDescription(currentDescription);
    setEditingTags(currentTags);
    setEditingPriority(currentPriority); // Set initial priority for editing
  };

  const updateTodo = (id: number) => {
    if (editingTitle.trim() === '') {
       const originalTodo = todos.find(todo => todo.id === id);
       if (originalTodo) {
         setEditingTitle(originalTodo.text);
       }
       setTodos(todos.map((todo) =>
         todo.id === id ? { ...todo, isEditing: false } : todo
       ));
       setEditingTitle('');
       setEditingDescription('');
       setEditingTags([]);
       setEditingPriority('Low'); // Reset editing priority state
       return;
    }

    const tagsString = editTagsInputRef.current?.value ?? editingTags.join(', ');
    const updatedTags = parseTags(tagsString);

    // Get priority from the select ref if available, otherwise use state (fallback)
    const updatedPriority = (editPrioritySelectRef.current?.value as 'Low' | 'Medium' | 'High') ?? editingPriority;


    setTodos(todos.map((todo) =>
      todo.id === id ? {
        ...todo,
        text: editingTitle.trim(),
        description: editingDescription.trim(),
        tags: updatedTags,
        priority: updatedPriority, // Save updated priority
        isEditing: false
      } : todo
    ));
    setEditingTitle('');
    setEditingDescription('');
    setEditingTags([]);
    setEditingPriority('Low'); // Reset editing priority state
  };

  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
    if (event.key === 'Enter' && !(event.target instanceof HTMLTextAreaElement && event.shiftKey)) {
       event.preventDefault();
       // If Enter is pressed in Title or Tags input, save the todo
       if (event.target === editTitleInputRef.current || event.target === editTagsInputRef.current) {
           updateTodo(id);
       }
       // If Enter (without Shift) is pressed in Description, also save (optional, could just move focus)
       else if (event.target === editDescInputRef.current) {
           updateTodo(id);
       }
    } else if (event.key === 'Escape') {
       setTodos(todos.map((todo) =>
         todo.id === id ? { ...todo, isEditing: false } : todo
       ));
       setEditingTitle('');
       setEditingDescription('');
       setEditingTags([]);
       setEditingPriority('Low');
    }
  };

  // Focus the title input when editing starts
  useEffect(() => {
    if (todos.some(todo => todo.isEditing) && editTitleInputRef.current) {
      editTitleInputRef.current.focus();
    }
  }, [todos]);

  // Determine star color based on priority
  const getPriorityColor = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High':
        return 'text-red-500 dark:text-red-400';
      case 'Medium':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'Low':
      default:
        return 'text-gray-400 dark:text-gray-500';
    }
  };

  // Determine background color for dropdown options based on priority
  const getPriorityBgColor = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High':
        return 'bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200';
      case 'Medium':
        return 'bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200';
      case 'Low':
      default:
        return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  // Format timestamp to a readable date string
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust format as needed
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-10">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Todo List</h1>
        <div className="flex mb-4">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add new todo title..."
            onKeyDown={handleAddKeyDown}
            className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-r-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <Plus className="h-5 w-5 inline-block" />
          </button>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {todos.map((todo) => (
            <li key={todo.id} className="py-3 flex flex-col space-y-1">
              {/* Top Row: Checkbox, Priority, Title/Input, Buttons */}
              <div className="flex items-center space-x-2 w-full">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="flex-shrink-0"
                  disabled={todo.isEditing}
                />
                 {/* Priority Display/Edit */}
                

                {todo.isEditing ? (
                  <input
                    ref={editTitleInputRef}
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                    className="flex-grow px-1 py-0.5 border border-blue-500 rounded focus:outline-none dark:bg-gray-700 dark:text-white dark:border-blue-400 font-medium"
                  />    
                ) : (
                  <span
                    className={`flex-grow font-medium ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}
                  >
                    {todo.text}
                  </span>
                )}
                <div className="flex space-x-1 flex-shrink-0 ml-auto">
                  {todo.isEditing ? (
                    <button
                      onClick={() => updateTodo(todo.id)}
                      className="px-2 py-1 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                      title="Save Changes"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(todo.id, todo.text, todo.description, todo.tags, todo.priority)} // Pass priority to startEditing
                      className="px-2 py-1 bg-yellow-500 dark:bg-yellow-600 text-white rounded hover:bg-yellow-600 dark:hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400"
                       title="Edit Todo"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-2 py-1 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                    disabled={todo.isEditing}
                    title="Delete Todo"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Description Area (View or Edit) */}
              <div className="pl-6 w-full">
                {todo.isEditing ? (
                  <textarea
                    ref={editDescInputRef}
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                    placeholder="Add description..."
                    className="w-full px-1 py-0.5 border border-blue-500 rounded focus:outline-none dark:bg-gray-700 dark:text-white dark:border-blue-400 text-sm text-gray-600 dark:text-gray-300"
                    rows={2}
                  />
                ) : (
                  todo.description && (
                    <p className={`text-sm ${todo.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                      {todo.description}
                    </p>
                  )
                )}
              </div>

              {/* Tags Area (View or Edit) */}
              <div className="pl-6 w-full">
                {todo.isEditing ? (
                  <input
                    ref={editTagsInputRef}
                    type="text"
                    defaultValue={editingTags.join(', ')}
                    onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                    placeholder="Tags (comma-separated)..."
                    className="w-full px-1 py-0.5 border border-blue-500 rounded focus:outline-none dark:bg-gray-700 dark:text-white dark:border-blue-400 text-xs text-gray-600 dark:text-gray-300"
                  />
                ) : (
                  todo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {todo.tags.map((tag, index) => (
                        <span key={index} className={`px-2 py-0.5 rounded-full text-xs ${todo.completed ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )
                )}
              </div>

              {/* Creation Date */}
              <div className="pl-6 w-full text-xs text-gray-500 dark:text-gray-400 mt-1"> {/* Styling for date */}
                 Created: {formatDate(todo.createdAt)}
              </div>
            </li>
          ))}
        </ul>
        {/* Dark Mode Toggle */}
        <label className="relative inline-flex items-center cursor-pointer mt-4">
          <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className="sr-only peer"/>
          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400">
          </div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark Mode</span>
        </label>
      </div>
    </div>
  );
};

export default App;
