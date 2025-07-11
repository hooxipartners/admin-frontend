const EyeIcon = ({ open }: { open: boolean }) => (
  open ? (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M1.667 10S4.167 4.167 10 4.167 18.333 10 18.333 10 15.833 15.833 10 15.833 1.667 10 1.667 10Z" stroke="#637083" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke="#637083" strokeWidth="1.5"/></svg>
  ) : (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M1.667 10S4.167 4.167 10 4.167c1.5 0 2.833.333 4 .833M18.333 10S15.833 15.833 10 15.833c-1.5 0-2.833-.333-4-.833M7.5 7.5l5 5" stroke="#637083" strokeWidth="1.5" strokeLinecap="round"/></svg>
  )
);

export default EyeIcon; 