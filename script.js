// this is an object used to access all required dom elements which needs to be updated
const sound = new Audio();

const dom = {
  nav: {
    mindfulnessBtn: document.getElementById("mindfulnessBtn"),
    timerBtn: document.getElementById("hourglassBtn"),
    alarmBtn: document.getElementById("notificationsBtn"),
    stopwatchBtn: document.getElementById("timerBtn"),
  },

  tab: {
    // 0: mindfulness
    // 1: timer
    // 2: alarm
    // 3: stopwatch
    mindfulness: document.getElementById("focus-sessions"),
    timer: document.getElementById("timer"),
    alarm: document.getElementById("alarm"),
    stopwatch: document.getElementById("stopwatch"),

    switchTab(tabIndex) {
      switch (tabIndex) {
        case 0:
          this.mindfulness.classList.remove("d-none");
          this.timer.classList.add("d-none");
          this.alarm.classList.add("d-none");
          this.stopwatch.classList.add("d-none");

          dom.nav.mindfulnessBtn.classList.add("nav-active");
          dom.nav.timerBtn.classList.remove("nav-active");
          dom.nav.alarmBtn.classList.remove("nav-active");
          dom.nav.stopwatchBtn.classList.remove("nav-active");
          break;

        case 1:
          this.mindfulness.classList.add("d-none");
          this.timer.classList.remove("d-none");
          this.alarm.classList.add("d-none");
          this.stopwatch.classList.add("d-none");

          dom.nav.mindfulnessBtn.classList.remove("nav-active");
          dom.nav.timerBtn.classList.add("nav-active");
          dom.nav.alarmBtn.classList.remove("nav-active");
          dom.nav.stopwatchBtn.classList.remove("nav-active");
          break;

        case 2:
          this.mindfulness.classList.add("d-none");
          this.timer.classList.add("d-none");
          this.alarm.classList.remove("d-none");
          this.stopwatch.classList.add("d-none");

          dom.nav.mindfulnessBtn.classList.remove("nav-active");
          dom.nav.timerBtn.classList.remove("nav-active");
          dom.nav.alarmBtn.classList.add("nav-active");
          dom.nav.stopwatchBtn.classList.remove("nav-active");
          break;

        case 3:
          this.mindfulness.classList.add("d-none");
          this.timer.classList.add("d-none");
          this.alarm.classList.add("d-none");
          this.stopwatch.classList.remove("d-none");

          dom.nav.mindfulnessBtn.classList.remove("nav-active");
          dom.nav.timerBtn.classList.remove("nav-active");
          dom.nav.alarmBtn.classList.remove("nav-active");
          dom.nav.stopwatchBtn.classList.add("nav-active");
          break;

        default:
          break;
      }
    },
  },

  focusSessionsTab: {
    edit: {
      setFocusSession: document.getElementById("set-focus-session"),
      sessionDurationInput: document.getElementById("session-duration"),
      breaks: document.getElementById("breaks"),
      skipBreaksCheck: document.getElementById("skip-breaks"),
      startSessionBtn: document.getElementById("start-session"),
      show() {
        dom.focusSessionsTab.edit.setFocusSession.classList.remove("d-none");
        dom.focusSessionsTab.edit.setFocusSession.classList.add("d-flex");
        dom.focusSessionsTab.running.runningSession.classList.add("d-none");
        dom.focusSessionsTab.running.runningSession.classList.remove("d-flex");
      },
    },
    running: {
      runningSession: document.getElementById("session-running"),
      sessionTimeRemaining: document.getElementById("remainingTime"),
      sessionTimeCompleted: document.getElementById("totalTime"),
      pauseSessionBtn: document.getElementById("pause-session"),
      stopSessionBtn: document.getElementById("stop-session"),
      breakMessage: document.getElementById("breakMessage"),
      breakMessageTime: document.getElementById("breakMessageTime"),
      show() {
        dom.focusSessionsTab.edit.setFocusSession.classList.add("d-none");
        dom.focusSessionsTab.edit.setFocusSession.classList.remove("d-flex");
        dom.focusSessionsTab.running.runningSession.classList.remove("d-none");
        dom.focusSessionsTab.running.runningSession.classList.add("d-flex");
      },
    },
  },

  timerTab: {
    edit: {
      hourInput: document.getElementById("timer-hour"),
      minuteInput: document.getElementById("timer-minute"),
      secondInput: document.getElementById("timer-second"),
      startTimerBtn: document.getElementById("start-timer"),
      editTimerDiv: document.getElementById("timer-edit"),

      show() {
        dom.timerTab.edit.editTimerDiv.classList.remove("d-none");
        dom.timerTab.edit.editTimerDiv.classList.add("d-flex");
        dom.timerTab.running.runningTimerDiv.classList.add("d-none");
        dom.timerTab.running.runningTimerDiv.classList.remove("d-flex");
      },
    },

    running: {
      runningTimerDiv: document.getElementById("timer-running"),
      hour: document.getElementById("timer-hour-remaining"),
      minute: document.getElementById("timer-minute-remaining"),
      second: document.getElementById("timer-second-remaining"),
      pauseBtn: document.getElementById("pause-timer"),
      stopBtn: document.getElementById("stop-timer"),
      show() {
        dom.timerTab.edit.editTimerDiv.classList.add("d-none");
        dom.timerTab.edit.editTimerDiv.classList.remove("d-flex");
        dom.timerTab.running.runningTimerDiv.classList.remove("d-none");
        dom.timerTab.running.runningTimerDiv.classList.add("d-flex");
      },
    },
  },

  stopwatchTab: {
    hoursElapsedDOM: document.getElementById("stopwatch-hour-elapsed"),
    minutesElapsedDOM: document.getElementById("stopwatch-minute-elapsed"),
    secondsElapsedDOM: document.getElementById("stopwatch-second-elapsed"),
    miliSecondsElapsedDOM: document.getElementById(
      "stopwatch-milisecond-elapsed"
    ),
    controls: {
      stopBtn: document.getElementById("stop-stopwatch"),
      pauseBtn: document.getElementById("pause-stopwatch"),
      addStampBtn: document.getElementById("add-stamp"),
    },
    timestamps: document.getElementById("sw-timestamps"),
  },

  alarmTab: {
    edit: {
      alarmHour: document.getElementById("alarm-hour"),
      alarmMinute: document.getElementById("alarm-minute"),
      alarmAddBtn: document.getElementById("add-alarm"),
      alarmDays: document.getElementsByName("day"),
      alarmDaysWrapper: document.getElementById("alarmDaysWrap"),
      setEveryDayBtn: document.getElementById("alarm-set-everyday"),
      setOnceBtn: document.getElementById("alarm-set-once"),
    },
  },
};

// this is an object which runs the 'focus session' feature
const focusSession = {
  sessionTimeRemaining: 0,
  totalTimeCompleted: 0,
  breaks: 0,
  isBreak: false,
  breakTimeRemaining: 0,
  interval: null,
  oneBreakLength: 5,
  paused: false,

  startSession(sessionDuration, breaks) {
    this.sessionTimeRemaining = sessionDuration * 60;
    this.breaks = breaks;

    this.interval = setInterval(() => {
      if (!this.paused) {
        if (this.isBreak) {
          this.breakTimeRemaining -= 1;
          dom.focusSessionsTab.running.breakMessageTime.innerHTML =
            Math.ceil(this.breakTimeRemaining / 60) + "mins";
          if (this.breakTimeRemaining < 0) {
            this.isBreak = false;
            this.breaks -= 1;
            this.sessionTimeRemaining -= 1;
            dom.focusSessionsTab.running.breakMessage.classList.add("d-none");
          }
        } else {
          this.sessionTimeRemaining -= 1;
          this.totalTimeCompleted += 1;
        }

        if (
          !this.isBreak &&
          this.breaks > 0 &&
          this.sessionTimeRemaining - 1 != 0 &&
          ((this.sessionTimeRemaining - 1) / 60) % 30 === 0
        ) {
          this.isBreak = true;
          dom.focusSessionsTab.running.breakMessage.classList.remove("d-none");
          this.breakTimeRemaining = this.oneBreakLength * 60;
        }
        dom.focusSessionsTab.running.sessionTimeCompleted.innerHTML =
          Math.floor(this.totalTimeCompleted / 60);
        dom.focusSessionsTab.running.sessionTimeRemaining.innerHTML = Math.ceil(
          this.sessionTimeRemaining / 60
        );
        if (this.sessionTimeRemaining <= 0) {
          sound.src = "/focus-session-end.mp3";
          sound.play();
          this.stopSession();
        }
      }
    }, 1000);
  },

  stopSession() {
    clearInterval(this.interval);
    this.sessionTimeRemaining = 0;
    this.breaks = 0;
    this.isBreak = false;
    this.breakTimeRemaining = 0;
    this.paused = false;

    dom.focusSessionsTab.edit.show();
  },
};

// object which runs the 'timer' feature
const timer = {
  remainingTime: 0,
  paused: false,
  interval: null,

  startTimer(h, m, s) {
    this.remainingTime = h * 3600 + m * 60 + s;
    this.interval = setInterval(() => {
      if (!this.paused) {
        this.remainingTime -= 1;
        let [hours, minutes, seconds] = convertSecondsToHMS(this.remainingTime);
        dom.timerTab.running.hour.innerHTML = hours;
        dom.timerTab.running.minute.innerHTML = minutes;
        dom.timerTab.running.second.innerHTML = seconds;
      }

      if (this.remainingTime <= 0) {
        this.stopTimer();
        sound.src = "/focus-session-end.mp3";
        sound.play();
        dom.timerTab.edit.show();
      }
    }, 1000);
  },
  stopTimer() {
    this.remainingTime = 0;
    this.paused = false;
    clearInterval(this.interval);
  },
};

const alarm = {
  alarms: {},
};

// object which runs the 'stopwatch' feature
const stopwatch = {
  millisecondsElapsed: 0,
  interval: null,
  paused: true,
  timestamps: [],
  stopped: true,

  stopTimer() {
    clearInterval(this.interval);
    this.millisecondsElapsed = 0;
    this.paused = true;
    this.stopped = true;
  },

  addStamp() {
    let [hours, minutes, seconds, milliseconds] = convertMillisecondsToHMSMs(
      stopwatch.millisecondsElapsed
    );
    const stamp = hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    this.timestamps.push(stamp);
    dom.stopwatchTab.timestamps.innerHTML =
      '<div class="timestamp"><span>' +
      this.timestamps.length.toString().padStart(2, "0") +
      "</span><span>" +
      stamp +
      "</span></div>" +
      dom.stopwatchTab.timestamps.innerHTML;
  },

  startTimer() {
    this.stopped = false;
    this.paused = false;

    this.interval = setInterval(this.timer0, 10);
  },

  pauseTimer() {
    this.paused = true;
    clearInterval(this.interval);
  },

  timer0() {
    if (!stopwatch.paused) {
      stopwatch.millisecondsElapsed += 10;
      let [hours, minutes, seconds, milliseconds] = convertMillisecondsToHMSMs(
        stopwatch.millisecondsElapsed
      );
      dom.stopwatchTab.hoursElapsedDOM.innerHTML = hours;
      dom.stopwatchTab.minutesElapsedDOM.innerHTML = minutes;
      dom.stopwatchTab.secondsElapsedDOM.innerHTML = seconds;
      dom.stopwatchTab.miliSecondsElapsedDOM.innerHTML = milliseconds;
    }
  },
};

// some common functions
const updateBreaksOnDOM = () => {
  let i = dom.focusSessionsTab.edit.sessionDurationInput.value;
  if (i < 0) {
    dom.focusSessionsTab.edit.sessionDurationInput.value = 0;
  } else if (i > 240) {
    dom.focusSessionsTab.edit.sessionDurationInput.value = 240;
  } else if (
    dom.focusSessionsTab.edit.skipBreaksCheck.checked ||
    i <= focusSession.oneBreakLength
  ) {
    dom.focusSessionsTab.edit.breaks.innerHTML = 0;
  } else {
    if (i < 30) {
      dom.focusSessionsTab.edit.breaks.innerHTML = 0;
    } else {
      dom.focusSessionsTab.edit.breaks.innerHTML = parseInt(i / 30) - 1;
    }
  }
};
const convertSecondsToHMS = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return [`${formattedHours}`, `${formattedMinutes}`, `${formattedSeconds}`];
};
const convertMillisecondsToHMSMs = (totalMilliseconds) => {
  const milliseconds = totalMilliseconds % 1000;
  const seconds = Math.floor((totalMilliseconds / 1000) % 60);
  const minutes = Math.floor((totalMilliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((totalMilliseconds / (1000 * 3600)) % 24);

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedMilliseconds = milliseconds
    .toString()
    .padStart(2, "0")
    .substring(0, 2);

  return [
    formattedHours,
    formattedMinutes,
    formattedSeconds,
    formattedMilliseconds,
  ];
};
const selectDay = (e) => {
  const isSelected = e.getAttribute("data-selected");
  if (isSelected === "false") {
    e.setAttribute("data-selected", "true");
  } else {
    e.setAttribute("data-selected", "false");
  }
};
// set event handlers
{
  {
    // for navigation
    dom.nav.mindfulnessBtn.onclick = () => {
      dom.tab.switchTab(0);
    };
    dom.nav.timerBtn.onclick = () => {
      dom.tab.switchTab(1);
    };
    dom.nav.alarmBtn.onclick = () => {
      dom.tab.switchTab(2);
    };
    dom.nav.stopwatchBtn.onclick = () => {
      dom.tab.switchTab(3);
    };
  }
  {
    // for focus-sessions
    dom.focusSessionsTab.edit.skipBreaksCheck.oninput = () => {
      updateBreaksOnDOM();
    };

    dom.focusSessionsTab.edit.sessionDurationInput.oninput = () => {
      updateBreaksOnDOM();
    };

    dom.focusSessionsTab.edit.startSessionBtn.onclick = () => {
      dom.focusSessionsTab.running.show();
      dom.focusSessionsTab.running.sessionTimeCompleted.innerHTML = Math.floor(
        focusSession.totalTimeCompleted / 60
      );
      dom.focusSessionsTab.running.sessionTimeRemaining.innerHTML = Math.ceil(
        dom.focusSessionsTab.edit.sessionDurationInput.value
      );
      if (!dom.focusSessionsTab.edit.skipBreaksCheck.checked) {
        focusSession.startSession(
          dom.focusSessionsTab.edit.sessionDurationInput.value,
          parseInt(dom.focusSessionsTab.edit.sessionDurationInput.value / 30) -
            1
        );
      } else {
        focusSession.startSession(
          dom.focusSessionsTab.edit.sessionDurationInput.value,
          0
        );
      }
    };

    dom.focusSessionsTab.running.pauseSessionBtn.onclick = () => {
      if (focusSession.paused) {
        focusSession.paused = false;
        dom.focusSessionsTab.running.pauseSessionBtn.innerHTML =
          '<span class="material-symbols-outlined">pause</span>';
      } else {
        dom.focusSessionsTab.running.pauseSessionBtn.innerHTML =
          '<span class="material-symbols-outlined">play_arrow</span>';
        focusSession.paused = true;
      }
    };

    dom.focusSessionsTab.running.stopSessionBtn.onclick = () => {
      dom.focusSessionsTab.edit.show();
      focusSession.stopSession();
    };
  }
  {
    // for timer feature
    dom.timerTab.edit.hourInput.oninput = (e) => {
      if (e.target.value < 0) {
        e.target.value = 0;
      } else if (e.target.value > 99) {
        e.target.value = 99;
      }
    };

    dom.timerTab.edit.minuteInput.oninput = (e) => {
      if (e.target.value < 0) {
        e.target.value = 0;
      } else if (e.target.value > 59) {
        e.target.value = 59;
      }
    };

    dom.timerTab.edit.secondInput.oninput = (e) => {
      if (e.target.value < 0) {
        e.target.value = 0;
      } else if (e.target.value > 59) {
        e.target.value = 59;
      }
    };

    dom.timerTab.edit.startTimerBtn.onclick = () => {
      let hours = parseInt(dom.timerTab.edit.hourInput.value);
      let minutes = parseInt(dom.timerTab.edit.minuteInput.value);
      let seconds = parseInt(dom.timerTab.edit.secondInput.value);
      if (isNaN(hours) || hours == undefined) {
        hours = 0;
      }
      if (isNaN(minutes) || minutes === undefined) {
        minutes = 0;
      }
      if (isNaN(seconds) || seconds === undefined) {
        seconds = 0;
      }
      const totalSecond = hours * 60 * 60 + minutes * 60 + seconds;
      console.log(hours, minutes, seconds);
      if (totalSecond > 0) {
        let [_hours, _minutes, _seconds] = convertSecondsToHMS(totalSecond);
        dom.timerTab.running.hour.innerHTML = _hours;
        dom.timerTab.running.minute.innerHTML = _minutes;
        dom.timerTab.running.second.innerHTML = _seconds;
        dom.timerTab.running.show();
        timer.startTimer(hours, minutes, seconds);
      }
    };

    dom.timerTab.running.stopBtn.onclick = () => {
      dom.timerTab.edit.show();
      timer.stopTimer();
    };

    dom.timerTab.running.pauseBtn.onclick = () => {
      if (timer.paused) {
        timer.paused = false;
        dom.timerTab.running.pauseBtn.innerHTML =
          '<span class="material-symbols-outlined">pause</span>';
      } else {
        timer.paused = true;
        dom.timerTab.running.pauseBtn.innerHTML =
          '<span class="material-symbols-outlined">play_arrow</span>';
      }
    };
  }
  {
    // for stopwatch
    dom.stopwatchTab.controls.pauseBtn.onclick = (e) => {
      if (stopwatch.stopped) {
        e.target.innerHTML =
          '<span class="material-symbols-outlined">pause</span>';
        dom.stopwatchTab.controls.addStampBtn.classList.remove("d-none");
        dom.stopwatchTab.controls.addStampBtn.classList.add("d-flex");
        dom.stopwatchTab.controls.stopBtn.classList.remove("d-none");
        dom.stopwatchTab.controls.stopBtn.classList.add("d-flex");
        stopwatch.startTimer();
        stopwatch.timestamps = [];
        dom.stopwatchTab.timestamps.innerHTML = "";
      } else {
        if (stopwatch.paused) {
          e.target.innerHTML =
            '<span class="material-symbols-outlined">pause</span>';
          stopwatch.startTimer();
        } else {
          e.target.innerHTML =
            '<span class="material-symbols-outlined">play_arrow</span>';
          stopwatch.pauseTimer();
        }
      }
    };

    dom.stopwatchTab.controls.stopBtn.onclick = (e) => {
      stopwatch.stopTimer();
      dom.stopwatchTab.controls.addStampBtn.classList.add("d-none");
      dom.stopwatchTab.controls.addStampBtn.classList.remove("d-flex");
      dom.stopwatchTab.controls.stopBtn.classList.add("d-none");
      dom.stopwatchTab.controls.stopBtn.classList.remove("d-flex");
      dom.stopwatchTab.controls.pauseBtn.innerHTML =
        '<span class="material-symbols-outlined">play_arrow</span>';
    };

    dom.stopwatchTab.controls.addStampBtn.onclick = () => {
      stopwatch.addStamp();
    };
  }
  {
    // for alarms
    dom.alarmTab.edit.alarmHour.oninput = (e) => {
      const i = e.target.value;
      if (i > 23) {
        e.target.value = 23;
      } else if (i < 0) {
        e.target.value = 0;
      }
    };

    dom.alarmTab.edit.alarmMinute.oninput = (e) => {
      const i = e.target.value;
      if (i > 59) {
        e.target.value = 59;
      } else if (i < 0) {
        e.target.value = 0;
      }
    };

    dom.alarmTab.edit.setEveryDayBtn.onclick = (ele) => {
      dom.alarmTab.edit.alarmDaysWrapper.classList.add("d-flex");
      dom.alarmTab.edit.alarmDaysWrapper.classList.remove("d-none");
      dom.alarmTab.edit.setOnceBtn.classList.remove("active");
      ele.target.classList.add("active");
    };

    dom.alarmTab.edit.setOnceBtn.onclick = (e) => {
      e.target.classList.add("active");
      dom.alarmTab.edit.setEveryDayBtn.classList.remove("active");
      dom.alarmTab.edit.alarmDaysWrapper.classList.add("d-none");
      dom.alarmTab.edit.alarmDaysWrapper.classList.remove("d-flex");
      // const crrDate = new Date();
      // let offset = 0;
      // if (
      //   crrDate.getHours() > parseInt(dom.alarmTab.edit.alarmHour.value) ||
      //   crrDate.getMinutes() > parseInt(dom.alarmTab.edit.alarmMinute.value)
      // ) {
      //   offset = 1;
      // }

      // const days = dom.alarmTab.edit.alarmDays;
      // for (let d = 0; d < days.length; d++) {
      //   if (d === (new Date().getDay() + offset) % 7) {
      //     days[d].setAttribute("data-selected", "true");
      //   } else {
      //     days[d].setAttribute("data-selected", "false");
      //   }
      // }
    };
  }
}
