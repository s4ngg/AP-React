// 약관 동의 체크박스
const TermsCheckbox = ({ label, required, checked, onChange }) => {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label} {required && <span>(필수)</span>}
    </label>
  );
};
export default TermsCheckbox;
