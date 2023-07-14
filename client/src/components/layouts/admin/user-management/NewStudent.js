import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import CreateAccountStudent from './CreateAccountStudent';
import NewStudentBasicInfo from './NewStudentBasicInfo';
import NewStudentProfile from './NewStudentProfile';
import { Button } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


const steps = ['Create Account', 'Basic Information', 'Student Profile'];


const NewStudent = () => {
  const [activestudentStep, setStudentActiveStep] = React.useState(0);
  const [skippedstudent, setStudentSkipped] = React.useState(new Set());

  const isStepStudentOptional = (step) => {
    return step === 1;
  };

  const isStepStudentSkipped = (step) => {
    return skippedstudent.has(step);
  };

  const handleStudentNext = () => {
    let newSkipped = skippedstudent;
    if (isStepStudentSkipped(activestudentStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activestudentStep);
    }

    setStudentActiveStep((prevStudentActiveStep) => prevStudentActiveStep + 1);
    setStudentSkipped(newSkipped);
  };

  const handleStudentBack = () => {
    setStudentActiveStep((prevStudentActiveStep) => prevStudentActiveStep - 1);
  };

  const handleStudentSkip = () => {
    if (!isStepStudentOptional(activestudentStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setStudentActiveStep((prevStudentActiveStep) => prevStudentActiveStep + 1);
    setStudentSkipped((prevStudentSkipped) => {
      const newstudentSkipped = new Set(prevStudentSkipped.values());
      newstudentSkipped.add(activestudentStep);
      return newstudentSkipped;
    });
  };

  const handleStudentReset = () => {
    setStudentActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activestudentStep} className="mt-3">
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          // if (isStepOptional(index)) {
          //   labelProps.optional = (
          //     <Typography variant="caption">Optional</Typography>
          //   );
          // }
          if (isStepStudentSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activestudentStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleStudentReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box component="form" sx={{ mt: 2, mb: 1 }}>
            {/* Step {activeStep + 1} */}
            {activestudentStep == 0 && <CreateAccountStudent />}
            {activestudentStep == 1 && <NewStudentBasicInfo />}
            {activestudentStep == 2 && <NewStudentProfile />}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              disabled={activestudentStep === 0}
              onClick={handleStudentBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {/* {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )} */}

            <Button onClick={handleStudentNext} variant="contained" color="primary">
              {activestudentStep === steps.length - 1 ? 'Save Student' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}


export default NewStudent;