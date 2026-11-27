/** 메뉴 한 줄 (프로토타입 menuRow): 왼쪽 이름, 오른쪽 작은 글자 + › */
export default function MenuRow({ label, sub = '', onClick, className = '' }) {
  return (
    <button className={`listbutton ${className}`} onClick={onClick}>
      <span>{label}</span>
      <span className="small">{sub}　›</span>
    </button>
  )
}
