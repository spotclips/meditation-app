/**
 * Breathing Engine
 * 
 * State machine for breathing exercises (Inhale -> Hold -> Exhale -> Rest).
 * Pure TypeScript, no React dependencies.
 */

import type { BreathingPattern, BreathingState, BreathingPhase } from '../types/breathing';
import { INITIAL_BREATHING_STATE } from '../types/breathing';

export type BreathingEngineEvent = 
  | { type: 'state_changed'; state: BreathingState }
  | { type: 'phase_changed'; phase: BreathingPhase; isLastCycle: boolean }
  | { type: 'completed' };

export type BreathingEventListener = (event: BreathingEngineEvent) => void;

export class BreathingEngine {
  private pattern: BreathingPattern;
  private state: BreathingState;
  
  private listeners: Set<BreathingEventListener> = new Set();
  
  private tickInterval: ReturnType<typeof setInterval> | null = null;
  private lastTickTime: number = 0;
  
  // Optional duration limits
  private maxDurationSeconds: number | null = null;
  private totalElapsedSeconds: number = 0;
  
  // Internal state tracking
  private phaseElapsedSeconds: number = 0;
  
  constructor(pattern: BreathingPattern, maxDurationSeconds: number | null = null) {
    this.pattern = pattern;
    this.maxDurationSeconds = maxDurationSeconds;
    
    this.state = {
      ...INITIAL_BREATHING_STATE,
      isActive: false,
      pattern,
    };
  }
  
  public start() {
    if (this.state.isActive) return;
    
    this.state.isActive = true;
    this.state.currentPhase = 'inhale';
    this.phaseElapsedSeconds = 0;
    this.state.phaseProgress = 0;
    this.state.phaseDuration = this.getPhaseDuration('inhale');
    this.state.phaseRemaining = this.state.phaseDuration;
    this.state.currentCycle = 1;
    this.state.totalCycles = this.pattern.cycles;
    
    this.lastTickTime = Date.now();
    
    this.emitState();
    this.notify({ type: 'phase_changed', phase: 'inhale', isLastCycle: false });
    
    this.startTicker();
  }
  
  public pause() {
    if (!this.state.isActive) return;
    
    this.state.isActive = false;
    this.stopTicker();
    this.emitState();
  }
  
  public resume() {
    if (this.state.isActive) return;
    
    this.state.isActive = true;
    this.lastTickTime = Date.now();
    this.startTicker();
    this.emitState();
  }
  
  public stop() {
    this.state.isActive = false;
    this.stopTicker();
    
    this.state = {
      ...INITIAL_BREATHING_STATE,
      isActive: false,
      pattern: this.pattern
    };
    
    this.emitState();
    this.notify({ type: 'completed' });
  }
  
  public destroy() {
    this.stopTicker();
    this.listeners.clear();
  }
  
  private startTicker() {
    if (this.tickInterval) return;
    this.tickInterval = setInterval(() => this.tick(), 50);
  }
  
  private stopTicker() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
  
  private tick() {
    if (!this.state.isActive) return;
    
    const now = Date.now();
    const deltaMs = now - this.lastTickTime;
    this.lastTickTime = now;
    
    const deltaSeconds = deltaMs / 1000;
    this.totalElapsedSeconds += deltaSeconds;
    
    if (this.maxDurationSeconds !== null && this.totalElapsedSeconds >= this.maxDurationSeconds) {
      this.stop();
      return;
    }
    
    this.phaseElapsedSeconds += deltaSeconds;
    
    const phaseDuration = this.getPhaseDuration(this.state.currentPhase);
    this.state.phaseDuration = phaseDuration;
    
    if (phaseDuration <= 0) {
      this.advancePhase();
      return;
    }
    
    this.state.phaseProgress = Math.min(this.phaseElapsedSeconds / phaseDuration, 1.0);
    this.state.phaseRemaining = Math.max(0, phaseDuration - this.phaseElapsedSeconds);
    
    if (this.phaseElapsedSeconds >= phaseDuration) {
      this.advancePhase();
    } else {
      this.emitState();
    }
  }
  
  private advancePhase() {
    let nextPhase: BreathingPhase;
    let isLastCycle = false;
    
    switch (this.state.currentPhase) {
      case 'inhale':
        nextPhase = this.pattern.holdDuration > 0 ? 'hold' : 'exhale';
        break;
      case 'hold':
        nextPhase = 'exhale';
        break;
      case 'exhale':
        nextPhase = this.pattern.restDuration > 0 ? 'rest' : 'inhale';
        if (nextPhase === 'inhale') {
          this.state.currentCycle++;
        }
        break;
      case 'rest':
        nextPhase = 'inhale';
        this.state.currentCycle++;
        break;
      default:
        nextPhase = 'inhale';
    }
    
    if (this.state.totalCycles !== Infinity && this.state.currentCycle > this.state.totalCycles) {
      this.stop();
      return;
    }
    
    if (nextPhase === 'inhale' && this.maxDurationSeconds !== null) {
      const cycleDuration = 
        this.pattern.inhaleDuration + 
        this.pattern.holdDuration + 
        this.pattern.exhaleDuration + 
        this.pattern.restDuration;
        
      if (this.totalElapsedSeconds + cycleDuration >= this.maxDurationSeconds) {
        isLastCycle = true;
      }
    }
    
    this.state.currentPhase = nextPhase;
    this.phaseElapsedSeconds = 0;
    this.state.phaseProgress = 0;
    this.state.phaseDuration = this.getPhaseDuration(nextPhase);
    this.state.phaseRemaining = this.state.phaseDuration;
    
    if (this.state.phaseDuration <= 0) {
      this.advancePhase();
      return;
    }
    
    this.emitState();
    this.notify({ type: 'phase_changed', phase: nextPhase, isLastCycle });
  }
  
  private getPhaseDuration(phase: BreathingPhase): number {
    switch (phase) {
      case 'inhale': return this.pattern.inhaleDuration;
      case 'hold': return this.pattern.holdDuration;
      case 'exhale': return this.pattern.exhaleDuration;
      case 'rest': return this.pattern.restDuration;
      default: return 0;
    }
  }
  
  public addEventListener(listener: BreathingEventListener) {
    this.listeners.add(listener);
    listener({ type: 'state_changed', state: this.getState() });
    return () => this.listeners.delete(listener);
  }
  
  private notify(event: BreathingEngineEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
  
  private emitState() {
    this.notify({ type: 'state_changed', state: this.getState() });
  }
  
  public getState(): BreathingState {
    return { ...this.state };
  }
}
