import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { TaskList } from '../../components/TaskList';

describe('App Page', () => {
  it('should be able to add a task', async () => {
    render(<TaskList />);

    const taskInput = screen.getByPlaceholderText('Adicionar novo todo');
    const addTaskButton = screen.getByTestId('add-task-button');

    fireEvent.change(taskInput, {
      target: {
        value: 'Beba agua diariamente'
      }
    });
    fireEvent.click(addTaskButton);

    const addedFirstTaskTitle = screen.getByText('Beba agua diariamente');

    expect(addedFirstTaskTitle).toHaveTextContent('Beba agua diariamente');
    expect(addedFirstTaskTitle.parentElement).not.toHaveClass('completed')

    fireEvent.change(taskInput, {
      target: {
        value: 'Páre de tomar coca-cola'
      }
    });
    fireEvent.click(addTaskButton);

    const addedSecondTaskTitle = screen.getByText('Páre de tomar coca-cola');

    expect(addedFirstTaskTitle).toBeInTheDocument();
    expect(addedFirstTaskTitle).toHaveTextContent('Beba agua diariamente');
    expect(addedFirstTaskTitle.parentElement).not.toHaveClass('completed')

    expect(addedSecondTaskTitle).toHaveTextContent('Páre de tomar coca-cola');
    expect(addedSecondTaskTitle.parentElement).not.toHaveClass('completed')
  })

  it('should not be able to add a task with a empty title', () => {
    render(<TaskList />);

    const addTaskButton = screen.getByTestId('add-task-button');

    fireEvent.click(addTaskButton);

    expect(screen.queryByTestId('task')).not.toBeInTheDocument();

    const taskInput = screen.getByPlaceholderText('Adicionar novo todo');

    fireEvent.change(taskInput, {
      target: {
        value: 'ReactJS é uma delícia!'
      }
    });
    
    fireEvent.click(addTaskButton);

    const addedFirstTaskTitle = screen.getByText('ReactJS é uma delícia!');

    expect(addedFirstTaskTitle).toHaveTextContent('ReactJS é uma delícia!');
  })

  it('should be able to remove a task', async () => {
    render(<TaskList />);

    const taskInput = screen.getByPlaceholderText('Adicionar novo todo');
    const addTaskButton = screen.getByTestId('add-task-button');

    fireEvent.change(taskInput, {
      target: {
        value: 'ReactJS é uma delícia!'
      }
    });
    fireEvent.click(addTaskButton);

    fireEvent.change(taskInput, {
      target: {
        value: 'Páre de tomar coca-cola'
      }
    });
    fireEvent.click(addTaskButton);

    const addedFirstTaskTitle = screen.getByText('ReactJS é uma delícia!');
    const addedSecondTaskTitle = screen.getByText('Páre de tomar coca-cola');

    expect(addedFirstTaskTitle).toBeInTheDocument()
    expect(addedSecondTaskTitle).toBeInTheDocument();

    const [addedFirstTaskRemoveButton] = screen.getAllByTestId('remove-task-button');

    fireEvent.click(addedFirstTaskRemoveButton);

    expect(addedFirstTaskTitle).not.toBeInTheDocument();
    expect(addedSecondTaskTitle).toBeInTheDocument();
  })

  it('should be able to check a task', () => {
    render(<TaskList />);

    const taskInput = screen.getByPlaceholderText('Adicionar novo todo');
    const addTaskButton = screen.getByTestId('add-task-button');

    fireEvent.change(taskInput, {
      target: {
        value: 'ReactJS é uma delícia!'
      }
    });
    fireEvent.click(addTaskButton);

    fireEvent.change(taskInput, {
      target: {
        value: 'Páre de tomar coca-cola'
      }
    });
    fireEvent.click(addTaskButton);

    const [addedFirstTask, addedSecondTask] = screen.getAllByTestId('task');

    if (addedFirstTask.firstChild) {
      fireEvent.click(addedFirstTask.firstChild)
    }

    expect(addedFirstTask).toBeInTheDocument();
    expect(addedFirstTask).toHaveClass('completed');

    expect(addedSecondTask).toBeInTheDocument();
    expect(addedSecondTask).not.toHaveClass('completed');
  })
})
