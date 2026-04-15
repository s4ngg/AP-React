// 공통 인풋 필드 컴포넌트
const InputField = ({ label, type = 'text', placeholder, error, ...props }) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input type={type} placeholder={placeholder} {...props} />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  );
};
export default InputField;
