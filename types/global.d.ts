interface CountdownTimerProps {
  minutes: number;
  seconds: number;
  setDone?(flag: boolean): void;
}
