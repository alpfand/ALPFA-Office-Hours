import MemberCard from "./MemberCard.jsx";
import "./BoardGrid.css";

export default function BoardGrid({ members, onBook }) {
  return (
    <div className="board">
      {members.map((member) => (
        <MemberCard key={member.name} member={member} onBook={onBook} />
      ))}
    </div>
  );
}
