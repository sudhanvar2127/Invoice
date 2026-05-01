import React from "react";
import Button from "../Components/Button";
import { StepTwo, StepOne } from "../Components/StepComponent";

const Home = () => {
  const steps = [StepOne, StepTwo];
  return (
    <div>
      <Button steps={steps} />
    </div>
  );
};

export default Home;
