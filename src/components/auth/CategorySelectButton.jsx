// 선호 카테고리 선택 버튼
const CategorySelectButton = ({ label, selected, onClick }) => {
  return (
    <button onClick={onClick} style={{ fontWeight: selected ? 'bold' : 'normal' }}>
      {label}
    </button>
  );
};
export default CategorySelectButton;
