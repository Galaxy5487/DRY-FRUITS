import { useEffect, useState } from "react";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";
import RatingStars from "../../components/ui/RatingStars";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/reviews");
      setReviews(data);
    };

    load();
  }, []);

  if (!reviews) return <Loader label="Loading reviews..." />;

  return (
    <section className="container-shell py-10">
      <h1 className="section-title">Customer reviews</h1>
      <div className="mt-8 space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="card-surface p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">{review.productId?.name}</p>
                <p className="text-sm text-brand-cocoa/70">
                  {review.userId?.name} • {review.userId?.email}
                </p>
              </div>
              <RatingStars rating={review.rating} />
            </div>
            <p className="mt-4 text-brand-cocoa/75">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminReviewsPage;
