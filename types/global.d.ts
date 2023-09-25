interface CountdownTimerProps {
  minutes: number | string;
  seconds: number | string;
  setDone?(flag: boolean): void;
}
