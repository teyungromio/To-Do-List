export default function LoadingSkeleton() {
  return (
    <div className="task-grid" aria-label="Loading tasks">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-button" />
        </div>
      ))}
    </div>
  );
}
