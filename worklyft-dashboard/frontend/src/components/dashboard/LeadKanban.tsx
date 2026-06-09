'use client';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, DragEndEvent, DragOverEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import type { Lead, LeadStage } from '@/types';

const STAGES: { key: LeadStage; label: string; color: string; bg: string }[] = [
  { key: 'DRAFT',      label: 'Draft',      color: 'text-slate-400',  bg: 'bg-slate-500/10' },
  { key: 'CHEMISTRY',  label: 'Chemistry',  color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { key: 'SALES',      label: 'Sales',      color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  { key: 'EVALUATION', label: 'Evaluation', color: 'text-amber-400',  bg: 'bg-amber-500/10' },
  { key: 'CLOSURE',    label: 'Closure',    color: 'text-emerald-400',bg: 'bg-emerald-500/10' },
];

function LeadCard({ lead, isDragging = false }: { lead: Lead; isDragging?: boolean }) {
  const stage = STAGES.find((s) => s.key === lead.stage)!;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="button"
      aria-label={`Lead: ${lead.company} - ${lead.contactName} - ${formatCurrency(lead.value)}`}
      tabIndex={0}
      className={cn(
        'glass-card p-3 cursor-grab active:cursor-grabbing select-none',
        isDragging && 'shadow-2xl scale-105 border-white/10',
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-semibold text-foreground leading-tight">{lead.company}</p>
        <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded border ml-1 shrink-0', stage.color, stage.bg, `border-current/20`)}>
          {stage.label}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-2">{lead.contactName}</p>
      <p className="text-sm font-bold text-foreground">{formatCurrency(lead.value, true)}</p>
    </div>
  );
}

function KanbanColumn({ stage, leads }: { stage: typeof STAGES[0]; leads: Lead[] }) {
  const totalValue = leads.reduce((s, l) => s + l.value, 0);

  return (
    <div className="flex flex-col min-w-[200px] max-w-[220px]" role="region" aria-label={`${stage.label} column`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', stage.bg.replace('/10', '').replace('bg-', 'bg-').replace('500', '400'))} />
          <span className={cn('text-xs font-semibold', stage.color)}>{stage.label}</span>
        </div>
        <span className="text-[10px] text-muted-foreground bg-white/[0.04] border border-border rounded-full px-1.5 py-0.5">
          {leads.length}
        </span>
      </div>
      <div className="text-[10px] text-muted-foreground mb-3 px-1">
        {formatCurrency(totalValue, true)} pipeline
      </div>

      <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 flex-1 min-h-[80px] p-1 rounded-lg transition-colors">
          <AnimatePresence>
            {leads.map((lead) => (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <LeadCard lead={lead} />
              </motion.div>
            ))}
          </AnimatePresence>
          {leads.length === 0 && (
            <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-border/50 min-h-[60px]">
              <p className="text-[10px] text-muted-foreground">Drop here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

interface Props { leads: Lead[] }

export function LeadKanban({ leads: initialLeads }: Props) {
  const { activeUser } = useAppStore();
  const queryClient = useQueryClient();
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId) {
      setLeads(initialLeads);
    }
  }, [initialLeads, activeId]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const mutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: LeadStage }) =>
      api.leads.updateStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', activeUser?.id] });
    },
    onError: () => {
      toast.error('Failed to update lead stage');
      setLeads(initialLeads);
    },
  });

  const leadById = (id: string) => leads.find((l) => l.id === id);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const overId = String(over.id);
    const targetStage = STAGES.find((s) => s.key === overId)?.key
      ?? leads.find((l) => l.id === overId)?.stage;

    if (!targetStage) return;

    const lead = leadById(String(active.id));
    if (!lead || lead.stage === targetStage) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, stage: targetStage } : l)),
    );
    mutation.mutate({ id: lead.id, stage: targetStage });
  }, [leads, mutation]);

  const getLeadsForStage = (stage: LeadStage) => leads.filter((l) => l.stage === stage);
  const activeLead = activeId ? leadById(activeId) : null;

  return (
    <div className="glass-card p-5" aria-label="Lead pipeline kanban board">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Lead Pipeline</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Drag cards to advance stages</p>
        </div>
        <span className="text-xs text-muted-foreground">{leads.length} leads</span>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {STAGES.map((stage) => (
            <KanbanColumn key={stage.key} stage={stage} leads={getLeadsForStage(stage.key)} />
          ))}
        </div>

        <DragOverlay>
          {activeLead && <LeadCard lead={activeLead} isDragging />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
