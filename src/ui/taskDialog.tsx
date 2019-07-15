import React, { Fragment } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Fade from "@material-ui/core/Fade";

import { Weekday } from "../core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    },
    dueToCheckbox: {
      marginTop: 26
    },
    weekdays: {
      justifyContent: "center"
    },
    toggleRoutineBtn: {
      position: "absolute",
      right: theme.spacing(2)
    }
  })
);

const TaskDialog = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );
  const [isRoutine, setIsRoutine] = React.useState<boolean>(false);
  const [isDue, setIsDue] = React.useState<boolean>(false);
  const [fixedTime, setFixedTime] = React.useState<boolean>(false);
  const [weekdays, setWeekdays] = React.useState<Record<Weekday, boolean>>({
    Friday: false,
    Monday: false,
    Saturday: false,
    Sunday: false,
    Thursday: false,
    Tuesday: false,
    Wednesday: false
  });

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleDateChange(date: Date | null) {
    setSelectedDate(date);
  }

  function handleIsDueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsDue(event.currentTarget.checked);
  }

  function handleFixedTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFixedTime(event.currentTarget.checked);
  }

  const handleWeekday = (name: Weekday) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWeekdays({
      ...weekdays,
      [name]: event.currentTarget.checked
    });
  };

  return (
    <Fragment>
      <Fab
        color="secondary"
        aria-label="Add"
        className={classes.fab}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          Create New Task
          <Button
            onClick={() => setIsRoutine(!isRoutine)}
            color="primary"
            className={classes.toggleRoutineBtn}
          >
            {isRoutine ? "Add Normal Task" : "Add Routine Task"}
          </Button>
        </DialogTitle>
        <DialogContent>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="flex-start"
            >
              {isRoutine ? (
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="flex-start"
                >
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" gutterBottom>
                      Period
                    </Typography>
                    <RadioGroup aria-label="Period" name="period" row>
                      <FormControlLabel
                        value="daily"
                        control={<Radio />}
                        label="Daily"
                      />
                      <FormControlLabel
                        value="weekly"
                        control={<Radio />}
                        label="Weekly"
                      />
                      <FormControlLabel
                        value="monthly"
                        control={<Radio />}
                        label="Monthly"
                      />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={8}>
                    <Typography variant="subtitle2" gutterBottom>
                      Reps
                    </Typography>
                    <Slider
                      defaultValue={1}
                      valueLabelDisplay="auto"
                      marks
                      min={1}
                      max={30}
                    />
                  </Grid>
                </Grid>
              ) : null}

              {!isRoutine ? (
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="flex-start"
                >
                  <Grid item xs={10}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="mui-pickers-date"
                      label="Date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      fullWidth={true}
                      KeyboardButtonProps={{
                        "aria-label": "change date"
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormControlLabel
                      className={classes.dueToCheckbox}
                      control={
                        <Checkbox
                          checked={isDue}
                          onChange={handleIsDueChange}
                          value="checkedA"
                        />
                      }
                      label="Due to"
                    />
                  </Grid>
                </Grid>
              ) : null}

              <Grid item xs={2}>
                <FormControlLabel
                  className={classes.dueToCheckbox}
                  control={
                    <Checkbox
                      checked={fixedTime}
                      onChange={handleFixedTimeChange}
                      value="checkedA"
                    />
                  }
                  label="Fixed time"
                />
              </Grid>

              <Grid item xs={10}>
                <KeyboardTimePicker
                  margin="normal"
                  id="mui-pickers-time"
                  label="Time"
                  value={selectedDate}
                  onChange={handleDateChange}
                  fullWidth={true}
                  disabled={!fixedTime}
                  KeyboardButtonProps={{
                    "aria-label": "change time"
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Duration
                </Typography>
                <Slider
                  defaultValue={30}
                  getAriaValueText={x => `${x} Minutes`}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={10}
                  max={300}
                />
              </Grid>

              <Fade in={isDue || isRoutine}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Allowed On
                  </Typography>
                  <FormGroup row className={classes.weekdays}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="Sunday"
                          onChange={handleWeekday("Sunday")}
                          checked={weekdays.Sunday}
                        />
                      }
                      label="Sunday"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="Monday"
                          onChange={handleWeekday("Monday")}
                          checked={weekdays.Monday}
                        />
                      }
                      label="Monday"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="Tuesday"
                          onChange={handleWeekday("Tuesday")}
                          checked={weekdays.Tuesday}
                        />
                      }
                      label="Tuesday"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="Wednesday"
                          onChange={handleWeekday("Wednesday")}
                          checked={weekdays.Wednesday}
                        />
                      }
                      label="Wednesday"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="Thursday"
                          onChange={handleWeekday("Thursday")}
                          checked={weekdays.Thursday}
                        />
                      }
                      label="Thursday"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="Friday"
                          onChange={handleWeekday("Friday")}
                          checked={weekdays.Friday}
                        />
                      }
                      label="Friday"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="Saturday"
                          onChange={handleWeekday("Saturday")}
                          checked={weekdays.Saturday}
                        />
                      }
                      label="Saturday"
                    />
                  </FormGroup>
                </Grid>
              </Fade>
            </Grid>
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default TaskDialog;
