import { useEffect, useState } from 'react';
import { FiTrash, FiCheckSquare } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/tasklist.scss';

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const key = "@tasks";

  useEffect(() => {
    function getTasks(){
      const result = getSavedTasks(key);
      setTasks(result);
    }
    getTasks();
  }, []);

  // show toast message
  function showSucessfullToast(message:string):void {
    toast.success(message)
  }

  // generate a unique randow id for each task
  const generateId = ():number => {
    return tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
  }

  //get saved tasks from localStorage
  const getSavedTasks = (key: string):Task[] => {
    const myTasks = localStorage.getItem(key);
    if (myTasks) {
      return JSON.parse(myTasks);
    }
    return [];
  }

  //save tasks to localStorage
  const saveTasks = (key: string, newTask:Task):void => {
    const tasksStored = getSavedTasks(key);
    const hasTaskToEdition = tasksStored.some(task => task.id === newTask.id)
    
    if(hasTaskToEdition){
      const newTasks = tasksStored.map(task => task.id === newTask.id ? newTask : task);     
      localStorage.setItem(key, JSON.stringify(newTasks));
    }else{
      tasksStored.push(newTask);
      localStorage.setItem(key, JSON.stringify(tasksStored))
    }
  }

   function handleCreateNewTask():void {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    if (newTaskTitle.trim()) {
      const newTask = {
        id: generateId(),
        title: newTaskTitle,
        isComplete: false
      };
      setTasks([...tasks, newTask]);
      saveTasks(key, newTask);
      setNewTaskTitle('');
      showSucessfullToast('Tarefa criada com sucesso!');
    }
  }

  function returnObjectWithIsCompleteOposite(task: Task):Task {
    return {
      ...task,
      isComplete: !task.isComplete
    }
  }

  function handleToggleTaskCompletion(taskSelected: Task):void {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    setTasks(tasks.map(task => task.id === taskSelected.id ? returnObjectWithIsCompleteOposite(task) : task));
    saveTasks('@tasks', returnObjectWithIsCompleteOposite(taskSelected));
  }

  function handleRemoveTask(id: number):void {
    // Remova uma task da listagem pelo ID
    const myTasksNotDeleted = tasks.filter(task => task.id !== id);
    localStorage.setItem('@tasks', JSON.stringify(myTasksNotDeleted))
    setTasks(myTasksNotDeleted);
    showSucessfullToast('Tarefa excluída com sucesso!');
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input 
            onKeyDown={e => e.key === 'Enter' && handleCreateNewTask()}
            type="text" 
            placeholder="Adicionar novo todo" 
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff"/>
          </button>
        </div>
      </header>

      <main>
        {!!tasks.length ? (
          <ul>
          { tasks.map(task => (
              <li key={task.id}>
                <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                  <label className="checkbox-container">
                    <input 
                      type="checkbox"
                      readOnly
                      checked={task.isComplete}
                      onClick={() => handleToggleTaskCompletion(task)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <p>{task.title}</p>
                </div>

                <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                  <FiTrash size={16}/>
                </button>
              </li>
            ))
          }
          </ul>
        ) : ( 
          <p>Nenhuma tarefa cadastrada</p>
        )}
      </main>

      <Toaster 
        position="top-right"
        reverseOrder={false}
      />
    </section>
  )
}