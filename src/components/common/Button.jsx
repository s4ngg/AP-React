// 공통 버튼 컴포넌트
const Button = ({ children, onClick, disabled, type = 'button' }) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
export default Button;
