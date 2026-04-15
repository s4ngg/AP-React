// 회원가입 단계 진행 표시 바
const StepProgressBar = ({ currentStep, totalStep = 5 }) => {
  return (
    <div>
      <span>step {currentStep}/{totalStep}</span>
    </div>
  );
};
export default StepProgressBar;
