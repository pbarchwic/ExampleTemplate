import { LockState } from "@app/core";

export const lockStateIcons = {
  [LockState.Uncalibrated]: {
    icon: "example_uncalibrated",
    tooltip: "uncalibrate",
  },
  [LockState.Calibration]: {
    icon: "example_calibration",
    tooltip: "calibration",
  },
  [LockState.Open]: {
    icon: "example_unlocked",
    tooltip: "open",
  },
  [LockState.PartiallyOpen]: {
    icon: "example_partially_open",
    tooltip: "partially_open",
  },
  [LockState.Opening]: {
    icon: "example_unlocking",
    tooltip: "opening",
  },
  [LockState.Closing]: {
    icon: "example_unlocking",
    tooltip: "closing",
  },
  [LockState.Closed]: {
    icon: "example_locked",
    tooltip: "closed",
  },
  [LockState.SpringPull]: {
    icon: "example_pull_spring",
    tooltip: "spring_pull",
  },
  [LockState.OpeningWithPull]: {
    icon: "example_pulling_spring",
    tooltip: "opening_with_pull",
  },
  [LockState.Unknown]: {
    icon: "",
    tooltip: "unknown",
  },
  [LockState.PullSpringCalibration]: {
    icon: "example_calibration",
    tooltip: "pull_spring_calibration",
  },
};
