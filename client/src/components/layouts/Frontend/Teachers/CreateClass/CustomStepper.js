import React from "react";
import LinearProgress from '@mui/material/LinearProgress';
function CustomStepper(props) {
  const { steps, current, progress } = props;
  
  const ProgressBar = ({ current, step, progress }) => {
    let value = 0;
    if(current+1 === step) {
      value = progress
    } else if(current >= step) {
      value = 100
    }
     
    return <LinearProgress variant="determinate" value={value} className="StepperBar" />
  }
  
  function renderStep(label, key) {
    const { current, progress } = this;
    const done = key < current;
    const currentStep = key === current;
    // const stepClasses = classNames({
    //   [classes.stepper__step__index]: true,
    //   [classes.currentStep]: currentStep,
    //   [classes.done]: done
    // });
  
    return (
      <li className='stepper__step' key={key}>
        {!!key && <ProgressBar current={current} step={key} progress={progress} />}
      </li>
    )
  }

  return (
    <ul className='stepper'>
      {steps.map(renderStep, { current, progress })}
    </ul>
  )
}

export default (CustomStepper);