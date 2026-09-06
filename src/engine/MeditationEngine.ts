/**
 * Meditation Engine
 * 
 * Core timeline executor for meditation sessions.
 * Pure TypeScript, no React or React Native dependencies.
 */

import type { 
  Meditation, 
  MeditationStep 
} from '../types/meditation';
import { 
  SessionState, 
  SessionConfiguration, 
  INITIAL_SESSION_STATE
} from '../types/session';

export type MeditationEngineEvent = 
  | { type: 'state_changed'; state: SessionState }
  | { type: 'step_started'; step: MeditationStep }
  | { type: 'session_completed' };

export type EngineEventListener = (event: MeditationEngineEvent) => void;

export class MeditationEngine {
  private meditation: Meditation;
  private config: SessionConfiguration;
  private state: SessionState;
  private isVoicePlaying: boolean = false;
  
  private listeners: Set<EngineEventListener> = new Set();
  
  private tickInterval: ReturnType<typeof setInterval> | null = null;
  private lastTickTime: number = 0;
  
  private timeline: Array<{ startTime: number; step: MeditationStep }> = [];
  
  constructor(meditation: Meditation, config: SessionConfiguration) {
    this.meditation = meditation;
    this.config = config;
    
    const totalDurationSeconds = config.durationSeconds ?? meditation.durationSeconds;
    
    this.state = {
      ...INITIAL_SESSION_STATE,
      status: 'idle',
      config,
      totalDurationSeconds,
      remainingSeconds: totalDurationSeconds,
    };
    
    this.buildTimeline();
  }
  
  private buildTimeline() {
    this.timeline = [];
    let currentTime = 0;
    
    for (const step of this.meditation.steps) {
      this.timeline.push({
        startTime: currentTime,
        step
      });
      currentTime += step.duration ?? 0;
    }
  }
  
  public start() {
    if (this.state.status === 'active') return;
    
    if (this.state.status === 'idle') {
      this.state.status = 'active';
      this.lastTickTime = Date.now();
      this.emitState();
      
      if (this.timeline.length > 0 && this.timeline[0].startTime === 0) {
        this.triggerStep(this.timeline[0].step);
      }
    } else if (this.state.status === 'paused') {
      this.state.status = 'active';
      this.lastTickTime = Date.now();
      this.emitState();
    }
    
    this.startTicker();
  }
  
  public pause() {
    if (this.state.status !== 'active') return;
    
    this.state.status = 'paused';
    this.stopTicker();
    this.emitState();
  }
  
  public stop() {
    this.state.status = 'completed';
    this.stopTicker();
    this.emitState();
    this.notify({ type: 'session_completed' });
  }
  
  public seekBy(seconds: number) {
    if (this.state.status === 'idle' || this.state.status === 'completed') return;
    const previousElapsed = this.state.elapsedSeconds;
    const newElapsed = Math.max(0, Math.min(previousElapsed + seconds, this.state.totalDurationSeconds));
    this.state.elapsedSeconds = newElapsed;
    this.state.remainingSeconds = this.state.totalDurationSeconds - newElapsed;
    this.state.progress = newElapsed / Math.max(1, this.state.totalDurationSeconds);
    
    if (seconds > 0) {
      this.checkTimeline(previousElapsed, newElapsed);
    } else {
      let currentStep = null;
      for (const item of this.timeline) {
        if (item.startTime <= newElapsed) currentStep = item.step;
      }
      if (currentStep) {
        this.state.currentStepId = currentStep.id;
        this.state.currentText = currentStep.text ?? null;
      }
    }
    if (newElapsed >= this.state.totalDurationSeconds) this.stop();
    else this.emitState();
  }
  
  public reset() {
    this.state.elapsedSeconds = 0;
    this.state.remainingSeconds = this.state.totalDurationSeconds;
    this.state.progress = 0;
    
    if (this.timeline.length > 0 && this.timeline[0].startTime === 0) {
      this.triggerStep(this.timeline[0].step);
    } else {
      this.state.currentStepId = null;
      this.state.currentText = null;
    }
    
    this.emitState();
  }
  
  public destroy() {
    this.stopTicker();
    this.listeners.clear();
  }
  
  private startTicker() {
    if (this.tickInterval) return;
    this.tickInterval = setInterval(() => this.tick(), 100);
  }
  
  private stopTicker() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
  
  private tick() {
    if (this.state.status !== 'active') return;
    
    const now = Date.now();
    const deltaMs = now - this.lastTickTime;
    this.lastTickTime = now;
    
    const deltaSeconds = deltaMs / 1000;
    const previousElapsed = this.state.elapsedSeconds;
    const newElapsed = Math.min(
      previousElapsed + deltaSeconds,
      this.state.totalDurationSeconds
    );
    
    this.state.elapsedSeconds = newElapsed;
    this.state.remainingSeconds = this.state.totalDurationSeconds - newElapsed;
    this.state.progress = newElapsed / Math.max(1, this.state.totalDurationSeconds);
    
    this.checkTimeline(previousElapsed, newElapsed);
    
    if (newElapsed >= this.state.totalDurationSeconds) {
      this.stop();
    } else {
      this.emitState();
    }
  }
  
  private checkTimeline(previousElapsed: number, currentElapsed: number) {
    for (const item of this.timeline) {
      if (item.startTime > previousElapsed && item.startTime <= currentElapsed) {
        this.triggerStep(item.step);
      }
    }
  }
  
  private triggerStep(step: MeditationStep) {
    this.state.currentStepId = step.id;
    this.state.currentText = step.text ?? null;
    
    if (step.type === 'voice') {
      this.isVoicePlaying = true;
    }
    
    this.notify({ type: 'step_started', step });
  }
  
  public addEventListener(listener: EngineEventListener) {
    this.listeners.add(listener);
    listener({ type: 'state_changed', state: this.getState() });
    return () => this.listeners.delete(listener);
  }
  
  private notify(event: MeditationEngineEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
  
  private emitState() {
    this.notify({ type: 'state_changed', state: this.getState() });
  }
  
  public getState(): SessionState {
    return { ...this.state };
  }
  
  public markVoiceComplete() {
    if (this.isVoicePlaying) {
      this.isVoicePlaying = false;
      // You could update state here if needed
    }
  }
}
