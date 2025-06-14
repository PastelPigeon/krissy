import { createContext, useContext, useState, type ReactNode } from "react"

const Task =  {
  SetGamePath: 0,
  SetAction: 1,
  SetSourceType: 2,
  SetSource: 3,
  SetPacks: 4,
  SetIsEnabledBackup: 5,
  SetNeedLuanchingDR: 6 
}

type TaskType = {
  task: number,
  args: object
}

type TaskContextType = {
  tasks: TaskType[],
  addTask: (task: number, args: object) => void
}

const TaskContext = createContext<TaskContextType | null>(null)

function TaskProvider(props: {children: ReactNode}){
  const [tasks, setTasks] = useState<TaskType[]>([])
  
  //添加task封装
  const addTask = (task: number, args: object) => {
    setTasks(
      [
        ...
        [
          {
            task: task,
            args: args
          }
        ]
      ]
    )
  }

  const contextValue = {
    tasks,
    addTask
  }

  return(
    <TaskContext.Provider value={contextValue}>
      {props.children}
    </TaskContext.Provider>
  )
}

function useTask(){
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export { TaskProvider, useTask, Task }