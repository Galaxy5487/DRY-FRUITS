const RatingStars = ({ rating = 0 }) => (
  <div className="flex items-center gap-1 text-brand-gold">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star}>{star <= Math.round(rating) ? "★" : "☆"}</span>
    ))}
  </div>
);

export default RatingStars;
