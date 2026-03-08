import { UserProfile, TrackerEntry, PeriodEntry } from './types';

const PROFILE_KEY = 'glow_profile';
const TRACKERS_KEY = 'glow_trackers';
const PERIODS_KEY = 'glow_periods';

export function getProfile(): UserProfile | null {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getTrackerEntries(type?: string): TrackerEntry[] {
  const data = localStorage.getItem(TRACKERS_KEY);
  const entries: TrackerEntry[] = data ? JSON.parse(data) : [];
  return type ? entries.filter(e => e.type === type) : entries;
}

export function addTrackerEntry(entry: TrackerEntry) {
  const entries = getTrackerEntries();
  entries.push(entry);
  localStorage.setItem(TRACKERS_KEY, JSON.stringify(entries));
}

export function getPeriodEntries(): PeriodEntry[] {
  const data = localStorage.getItem(PERIODS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addPeriodEntry(entry: PeriodEntry) {
  const entries = getPeriodEntries();
  entries.push(entry);
  localStorage.setItem(PERIODS_KEY, JSON.stringify(entries));
}

export function clearAllData() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(TRACKERS_KEY);
  localStorage.removeItem(PERIODS_KEY);
}
