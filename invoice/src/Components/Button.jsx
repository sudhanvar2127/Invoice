import React, { useState } from "react";

const Button = ({ steps }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const StepComponent = steps[currentStepIndex];

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div>
      <div style={{ minHeight: "200px", marginBottom: "1rem" }}>
        <StepComponent />
      </div>
      <div className="flex justify-between items-center my-3">
        <button
          onClick={goPrev}
          disabled={currentStepIndex === 0}
          className="bg-gray-700 rounded p-2 text-white font-medium w-[10%] hover:bg-black cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={goNext}
          disabled={currentStepIndex === steps.length - 1}
          className="bg-gray-700 rounded p-2 text-white font-medium w-[10%] hover:bg-black cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Button;