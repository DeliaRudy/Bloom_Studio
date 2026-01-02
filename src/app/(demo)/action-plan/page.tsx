
'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle } from 'lucide-react';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { demoActionPlan } from '@/lib/demo-data';

type ActionPlanItem = {
    id: string;
    itemText: string;
    isCompleted: boolean;
};

export default function DemoActionPlanPage() {
  const [tasks, setTasks] = React.useState<ActionPlanItem[]>(demoActionPlan);
  const [newTask, setNewTask] = React.useState('');
  const { toast } = useToast();

  const handleAddTask = () => {
    if (newTask.trim()) {
      toast({
          title: "Demo Mode",
          description: "Adding new tasks is disabled in the demo.",
          variant: "default",
      });
      setNewTask('');
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast({
        title: "Demo Mode",
        description: "Task removed for this session only.",
        variant: "default",
    });
  };

  const handleGenerateSummary = () => {
    const summary = tasks
      .map((t) => `${t.isCompleted ? '[x]' : '[ ]'} ${t.itemText}`)
      .join('\n');
    console.log('Action Plan Summary:', summary);
    toast({
      title: 'Plan Summary Generated!',
      description: 'Your action plan has been copied to the console.',
    });
  };

  return (
    <div>
      <PageHeader
        title="My Action Plan"
        description="What do you need to do to make your vision a reality? Break it down into small, manageable steps."
      />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              STEP 4
            </Badge>
            <CardTitle className="font-headline">To-Do List</CardTitle>
          </div>
          <CardDescription>
            Add, edit, and complete your tasks below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks?.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50"
              >
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.isCompleted}
                  onCheckedChange={() => handleToggleTask(task.id)}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`flex-grow text-sm ${
                    task.isCompleted ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.itemText}
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTask(task.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Input
              placeholder="Add a new action step..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button onClick={handleAddTask}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateSummary} className="ml-auto">
            Generate Plan Summary
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
